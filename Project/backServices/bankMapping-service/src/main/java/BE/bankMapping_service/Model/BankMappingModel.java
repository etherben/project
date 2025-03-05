package BE.bankMapping_service.Model;

import java.util.List;

public class BankMappingModel {
    private String bankName;
    private List<String> wantedColumns;
    private List<String> nonWantedColumns;

    public BankMappingModel(String bankName, List<String> wantedColumns, List<String> nonWantedColumns) {
        this.bankName = bankName;
        this.wantedColumns = wantedColumns;
        this.nonWantedColumns = nonWantedColumns;
    }

    // Getter and Setter for bankName
    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    // Getter and Setter for wantedColumns
    public List<String> getWantedColumns() {
        return wantedColumns;
    }

    public void setWantedColumns(List<String> wantedColumns) {
        this.wantedColumns = wantedColumns;
    }

    // Getter and Setter for nonWantedColumns
    public List<String> getNonWantedColumns() {
        return nonWantedColumns;
    }

    public void setNonWantedColumns(List<String> nonWantedColumns) {
        this.nonWantedColumns = nonWantedColumns;
    }
}
