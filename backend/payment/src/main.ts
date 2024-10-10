import ProcessPayment from "./application/usecases/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { Registry } from "./infra/di/DI";
import CieloGateway from "./infra/gateway/CieloGateway";
import PJBankGateway from "./infra/gateway/PJBankGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
//Registry.getInstance().provide("paymentGateway", new CieloGateway());
Registry.getInstance().provide("paymentGateway", new PJBankGateway());
Registry.getInstance().provide("processPayment", new ProcessPayment());
Registry.getInstance().provide("accountController", new PaymentController());
httpServer.listen(3002);
