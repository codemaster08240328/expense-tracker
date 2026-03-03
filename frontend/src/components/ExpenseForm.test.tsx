import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, within } from '@testing-library/react';
import { ExpenseForm } from './ExpenseForm';

describe('ExpenseForm', () => {
  it('renders description and amount inputs and submit button', () => {
    const { container } = render(<ExpenseForm onCreate={() => {}} />);
    const form = container.querySelector('form')!;
    expect(within(form).getByLabelText(/description/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/amount/i)).toBeInTheDocument();
    expect(within(form).getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('does not call onCreate when description is empty', () => {
    const onCreate = vi.fn();
    const { container } = render(<ExpenseForm onCreate={onCreate} />);
    const form = container.querySelector('form')!;
    fireEvent.change(within(form).getByLabelText(/amount/i), { target: { value: '50' } });
    fireEvent.submit(form);
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('does not call onCreate when amount is empty', () => {
    const onCreate = vi.fn();
    const { container } = render(<ExpenseForm onCreate={onCreate} />);
    const form = container.querySelector('form')!;
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: 'Coffee' } });
    fireEvent.submit(form);
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('calls onCreate with correct payload and clears inputs on submit', () => {
    const onCreate = vi.fn();
    const { container } = render(<ExpenseForm onCreate={onCreate} />);
    const form = container.querySelector('form')!;
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: 'Coffee' } });
    fireEvent.change(within(form).getByLabelText(/amount/i), { target: { value: '12.5' } });
    fireEvent.submit(form);

    expect(onCreate).toHaveBeenCalledTimes(1);
    const payload = onCreate.mock.calls[0][0];
    expect(payload).toMatchObject({
      description: 'Coffee',
      amount: 12.5,
      categoryId: 'General',
    });
    expect(payload.date).toBeDefined();
    expect(typeof payload.date).toBe('string');

    expect((within(form).getByLabelText(/description/i) as HTMLInputElement).value).toBe('');
    expect((within(form).getByLabelText(/amount/i) as HTMLInputElement).value).toBe('');
  });
});
