package com.fyp.pftracker_backend.service;

import com.fyp.pftracker_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fyp.pftracker_backend.repository.UserRepo;
@Service
public class UserService {
    //@Autowired
    private UserRepo loginuserrepo;


    public  User saveUser(User user) {
        return loginuserrepo.save(user);
    }
}