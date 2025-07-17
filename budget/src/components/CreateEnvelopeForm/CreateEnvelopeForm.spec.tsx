import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CreateEnvelopeForm from "./CreateEnvelopeForm.tsx";
import {userEvent} from "@testing-library/user-event";

describe('CreateEnvelopeForm', () => {
  it('renders the form with all required fields', () => {
    render(<CreateEnvelopeForm />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CreateEnvelopeForm />);

    // Submit form without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation messages
    expect(await screen.findByText(/Please input the envelope name!/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please input the budget amount!/i)).toBeInTheDocument();
  });

  //
  // it('clears the form after successful submission', async () => {
  //   const user = userEvent.setup();
  //   render(<CreateEnvelopeForm onSubmit={() => {}} />);
  //
  //   // Fill in the form
  //   await user.type(screen.getByLabelText(/name/i), 'Groceries');
  //   await user.type(screen.getByLabelText(/budget/i), '500');
  //
  //   // Submit the form
  //   await user.click(screen.getByRole('button', { name: /create/i }));
  //
  //   // Check if form is cleared
  //   await waitFor(() => {
  //     expect(screen.getByLabelText(/name/i)).toHaveValue('');
  //     expect(screen.getByLabelText(/budget/i)).toHaveValue('');
  //   });
  // });
});
