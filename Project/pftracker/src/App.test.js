import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {act} from 'react';
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
  //given
  render(<App />);
  //when (app renders)
  //then
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('switches to Login form when link is clicked', () => {
  //given
  render(<App />);
  //when
  fireEvent.click(screen.getByText(/login/i));
  //then
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('calls handleSignupSubmit with correct data', async () => {
  //given
  render(<App/>);
  //when
  //enter data
  fireEvent.change(screen.getByPlaceholderText(/email/i), {target: {value: 'test@test.com'},});
  fireEvent.change(screen.getByPlaceholderText(/username/i), {target: {value: 'test'},});
  fireEvent.change(screen.getByPlaceholderText(/password/i), {target: {value: 'password'},});
  fireEvent.click(screen.getByRole('button', {name: /sign up/i})); //submit
  //then
  //Wait for fetch call
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/users/create',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),    //Check body data is correct
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
  // given
  const mockSubmit = jest.fn();
  render(<Login onSwitch={jest.fn()} onSubmit={mockSubmit} />);

  // when
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // then
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'test',
      password: 'password',
    });
  });
});

test('loads userId from sessionStorage from mount', () => {
  // given
  sessionStorage.setItem('userId', '12345'); // Mock a stored userId

  // when
  render(<App />);

  // then
  expect(screen.getByText(/Welcome, User ID: 12345/i)).toBeInTheDocument(); // Ensure it's displayed
});
test('stores userId in sessionStorage after successful login', async () => {
  // given
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ userId: '67890' }),
  });

  render(<App />);  // Render the App instead of just Login

  // when
  fireEvent.click(screen.getByText(/login/i));
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'test' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // then
  await waitFor(() => {
    // Ensure that the welcome message is displayed after login
    expect(screen.getByText(/Welcome, User ID: 67890/i)).toBeInTheDocument();
    // Check that sessionStorage contains the correct userId
    expect(sessionStorage.getItem('userId')).toBe('67890');
  });
});