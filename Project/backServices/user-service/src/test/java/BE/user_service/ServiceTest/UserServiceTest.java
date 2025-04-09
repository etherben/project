package BE.user_service.ServiceTest;

import BE.user_service.Model.User;
import BE.user_service.Repo.UserRepo;
import BE.user_service.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepo userRepo;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepo = Mockito.mock(UserRepo.class);
        userService = new UserService();
        userService.userRepo = userRepo; // direct field access since it's not private
    }

    @Test
    void testCreateUser() {
        User mockUser = new User();
        mockUser.setUsername("testuser");

        when(userRepo.save(mockUser)).thenReturn(mockUser);

        User result = userService.createUser(mockUser);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepo, times(1)).save(mockUser);
    }

    @Test
    void testGetUsers() {
        List<User> mockList = Arrays.asList(new User(), new User());
        when(userRepo.findAll()).thenReturn(mockList);

        List<User> result = userService.getUsers();

        assertEquals(2, result.size());
        verify(userRepo, times(1)).findAll();
    }

    @Test
    void testLoginUser_Success() {
        User storedUser = new User();
        storedUser.setUsername("test");
        storedUser.setPassword("tespass");

        when(userRepo.findByUsername("test")).thenReturn(Optional.of(storedUser));

        User result = userService.loginUser("test", "tespass");

        assertNotNull(result);
        assertEquals("test", result.getUsername());
    }

    @Test
    void testLoginUser_WrongPassword() {
        User storedUser = new User();
        storedUser.setUsername("test");
        storedUser.setPassword("testpass");

        when(userRepo.findByUsername("test")).thenReturn(Optional.of(storedUser));

        User result = userService.loginUser("test", "testpasswrog");

        assertNull(result);
    }

    @Test
    void testLoginUser_NotFound() {
        when(userRepo.findByUsername("test")).thenReturn(Optional.empty());

        User result = userService.loginUser("test", "testpass");

        assertNull(result);
    }
}
