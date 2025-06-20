package BE.transaction_service.ControllerTest;

import BE.transaction_service.Controller.TransactionController;
import BE.transaction_service.Model.Transaction;
import BE.transaction_service.Service.TransactionService;

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
        String userId = "userId123";
        List<Transaction> mockResponse = new ArrayList<>();
        mockResponse.add(transaction);
        mockResponse.add(transaction2);
        when(transactionService.parseFile(any(MultipartFile.class), eq(userId)))
                .thenReturn(mockResponse); //eq matches arguement rather than passing raw value
        //when
        ResponseEntity<String> response = transactionController.addBulkTransaction(file, userId);

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
        String userId = "userId123";
        when(transactionService.parseFile(any(MultipartFile.class), eq(userId)))
                .thenThrow(new IllegalArgumentException("Invalid file format. Not CSV"));

        // When
        ResponseEntity<String> response = transactionController.addBulkTransaction(file, userId);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid file format. Not CSV", response.getBody());
    }

    @Test
    public void testGetTransactions() {
        //Given
        String userId = "userId123";
        List<Transaction> mockTransactions = new ArrayList<>();
        mockTransactions.add(transaction);
        mockTransactions.add(transaction2);
        when(transactionService.getTransactionsByUserId("userId123"))
                .thenReturn(mockTransactions);

        //When
        ResponseEntity<?> response = transactionController.getTransactionsByUserId(userId);

        //Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockTransactions, response.getBody());

    }

    @Test
    public void testGetTransactionNoTransactionsFound() {
        //Given
        String userId = "userId123";
        when(transactionService.getTransactionsByUserId(userId))
                .thenThrow(new IllegalArgumentException("No transactions found for the user id " + userId));
        //When
        ResponseEntity<?> response = transactionController.getTransactionsByUserId(userId);
        //Then
        assertEquals("No transactions found for the user id " + userId, response.getBody());
    }

    @Test
    public void testGetTransactionRuntimeException() {
        //Given
        String userId = "userId123";
        when(transactionService.getTransactionsByUserId(userId))
                .thenThrow(new RuntimeException("Runtime error: (Message)"));
        //When
        ResponseEntity<?> response = transactionController.getTransactionsByUserId(userId);
        //Then
        assertEquals("Runtime error: (Message)", response.getBody());
    }

    @Test
    public void testDeleteSingleTransaction() {
        // Given
        String transactionId = "validId";
        doNothing().when(transactionService).deleteSingle(transactionId);

        // When
        ResponseEntity<String> response = transactionController.deleteSingleTransaction(transactionId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testDeleteSingleTransaction_BadRequest() {
        // Given
        String transactionId = "invalidTransactionId";
        doThrow(new IllegalArgumentException("Transaction could not be deleted")).when(transactionService).deleteSingle(transactionId);

        // When
        ResponseEntity<?> response = transactionController.deleteSingleTransaction(transactionId);

        // Then
        assertEquals("Transaction could not be deleted", response.getBody());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testUpdateTransaction_Success() {
        // Given
        String transactionId = "123";
        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setAmount(150.0);
        updatedTransaction.setMerchant("NewMerchant");
        Date newDate = new Date();
        updatedTransaction.setTransactionDate(newDate);

        Transaction returnedTransaction = new Transaction();
        returnedTransaction.setId(transactionId);
        returnedTransaction.setAmount(150.0);
        returnedTransaction.setMerchant("NewMerchant");
        returnedTransaction.setTransactionDate(newDate);

        when(transactionService.updateTransaction(eq(transactionId), any(Transaction.class)))
                .thenReturn(returnedTransaction);

        // When
        ResponseEntity<?> response = transactionController.updateTransaction(transactionId, updatedTransaction);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Transaction responseBody = (Transaction) response.getBody();
        assertEquals(150.0, responseBody.getAmount());
        assertEquals("NewMerchant", responseBody.getMerchant());
        assertEquals(newDate, responseBody.getTransactionDate());
    }

    @Test
    public void testUpdateTransaction_Error() {
        // Given
        String transactionId = "invalidId";
        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setAmount(150.0);
        updatedTransaction.setMerchant("NewMerchant");
        updatedTransaction.setTransactionDate(new Date());

        when(transactionService.updateTransaction(eq(transactionId), any(Transaction.class)))
                .thenThrow(new IllegalArgumentException("Transaction not found"));

        // When
        ResponseEntity<?> response = transactionController.updateTransaction(transactionId, updatedTransaction);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Transaction not found", response.getBody());
    }

}