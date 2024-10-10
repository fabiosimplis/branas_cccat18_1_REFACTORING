import ProcessPayment from "./application/usecases/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { Registry } from "./infra/DI/DI";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
const processPayment = new ProcessPayment();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("processPayment", processPayment);
Registry.getInstance().provide("accountController", new PaymentController());
httpServer.listen(3002);
