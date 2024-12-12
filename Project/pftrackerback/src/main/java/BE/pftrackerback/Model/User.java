package BE.pftrackerback.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a user entity in the system.
 * <p>
 * This class is mapped to the "user" collection in MongoDB database.
 */
@Document(collection = "user")
public class User {

    /**
     * The userid for the user collection.
     */
    @Id
    private String id;

    /**
     * The username of the user.
     */
    private String username;

    /**
     * The password of the user.
     * <p>
     * Note: Not yet encrypted.
     */
    private String password;

    /**
     * The email address of the user.
     */
    private String email;

    /**
     * Default constructor for creating an empty user.
     */
    public User() {}

    /**
     * Constructor to initialize a user with the specified details.
     *
     * @param username the username of the user.
     * @param password the password of the user.
     * @param email    the email address of the user.
     */
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    /**
     * Gets the userid of the user.
     *
     * @return the user ID.
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the userid of the user.
     *
     * @param id the user ID.
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets the username of the user.
     *
     * @return the username.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the user.
     *
     * @param username the username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the password of the user.
     *
     * @return the password.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password of the user.
     *
     * @param password the password.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the email address of the user.
     *
     * @return the email address.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address of the user.
     *
     * @param email the email address.
     */
    public void setEmail(String email) {
        this.email = email;
    }
}