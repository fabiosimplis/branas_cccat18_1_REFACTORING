import GetAccount from "./application/usecases/GetAccount";
import Signup from "./application/usecases/Signup";
import AccountController from "./infra/controller/AccountController";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { Registry } from "./infra/DI/DI";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { AccountRepositoryDatabase } from "./infra/Repository/AccountRepository";


const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Registry.getInstance().provide("signup", new Signup());
Registry.getInstance().provide("getAccount", new GetAccount());
Registry.getInstance().provide("accountController", new AccountController());

httpServer.listen(3001);
