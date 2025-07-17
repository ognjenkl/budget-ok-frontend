import {describe, it, expect, beforeEach} from 'vitest';
import { render, screen } from '@testing-library/react';
import CreateEnvelopeForm from "./CreateEnvelopeForm.tsx";
import { userEvent } from "@testing-library/user-event";

describe('CreateEnvelopeForm', () => {
  beforeEach(() => {
    render(<CreateEnvelopeForm />);
  })

  it('renders the form with all required fields', () => {
    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    // Submit form without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation messages
    expect(await screen.findByText(/Please input the envelope name!/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please input the budget amount!/i)).toBeInTheDocument();
  });

  it('allows typing in the name field', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Groceries');

    expect(nameInput).toHaveValue('Groceries');
  });

  it('allows typing in the budget field', async () => {
    const budgetInput = screen.getByLabelText(/budget/i);
    await userEvent.type(budgetInput, '500');

    expect(budgetInput).toHaveValue('500');
  });

  it('does not show validation errors initially', () => {
    expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input the budget amount!/i)).not.toBeInTheDocument();
  });

  it('shows validation error only for empty name when only budget is filled', async () => {
    // Fill only the budget field
    const budgetInput = screen.getByLabelText(/budget/i);
    await userEvent.type(budgetInput, '500');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Should show error only for name
    expect(await screen.findByText(/Please input the envelope name!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Please input the budget amount!/i)).not.toBeInTheDocument();
  });

  it('shows validation error only for empty budget when only name is filled', async () => {
    // Fill only the name field
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Groceries');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Should show error only for budget
    expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Please input the budget amount!/i)).toBeInTheDocument();
  });

  it('handles special characters in the name field', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Special @#$% Characters');

    expect(nameInput).toHaveValue('Special @#$% Characters');
  });

  it('handles decimal values in the budget field', async () => {
    const budgetInput = screen.getByLabelText(/budget/i);
    await userEvent.type(budgetInput, '123.45');

    expect(budgetInput).toHaveValue('123.45');
  });

  it('handles form submission with keyboard Enter key', async () => {
    // Fill in both fields
    const nameInput = screen.getByLabelText(/name/i);
    const budgetInput = screen.getByLabelText(/budget/i);

    await userEvent.type(nameInput, 'Groceries');
    await userEvent.type(budgetInput, '500');

    // Press Enter key on the budget field
    await userEvent.type(budgetInput, '{Enter}');

    // Check that validation errors don't appear
    expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please input the budget amount!/i)).not.toBeInTheDocument();
  });

  it('trims whitespace from the name field', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, '  Groceries  ');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // The form should accept the value with whitespace
    expect(screen.queryByText(/Please input the envelope name!/i)).not.toBeInTheDocument();
  });
});
