import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {userEvent} from '@testing-library/user-event';
import CreateEnvelopeForm from './CreateEnvelopeForm';

describe('CreateEnvelopeForm', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

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
});
