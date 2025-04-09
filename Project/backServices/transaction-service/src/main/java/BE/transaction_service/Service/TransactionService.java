package BE.transaction_service.Service;

import BE.transaction_service.Model.Transaction;
import BE.transaction_service.Repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Service class to handle operations related to transactions for users.
 * Provides functionality for adding, updating, deleting, retrieving, and filtering transactions.
 */
@Service
public class TransactionService {

    private List<Transaction> transactions = new ArrayList<>();
    private TransactionRepo transactionRepo;

    /**
     * Constructor to initialize the TransactionService with a TransactionRepo.
     *
     * @param transactionRepo The repository used for saving and retrieving transactions.
     */
    @Autowired
    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    /**
     * Retrieves all transactions currently in memory.
     *
     * @return A list of all transactions.
     */
    public List<Transaction> getTransactions() {
        return transactions;
    }

    /**
     * Clears the transaction buffer, typically used when closing the add transaction modal.
     */
    public void clearTransactions() {
        transactions.clear();
    }

    /**
     * Retrieves all transactions for a specific user, sorted by transaction date in descending order.
     *
     * @param userId The ID of the user whose transactions are to be retrieved.
     * @return A list of transactions for the specified user.
     * @throws IllegalArgumentException if the userId is null or empty, or if no transactions are found.
     */
    public List<Transaction> getTransactionsByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User id is null or empty");
        }
        List<Transaction> list = transactionRepo.findByUserId(userId, Sort.by(Sort.Direction.DESC, "TransactionDate"));
        if (list.isEmpty()) {
            throw new IllegalArgumentException("No transactions found");
        }
        return list;
    }

    /**
     * Adds a new transaction to the transaction list after validation.
     *
     * @param transaction The transaction object to be added.
     * @return The added transaction.
     * @throws IllegalArgumentException if any field in the transaction is invalid.
     */
    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getTransactionDate() == null) {
            throw new IllegalArgumentException("Transaction date cannot be null");
        } else if (transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than 0");
        } else if (transaction.getMerchant() == null) {
            throw new IllegalArgumentException("Transaction merchant cannot be null");
        } else if (transaction.getCategory() == null || transaction.getCategory().isEmpty()) {
            throw new IllegalArgumentException("Transaction category cannot be null or empty");
        } else {
            transactions.add(transaction);
            return transaction;
        }
    }

    /**
     * Parses a date string in the format "dd/MM/yyyy" into a Date object.
     *
     * @param dateStr The date string to be parsed.
     * @return The parsed Date object.
     * @throws IllegalArgumentException if the date cannot be parsed.
     */
    public Date parseDate(String dateStr) throws IllegalArgumentException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        try {
            return dateFormat.parse(dateStr);
        } catch (Exception e) {
            throw new IllegalArgumentException("Date cannot be parsed");
        }
    }

    /**
     * Parses a CSV transaction line into a Transaction object.
     *
     * @param line The CSV line representing a transaction.
     * @return The parsed Transaction object.
     * @throws IllegalArgumentException if the CSV line is in an invalid format.
     */
    public Transaction parseTransaction(String line) throws IllegalArgumentException {
        String[] parts = line.split(",");
        if (parts.length != 4) {
            throw new IllegalArgumentException("Invalid transaction format");
        }

        String dateStr = parts[0].trim();
        String merchant = parts[1].trim();
        double amount = Double.parseDouble(parts[2].trim());
        String category = parts[3].trim();

        Date transactionDate = parseDate(dateStr);

        Transaction transaction = new Transaction();
        transaction.setTransactionDate(transactionDate);
        transaction.setAmount(amount);
        transaction.setMerchant(merchant);
        transaction.setCategory(category);

        return transaction;
    }

    /**
     * Parses a CSV file into a list of transactions and associates them with a user.
     *
     * @param file The CSV file containing transaction data.
     * @param userId The user ID to associate with the transactions.
     * @return A list of parsed transactions.
     * @throws IOException If there is an issue reading the file.
     * @throws IllegalArgumentException If the file format is invalid.
     */
    public List<Transaction> parseFile(MultipartFile file, String userId) throws IOException, IllegalArgumentException {
        if (!file.getContentType().equals("text/csv")) {
            throw new IllegalArgumentException("Invalid file format. Not CSV");
        }
        List<Transaction> lines = new ArrayList<>();
        try (BufferedReader readFile = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = readFile.readLine()) != null) {
                Transaction currentTransaction = parseTransaction(line);
                currentTransaction.setUserId(userId);
                transactions.add(currentTransaction);
                lines.add(transactions.get(transactions.size() - 1));
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("File could not be read");
        }
        return lines;
    }

    /**
     * Persists the current transactions to the database and clears the in-memory transaction list.
     */
    public void persistTransaction() {
        try {
            List<Transaction> savedTransactions = transactionRepo.saveAll(transactions);
            transactions.clear();
        } catch (Exception e) {
            throw new IllegalArgumentException("Transactions could not be saved");
        }
    }

    /**
     * Deletes a single transaction by its ID.
     *
     * @param transactionId The ID of the transaction to be deleted.
     * @throws IllegalArgumentException If the transaction could not be deleted.
     */
    public void deleteSingle(String transactionId) {
        try {
            transactionRepo.deleteById(transactionId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Transaction could not be deleted");
        }
    }

    /**
     * Updates an existing transaction with new details.
     *
     * @param transactionId The ID of the transaction to be updated.
     * @param updatedTransaction The transaction object containing the updated details.
     * @return The updated transaction.
     * @throws IllegalArgumentException If the transaction could not be found or updated.
     */
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
        if (updatedTransaction.getCategory() != null) {
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }

        return transactionRepo.save(existingTransaction);
    }

    /**
     * Retrieves the most popular category for a specific merchant based on transaction history.
     *
     * @param merchant The merchant for which to find the most popular category.
     * @return The most popular category for the specified merchant.
     */
    public String getMostPopularCategoryForMerchant(String merchant) {
        merchant = merchant.trim();
        List<Transaction> merchantTransactions = transactionRepo.findByMerchant(merchant);

        if (merchantTransactions.isEmpty()) {
            System.out.println("No transactions found for merchant: " + merchant);
            return "General"; // Default category if no transactions found
        }

        Map<String, Integer> categoryCounts = new HashMap<>();

        for (Transaction transaction : merchantTransactions) {
            String category = transaction.getCategory();
            categoryCounts.put(category, categoryCounts.getOrDefault(category, 0) + 1);
        }

        String currentHighest = "";
        int highestCount = 0;
        for (String key : categoryCounts.keySet()) {
            if (categoryCounts.get(key) > highestCount) {
                currentHighest = key;
                highestCount = categoryCounts.get(key);
            }
        }

        return currentHighest;
    }

    /**
     * Filters transactions based on the provided criteria.
     *
     * @param userId The user ID for which to filter transactions.
     * @param merchant The merchant name to filter by (optional).
     * @param category The category to filter by (optional).
     * @param startDate The start date for filtering transactions (optional).
     * @param endDate The end date for filtering transactions (optional).
     * @return A list of filtered transactions based on the provided criteria.
     * @throws IllegalArgumentException If no transactions match the filter criteria.
     */
    public List<Transaction> filterTransactions(
            String userId,
            String merchant,
            String category,
            Date startDate,
            Date endDate
    ) {
        List<Transaction> filteredTransactions;

        if (merchant != null && startDate != null && endDate != null) {
            filteredTransactions = transactionRepo.findByUserIdAndMerchantAndTransactionDateBetweenOrderByTransactionDateDesc(
                    userId, merchant, startDate, endDate);
        } else if (category != null && startDate != null && endDate != null) {
            filteredTransactions = transactionRepo.findByUserIdAndCategoryAndTransactionDateBetweenOrderByTransactionDateDesc(
                    userId, category, startDate, endDate);
        } else if (merchant != null) {
            filteredTransactions = transactionRepo.findByUserIdAndMerchantOrderByTransactionDateDesc(userId, merchant);
        } else if (category != null) {
            filteredTransactions = transactionRepo.findByUserIdAndCategoryOrderByTransactionDateDesc(userId, category);
        } else if (startDate != null && endDate != null) {
            filteredTransactions = transactionRepo.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);
        } else {
            filteredTransactions = getTransactionsByUserId(userId);
        }

        if (filteredTransactions.isEmpty()) {
            throw new IllegalArgumentException("No transactions found for the given filters");
        }

        return filteredTransactions;
    }

}
