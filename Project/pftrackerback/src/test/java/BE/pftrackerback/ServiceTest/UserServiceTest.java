package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.User;
import BE.pftrackerback.Repo.UserRepo;
import BE.pftrackerback.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepo userRepo;

    private User user;

    @BeforeEach
    public void setUp() {
        // Initialize mocks
        MockitoAnnotations.openMocks(this);

        // Create test user
        user = new User();
        user.setUsername("test");
        user.setPassword("test123");
        user.setEmail("test@test.com");
    }

    @Test
    public void testCreateUser() {
        // Given
        when(userRepo.save(user)).thenReturn(user);

        // When
        User createdUser = userService.createUser(user);

        // Then
        assertNotNull(createdUser);
        assertEquals("test", createdUser.getUsername());
        assertEquals("test123", createdUser.getPassword());
        assertEquals("test@test.com", createdUser.getEmail());

        verify(userRepo, times(1)).save(user);
    }

    @Test
    public void testGetUsers() {
        // Given
        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(user);

        User user2 = new User();
        user2.setUsername("testUsername2");
        user2.setPassword("testPassword2");
        user2.setEmail("testEmail2");
        mockUsers.add(user2);

        when(userRepo.findAll()).thenReturn(mockUsers);

        // When
        List<User> users = userService.getUsers();

        // Then
        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("test", users.getFirst().getUsername());
        assertEquals("test123", users.get(0).getPassword());
        assertEquals("test@test.com", users.get(0).getEmail());

        assertEquals("testUsername2", users.get(1).getUsername());
        assertEquals("testPassword2", users.get(1).getPassword());
        assertEquals("testEmail2", users.get(1).getEmail());

        verify(userRepo, times(1)).findAll();
    }

    @Test
    public void testLoginUserSuccess() {
        // Given
        when(userRepo.findByUsername("test")).thenReturn(Optional.of(user));

        // When
        User loggedInUser = userService.loginUser("test", "test123");

        // Then
        assertNotNull(loggedInUser);
        assertEquals("test", loggedInUser.getUsername());
        assertEquals("test123", loggedInUser.getPassword());

        verify(userRepo, times(1)).findByUsername("test");
    }

    @Test
    public void testLoginUserFail() {
        // Given
        when(userRepo.findByUsername("test")).thenReturn(Optional.empty());

        // When
        User loggedInUser = userService.loginUser("test", "wrongPassword");

        // Then
        assertNull(loggedInUser);

        verify(userRepo, times(1)).findByUsername("test");
    }
}