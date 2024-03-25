import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Page from '../app/register/page';

// Setup Mock Service Worker server
const server = setupServer(
  rest.post(`${process.env.NEXT_PUBLIC_REGISTER_API}`, (req, res, ctx) => {
    // Simulate successful registration
    return res(
      ctx.json({ token: 'mock-token' }),
      ctx.status(200)
    );
  }),
  rest.post(`${process.env.NEXT_PUBLIC_REGISTER_API}`, (req, res, ctx) => {
    // Simulate failed registration
    return res(
      ctx.status(500),
      ctx.json({ error: 'Failed to register' })
    );
  })
);

// Start the Mock Service Worker server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('<Page />', () => {
  test('renders the page correctly', () => {
    render(<Page />);
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('submits the form with valid email', async () => {
    render(<Page />);
    const emailInput = screen.getByLabelText('Your email');
    const submitButton = screen.getByText('Submit');

    // Enter a valid email address
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Expect "Submitting..." text to be visible
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Account Created')).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    render(<Page />);
    const emailInput = screen.getByLabelText('Your email');
    const submitButton = screen.getByText('Submit');

    // Enter an email that triggers an error
    fireEvent.change(emailInput, { target: { value: 'error@example.com' } });
    fireEvent.click(submitButton);

    // Expect "Submitting..." text to be visible
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error submitting email. Please try again.')).toBeInTheDocument();
    });
  });

  test('displays validation error for invalid email', async () => {
    render(<Page />);
    const emailInput = screen.getByLabelText('Your email');
    const submitButton = screen.getByText('Submit');

    // Enter an invalid email address
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Expect validation error message to be visible
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });
});
