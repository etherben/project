package BE.pftrackerback.Service;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {

    private List<Transaction> transactions = new ArrayList<>();
    private TransactionRepo transactionRepo;

    @Autowired
    public TransactionService(TransactionRepo transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public List<Transaction> getTransactions(){return transactions;}
    public List<Transaction> getTransactionsByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User id is null or empty");
        }
        // Try to retrieve transactions from the repo
        try{
           return transactionRepo.findByUserId(userId);
        } catch (Exception e) {
            throw new IllegalArgumentException("No transactions found");
        }
    }

    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getUserId() == null) {
            throw new IllegalArgumentException("Transaction ID cannot be null");
        } else if (transaction.getTransactionDate() == null){
            throw new IllegalArgumentException("Transaction date cannot be null");
        } else if (transaction.getAmount() <= 0){
            throw new IllegalArgumentException("Transaction amount must be greater than 0");
        }else{
            transactions.add(transaction);
            return transaction;
        }
    }

    public Date parseDate(String dateStr) throws IllegalArgumentException{
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);  // Disallow non-existent date parsing such as 32/13/2024
        try{
            return dateFormat.parse(dateStr);
        }catch(Exception e){
            throw new IllegalArgumentException("Date cannot be parsed");
        }

    }

    public Transaction parseTransaction(String line) throws IllegalArgumentException{
        String[] parts = line.split(",");  // should spit into 3 parts, splits at commas
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid transaction format");
        }


        String dateStr = parts[0].trim();
        double amount = Double.parseDouble(parts[1].trim());


        Date transactionDate = parseDate(dateStr); // parse date to correct format

        // Create and return the Transaction object
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(transactionDate);
        transaction.setAmount(amount);

        return transaction;
    }

    public List<Transaction> parseFile(MultipartFile file, String userId) throws IOException, IllegalArgumentException{
        if (!file.getContentType().equals("text/csv")) {
            throw new IllegalArgumentException("Invalid file format. Not CSV");  //check filetype before processing
        }
        List<Transaction> lines = new ArrayList<>();
        try (BufferedReader readFile = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = readFile.readLine()) != null) {
                Transaction currentTransaction  = parseTransaction(line);
                currentTransaction.setUserId(userId); // sets user id for each transaction that came with file
                transactions.add(currentTransaction);
                lines.add(transactions.getLast()); // adds last created transaction to its own list to send back to controller
            }
        }catch (IOException e){
            throw new IllegalArgumentException("File could not be read");
        }
        return lines;
    }

    public List<Transaction> persistTransaction(){
        //saves the list of transactions to hte transaction repo
        try {
           return transactionRepo.saveAll(transactions);
        } catch(Exception e) {
            throw new IllegalArgumentException("Transaction could not be saved");
        }
    }
}
