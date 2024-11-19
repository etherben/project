package BE.pftrackerback.Service;

import BE.pftrackerback.Model.User;
import BE.pftrackerback.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    public User createUser(User user) {
        return userRepo.save(user);
    }
    public List<User> getUsers(){
        return userRepo.findAll();
    }

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
