package BE.pftrackerback.Repo;

import BE.pftrackerback.Model.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

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

}