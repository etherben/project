package BE.pftrackerback.Repo;

import BE.pftrackerback.Model.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepo extends MongoRepository<Transaction, String> {
     List<Transaction> findByUserId(String userId,Sort sort);

}
