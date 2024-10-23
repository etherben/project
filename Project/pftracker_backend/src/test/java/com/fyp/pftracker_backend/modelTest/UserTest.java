package com.fyp.pftracker_backend.modelTest;

import com.fyp.pftracker_backend.model.User;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    @Test
    public void testSetGetUser() {
        User user = new User();

        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("password");

        assertEquals("testuser", user.getUsername());
        assertEquals("test@test.com", user.getEmail());
        assertEquals("password", user.getPassword());

    }
    @Test
    public void testGetUser(){

    }
}