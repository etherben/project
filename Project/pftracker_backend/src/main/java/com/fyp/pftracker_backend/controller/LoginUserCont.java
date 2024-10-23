package com.fyp.pftracker_backend.controller;

import com.fyp.pftracker_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fyp.pftracker_backend.service.LoginUser;

@RestController
@RequestMapping("/users")
public class LoginUserCont {
    @Autowired
    private LoginUser loginuser;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return loginuser.saveUser(user);
    }
}