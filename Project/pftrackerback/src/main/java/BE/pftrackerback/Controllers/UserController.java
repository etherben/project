package BE.pftrackerback.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import BE.pftrackerback.Model.User;
import BE.pftrackerback.Service.UserService;
import  org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin (origins = "http://localhost:3000")
@RequestMapping("/users")

public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser =  userService.createUser(user.getUsername(),user.getPassword(), user.getEmail());
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
         user = userService.loginUser(user.getUsername(), user.getPassword());
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

}
