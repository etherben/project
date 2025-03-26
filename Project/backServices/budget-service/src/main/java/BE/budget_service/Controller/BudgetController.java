package BE.budget_service.Controller;
import BE.budget_service.Model.Budget;
import BE.budget_service.Service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // Get the budget for a specific user and category
    @GetMapping("/{userId}/{category}")
    public ResponseEntity<Budget> getBudget(@PathVariable String userId, @PathVariable String category) {
        Budget budget = budgetService.getBudget(userId, category);
        if (budget == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(budget);
    }

    // Set or update the budget for a specific user and category
    @PostMapping("/{userId}")
    public ResponseEntity<Budget> setBudget(@PathVariable String userId,
                                            @RequestBody Budget budget) {
        Budget updatedBudget = budgetService.setBudget(userId, budget.getCategory(), budget.getAmount());
        return ResponseEntity.ok(updatedBudget);
    }
}