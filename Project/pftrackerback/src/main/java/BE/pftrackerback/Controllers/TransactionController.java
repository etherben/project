package BE.pftrackerback.Controllers;

import BE.pftrackerback.Model.Transaction;
import BE.pftrackerback.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<String> addTransaction(@RequestBody Transaction transaction) {
        try {
            transactionService.addTransaction(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body("Created");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add transaction");
        }

    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getTransactions();
        return ResponseEntity.ok(transactions);
    }
}