package BE.budget_service.Service;

import BE.budget_service.Model.Budget;
import BE.budget_service.Repo.BudgetRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class to handle operations related to budgets for users.
 * Provides functionality to get and set the budget for a specific user and category.
 */
@Service
public class BudgetService {

    @Autowired
    public BudgetRepo budgetRepository;

    /**
     * Retrieves the budget for a specific user and category.
     *
     * @param userId  The ID of the user whose budget is to be retrieved.
     * @param category The category for which the budget is to be retrieved.
     * @return The budget for the specified user and category.
     */
    public Budget getBudget(String userId, String category) {
        System.out.println(category);
        Budget budget = budgetRepository.findByUserIdAndCategory(userId, category);
        System.out.println(budget);
        return budget;
    }

    /**
     * Sets or updates the budget for category.
     * If a budget already exists, it updates the amount. If no budget exists, it creates a new one.
     *
     * @param userId  The ID of the user for whom the budget is to be set or updated.
     * @param category The category for which the budget is to be set or updated.
     * @param amount The amount to be set for the budget.
     * @return The saved budget object after being set or updated.
     */
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
