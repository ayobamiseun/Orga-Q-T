import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home component', () => {
  beforeEach(() => {
    // Mock localStorage getItem method
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mockToken');
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText('Questions and Answer')).toBeInTheDocument();
  });

  it('adds a new question', async () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Add Question'));
    fireEvent.change(screen.getByPlaceholderText('Question'), { target: { value: 'Test Question' } });
    fireEvent.change(screen.getAllByPlaceholderText('Option')[0], { target: { value: 'Option A' } });
    fireEvent.change(screen.getAllByPlaceholderText('Option')[1], { target: { value: 'Option B' } });
    fireEvent.change(screen.getAllByPlaceholderText('Option')[2], { target: { value: 'Option C' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Test Question',
          options: ['Option A', 'Option B', 'Option C'],
        }),
      });
    });
  });

  it('edits a question', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, question: 'Old Question', options: ['Option A', 'Option B'] }]),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Old Question')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByPlaceholderText('Question'), { target: { value: 'Updated Question' } });
    fireEvent.change(screen.getAllByPlaceholderText('Option')[0], { target: { value: 'Updated Option A' } });
    fireEvent.change(screen.getAllByPlaceholderText('Option')[1], { target: { value: 'Updated Option B' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Updated Question',
          options: ['Updated Option A', 'Updated Option B'],
        }),
      });
    });
  });

  it('deletes a question', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, question: 'Test Question', options: ['Option A', 'Option B', 'Option C'] }]),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});
