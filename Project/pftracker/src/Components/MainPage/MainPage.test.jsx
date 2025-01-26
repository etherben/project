import { render, screen, fireEvent, } from '@testing-library/react';
import MainPage from './MainPage';

test('renders the page and components with given user ID ', () => {
    // given
    const mockOnSingleSubmit = jest.fn();
    const mockOnFileSubmit = jest.fn();
    const mockHandleFetchTransactions = jest.fn();
    const mockOnLogout = jest.fn();

    const userId = '12345';
    const transactions = [];

    // when
    render(
        <MainPage
            userId={userId}
            onSingleSubmit={mockOnSingleSubmit}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={mockOnLogout}
            transactions={transactions}
        />
    );

    // then
    expect(screen.getByText(/welcome, user id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/transaction date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/transaction amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/merchant name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit transaction/i })).toBeInTheDocument();
    expect(screen.getByText(/upload csv/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit csv/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /transactions/i })).toBeInTheDocument();
});
test('manual input calls onSingleSubmit with correct data', async () => {
    // given
    const mockOnSingleSubmit = jest.fn();
    const mockHandleFetchTransactions = jest.fn();
    const mockOnFileSubmit = jest.fn();
    const mockOnLogout = jest.fn();

    const userId = '12345';
    const transactions = [];

    render(
        <MainPage
            userId={userId}
            onSingleSubmit={mockOnSingleSubmit}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={mockOnLogout}
            transactions={transactions}
        />
    );

    // when
    fireEvent.change(screen.getByPlaceholderText(/transaction date/i), { target: { value: '2025-01-21' } });
    fireEvent.change(screen.getByPlaceholderText(/transaction amount/i), { target: { value: '100.00' } });
    fireEvent.change(screen.getByPlaceholderText(/merchant name/i), { target: { value: 'Merchant Inc.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit transaction/i }));

    // then
    expect(mockOnSingleSubmit).toHaveBeenCalledWith({
        userId: '12345',
        amount: '100.00',
        TransactionDate: '2025-01-21',
        merchant: 'Merchant Inc.',
    });
});
test('calls file submit with a fake file directly', () => {
    // given
    const mockOnFileSubmit = jest.fn();
    const mockHandleFetchTransactions = jest.fn();
    const userId = '12345';
    const transactions = [];

    render(
        <MainPage
            userId={userId}
            onSingleSubmit={jest.fn()}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={jest.fn()}
            transactions={transactions}
        />
    );

    // when
    const fakeFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
    mockOnFileSubmit(fakeFile);

    const submitButton = screen.getByRole('button', { name: /submit csv/i });
    fireEvent.click(submitButton);

    // then
    expect(mockOnFileSubmit).toHaveBeenCalledWith(fakeFile);
});
test('displays "no transactions to show yet." when there are no transactions', () => {
    // given
    const mockOnFileSubmit = jest.fn();
    const mockHandleFetchTransactions = jest.fn();
    const userId = '12345';
    const transactions = [];

    render(
        <MainPage
            userId={userId}
            onSingleSubmit={jest.fn()}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={jest.fn()}
            transactions={transactions}
        />
    );

    // when
    const noTransactionsMessage = screen.getByText(/no transactions to show yet/i);

    // then
    expect(noTransactionsMessage).toBeInTheDocument();
});
test('renders chart when transaction data is provided', () => {
    // given
    const mockOnSingleSubmit = jest.fn();
    const mockOnFileSubmit = jest.fn();
    const mockHandleFetchTransactions = jest.fn();
    const mockOnLogout = jest.fn();

    const userId = '12345';
    const transactions = [
        { id: '1', TransactionDate: '2025-01-01', amount: '100.00', merchant: 'Merchant A' },
        { id: '2', TransactionDate: '2025-01-02', amount: '150.00', merchant: 'Merchant B' },
    ];

    render(
        <MainPage
            userId={userId}
            onSingleSubmit={mockOnSingleSubmit}
            onFileSubmit={mockOnFileSubmit}
            handleFetchTransactions={mockHandleFetchTransactions}
            onLogout={mockOnLogout}
            transactions={transactions}
        />
    );

    // when
    const chartContainer = document.querySelector('.chart-container');

    // then
    expect(chartContainer).toBeInTheDocument();
});
