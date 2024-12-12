package BE.pftrackerback.Repo;

import BE.pftrackerback.Model.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public interface TransactionRepo extends MongoRepository<Transaction, String> {
     List<Transaction> findByUserId(String userId,Sort sort);

}
