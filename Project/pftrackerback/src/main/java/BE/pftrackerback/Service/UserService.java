package BE.pftrackerback.Service;

import BE.pftrackerback.Model.User;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final List<User> users = new ArrayList<>();

    public User createUser(String username, String password, String email) {
        User user = new User(username, password, email);
        users.add(user);
        return user;
    }

    public List<User> getUsers(){
        return users;
    }

}
