package BE.transaction_service.Controller;

import BE.transaction_service.Model.Transaction;
import BE.transaction_service.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * Controller class for handling transaction-related HTTP requests.
 * <p>
 * This class exposes the endpoints for adding transactions, retrieving all transactions, processing bulk transactions from files,
 * and saving transactions to the database.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000") // Enable Cross-Origin Requests from the specified origin
@RequestMapping("/transactions") // Base URL for all transaction-related endpoints
public class TransactionController {

    /**
     * Service instance for managing transaction operations.
     */
    @Autowired
    private TransactionService transactionService;

    /**
     * Endpoint to add a single transaction.
     * <p>
     * Accepts a {@link Transaction} object in the request body and returns a message indicating whether the transaction was created successfully.
     *
     * @param transaction the {@link Transaction} object to be added.
     * @return a {@link ResponseEntity} with the HTTP status code and message indicating the result.
     */
    @PostMapping
    public ResponseEntity<String> addTransaction(@RequestBody Transaction transaction) {
        try {
            transactionService.addTransaction(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body("Created");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add transaction");
        }
    }

    /**
     * Endpoint to process and add multiple transactions from a CSV file.
     * <p>
     * Accepts a CSV file and a user ID, processes the file to extract transactions, and associates them with the given user ID.
     *
     * @param file   the CSV file containing transaction data.
     * @param userId the user ID to associate with the transactions.
     * @return a {@link ResponseEntity} with the HTTP status code and message indicating the result.
     */
    @PostMapping("/bulk")
    public ResponseEntity<String> addBulkTransaction(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId) {
        try {
            transactionService.parseFile(file, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Created");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add transactions");
        }
    }

    /**
     * Endpoint to save transactions to the database.
     * <p>
     * This endpoint persists all transactions that have been added and buffered in memory.
     *
     * @return a {@link ResponseEntity} with the HTTP status code and message indicating the result.
     */
    @PostMapping("/save")
    public ResponseEntity<String> saveTransaction() {
        try {
            transactionService.persistTransaction();
            return ResponseEntity.status(HttpStatus.CREATED).body("Saved");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Endpoint to retrieve all buffered transactions.
     * <p>
     * Returns a list of all transactions stored in the buffer.
     *
     * @return a {@link ResponseEntity} containing the list of all transactions and HTTP status code {@code 200 OK}.
     */
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * Endpoint to retrieve transactions for a specific user based on their user ID.
     * <p>
     * Returns a list of transactions associated with the provided user ID.
     *
     * @param userId the ID of the user whose transactions are to be retrieved.
     * @return a {@link ResponseEntity} containing the list of transactions for the user and appropriate HTTP status code.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getTransactionsByUserId(@PathVariable String userId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
            return ResponseEntity.ok(transactions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Deletes a single transaction by its ID.
     *
     * @param transactionId The ID of the transaction to be deleted.
     * @return ResponseEntity with a success message or error details.
     */
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteSingleTransaction(@PathVariable String transactionId) {
        try {
            transactionService.deleteSingle(transactionId);  // Call the service method to delete the transaction
            return new ResponseEntity<>("Transaction deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Updates an existing transaction by its ID.
     *
     * @param transactionId The ID of the transaction to be updated.
     * @param updatedTransaction The transaction object containing updated details.
     * @return ResponseEntity with the updated transaction or error details.
     */
    @PutMapping("/{transactionId}")
    public ResponseEntity<?> updateTransaction(@PathVariable String transactionId, @RequestBody Transaction updatedTransaction) {
        try {
            Transaction transaction = transactionService.updateTransaction(transactionId, updatedTransaction);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Retrieves the most popular category for a specific merchant.
     *
     * @param Merchant The name of the merchant.
     * @return ResponseEntity with the most popular category or an error message.
     */
    @GetMapping("/category/{Merchant}")
    public ResponseEntity<String> getMostPopularCategoryForMerchant(@PathVariable String Merchant) {
        try {
            String category = transactionService.getMostPopularCategoryForMerchant(Merchant);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Filters transactions based on various parameters such as user ID, merchant, category, start date, and end date.
     *
     * @param userId The ID of the user whose transactions are being queried.
     * @param merchant The merchant to filter transactions by (optional).
     * @param category The category to filter transactions by (optional).
     * @param startDate The start date to filter transactions (optional).
     * @param endDate The end date to filter transactions (optional).
     * @return A list of filtered transactions.
     */
    @GetMapping("/filter")
    public List<Transaction> filterTransactions(
            @RequestParam("userId") String userId,
            @RequestParam(required = false) String merchant,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate
    ) {
        System.out.println("Received userId: " + userId);
        System.out.println("Received merchant: " + merchant);
        System.out.println("Received category: " + category);
        System.out.println("Received startDate: " + startDate);
        System.out.println("Received endDate: " + endDate);

        return transactionService.filterTransactions(userId, merchant, category, startDate, endDate);
    }

    /**
     * Clears all transactions from the transaction service.
     *
     * @return ResponseEntity with a message confirming that all transactions were cleared.
     */
    @GetMapping("/clear")
    public ResponseEntity<String> clearAllTransactions() {
        transactionService.clearTransactions();
        return ResponseEntity.status(HttpStatus.CREATED).body("All transactions cleared");
    }
}