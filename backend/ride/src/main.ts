import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { Registry } from "./infra/DI/DI";
import { ExpressAdapter } from "./infra/http/HttpServer";



const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());

httpServer.listen(3000);
