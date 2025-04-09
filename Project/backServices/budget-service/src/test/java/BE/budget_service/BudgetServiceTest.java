package BE.budget_service;

import BE.budget_service.Model.Budget;
import BE.budget_service.Repo.BudgetRepo;
import BE.budget_service.Service.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class BudgetServiceTest {

    private BudgetRepo budgetRepo;
    private BudgetService budgetService;

    @BeforeEach
    void setUp() {
        budgetRepo = Mockito.mock(BudgetRepo.class);
        budgetService = new BudgetService();
        budgetService.budgetRepository = budgetRepo; // field injection
    }

    @Test
    void testGetBudget() {
        Budget mockBudget = new Budget("user1", "Food", 100.0);
        when(budgetRepo.findByUserIdAndCategory("user1", "Food")).thenReturn(mockBudget);

        Budget result = budgetService.getBudget("user1", "Food");

        assertNotNull(result);
        assertEquals("user1", result.getUserId());
        assertEquals("Food", result.getCategory());
        assertEquals(100.0, result.getAmount());
        verify(budgetRepo, times(1)).findByUserIdAndCategory("user1", "Food");
    }

    @Test
    void testSetBudget_NewBudget() {
        when(budgetRepo.findByUserIdAndCategory("user1", "Bills")).thenReturn(null);

        Budget newBudget = new Budget("user1", "Bills", 200.0);
        when(budgetRepo.save(any(Budget.class))).thenReturn(newBudget);

        Budget result = budgetService.setBudget("user1", "Bills", 200.0);

        assertNotNull(result);
        assertEquals("Bills", result.getCategory());
        assertEquals(200.0, result.getAmount());
        verify(budgetRepo).save(any(Budget.class));
    }

    @Test
    void testSetBudget_UpdateExisting() {
        Budget existing = new Budget("user1", "Entertainment", 150.0);
        when(budgetRepo.findByUserIdAndCategory("user1", "Entertainment")).thenReturn(existing);

        existing.setAmount(300.0);
        when(budgetRepo.save(existing)).thenReturn(existing);

        Budget result = budgetService.setBudget("user1", "Entertainment", 300.0);

        assertEquals(300.0, result.getAmount());
        verify(budgetRepo).save(existing);
    }
}
