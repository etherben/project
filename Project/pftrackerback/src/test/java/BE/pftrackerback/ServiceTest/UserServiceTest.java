package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.User;
import BE.pftrackerback.Repo.UserRepo;
import BE.pftrackerback.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.Mockito.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @MockBean
    private UserRepo userRepo; // Changed to userRepo

    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);


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
        assertNotNull(createdUser, "Created user should not be null");
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
        assertNotNull(users, "Users list should not be null");
        assertEquals(2, users.size(), "Users list should contain 2 users");

        // Verify details of first user
        assertEquals("test", users.get(0).getUsername());
        assertEquals("test123", users.get(0).getPassword());
        assertEquals("test@test.com", users.get(0).getEmail());

        // Verify details of second user
        assertEquals("testUsername2", users.get(1).getUsername());
        assertEquals("testPassword2", users.get(1).getPassword());
        assertEquals("testEmail2", users.get(1).getEmail());

        verify(userRepo, times(1)).findAll();
    }

    /*
    @Test
    public void testLoginAdmin() {
        // Given
        when(userRepo.findByUsername("admin"))
                .thenReturn(Optional.of(new User("admin", "password", "adminemail")));

        // When
        User admin = userService.loginUser("admin", "password");

        // Then
        assertNotNull(admin, "Admin login should return a user");
        assertEquals("admin", admin.getUsername());
        assertEquals("password", admin.getPassword());

        verify(userRepo, times(1)).findByUsernameAndPassword("admin", "password");
    }
    */

    @Test
    public void testLoginUserSuccess() {
        // Given
        when(userRepo.findByUsername("test"))
                .thenReturn(Optional.of(user));

        // When
        User loggedInUser = userService.loginUser("test", "test123");

        // Then
        assertNotNull(loggedInUser, "User login should succeed with correct credentials");
        assertEquals("test", loggedInUser.getUsername());
        assertEquals("test123", loggedInUser.getPassword());

        verify(userRepo, times(1)).findByUsername("test");
    }

    @Test
    public void testLoginUserFail() {
        // Given
        when(userRepo.findByUsername("test"))
                .thenReturn(Optional.empty());

        // When
        User loggedInUser = userService.loginUser("test", "wrongPassword");

        // Then
        assertNull(loggedInUser, "User login should fail with incorrect credentials");

        verify(userRepo, times(1)).findByUsername("test");
    }
}