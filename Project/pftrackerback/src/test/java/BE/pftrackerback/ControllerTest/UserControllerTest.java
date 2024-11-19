package BE.pftrackerback.ControllerTest;

import BE.pftrackerback.Controllers.UserController;
import BE.pftrackerback.Model.User;
import BE.pftrackerback.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    private User user;

    @MockBean
    private UserService userService;

    @Autowired
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User("test", "test123", "test@test.com");
    }

    @Test
    public void testCreateUser() {
        // Given
        when(userService.createUser(user)).thenReturn(user);

        // When
        ResponseEntity<User> response = userController.createUser(user);

        // Then
        assertEquals(user, response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    public void testLoginAdmin() {
        // Given
        User admin = new User("admin", "password", "adminemail");
        when(userService.loginUser(admin.getUsername(), admin.getPassword())).thenReturn(admin);

        // When
        ResponseEntity<User> response = userController.loginUser(admin);

        // Then
        assertEquals(admin, response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testLoginUser() {
        // Given
        when(userService.loginUser(user.getUsername(), user.getPassword())).thenReturn(user);

        // When
        ResponseEntity<User> response = userController.loginUser(user);

        // Then
        assertEquals(user, response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}