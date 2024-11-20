package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TransactionServiceTest {
    @Mock
    private TransactionService transactionService;
    private Transaction transaction;

    @BeforeEach
    public void setUp() {
        // Create a new instance for each test to reset state
        transactionService = new TransactionService();
    }

    @Test
    public void testAddTransaction() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);

        // When
        transactionService.addTransaction(transaction);

        // Then
        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals("user1", transactions.get(0).getId());
    }

    @Test
    public void testMultipleTransactions() {
        // Given
        Transaction transaction1 = new Transaction();
        transaction1.setId("user1");
        transaction1.setTransactionDate(new Date());
        transaction1.setAmount(100.0);

        Transaction transaction2 = new Transaction();
        transaction2.setId("user2");
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(75.0);

        // When
        transactionService.addTransaction(transaction1);
        transactionService.addTransaction(transaction2);

        // Then
        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertEquals("user1", transactions.get(0).getId()); //
        assertEquals("user2", transactions.get(1).getId());
    }
    @Test
    public void testNoTransactions() {
        // When
        List<Transaction> transactions = transactionService.getTransactions();

        // Then
        assertNotNull(transactions); // Ensure list is not null
        assertTrue(transactions.isEmpty()); // But is empty
    }
    @Test
    public void testAddDuplicateTransaction() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);

        // When
        transactionService.addTransaction(transaction);
        transactionService.addTransaction(transaction); // Adding the same transaction

        // Then
        List<Transaction> transactions = transactionService.getTransactions();
        assertEquals(2, transactions.size()); // Allow duplicates as could be some in transactions
    }

    @Test
    public void testAddTransactionWithNullFields() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setId(null); // Null user ID
        transaction.setTransactionDate(null); // Null date
        transaction.setAmount(0);

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for null fields");
    }

    @Test
    public void testAddTransactionWithNegativeAmount() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(-50.0); // Invalid negative amount

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected  to throw an IllegalArgument for negative amount");
    }
    @Test
    public void testGetTransactionsEmpty() {
        // When
        List<Transaction> transactions = transactionService.getTransactions();

        // Then
        assertNotNull(transactions, "Transactions list should not be null");
        assertTrue(transactions.isEmpty(), "Transactions list should be empty when no transactions are added");
    }
}
