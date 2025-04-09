package BE.user_service.Service;

import BE.user_service.Model.User;
import BE.user_service.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing user-related operations.
 * <p>
 * This class handles logic for the {@link UserRepo} repository,
 * providing methods for creating users, retrieving all users,
 * and authenticating users during login.
 */
@Service
public class UserService {

    /**
     * Repository instance for performing database operations on User entities.
     */
    @Autowired
    public UserRepo userRepo;

    /**
     * Creates a new user and saves it to the database.
     *
     * @param user the user entity to be created and saved.
     * @return the saved user entity.
     */
    public User createUser(User user) {
        return userRepo.save(user);
    }

    /**
     * Retrieves a list of all users from the database.
     *
     * @return a list of all user entities.
     */
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    /**
     * Authenticates a user by verifying the provided username and password.
     * <p>
     * If the username exists in the database and the provided password matches the stored password,
     * the corresponding user is returned. Otherwise, {@code null} is returned.
     *
     * @param username the username of the user attempting to log in.
     * @param password the password of the user attempting to log in.
     * @return the authenticated user entity if credentials are valid, or {@code null} if authentication fails.
     */
    public User loginUser(String username, String password) {
        Optional<User> userOptional = userRepo.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}