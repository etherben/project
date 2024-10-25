package com.fyp.pftracker_backend.service;

import com.fyp.pftracker_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.fyp.pftracker_backend.repository.UserRepo;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    //@Autowired
    private UserRepo loginuserrepo;


    public  User saveUser(User user) {

        if(user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if(user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if(user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }


        return loginuserrepo.save(user);
    }
}