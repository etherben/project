package BE.budget_service.Service;

import BE.budget_service.Model.Budget;
import BE.budget_service.Repo.BudgetRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    @Autowired
    public BudgetRepo budgetRepository;

    // Get the budget for a specific user and category
    public Budget getBudget(String userId, String category) {
        System.out.println(category);
        Budget budget = budgetRepository.findByUserIdAndCategory(userId, category);
        System.out.println(budget);
        return budget;
    }

    // Set or update the budget for a specific user and category
    public Budget setBudget(String userId, String category, double amount) {

        Budget budget = budgetRepository.findByUserIdAndCategory(userId, category);

        if (budget == null) {
            // If no existing budget, create a new one
            budget = new Budget(userId, category, amount);
        } else {
            // Update the existing budget
            budget.setAmount(amount);
        }
        return budgetRepository.save(budget);
    }
}
