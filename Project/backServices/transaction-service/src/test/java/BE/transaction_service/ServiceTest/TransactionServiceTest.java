package BE.transaction_service.ServiceTest;

import BE.transaction_service.Model.Transaction;
import BE.transaction_service.Repo.TransactionRepo;
import BE.transaction_service.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.ResourceUtils;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TransactionServiceTest {

    @Mock
    private TransactionRepo transactionRepo;
    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAddTransaction() {
        Transaction transaction = new Transaction();
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);
        transaction.setMerchant("TestMer");
        transaction.setCategory("Food");

        transactionService.addTransaction(transaction);

        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals("user1", transactions.getFirst().getUserId());
    }

    @Test
    public void testMultipleTransactions() {
        Transaction transaction1 = new Transaction();
        transaction1.setUserId("user1");
        transaction1.setTransactionDate(new Date());
        transaction1.setAmount(100.0);
        transaction1.setMerchant("TestMer");
        transaction1.setCategory("Food");

        Transaction transaction2 = new Transaction();
        transaction2.setUserId("user2");
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(75.0);
        transaction2.setMerchant("TestMer2");
        transaction2.setCategory("Food");

        transactionService.addTransaction(transaction1);
        transactionService.addTransaction(transaction2);

        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertEquals("user1", transactions.get(0).getUserId());
        assertEquals("user2", transactions.get(1).getUserId());
    }

    @Test
    public void testNoTransactions() {
        List<Transaction> transactions = transactionService.getTransactions();

        assertNotNull(transactions);
        assertTrue(transactions.isEmpty());
    }

    @Test
    public void testAddDuplicateTransaction() {
        Transaction transaction = new Transaction();
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);
        transaction.setMerchant("TestMer");
        transaction.setCategory("Food");

        transactionService.addTransaction(transaction);
        transactionService.addTransaction(transaction);

        List<Transaction> transactions = transactionService.getTransactions();
        assertEquals(2, transactions.size());
    }

    @Test
    public void testAddTransactionWithNullFields() {
        Transaction transaction = new Transaction();
        transaction.setUserId(null);
        transaction.setTransactionDate(null);
        transaction.setAmount(0);
        transaction.setMerchant(null);

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for null fields");
    }

    @Test
    public void testAddTransactionWithNegativeAmount() {
        Transaction transaction = new Transaction();
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(-50.0);
        transaction.setMerchant("TestMer");

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for negative amount");
    }

    @Test
    public void testGetTransactionsEmpty() {
        List<Transaction> transactions = transactionService.getTransactions();

        assertNotNull(transactions, "Transactions list should not be null");
        assertTrue(transactions.isEmpty(), "Transactions list should be empty when no transactions are added");
    }

    @Test
    public void testDateParsing() {
        String dateStr = "15/11/2024";

        Date ParsedDate = transactionService.parseDate(dateStr);

        assertEquals(15, ParsedDate.getDate());
        assertEquals(10, ParsedDate.getMonth());
        assertEquals(2024, ParsedDate.getYear() + 1900);
    }

    @Test
    public void testInvalidDateParsing() {
        String dateStr = "31/02/2024";
        assertThrows(IllegalArgumentException.class, () -> transactionService.parseDate(dateStr));
    }

    @Test
    public void testInvalidDateFormat() {
        String dateStr = "2024-11-15";
        assertThrows(IllegalArgumentException.class, () -> transactionService.parseDate(dateStr));
    }

    @Test
    public void testParseTransaction() {
        String line = "15/11/2024,TestMer,100.0,Food";

        Transaction transaction = transactionService.parseTransaction(line);
        transaction.setUserId("user1");

        assertEquals("user1", transaction.getUserId());
        assertEquals(100.0, transaction.getAmount());
        assertEquals("TestMer", transaction.getMerchant());
        assertEquals(2024, transaction.getTransactionDate().getYear() + 1900);
        assertEquals(10, transaction.getTransactionDate().getMonth());
        assertEquals(15, transaction.getTransactionDate().getDate());
    }

    @Test
    public void testParseFile() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "mockTransactionsFile.csv",
                "text/csv",
                new FileInputStream(ResourceUtils.getFile("classpath:mockTransactionsFile.csv"))
        );
        String userId = "userId123";

        List<Transaction> lines = transactionService.parseFile(file, userId);

        assertNotNull(lines);
        assertFalse(lines.isEmpty(), "File should contain at least one line");
        assertEquals(100, lines.get(0).getAmount());
        assertEquals(200, lines.get(1).getAmount());
        assertEquals(300, lines.get(2).getAmount());
    }

    @Test
    public void testParseFileFormatFail() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "mockTransactionsFile.txt",
                "text/plain",
                new FileInputStream("src/test/resources/mockTransactionsFile.txt")
        );
        String userId = "userId123";

        assertThrows(IllegalArgumentException.class, () -> transactionService.parseFile(file, userId), "Invalid file format. Not CSV");
    }

    @Test
    public void getAllTransactions_InvalidUserId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.getTransactionsByUserId("");
        });
        assertEquals("User id is null or empty", exception.getMessage());
    }

    @Test
    public void testGetTransactionsByUserId_NoTransactions() {
        String userId = "user123";
        when(transactionRepo.findByUserId(userId, Sort.unsorted()))
                .thenThrow(new IllegalArgumentException("No transactions found"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.getTransactionsByUserId(userId);
        });

        assertEquals("No transactions found", exception.getMessage());
    }

    @Test
    public void testNullMerchant() {
        Transaction transaction = new Transaction();
        transaction.setUserId("test123");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);
        transaction.setMerchant(null);

        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for null fields");
    }

    @Test
    public void testDeleteSingle() {
        String transactionId = "test123";
        doNothing().when(transactionRepo).deleteById(transactionId);

        transactionService.deleteSingle(transactionId);

        verify(transactionRepo, times(1)).deleteById(transactionId);
    }

    @Test
    public void testDeleteSingle_BadRequest() {
        String invalidTransactionId = "invalidTransactionId";
        doThrow(new RuntimeException("Errorlol")).when(transactionRepo).deleteById(invalidTransactionId);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.deleteSingle(invalidTransactionId);
        });
        assertEquals("Transaction could not be deleted", exception.getMessage());
    }

    @Test
    public void testUpdateTransaction_Success() {
        String transactionId = "123";
        Transaction existingTransaction = new Transaction();
        existingTransaction.setId(transactionId);
        existingTransaction.setMerchant("OldMerchant");
        existingTransaction.setAmount(100.0);
        Date oldDate = new Date();
        existingTransaction.setTransactionDate(oldDate);

        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setAmount(150.0);
        updatedTransaction.setMerchant("NewMerchant");
        Date newDate = new Date(oldDate.getTime() + 100000);
        updatedTransaction.setTransactionDate(newDate);

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.of(existingTransaction));
        when(transactionRepo.save(existingTransaction)).thenReturn(existingTransaction);

        Transaction result = transactionService.updateTransaction(transactionId, updatedTransaction);

        assertEquals(150.0, result.getAmount());
        assertEquals("NewMerchant", result.getMerchant());
        assertEquals(newDate, result.getTransactionDate());
    }

    @Test
    public void testUpdateTransaction_TransactionNotFound() {
        String transactionId = "nonExistingId";
        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setAmount(150.0);
        updatedTransaction.setMerchant("NewMerchant");
        updatedTransaction.setTransactionDate(new Date());

        when(transactionRepo.findById(transactionId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.updateTransaction(transactionId, updatedTransaction);
        });
        assertEquals("Transaction not found", exception.getMessage());
    }
}
