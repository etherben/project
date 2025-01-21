import { render, screen } from '@testing-library/react';
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