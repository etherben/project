package com.fyp.pftracker_backend.controllerTest;

import com.fyp.pftracker_backend.controller.UserCont;
import com.fyp.pftracker_backend.model.User;
import com.fyp.pftracker_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest
@AutoConfigureMockMvc
public class UserContTest {

   @InjectMocks
   private UserCont userController;

   @Mock
   private UserService userService;
   private User user;

   @BeforeEach
   void setUp() {
       MockitoAnnotations.openMocks(this);
       user = new User();
       user.setEmail("test@test.com");
       user.setUsername("test");
       user.setPassword("test123");
   }
    @Test
    void testSignUpSuccess(){
        when(userService.saveUser(any(User.class))).thenReturn(user); //mock saveUser method
        ResponseEntity<User> response = userController.createUser(user);

        assertEquals(user, response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode() );
    }
    @Test
    void testSignUpMissing(){

       ResponseStatusException exception;
       user.setUsername(null);
        exception = assertThrows(ResponseStatusException.class, () -> userController.createUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Username is required", exception.getReason());
       user.setUsername("test");

       user.setEmail(null);
        exception = assertThrows(ResponseStatusException.class, () -> userController.createUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Email is required", exception.getReason());
       user.setEmail("test@test.com");


       user.setPassword(null);
        exception = assertThrows(ResponseStatusException.class, () -> userController.createUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Password is required", exception.getReason());
       user.setPassword("test");
    }
    @Test
    void testSignUpRuntimeError(){
        when(userService.saveUser(any(User.class))).thenThrow(new RuntimeException("Service error")); //mock saveUser throw

        ResponseEntity<User> response = userController.createUser(user);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }
    @Test
    void loginSuccess(){
    when(userService.loadUser("test","test123")).thenReturn(user);

    ResponseEntity<String> response = userController.login(user);

    assertEquals("Login successful", response.getBody());
    assertEquals(HttpStatus.OK, response.getStatusCode());

    }




}