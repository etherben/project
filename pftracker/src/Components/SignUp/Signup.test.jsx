import { render, screen, fireEvent} from '@testing-library/react';
import Signup from './Signup';

test('switches to login form', () => {
    //given
    const mockSwitch = jest.fn();
    render(<Signup onSwitch={mockSwitch} onSubmit={jest.fn()} />);
    //when
    fireEvent.click(screen.getByText(/login/i));
    //then
    expect(mockSwitch).toHaveBeenCalled();
});

test('rending signup form', () => {
    //given
    render(<Signup onSwitch={jest.fn()} onSubmit={jest.fn()} />);
    //when(just renders it)
    //then(checking form is rendered)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('allows typing into fields', () => {
    //given
    render(<Signup onSwitch={jest.fn()} onSubmit={jest.fn()} />);
    //when
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    //then
    expect(screen.getByPlaceholderText(/email/i).value).toBe('test@test.com');
    expect(screen.getByPlaceholderText(/username/i).value).toBe('test');
    expect(screen.getByPlaceholderText(/password/i).value).toBe('password');
});

test('onSubmit called with user data when submitted', () => {
    //given
    const mockSubmit = jest.fn();
    render(<Signup onSwitch={jest.fn()} onSubmit={mockSubmit} />);
    //when
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    //then
    expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@test.com',
        username: 'test',
        password: 'password',
    });
});


test('API call fail on form submission', async () => {
    //given
    const mockSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    render(<Signup onSwitch={jest.fn()} onSubmit={mockSubmit} />);
    //when
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    //then
    expect(mockSubmit).toHaveBeenCalled();
});
