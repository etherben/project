package BE.budget_service.Model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    private String userId;
    private double totalBudget;
    private double foodBudget;
    private double entertainmentBudget;
    private double shoppingBudget;
    private double billsBudget;
    private double vehicleBudget;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public double getFoodBudget() {
        return foodBudget;
    }

    public void setFoodBudget(double foodBudget) {
        this.foodBudget = foodBudget;
    }

    public double getEntertainmentBudget() {
        return entertainmentBudget;
    }

    public void setEntertainmentBudget(double entertainmentBudget) {
        this.entertainmentBudget = entertainmentBudget;
    }

    public double getShoppingBudget() {
        return shoppingBudget;
    }

    public void setShoppingBudget(double shoppingBudget) {
        this.shoppingBudget = shoppingBudget;
    }

    public double getBillsBudget() {
        return billsBudget;
    }

    public void setBillsBudget(double billsBudget) {
        this.billsBudget = billsBudget;
    }

    public double getVehicleBudget() {
        return vehicleBudget;
    }

    public void setVehicleBudget(double vehicleBudget) {
        this.vehicleBudget = vehicleBudget;
    }
}
