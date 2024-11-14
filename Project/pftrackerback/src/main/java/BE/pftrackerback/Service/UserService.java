package BE.pftrackerback.Service;

import BE.pftrackerback.Model.User;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final User admin = new User("admin", "password", "adminemail");
    //hardcoded admin user for testing
    private final List<User> users = new ArrayList<>();

    public UserService() {
        users.add(admin); //adds admin user to list from start
    }

    public User createUser(String username, String password, String email) {
        //check that username and email don't already exist
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                return null;  // Return null if username already exists
            }
            if (user.getEmail().equals(email)) {
                return null;  // Return null if email already exists
            }
        }

        //add user and return user
        User user = new User(username, password, email);
        users.add(user);
        return user;
    }

    public List<User> getUsers(){
        return users;
    }

    public User loginUser(String username, String password) {
        for (User user : users) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
}
