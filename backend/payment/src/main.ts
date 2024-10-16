import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ProcessPayment from "./application/usecases/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import { PaymentProcessorFactory } from "./infra/fallback/PaymentProcessor";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import QueueController from "./infra/controller/QueueController";
import { TransactionRepositoryORM } from "./infra/Repository/TransactionRepository";
import ORM from "./infra/orm/ORM";

async function main() {
  
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  Registry.getInstance().provide("httpServer", httpServer);
  Registry.getInstance().provide("queue", queue);
  Registry.getInstance().provide("databaseConnection", PgPromiseAdapter.getInstance().getConnection());
  Registry.getInstance().provide("paymentProcessor", PaymentProcessorFactory.create());
  Registry.getInstance().provide("orm", new ORM(PgPromiseAdapter.getInstance().getConnection()));
  Registry.getInstance().provide("transactionRepository", new TransactionRepositoryORM());
  Registry.getInstance().provide("processPayment", new ProcessPayment());
  Registry.getInstance().provide("accountController", new PaymentController());
  new QueueController();
  httpServer.listen(3002);
}

main();