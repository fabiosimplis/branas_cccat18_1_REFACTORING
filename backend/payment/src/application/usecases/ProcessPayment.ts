import { inject } from "../../infra/di/DI";
import PaymentProcessor from "../../infra/fallback/PaymentProcessor";

export default class ProcessPayment {

  @inject("paymentProcessor")
  paymentProcessor!: PaymentProcessor;

  async execute (input: Input) : Promise<void> {
    console.log("processPayment", input);
    // chamar o Pagar.me, ou o PagSeguro ou o ASAAS...
    const inputTransaction = {
      cardHolder: "Ilpa Elaite Poresmo",
      // creditCardNumber: "4012001037141112",
      creditCardNumber: "4763329888153113",
      expDate: "05/2027",
      cvv: "515",
      amount: input.amount
    };
    try {
      const outputCreateTransaction = await this.paymentProcessor.processPayment(inputTransaction);
      if (outputCreateTransaction.status === "approved") {
        console.log("pago com sucesso");
      }
    } catch (e: any) {
      console.log("ERROR:", e.message);
    }

  }
}

type Input = {
  rideId: string,
  amount: number
}