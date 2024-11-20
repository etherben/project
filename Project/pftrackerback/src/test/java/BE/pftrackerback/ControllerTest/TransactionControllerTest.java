package BE.pftrackerback.ControllerTest;

import BE.pftrackerback.Controllers.TransactionController;
import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Service.TransactionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;


@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {

    private Transaction transaction;
    private Transaction transaction2;

    @Autowired
    private TransactionController transactionController;

    @MockBean
    private TransactionService transactionService;

    @BeforeEach
    public void setUp() {

        MockitoAnnotations.openMocks(this);

        transaction = new Transaction();
        transaction.setId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);

        transaction2 = new Transaction();
        transaction2.setId("user2");
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(50.0);


    }
    @Test
    public void testAddTransaction() {
        // Given
        when(transactionService.addTransaction(transaction)).thenReturn(transaction);

        // When
        ResponseEntity<String> response = transactionController.addTransaction(transaction);

        // Then
        assertNotNull(response.getBody());
        assertEquals("Transaction added successfully", response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
}