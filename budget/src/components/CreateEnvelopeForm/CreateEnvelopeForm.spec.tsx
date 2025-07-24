import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup';
import CreateEnvelopeForm from './CreateEnvelopeForm';
import type CreateEnvelopeDto from '../../api/create.envelope.dto';
import type CreateEnvelopeResponse from '../../api/create.envelope.response';

describe('CreateEnvelopeForm', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;
  const apiUrl = 'http://localhost:8090/envelopes';

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CreateEnvelopeForm />
      </QueryClientProvider>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('Form Rendering', () => {
    it('renders the form with all required fields', () => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('has correct form structure and attributes', () => {
      const nameInput = screen.getByLabelText(/name/i);
      const budgetInput = screen.getByLabelText(/budget/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(nameInput).toHaveAttribute('placeholder', 'Name');
      expect(budgetInput).toHaveAttribute('placeholder', 'Budget');
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('validates required fields when submitting empty form', async () => {
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(await screen.findByText(/Please input the envelope name!/i)).toBeInTheDocument();
      expect(await screen.findByText(/Please input the budget amount!/i)).toBeInTheDocument();
    });

    it('shows validation error only for empty name when only budget is filled', async () => {
      const budgetInput = screen.getByLabelText(/budget/i);
      await user.type(budgetInput, '500');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(await screen.findByText(/Please input the envelope name!/i)).toBeInTheDocument();
      expect(screen.queryByText(/Please input the budget amount!/i)).not.toBeInTheDocument();
    });

    it('shows validation error only for empty budget when only name is filled', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Rent');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
      expect(await screen.findByText(/Please input the budget amount!/i)).toBeInTheDocument();
    });

    it('does not show validation errors initially', () => {
      expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Please input the budget amount!/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('allows typing in the name field', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Rent');

      expect(nameInput).toHaveValue('Rent');
    });

    it('allows typing in the budget field', async () => {
      const budgetInput = screen.getByLabelText(/budget/i);
      await user.type(budgetInput, '500');

      expect(budgetInput).toHaveValue('500');
    });

    it('handles special characters in the name field', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Special @#$% Characters & More!');

      expect(nameInput).toHaveValue('Special @#$% Characters & More!');
    });

    it('handles decimal values in the budget field', async () => {
      const budgetInput = screen.getByLabelText(/budget/i);
      await user.type(budgetInput, '123.45');

      expect(budgetInput).toHaveValue('123.45');
    });

    it('handles large numbers in the budget field', async () => {
      const budgetInput = screen.getByLabelText(/budget/i);
      await user.type(budgetInput, '999999.99');

      expect(budgetInput).toHaveValue('999999.99');
    });

    it('accepts whitespace in name field during input', async () => {
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, '  Rent  ');

      expect(nameInput).toHaveValue('  Rent  ');
    });
  });

  describe('API Integration - Success Scenarios', () => {
    it('successfully creates an envelope and shows success message', async () => {
      const mockResponse: CreateEnvelopeResponse = {
        id: '123',
        name: 'Rent',
        budget: 500
      };

      server.use(
        http.post(apiUrl, async ({ request }) => {
          const body = await request.json() as CreateEnvelopeDto;
          expect(body).toEqual({ name: 'Rent', budget: 500 });
          return HttpResponse.json(mockResponse, { status: 201 });
        })
      );

      // Fill out the form
      const nameInput = screen.getByLabelText(/name/i);
      const budgetInput = screen.getByLabelText(/budget/i);

      await user.type(nameInput, 'Rent');
      await user.type(budgetInput, '500');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Wait for successful API call and form reset
      await waitFor(() => {
        const successMessageText = 'Envelope created successfully!';
        expect(screen.getByText(successMessageText)).toBeInTheDocument();
        // expect(nameInput).toHaveValue('');
        // expect(budgetInput).toHaveValue(null);
      });


    });
  });

  describe('API Integration - Error Scenarios', () => {
    it('handles API server error (500) and shows error message', async () => {
      server.use(
        http.post(apiUrl, () => {
          return HttpResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        })
      );

      const nameInput = screen.getByLabelText(/name/i);
      const budgetInput = screen.getByLabelText(/budget/i);

      await user.type(nameInput, 'Rent');
      await user.type(budgetInput, '500');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify form is not reset on error
      await waitFor(() => {
        expect(nameInput).toHaveValue('Rent');
        expect(budgetInput).toHaveValue('500');

        expect(screen.getByText('Failed to create envelope!')).toBeInTheDocument();
      });
    });

    it('handles API validation error (400) and shows error message', async () => {
      server.use(
        http.post(apiUrl, () => {
          return HttpResponse.json(
            { error: 'Validation failed', details: 'Envelope with this name already!' },
            { status: 400 }
          );
        })
      );

      const nameInput = screen.getByLabelText(/name/i);
      const budgetInput = screen.getByLabelText(/budget/i);

      await user.type(nameInput, 'Duplicate Name');
      await user.type(budgetInput, '200');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText('Envelope with this name already!')).toBeInTheDocument();
      });
    });

  });

  describe('Loading States', () => {
    it('disables submit button during loading', async () => {
      let resolveRequest: (value: Response) => void;
      const requestPromise = new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      });

      server.use(
        http.post(apiUrl, () => {
          return requestPromise;
        })
      );

      const nameInput = screen.getByLabelText(/name/i);
      const budgetInput = screen.getByLabelText(/budget/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, 'Disable Test');
      await user.type(budgetInput, '250');

      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Resolve the request
      resolveRequest!(HttpResponse.json({ id: '888', name: 'Disable Test', budget: 250 }, { status: 201 }));

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});
