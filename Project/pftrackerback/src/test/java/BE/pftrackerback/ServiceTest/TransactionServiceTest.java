package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Repo.TransactionRepo;
import BE.pftrackerback.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.ResourceUtils;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

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
        // Given
        Transaction transaction = new Transaction();
        transaction.setUserId("user1");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);
        transaction.setMerchant("TestMer");

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
        transaction1.setMerchant("TestMer");

        Transaction transaction2 = new Transaction();
        transaction2.setUserId("user2");
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(75.0);
        transaction2.setMerchant("TestMer2");

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
        transaction.setMerchant("TestMer");

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
        transaction.setMerchant(null);

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
        transaction.setMerchant("TestMer");

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
        String line ="15/11/2024,TestMer,100.0";


        // When
        Transaction transaction = transactionService.parseTransaction(line);
        transaction.setUserId("user1");
        // Then
        assertEquals("user1", transaction.getUserId());
        assertEquals(100.0, transaction.getAmount());
        assertEquals("TestMer", transaction.getMerchant());
        assertEquals(2024, transaction.getTransactionDate().getYear() + 1900);
        assertEquals(10, transaction.getTransactionDate().getMonth()); // Correctly parsed Details put into transaction
        assertEquals(15, transaction.getTransactionDate().getDate());
    }
    @Test
    public void testParseFile() throws IOException {
        //Given Use mock file for testing in test/resources
        MockMultipartFile file = new MockMultipartFile(            //had to change to MultipartFile
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
        //Given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "mockTransactionsFile.txt", // Invalid file extension
                "text/plain",
                new FileInputStream("src/test/resources/mockTransactionsFile.txt")
        );
        String userId = "userId123";

        assertThrows(IllegalArgumentException.class, () -> transactionService.parseFile(file, userId), "Invalid file format. Not CSV");
    }

    @Test
    public void getAllTransactions() {
        //Given
        String userId = "user1";
        Transaction transaction1 = new Transaction();
        transaction1.setUserId(userId);
        transaction1.setTransactionDate(new Date());
        transaction1.setAmount(100.0);
        transaction1.setMerchant("TestMer");
        Transaction transaction2 = new Transaction();
        transaction2.setUserId(userId);
        transaction2.setTransactionDate(new Date());
        transaction2.setAmount(200.0);
        transaction2.setMerchant("TestMer2");

        List<Transaction> mockTransaction = new ArrayList<>();
        mockTransaction.add(transaction1);  // creating mock of return from repo
        mockTransaction.add(transaction2);

        Mockito.when(transactionRepo.findByUserId(userId)).thenReturn(mockTransaction);

        //When
        System.out.println(transactionRepo.findByUserId(userId));
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);

        //Then
        assertNotNull(transactions);
        assertEquals(2, transactions.size());
        assertEquals(transaction1, transactions.get(0));  //list is correct
        assertEquals(transaction2, transactions.get(1));

    }

    @Test
    public void getAllTransactions_InvalidUserId() {
        //Just checking for the throw, don't need to mock a transaction list
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.getTransactionsByUserId("");
        });
        assertEquals("User id is null or empty", exception.getMessage());
    }
    @Test
    public void testGetTransactionsByUserId_NoTransactions() {
        //Given
        String userId = "user123";
        Mockito.when(transactionRepo.findByUserId(userId)).thenThrow(new IllegalArgumentException("No transactions found"));
        //When

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            transactionService.getTransactionsByUserId(userId);
        });
        //Then
        assertEquals("No transactions found", exception.getMessage());
    }
    @Test
    public void testNullMerchant(){
        // Given
        Transaction transaction = new Transaction();
        transaction.setUserId("test123");
        transaction.setTransactionDate(new Date());
        transaction.setAmount(100.0);
        transaction.setMerchant(null);

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.addTransaction(transaction),
                "Expected to throw an IllegalArgument for null fields");
    }
}


