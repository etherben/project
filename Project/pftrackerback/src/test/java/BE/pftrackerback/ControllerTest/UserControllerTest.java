package BE.pftrackerback.ControllerTest;


import BE.pftrackerback.Controllers.UserController;
import BE.pftrackerback.Model.User;
import BE.pftrackerback.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    User user;
    @Autowired

    @MockBean
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();

        user.setUsername("test");
        user.setPassword("test123");
        user.setEmail("test@test.com");
    }

    @Test
    public void testCreateUser(){
        //given (mocking the userService to return)
       when(userService.createUser(user.getUsername(), user.getPassword(), user.getEmail())).thenReturn(user);

       //when (send post request to create new user
        ResponseEntity<User> response = userController.createUser(user);

        //Then
        assertEquals(user, response.getBody()); // Check if the returned user matches the input user
        assertEquals(HttpStatus.CREATED, response.getStatusCode()); // Check if the status is 201 Created

    }

    @Test
    public void testExistingUser(){
        //given (mocking null return of user service)
        when(userService.createUser(user.getUsername(), user.getPassword(), user.getEmail())).thenReturn(null);
        //when
        ResponseEntity<User> response = userController.createUser(user);
        //then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

    }
    @Test
    public void testGetUsers(){
        //given
        User user1 = new User("test1", "password1", "testemail1");
        User user2 = new User("test2", "password2", "testemail2");

        List<User> users = Arrays.asList(user1, user2);
        when(userService.getUsers()).thenReturn(users);

        List<User> result = userController.getAllUsers();

        assertEquals(users, result);
    }

    @Test
    public void testLoginAdmin(){
        User admin = new User("admin", "password", "adminemail");
        when(userService.loginUser(admin.getUsername(), admin.getPassword())).thenReturn(admin);
        //when
        ResponseEntity<User> response = userController.loginUser("admin", "password");

        //then checks admin is there
        assertEquals(admin, response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testLoginUser(){
        //given
        when(userService.loginUser(user.getUsername(), user.getPassword())).thenReturn(user);
        //when
        ResponseEntity<User> response = userController.loginUser(user.getUsername(), user.getPassword());
        //then
        assertEquals(user, response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testLoginUserFail(){
        //given(correct username wrong password)
        String username = "test";
        String password = "wrongPassword";
        //mock return of null for wrong password
        when(userService.loginUser(username, password)).thenReturn(null);
        //when
        ResponseEntity<User> response = userController.loginUser(username, password);
        //then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

        //given (wrong username correct password)
        username = "wrongUsername";
        password = "test123";
        when(userService.loginUser(username, password)).thenReturn(null);
        //when
        ResponseEntity<User> response2 = userController.loginUser(username, password);
        //then
        assertEquals(HttpStatus.UNAUTHORIZED, response2.getStatusCode());
        assertNull(response2.getBody());
    }


}

