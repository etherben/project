package BE.bankMapping_service.Model;


import java.util.List;
import java.util.Map;

public class BankMappingModel {

    private String bankName;
    private Map<String, String> columnMappings;
    private List<String> ignoredColumns;

    public BankMappingModel(String bankName, Map<String, String> columnMappings, List<String> ignoredColumns) {
        this.bankName = bankName;
        this.columnMappings = columnMappings;
        this.ignoredColumns = ignoredColumns;
    }


    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Map<String, String> getColumnMappings() {
        return columnMappings;
    }

    public void setColumnMappings(Map<String, String> columnMappings) {
        this.columnMappings = columnMappings;
    }

    public List<String> getIgnoredColumns() {
        return ignoredColumns;
    }

    public void setIgnoredColumns(List<String> ignoredColumns) {
        this.ignoredColumns = ignoredColumns;
    }
}