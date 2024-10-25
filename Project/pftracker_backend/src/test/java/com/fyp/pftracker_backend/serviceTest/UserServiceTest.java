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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@test.com");
        user.setUsername("test");
        user.setPassword("test");
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
    @Test
    void testInvalidDetails() {
        ResponseStatusException exception;
        user.setUsername(null);
        exception = assertThrows(ResponseStatusException.class, () -> userService.saveUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Username is required", exception.getReason());
        verify(userRepo, never()).save(any()); //check repo save wasnt called
        user.setUsername("test");


        user.setEmail(null);
        exception = assertThrows(ResponseStatusException.class, () -> userService.saveUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Email is required", exception.getReason());
        verify(userRepo, never()).save(any());
        user.setEmail("test@test.com");


        user.setPassword(null);
        exception = assertThrows(ResponseStatusException.class, () -> userService.saveUser(user));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Password is required", exception.getReason());
        verify(userRepo, never()).save(any());
        user.setPassword("test");
    }


}
