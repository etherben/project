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
import org.springframework.mock.web.MockMultipartFile;

import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;


import java.io.FileInputStream;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;



@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {

    private Transaction transaction;
    private Transaction transaction2;
    private Transaction invalidTransaction;

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
        assertEquals("Created", response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    public void testAddTransactionWithInvalidId() {
        invalidTransaction = new Transaction();
        invalidTransaction.setId(null); // Invalid ID
        invalidTransaction.setTransactionDate(new Date());
        invalidTransaction.setAmount(100.0);

        // Given Mock the TransactionService to throw an IllegalArgumentException
        when(transactionService.addTransaction(any(Transaction.class)))
                .thenThrow(new IllegalArgumentException("Transaction ID cannot be null"));

        // When
        ResponseEntity<String> response = transactionController.addTransaction(invalidTransaction);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Transaction ID cannot be null", response.getBody());
    }
    @Test
    public void testAddTransactionWithInvalidDate() {
        // Given
        invalidTransaction = new Transaction();
        invalidTransaction.setId("test123");
        invalidTransaction.setTransactionDate(null); // Invalid date
        invalidTransaction.setAmount(100.0);


        when(transactionService.addTransaction(any(Transaction.class)))
                .thenThrow(new IllegalArgumentException("Transaction date cannot be null"));

        // When
        ResponseEntity<String> response = transactionController.addTransaction(invalidTransaction);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Transaction date cannot be null", response.getBody());
    }

    @Test
    public void testAddTransactionWithInvalidAmount() {
        // Given
        invalidTransaction = new Transaction();
        invalidTransaction.setId("test123");
        invalidTransaction.setTransactionDate(new Date());
        invalidTransaction.setAmount(-10.0); // Invalid amount

        when(transactionService.addTransaction(any(Transaction.class)))
                .thenThrow(new IllegalArgumentException("Transaction amount must be greater than 0"));

        // When
        ResponseEntity<String> response = transactionController.addTransaction(invalidTransaction);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Transaction amount must be greater than 0", response.getBody());

    }

    @Test
    public void testGetAllTransactions() {
        // Given
        List<Transaction> transactionList = new ArrayList<>();
        transactionList.add(transaction);
        transactionList.add(transaction2);
        when(transactionService.getTransactions()).thenReturn(transactionList);

        // When
        ResponseEntity<List<Transaction>> response = transactionController.getAllTransactions();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(transaction, response.getBody().get(0));
        assertEquals(transaction2, response.getBody().get(1));
    }
    @Test
    public void testAddBulkTransactionSuccess() throws Exception {
        //Given
        MockMultipartFile file = new MockMultipartFile(            //had to change to multipartfile
                "file", // The name of the file field
                "mockTransactionsFile.csv", // Original filename
                "text/csv", // File type
                new FileInputStream(ResourceUtils.getFile("classpath:mockTransactionsFile.csv")) // File content
        );
        List<Transaction> mockResponse = new ArrayList<>();
        mockResponse.add(transaction);
        mockResponse.add(transaction2);
        when(transactionService.parseFile(any(MultipartFile.class))).thenReturn(mockResponse);

        //when
        ResponseEntity<String> response = transactionController.addBulkTransaction(file);

        //then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Created", response.getBody());
        assertNotNull(response.getBody());
    }

    @Test
    public void testAddBulkTransactionInvalidFileType() throws Exception {
        // Given (txt file)
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "invalidFile.txt",
                "text/plain",
                "Some text content".getBytes() //rand content
        );
        when(transactionService.parseFile(any(MultipartFile.class))).thenThrow(new IllegalArgumentException("Invalid file format. Not CSV"));

        // When
        ResponseEntity<String> response = transactionController.addBulkTransaction(file);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid file format. Not CSV", response.getBody());
    }

}