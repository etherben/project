/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import Login from './Components/Login/Login';
import MainPage from './Components/MainPage/MainPage';
jest.mock('echarts', () => ({
  // Return an empty object to block all calls to echarts
  init: jest.fn().mockReturnValue({
    setOption: jest.fn(),  // Optionally block setOption method if needed
  }),
}));

describe('MainPage Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = jest.fn(() => Promise.resolve({})); // Mock the global fetch API if needed
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

test('loads mainpage with userid stored', async () => {
  sessionStorage.setItem('id', '12345');

  const mockHandleFetchTransactions = jest.fn();
  const mockOnLogout = jest.fn();

  const mockTransactions = [
    { id: '1', TransactionDate: '01/2025', amount: 100, merchant: 'Merchant 1' },
    { id: '2', TransactionDate: '02/2025', amount: 200, merchant: 'Merchant 2' },
    { id: '3', TransactionDate: '03/2025', amount: 150, merchant: 'Merchant 3' }
  ];

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

  await waitFor(() => {
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText('Merchant 1')).toBeInTheDocument();
    expect(screen.getByText('Merchant 2')).toBeInTheDocument();
    expect(screen.getByText('Merchant 3')).toBeInTheDocument();
  });

});

  test('should fake submit a single transaction and log the success message', async () => {
    const mockUserId = '123';  // Mocked user ID
    const mockOnSingleSubmit = jest.fn().mockResolvedValueOnce('Transaction successful');  // Mock the onSingleSubmit function
    const mockHandleFetchTransactions = jest.fn();
    const mockOnLogout = jest.fn();

    // Mock console.log to capture the printed message
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Render the MainPage with the necessary props
    render(
        <MainPage
            userId={mockUserId}
            onSingleSubmit={mockOnSingleSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={mockOnLogout}
            transactions={[]}
        />
    );

    // Simulate user input for transaction date, amount, and merchant
    fireEvent.change(screen.getByPlaceholderText('Transaction Date'), { target: { value: '2024-11-29' } });
    fireEvent.change(screen.getByPlaceholderText('Transaction Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByPlaceholderText('Merchant Name'), { target: { value: 'Amazon' } });

    // Simulate clicking the submit button (this should trigger the mockOnSingleSubmit and the console.log)
    fireEvent.click(screen.getByText('Submit Transaction'));

    // Wait for the mock function to be called and the success message to be logged
    await waitFor(() => expect(mockOnSingleSubmit).toHaveBeenCalledWith({
      userId: mockUserId,
      amount: '100',
      TransactionDate: '2024-11-29',
      merchant: 'Amazon',
    }));
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
  test('should fake file submit and log the success message', async () => {
    const mockUserId = '123';  // Mocked user ID
    const mockOnFileSubmit = jest.fn().mockResolvedValueOnce('File uploaded successfully');  // Mock the onFileSubmit function
    const mockHandleFetchTransactions = jest.fn();
    const mockOnLogout = jest.fn();


    // Render the MainPage with the necessary props
    render(
        <MainPage
            userId={mockUserId}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={mockOnLogout}
            transactions={[]}
        />
    );

    // Create a dummy file
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });

    // Find the file input and simulate the file selection
    const fileInput = screen.getByText('/Upload csv/i');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate clicking the submit button (this should trigger the mockOnFileSubmit and the console.log)
    fireEvent.click(screen.getByText('Submit CSV'));

    // Wait for the mock function to be called and the success message to be logged
    await waitFor(() => expect(mockOnFileSubmit).toHaveBeenCalledWith(file));
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
  });
});