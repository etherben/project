package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Repo.TransactionRepo;
import BE.pftrackerback.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.ResourceUtils;
import java.io.FileInputStream;
import java.io.IOException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.springframework.data.mongodb.core.aggregation.ConditionalOperators.Switch.CaseOperator.when;

@SpringBootTest
public class TransactionServiceTest {


    @Autowired
    private TransactionService transactionService;
    @MockBean
    private TransactionRepo transactionRepo;

    private List<Transaction> transactions;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        transactions = new ArrayList<>();

        // Create a new instance for each test to reset state
        transactionService = new TransactionService();
    }

    @Test
    public void testAddTransaction() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);

        // When
        transactionService.addTransaction(transaction);

        // Then
        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(1, transactions.size());
        assertEquals("user1", transactions.getFirst().getUserId());
    }

    @Test
    public void testMultipleTransactions() {
        // Given
        Transaction transaction1 = new Transaction();
        transaction1.setUserId("user1");
        transaction1.setTransactionDate(new Date());
        transaction1.setAmount(100.0);

        Transaction transaction2 = new Transaction();
        transaction2.setUserId("user2");
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(75.0);

        // When
        transactionService.addTransaction(transaction1);
        transactionService.addTransaction(transaction2);

        // Then
        List<Transaction> transactions = transactionService.getTransactions();
        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertEquals("user1", transactions.get(0).getUserId()); //
        assertEquals("user2", transactions.get(1).getUserId());
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
        transaction.setUserId("user1");
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
        transaction.setUserId(null); // Null user ID
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
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(-50.0); // Invalid negative amount

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for negative amount");
    }
    @Test
    public void testGetTransactionsEmpty() {
        // When
        List<Transaction> transactions = transactionService.getTransactions();

        // Then
        assertNotNull(transactions, "Transactions list should not be null");
        assertTrue(transactions.isEmpty(), "Transactions list should be empty when no transactions are added");
    }

    @Test
    public void testDateParsing() {
        //Given
        String dateStr = "15/11/2024";

        //When
        Date ParsedDate = transactionService.parseDate(dateStr);

        //Then
        assertEquals(15, ParsedDate.getDate());
        assertEquals(10, ParsedDate.getMonth()); //Keep in mind jan is month 0. Dec is month 11
        assertEquals(2024, ParsedDate.getYear() + 1900); //needed as want it stored correctly

    }
    @Test
    public void testInvalidDateParsing() {
        // Given
        String dateStr = "31/02/2024"; // Invalid date
        // When & then
        assertThrows(IllegalArgumentException.class, () -> transactionService.parseDate(dateStr));
    }
    @Test
    public void testInvalidDateFormat() {
        // Given
        String dateStr = "2024-11-15";
        // When & then
        assertThrows(IllegalArgumentException.class, () -> transactionService.parseDate(dateStr));
    }
    @Test
    public void testParseTransaction() {
        // Given (what each line will be parsed into)
        String line ="15/11/2024,100.0";


        // When
        Transaction transaction = transactionService.parseTransaction(line);
        transaction.setUserId("user1");
        // Then
        assertEquals("user1", transaction.getUserId());
        assertEquals(100.0, transaction.getAmount());
        assertEquals(2024, transaction.getTransactionDate().getYear() + 1900);
        assertEquals(10, transaction.getTransactionDate().getMonth()); // Correctly parsed Details put into transaction
        assertEquals(15, transaction.getTransactionDate().getDate());
    }
    @Test
    public void testParseFile() throws IOException {
        //Given Use mock file for testing in test/resources
        MockMultipartFile file = new MockMultipartFile(            //had to change to multipartfile
                "file", // The name of the file field
                "mockTransactionsFile.csv", //filename
                "text/csv", // File type
                new FileInputStream(ResourceUtils.getFile("classpath:mockTransactionsFile.csv")) // File content
        );
        String userId = "userId123";
        //When
        List<Transaction> lines = transactionService.parseFile(file, userId);


        //Then
        assertNotNull(lines);
        assertFalse(lines.isEmpty(), "File should contain at least one line");
        assertEquals(100, lines.get(0).getAmount());
        assertEquals(200, lines.get(1).getAmount());
        assertEquals(300, lines.get(2).getAmount());
    }

    @Test
    public void testParseFileFormatFail() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", // The name of the file field
                "mockTransactionsFile.txt", // Invalid file extension
                "text/plain", // File type (not CSV)
                new FileInputStream("src/test/resources/mockTransactionsFile.txt") // File content
        );
        String userId = "userId123";

        assertThrows(IllegalArgumentException.class, () -> transactionService.parseFile(file, userId), "Invalid file format. Not CSV");
    }
}

