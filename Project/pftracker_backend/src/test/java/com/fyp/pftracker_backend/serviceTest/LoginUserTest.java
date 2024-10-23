
/* Goals of login
 Validate user credentials
 Return result of login - fail or pass
* */
/*



package com.fyp.pftracker_backend.serviceTest;

import org.apache.catalina.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest
@AutoConfigureMockMvc
public class LoginUserTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void loginSuccess(){
        String username= "testuser";
        String password= "testpassword";

        User user = new User(username,password);
        when(loginUserRepo.findByUsername(username).thenReturn(user));

        boolean success = LoginUser.login(username,password);

        assertTrue(success);
        verify(loginUserRepo).findByUsername(username);


    }
}

 */