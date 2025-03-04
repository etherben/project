package BE.bankMapping_service.Model;

import java.util.List;

public class WrapperClass {
    private List<BankMappingModel> bankMappings;

    // Getter and Setter
    public List<BankMappingModel> getBankMappings() {
        return bankMappings;
    }

    public void setBankMappings(List<BankMappingModel> bankMappings) {
        this.bankMappings = bankMappings;
    }
}
