package BE.transaction_service.Repo;

import BE.transaction_service.Model.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * Repository interface for performing operations on the Transaction entity.
 * <p>
 * This interface extends {@link MongoRepository}
 *
 */
@Repository
public interface TransactionRepo extends MongoRepository<Transaction, String> {

     /**
      * Finds all transactions associated with a specific user ID, sorted based on the given criteria.
      *
      * @param userId the userid whose transactions are to be retrieved.
      * @param sort   the sorting criteria to order the transactions(will currently only by date in desc order)
      * @return a list of transactions for the specified user, sorted according to the provided criteria.
      */
     List<Transaction> findByUserId(String userId, Sort sort);
     List<Transaction> findByMerchant(String merchant);
     List<Transaction> findByUserIdAndCategoryOrderByDateDesc(String userId, String category);  // Named like this as mongo repo will auto infer the query based on method name
     List<Transaction> findByUserIdAndMerchantOrderByDateDesc(String userId, String merchant);  // pretty dope
     List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, Date startDate, Date endDate);
     List<Transaction> findByUserIdAndMerchantAndDateBetweenOrderByDateDesc(String userId, String merchant, Date startDate, Date endDate);
     List<Transaction> findByUserIdAndCategoryAndDateBetweenOrderByDateDesc(String userId, String category, Date startDate, Date endDate);


     

}