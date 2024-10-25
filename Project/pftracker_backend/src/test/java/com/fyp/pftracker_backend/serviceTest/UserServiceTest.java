/*
Goal of Signup
- Take user inputs
- Insert them into database
- Return pass or fail message
 */


package com.fyp.pftracker_backend.serviceTest;

import com.fyp.pftracker_backend.model.User;
import com.fyp.pftracker_backend.repository.UserRepo;
import com.fyp.pftracker_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private UserService userService;

    private User user;
    private User invalidUserUsername;
    private User invalidUserEmail;
    private User invalidUserPassword;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@test.com");
        user.setUsername("test");
        user.setPassword("test");

        invalidUserUsername = new User();
        invalidUserUsername.setEmail("test@test.com");
        invalidUserUsername.setUsername("");
        invalidUserUsername.setPassword("test");

        invalidUserEmail = new User();
        invalidUserEmail.setEmail("");
        invalidUserEmail.setUsername("test");
        invalidUserEmail.setPassword("test");

        invalidUserPassword = new User();
        invalidUserPassword.setEmail("test@test.com");
        invalidUserPassword.setUsername("test");
        invalidUserPassword.setPassword("");
    }


    @Test
    void testValidUser() {
        when(userRepo.save(any())).thenReturn(user);

        User savedUser = userService.saveUser(user);
        assertNotNull(savedUser);
        assertEquals(user.getId(), savedUser.getId());
        assertEquals(user.getEmail(), savedUser.getEmail());
        assertEquals(user.getUsername(), savedUser.getUsername());
        assertEquals(user.getPassword(), savedUser.getPassword());

        verify(userRepo, times(1)).save(any());
    }





}
