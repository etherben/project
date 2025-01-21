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
