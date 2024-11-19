package BE.pftrackerback.ServiceTest;

import BE.pftrackerback.Service.TransactionService;
import org.junit.jupiter.api.BeforeEach;

public class TransactionServiceTest {

    private TransactionService transactionService;

    @BeforeEach
    public void setUp() {
        transactionService = new TransactionService();
    }


}
