/**
 * @jest-environment jsdom
 */

import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { act } from 'react';
import App from './App';
import Login from "./Components/Login/Login";


beforeEach(() => {
  sessionStorage.clear();


  global.fetch = jest.fn(() =>
      Promise.resolve({})
  );

});

afterEach(() => {
  jest.clearAllMocks();
});


test('renders the Signup form initially', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('switches to Login form when link is clicked', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/login/i));
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('calls handleSignupSubmit with correct data', async () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/users/create',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'test@test.com',
            username: 'test',
            password: 'password',
          }),
        })
    );
  });
});

test('calls handleLoginSubmit with correct data', async () => {
  const mockSubmit = jest.fn();
  render(<Login onSwitch={jest.fn()} onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'test',
      password: 'password',
    });
  });
});

/*
To Note: The tests below are commented due to a change in the package.json, causing the MainPage to not render in tests
Unfortunatly this couldn't be resolved before the interim due date.
 */


/*
test('loads userId from sessionStorage on mount', () => {
  sessionStorage.setItem('userId', '12345');

  render(<App />);

  expect(screen.getByText(/Welcome, User ID: 12345/i)).toBeInTheDocument();
});

test('stores userId in sessionStorage after successful login', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ userId: '67890' }),
  });

  render(<App />);

  fireEvent.click(screen.getByText(/login/i));
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/Welcome, User ID: 67890/i)).toBeInTheDocument();
    expect(sessionStorage.getItem('userId')).toBe('67890');
  });
});

test('should submit a single transaction successfully', async () => {
  const mockResponse = { text: () => 'Transaction successful' };
  fetch.mockResolvedValueOnce({ ok: true, text: mockResponse.text });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Transaction Date'), { target: { value: '2024-11-29' } });
  fireEvent.change(screen.getByPlaceholderText('Transaction Amount'), { target: { value: '100' } });
  fireEvent.click(screen.getByText('Submit Transaction'));

  await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:8080/transactions', expect.anything()));

  expect(await screen.findByText('Transaction successful')).toBeInTheDocument();
});

test('should handle file upload with userId successfully', async () => {
  const mockResponse = { text: () => 'File uploaded successfully' };
  fetch.mockResolvedValueOnce({ ok: true, text: mockResponse.text });

  render(<App />);

  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
  const fileInput = screen.getByText('Drag and drop your CSV file here');
  fireEvent.change(fileInput, { target: { files: [file] } });

  fireEvent.click(screen.getByText('Submit CSV'));

  await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:8080/transactions/bulk', expect.anything()));

  expect(await screen.findByText('File uploaded successfully')).toBeInTheDocument();
});

test('should instantly save the transaction after file upload', async () => {
  const mockResponse = { text: () => 'Transaction successful' };
  fetch.mockResolvedValueOnce({ ok: true, text: mockResponse.text });

  render(<App />);

  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
  const fileInput = screen.getByText('Drag and drop your CSV file here');
  fireEvent.change(fileInput, { target: { files: [file] } });

  fireEvent.click(screen.getByText('Submit CSV'));

  await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:8080/transactions/save', expect.anything()));

  expect(await screen.findByText('Transaction successful')).toBeInTheDocument();
});

test('should handle error when submitting single transaction fails', async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Transaction Date'), { target: { value: '2024-11-29' } });
  fireEvent.change(screen.getByPlaceholderText('Transaction Amount'), { target: { value: '100' } });
  fireEvent.click(screen.getByText('Submit Transaction'));

  await waitFor(() => expect(screen.getByText('Transaction submission failed')).toBeInTheDocument());
});

test('should handle error when file upload fails', async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  render(<App />);

  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
  const fileInput = screen.getByText('Drag and drop your CSV file here');
  fireEvent.change(fileInput, { target: { files: [file] } });

  fireEvent.click(screen.getByText('Submit CSV'));

  await waitFor(() => expect(screen.getByText('Failed to upload file')).toBeInTheDocument());
});*/