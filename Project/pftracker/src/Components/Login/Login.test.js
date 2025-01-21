import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import Signup from "../SignUp/Signup";

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

    //when
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    //then
    expect(mockSubmit).toHaveBeenCalledWith({

            username: 'test',
            password: 'password',

    });
});
test('should not submit form if username or password is empty', () => {
    //given
    const mockSubmit = jest.fn();
    render(<Login onSwitch={jest.fn()} onSubmit={mockSubmit} />);

    //when (submitting with empty fields)
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    //then
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter a username and password/i)).toBeInTheDocument();
});
test('displays error message when login fails', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    // given
    const mockSubmit = jest.fn().mockRejectedValue(new Error('Login failed'));
    render(<Login onSwitch={jest.fn()} onSubmit={mockSubmit} />);

    // when
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // then
    await waitFor(() => expect(screen.getByText('Login failed')).toBeInTheDocument());
    expect(consoleErrorMock).toHaveBeenCalledWith(new Error('Login failed'));

    consoleErrorMock.mockRestore();
});
test('renders the Signup form correctly', () => {
    // given
    render(<Signup onSwitch={jest.fn()} onSubmit={jest.fn()} />);

    // when (renders it)
    // then
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
});
