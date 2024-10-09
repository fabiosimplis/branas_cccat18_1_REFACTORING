import { Registry } from "./infra/DI/DI";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/Repository/AccountRepository";
import Signup from "./application/usecases/Signup";
import GetAccount from "./application/usecases/GetAccount";
import Mediator from "./infra/mediator/Mediator";
import ProcessPayment from "./application/usecases/ProcessPayment";
import GenerateInvoice from "./application/usecases/GenerateInvoice";


const httpServer = new ExpressAdapter();
const processPayment = new ProcessPayment();
const generateInvoice = new GenerateInvoice();
// Mediator
const mediator  = new Mediator();
mediator.register("rideCompleted", async function (event: any) {
  await processPayment.execute(event);
  await generateInvoice.execute(event);
});
Registry.getInstance().provide("mediator", mediator);
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Registry.getInstance().provide("signup", new Signup());
Registry.getInstance().provide("getAccount", new GetAccount());
Registry.getInstance().provide("accountController", new AccountController());

httpServer.listen(3000);
