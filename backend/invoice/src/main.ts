import GenerateInvoice from "./application/usecases/GenerateInvoice";
import QueueController from "./infra/controller/QueueController";
import { Registry } from "./infra/di/DI";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();
  Registry.getInstance().provide("queue", queue);
  Registry.getInstance().provide("generateInvoice", new GenerateInvoice());
  new QueueController();
}

main();