package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class TransactionServiceTest {
    @Autowired
    private TransactionService transactionService;

    @BeforeEach
    public void setUp() {}

    @Test
    public void testAddTransaction() {
        // Prepare the transaction
        Transaction transaction = new Transaction();
        transaction.setId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);

        // Add the transaction
        transactionService.addTransaction(transaction);

        // Verify that the transaction was added
        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals("user1", transactions.get(0).getId()); // Ensure userId is correctly linked
    }
}
