package BE.pftrackerback.Service;

import BE.pftrackerback.Model.User;
import BE.pftrackerback.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    //private final List<User> users = new ArrayList<>();

    public UserService() {}

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public List<User> getUsers(){
        return userRepo.findAll();
    }

    public User loginUser(String username, String password) {
        User user = userRepo.findByUserName(username);

        if (user != null) {
            if (user.getPassword().equals(password)) {
            return user;}
        }
        return null;
    }
}
