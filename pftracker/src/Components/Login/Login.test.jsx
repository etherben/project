import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders the Login form correctly ', () => {
    render(<Login onSwitch={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/need an account\?/i)).toBeInTheDocument();
});

test('updates username and password inputs correctly', () => {
    render(<Login onSwitch={jest.fn()} onSubmit={jest.fn()} />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(usernameInput.value).toBe('test');
    expect(passwordInput.value).toBe('password');
});