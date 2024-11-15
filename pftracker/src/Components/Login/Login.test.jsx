import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders the Login form correctly ', () => {
    //given
    render(<Login onSwitch={jest.fn()} onSubmit={jest.fn()} />);
    //when (renders it)
    //then
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/need an account\?/i)).toBeInTheDocument();
});

test('updates username and password inputs correctly', () => {
    //given
    render(<Login onSwitch={jest.fn()} onSubmit={jest.fn()} />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    //when
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    //then
    expect(usernameInput.value).toBe('test');
    expect(passwordInput.value).toBe('password');
});


test('calls the onSubmit with the correct data on form submission', () => {
    //given
    const mockSubmit = jest.fn();
    render(<Login onSwitch={jest.fn()} onSubmit={mockSubmit} />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    //when
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    //then
    expect(mockSubmit).toHaveBeenCalledWith({
        username: 'test',
        password: 'password',
    });
});