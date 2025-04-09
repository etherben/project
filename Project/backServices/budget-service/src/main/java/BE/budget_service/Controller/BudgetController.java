package BE.budget_service.Controller;

import BE.budget_service.Model.Budget;
import BE.budget_service.Service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller class to handle HTTP requests related to budgets for users.
 * Provides endpoints to get and set budgets for a specific user and category.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    /**
     * Retrieves the budget for a specific user and category.
     *
     * @param userId  The ID of the user whose budget is to be retrieved.
     * @param category The category for which the budget is to be retrieved.
     * @return A ResponseEntity containing the budget if found, or a 404 Not Found status if the budget is not found.
     */
    @GetMapping("/{userId}/{category}")
    public ResponseEntity<Budget> getBudget(@PathVariable String userId, @PathVariable String category) {
        Budget budget = budgetService.getBudget(userId, category);
        if (budget == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(budget);
    }

    /**
     * Calls service to update budget to new amount
     *
     *
     *
     * @param userId The ID of the user for whom the budget is to be set or updated.
     * @param budget The budget object containing the category and the amount to be set.
     * @return A ResponseEntity containing the updated budget.
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Budget> setBudget(@PathVariable String userId,
                                            @RequestBody Budget budget) {
        Budget updatedBudget = budgetService.setBudget(userId, budget.getCategory(), budget.getAmount());
        return ResponseEntity.ok(updatedBudget);
    }
}
