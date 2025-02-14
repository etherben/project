package BE.transaction_service.Service;

import BE.transaction_service.Model.Transaction;
import BE.transaction_service.Repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Service class for handling business logic related to transactions.
 * <p>
 * This class manages operations such as adding, parsing, and retrieving transactions,
 * as well as file parsing and transaction persisting to database.
 */
@Service
public class TransactionService {

    /**
     * List of transactions stored in memory to act as a buffer before storing.
     */
    private List<Transaction> transactions = new ArrayList<>();

    /**
     * Repository for performing database operations on Transaction entities.
     */
    private TransactionRepo transactionRepo;

    /**
     * Constructs a TransactionService instance with the specified {@link TransactionRepo}.
     *
     * @param transactionRepo the {@link TransactionRepo} to interact with the database.
     */
    @Autowired
    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    /**
     * Retrieves all transactions stored in memory.
     *
     * @return a list of all transactions.
     */
    public List<Transaction> getTransactions() {
        return transactions;
    }

    /**
     * Retrieves transactions for a specific user ID, sorted by transaction date in descending order.
     *
     * @param userId the user ID whose transactions are to be retrieved.
     * @return a list of transactions for the specified user.
     * @throws IllegalArgumentException if the userId is null, empty, or no transactions are found.
     */
    public List<Transaction> getTransactionsByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User id is null or empty");
        }
        // Retrieve transactions sorted by TransactionDate in descending order
        List<Transaction> list = transactionRepo.findByUserId(userId, Sort.by(Sort.Direction.DESC, "TransactionDate"));
        if (list.isEmpty()) {
            throw new IllegalArgumentException("No transactions found");
        }
        return list;
    }

    /**
     * Adds a new transaction to the in memory list of transactions after validating its fields.
     *
     * @param transaction the transaction to be added.
     * @return the added transaction.
     * @throws IllegalArgumentException if any required field of the transaction is invalid.
     */
    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getUserId() == null) {
            throw new IllegalArgumentException("Transaction user ID cannot be null");
        } else if (transaction.getTransactionDate() == null) {
            throw new IllegalArgumentException("Transaction date cannot be null");
        } else if (transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than 0");
        } else if (transaction.getMerchant() == null) {
            throw new IllegalArgumentException("Transaction merchant cannot be null");
        } else {
            transactions.add(transaction);
            return transaction;
        }
    }

    /**
     * Parses each lines date string into a {@link Date} object.
     *
     * @param dateStr the date string to be parsed.
     * @return the parsed {@link Date}.
     * @throws IllegalArgumentException if the date string cannot be parsed.
     */
    public Date parseDate(String dateStr) throws IllegalArgumentException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);  // Disallow non-existent dates such as 32/13/2024
        try {
            return dateFormat.parse(dateStr);
        } catch (Exception e) {
            throw new IllegalArgumentException("Date cannot be parsed");
        }
    }

    /**
     * Parses each transaction line (CSV format) into a {@link Transaction} object.
     *
     * @param line the line for the CSV file, representing a transaction.
     * @return the parsed {@link Transaction}.
     * @throws IllegalArgumentException if the line format is invalid.
     */
    public Transaction parseTransaction(String line) throws IllegalArgumentException {
        String[] parts = line.split(",");  // Split the line into 3 parts (date, merchant, amount)
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid transaction format");
        }

        String dateStr = parts[0].trim();  // The date part
        String merchant = parts[1].trim(); // The merchant part
        double amount = Double.parseDouble(parts[2].trim()); // The amount part

        Date TransactionDate = parseDate(dateStr); // Parse the date string

        // Create and return the Transaction object
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(TransactionDate);
        transaction.setAmount(amount);
        transaction.setMerchant(merchant);

        return transaction;
    }

    /**
     * Parses a CSV file containing transactions and stores the transactions in memory.
     * <p>
     * Each transaction is parsed from a line, and the userid is assigned to each transaction.
     *
     * @param file the CSV file containing the transaction data.
     * @param userId the userid to associate with the transactions.
     * @return a list of transactions parsed from the file.
     * @throws IOException if the file cannot be read.
     * @throws IllegalArgumentException if the file format is invalid or parsing fails.
     */
    public List<Transaction> parseFile(MultipartFile file, String userId) throws IOException, IllegalArgumentException {
        if (!file.getContentType().equals("text/csv")) {
            throw new IllegalArgumentException("Invalid file format. Not CSV");  // Check file type before processing
        }
        List<Transaction> lines = new ArrayList<>();
        try (BufferedReader readFile = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = readFile.readLine()) != null) {
                Transaction currentTransaction = parseTransaction(line);
                currentTransaction.setUserId(userId); // Set user ID for each transaction parsed
                transactions.add(currentTransaction);
                lines.add(transactions.get(transactions.size() - 1)); // Add the last created transaction to the list
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("File could not be read");
        }
        return lines;
    }

    /**
     * Persists all the transactions stored in memory to the database.
     * <p>
     * This method saves the list of transactions to the {@link TransactionRepo} and clears the in-memory buffer list.
     *
     * @throws IllegalArgumentException if saving the transactions to the database fails.
     */
    public void persistTransaction() {
        try {
            List<Transaction> savedTransactions = transactionRepo.saveAll(transactions);
            transactions.clear();  // Clear the in-memory list after saving
        } catch (Exception e) {
            throw new IllegalArgumentException("Transactions could not be saved");
        }
    }

    public void deleteSingle(String transactionId) {
        try {
            transactionRepo.deleteById(transactionId);
        }catch (Exception e) {
            throw new IllegalArgumentException("Transaction could not be deleted");
        }
    }

    public Transaction updateTransaction(String transactionId, Transaction updatedTransaction) {
        Transaction existingTransaction = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (updatedTransaction.getAmount() > 0) {
            existingTransaction.setAmount(updatedTransaction.getAmount());
        }
        if (updatedTransaction.getMerchant() != null) {
            existingTransaction.setMerchant(updatedTransaction.getMerchant());
        }
        if (updatedTransaction.getTransactionDate() != null) {
            existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        }

        return transactionRepo.save(existingTransaction);
    }



}
