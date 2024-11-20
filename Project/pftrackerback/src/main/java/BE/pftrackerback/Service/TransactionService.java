package BE.pftrackerback.Service;

import BE.pftrackerback.Model.Transaction;
import org.springframework.stereotype.Service;

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

    public Date parseDate(String dateStr) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);  // Disallow non-existent date parsing such as 32/13/2024
        try{
            return dateFormat.parse(dateStr);
        }catch(Exception e){
            throw new IllegalArgumentException("Date cannot be parsed");
        }

    }
}
