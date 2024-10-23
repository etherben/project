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

import static org.junit.jupiter.api.Assertions.assertEquals;

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
       user.setPassword("test");
   }
    @Test
    void testSignUpSuccess() throws Exception {
        ResponseEntity<User> response = userController.createUser(user);

        assertEquals(user, response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode() );

    }
}