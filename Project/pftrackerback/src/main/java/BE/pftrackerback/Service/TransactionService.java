package BE.pftrackerback.Service;

import BE.pftrackerback.Model.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {

    private List<Transaction> transactions = new ArrayList<>();

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getId() == null) {
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
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid transaction format");
        }

        String id = parts[0].trim();  // cuts off each part and places into respective form
        String dateStr = parts[1].trim();
        double amount = Double.parseDouble(parts[2].trim());


        Date transactionDate = parseDate(dateStr); // parse date to correct format

        // Create and return the Transaction object
        Transaction transaction = new Transaction();
        transaction.setId(id);
        transaction.setTransactionDate(transactionDate);
        transaction.setAmount(amount);

        return transaction;
    }

    public List<Transaction> parseFile(MultipartFile file) throws IOException, IllegalArgumentException{
        if (!file.getContentType().equals("text/csv")) {
            throw new IllegalArgumentException("Invalid file format. Not CSV");  //check filetype before processing
        }
        List<Transaction> lines = new ArrayList<>();
        try (BufferedReader readFile = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = readFile.readLine()) != null) {
                transactions.add(parseTransaction(line)); // adds each line as transaction to main list
                lines.add(transactions.getLast()); // adds last created transaction to its own list to send back to controller
            }
        }catch (IOException e){
            throw new IllegalArgumentException("File could not be read");
        }
        return lines;
    }
}
