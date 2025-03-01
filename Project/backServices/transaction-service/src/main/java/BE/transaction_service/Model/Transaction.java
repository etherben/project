package BE.transaction_service.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Represents a financial transaction linked to a user in the system.
 * <p>
 * This class is mapped to the "transactions" collection in MongoDB.
 * Each transaction has user ID, transaction date, merchant, amount, and category.
 */

@Document(collection = "transactions")
public class Transaction {

    /**
     * The userid for the transaction.
     */
    @Id
    private String id;

    /**
     * The userid of the user linked with the transaction.
     */
    private String userId;

    /**
     * The date of the transaction.
     * <p>
     * The format must me dd/mm/yyyy
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date TransactionDate;

    /**
     * The amount of the transaction.
     */
    private double amount;

    /**
     * The merchant or vendor of the transaction.
     */
    private String merchant;

    /**
     * The category of the transaction.
     */
    private String category;

    /**
     * Retrieves the userid of the user linked with the transaction.
     *
     * @return the user ID.
     */
    public String getUserId() {
        return userId;
    }

    /**
     * Sets the userid of the user linked with the transaction.
     *
     * @param userId the user ID.
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * Retrieves the name of the merchant linked with the transaction.
     *
     * @return the merchant's name.
     */
    public String getMerchant() {
        return merchant;
    }

    /**
     * Sets the name of the merchant linked with the transaction.
     *
     * @param merchant the merchant's name.
     */
    public void setMerchant(String merchant) {
        this.merchant = merchant;
    }

    /**
     * Retrieves the monetary amount of the transaction.
     *
     * @return the transaction amount.
     */
    public double getAmount() {
        return amount;
    }

    /**
     * Sets the monetary amount of the transaction.
     *
     * @param amount the transaction amount.
     */
    public void setAmount(double amount) {
        this.amount = amount;
    }

    /**
     * Retrieves the date of the transaction.
     *
     * @return the transaction date.
     */
    public Date getTransactionDate() {
        return TransactionDate;
    }

    /**
     * Sets the date of the transaction.
     *
     * @param transactionDate the transaction date.
     */
    public void setTransactionDate(Date transactionDate) {
        this.TransactionDate = transactionDate;
    }

    /**
     * Retrieves the id of the transaction.
     *
     * @return the transaction ID.
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the id of the transaction.
     *
     * @param id the transaction ID.
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Retrieves the category of the transaction.
     *
     * @return the transaction category.
     */
    public String getCategory() {
        return category;
    }

    /**
     * Sets the category of the transaction.
     *
     * @param category the transaction category.
     */
    public void setCategory(String category) {
        this.category = category;
    }
}