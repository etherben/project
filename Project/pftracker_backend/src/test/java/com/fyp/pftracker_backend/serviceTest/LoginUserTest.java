
/* Goals of login
 Validate user credentials
 Return result of login - fail or pass
* */


package com.fyp.pftracker_backend.serviceTest;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest
@AutoConfigureMockMvc
public class LoginUserTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shoulddostuff(){

    }
}

