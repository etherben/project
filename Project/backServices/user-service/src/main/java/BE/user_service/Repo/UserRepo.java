package BE.user_service.Repo;

import BE.user_service.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for performing operations on the User entity.
 * <p>
 * This interface extends {@link MongoRepository}
 *
 */
@Repository
public interface UserRepo extends MongoRepository<User, String> {

    /**
     * Finds a user by their username.
     *
     * @param username the username to search for.
     * @return an {@link Optional} containing the User if found, or empty if no user is found.
     */
    Optional<User> findByUsername(String username);
}