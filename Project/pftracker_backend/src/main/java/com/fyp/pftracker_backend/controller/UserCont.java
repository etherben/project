package com.fyp.pftracker_backend.controller;

import com.fyp.pftracker_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fyp.pftracker_backend.service.UserService;

@RestController
@RequestMapping("/signup")
public class UserCont {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.saveUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}