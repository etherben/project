package BE.pftrackerback.Model;


import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String userId;

    @JsonFormat(pattern = "dd/MM/yyyy") //convert the json string into date format
    private Date TransactionDate;
    private double amount;
   // private String merchant;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    /*public String getMerchant() {
        return merchant;
    }

    public void setMerchant(String merchant) {
        this.merchant = merchant;
    }
*/
    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getTransactionDate() {
        return TransactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        TransactionDate = transactionDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
