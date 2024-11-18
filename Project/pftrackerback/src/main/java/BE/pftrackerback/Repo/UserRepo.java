package BE.pftrackerback.Repo;

import BE.pftrackerback.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepo extends MongoRepository<User, String> {
    User findByUserName(String username);
}