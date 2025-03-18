package BE.budget_service.Repo;

import BE.budget_service.Model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepo extends MongoRepository<Budget, String> {
    Budget findByUserIdAndCategory(String userId, String category); // initally plan to return budgets based on userid
}