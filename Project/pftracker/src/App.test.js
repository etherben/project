/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import Login from "./Components/Login/Login";
import MainPage from "./Components/MainPage/MainPage";

// Mock fetch for API calls
global.fetch = jest.fn();

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset sessionStorage for userID
  sessionStorage.clear();

  // Provide a default mock implementation for fetch
  fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Default empty response for GET requests
        text: () => Promise.resolve('Success'), // Default response for text-based APIs
      })
  );
});


test('renders the Signup form to start', () => {
  render(<App />);

  // Check for placeholders in the Signup form inputs
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

  // Check for the "Sign Up" button
  expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
});

test('switches to Login form when link is clicked', () => {
  render(<App />);

  //Given
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

  //When
  fireEvent.click(screen.getByText(/Login/i));

  // Then
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('calls handleSignupSubmit with correct data', async () => {
  render(<App />);

  // Given
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

  // When
  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  // Then
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/users/create',
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

  // Given
  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

  // When
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Then
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'test',
      password: 'password',
    });
  });
});
test('loads MainPage with userid stored', async () => {
  // Given
  sessionStorage.setItem('id', '12345');

  const mockHandleFetchTransactions = jest.fn();
  const mockOnLogout = jest.fn();

  //This is needed so echarts doesnt create error messages and bug tests
  const mockTransactions = [
    { id: '1', TransactionDate: '01/2025', amount: 100, merchant: 'Merchant 1' },
    { id: '2', TransactionDate: '02/2025', amount: 200, merchant: 'Merchant 2' },
    { id: '3', TransactionDate: '03/2025', amount: 150, merchant: 'Merchant 3' }
  ];

  // When
  render(
      <MainPage
          userId="12345"
          onSingleSubmit={() => {}}
          onFileSubmit={() => {}}
          handleFetchTransactions={mockHandleFetchTransactions}
          onLogout={mockOnLogout}
          transactions={mockTransactions}
      />
  );

  // Then
  await waitFor(() => {
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText('Merchant 1')).toBeInTheDocument();
    expect(screen.getByText('Merchant 2')).toBeInTheDocument();
    expect(screen.getByText('Merchant 3')).toBeInTheDocument();
  });
});

test('logs out user successfully', () => {
  // When
  const mockHandleFetchTransactions = jest.fn();
  const mockOnLogout = jest.fn();

  render(
      <MainPage
          userId="12345"
          onSingleSubmit={() => {}}
          onFileSubmit={() => {}}
          handleFetchTransactions={mockHandleFetchTransactions}
          onLogout={mockOnLogout}
          transactions={[]}
      />
  );
  fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

  // Then
  expect(sessionStorage.getItem('id')).toBeNull();
  expect(mockOnLogout).toHaveBeenCalled();
});

