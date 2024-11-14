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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;



import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    User user;
    @Autowired

    @Mock
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
}

