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

@Service
public class TransactionService {

    private List<Transaction> transactions = new ArrayList<>();
    private TransactionRepo transactionRepo;

    @Autowired
    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

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

    public Date parseDate(String dateStr) throws IllegalArgumentException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        try {
            return dateFormat.parse(dateStr);
        } catch (Exception e) {
            throw new IllegalArgumentException("Date cannot be parsed");
        }
    }

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

    public void persistTransaction() {
        try {
            List<Transaction> savedTransactions = transactionRepo.saveAll(transactions);
            transactions.clear();
        } catch (Exception e) {
            throw new IllegalArgumentException("Transactions could not be saved");
        }
    }

    public void deleteSingle(String transactionId) {
        try {
            transactionRepo.deleteById(transactionId);
        } catch (Exception e) {
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
        if (updatedTransaction.getCategory() != null) {
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }

        return transactionRepo.save(existingTransaction);
    }

    public String getMostPopularCategoryForMerchant(String merchant) {
        // Get transactions for this merchant
        merchant = merchant.trim();
        List<Transaction> merchantTransactions = transactionRepo.findByMerchant(merchant);

        if (merchantTransactions.isEmpty()) {
            System.out.println("No transactions found for merchant: " + merchant);
           return "General"; // Default category if no transactions found
        }

        System.out.println("Found " + merchantTransactions.size() + " transactions for merchant: " + merchant);

        // Create a map to count category occurrences
        Map<String, Integer> categoryCounts = new HashMap<>();

        // Count occurrences of each category
        for (Transaction transaction : merchantTransactions) {
            String category = transaction.getCategory();
            System.out.println("Merchant: " + merchant + ", Category: " + category); // Log merchant and category
            categoryCounts.put(category, categoryCounts.getOrDefault(category, 0) + 1);
        }

        // Log category counts
        System.out.println("Category counts: " + categoryCounts);

        String currentHighest = "";
        int highestCount = 0;
        for (String key : categoryCounts.keySet()) {
            if (categoryCounts.get(key) > highestCount) {
                currentHighest = key;
                highestCount = categoryCounts.get(key);
            }
        }

        // Return the most popular category, or "General" if none found
        System.out.println("Most popular category for merchant " + merchant + ": " + currentHighest);
        return currentHighest;
    }

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
            filteredTransactions = getTransactionsByUserId(userId); // will return a sorted list of transactions by userId
        }
        // If the filtered list is empty throw an exception
        if (filteredTransactions.isEmpty()) {
            throw new IllegalArgumentException("No transactions found for the given filters");
        }

        return filteredTransactions;
    }

}
