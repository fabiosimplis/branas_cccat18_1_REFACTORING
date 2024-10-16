
import GenerateInvoice from "../../application/usecases/GenerateInvoice";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";



export default class PaymentController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("processPayment")
  processPayment!: GenerateInvoice;

  constructor () {
    this.httpServer?.register("post","/processPayment", async (params: any, body: any) => {
      const input = body;
        const output = await this.processPayment?.execute(input);
        return output;
    });
    
    

  }

}