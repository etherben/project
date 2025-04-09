package BE.budget_service;

import BE.budget_service.Controller.BudgetController;
import BE.budget_service.Model.Budget;
import BE.budget_service.Service.BudgetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BudgetController.class)
class BudgetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BudgetService budgetService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getBudget_ReturnsBudget_WhenFound() throws Exception {
        Budget budget = new Budget("user123", "Food", 100.0);
        when(budgetService.getBudget("user123", "Food")).thenReturn(budget);

        mockMvc.perform(get("/budget/user123/Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user123"))
                .andExpect(jsonPath("$.category").value("Food"))
                .andExpect(jsonPath("$.amount").value(100.0));
    }

    @Test
    void getBudget_ReturnsNotFound_WhenNotExist() throws Exception {
        when(budgetService.getBudget("user123", "Bills")).thenReturn(null);

        mockMvc.perform(get("/budget/user123/Bills"))
                .andExpect(status().isNotFound());
    }

    @Test
    void setBudget_CreatesOrUpdatesBudget() throws Exception {
        Budget input = new Budget("user123", "Travel", 250.0);
        when(budgetService.setBudget("user123", "Travel", 250.0)).thenReturn(input);

        mockMvc.perform(post("/budget/user123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user123"))
                .andExpect(jsonPath("$.category").value("Travel"))
                .andExpect(jsonPath("$.amount").value(250.0));
    }
}
