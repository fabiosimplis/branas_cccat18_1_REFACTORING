import GenerateInvoice from "../../application/usecases/GenerateInvoice";
import { inject } from "../di/DI";
import Queue from "../queue/Queue";

export default class QueueController {
  @inject("queue")
  queue!: Queue;
  @inject("generateInvoice")
  generateInvoice!: GenerateInvoice;

  constructor() {
    this.queue.consumer("rideCompleted.generateInvoice", async (input: any) => {
      await this.generateInvoice.execute(input);
      
    });
  }

}
