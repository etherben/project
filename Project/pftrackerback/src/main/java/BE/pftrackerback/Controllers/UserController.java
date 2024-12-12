package BE.pftrackerback.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import BE.pftrackerback.Model.User;
import BE.pftrackerback.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling user-related HTTP requests.
 * <p>
 * This class exposes the endpoints for creating a user, retrieving all users, and logging in a user.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000") // Enable Cross-Origin Requests from the specified origin
@RequestMapping("/users") // Base URL for all user-related endpoints
public class UserController {

    /**
     * Service instance for managing user operations.
     */
    @Autowired
    private UserService userService;

    /**
     * Endpoint to create a new user.
     * <p>
     * Accepts a {@link User} object in the request body and returns the created user.
     *
     * @param user the {@link User} object to be created.
     * @return a {@link ResponseEntity} containing the created user and HTTP status code {@code 201 Created}.
     */
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    /**
     * Endpoint to retrieve all users.
     * <p>
     * Returns a list of all users in the system.
     *
     * @return a list of {@link User} objects representing all users.
     */
    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    /**
     * Endpoint for user login.
     * <p>
     * Accepts a {@link User} object with the username and password, and returns the authenticated user
     * if the login is successful. Returns an HTTP status code of {@code 401 Unauthorized} if the login fails.
     *
     * @param user the {@link User} object containing the username and password for login.
     * @return a {@link ResponseEntity} containing the authenticated user or {@code null} with HTTP status code {@code 401 Unauthorized}.
     */
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        user = userService.loginUser(user.getUsername(), user.getPassword());
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }
}