package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.User;
import BE.pftrackerback.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {

    private UserService userService;

    @BeforeEach
    public void setUp() {
        userService = new UserService();
    }

    @Test
    public void testCreateUser() {
        //Test for correct creation of user in service
        //given
        String username = "testUsername";
        String password = "testPassword";
        String email = "testEmail";
        //when
        User createdUser = userService.createUser(username, password, email);
        //then
        assertNotNull(createdUser);
        assertEquals("testUsername", createdUser.getUsername());
        assertEquals("testPassword", createdUser.getPassword());
        assertEquals("testEmail", createdUser.getEmail());
    }
    @Test
    public void testGetUsers() {
        //given
        userService.createUser("testUsername2", "testPassword2", "testEmail2");
        //when
        List<User> users = userService.getUsers();
        //then
        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("admin", users.getFirst().getUsername());
        assertEquals("password", users.get(0).getPassword());
        assertEquals("adminemail", users.get(0).getEmail());
        assertEquals("testUsername2", users.get(1).getUsername());
        assertEquals("testPassword2", users.get(1).getPassword());
        assertEquals("testEmail2", users.get(1).getEmail());
    }
    @Test
    public void loginAdmin(){
        //testing hard coded user (admin) hence don't need given
        //when
        User correctUser = userService.loginUser("admin", "password");
        //Then
        assertNotNull(correctUser);
        assertEquals("admin", correctUser.getUsername());
        assertEquals("password", correctUser.getPassword());

    }
    @Test
    public void loginUserSuccess(){
        //given
        userService.createUser("testUsername", "testPassword", "testEmail");
        //when
        User user = userService.loginUser("testUsername", "testPassword");
        //then
        assertNotNull(user);
        assertEquals("testUsername", user.getUsername());
        assertEquals("testPassword", user.getPassword());

    }
    @Test
    public void loginUserFail(){
        //given
        userService.createUser("testUsername", "testPassword", "testEmail");
        //when (wrong password)
        User wrongPassword = userService.loginUser("testUsername", "testPasswordWrong");
        //then
        assertNull(wrongPassword);
        //when (wrong username
        User wrongUsername = userService.loginUser("testUsernameWrong", "testPassword");
        //then
        assertNull(wrongUsername);
    }
}
