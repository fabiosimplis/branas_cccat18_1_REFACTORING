import Transaction from "../../domain/Transaction";
import { inject } from "../../infra/di/DI";
import PaymentProcessor from "../../infra/fallback/PaymentProcessor";
import TransactionRepository from "../../infra/Repository/TransactionRepository";

export default class ProcessPayment {

  @inject("paymentProcessor")
  paymentProcessor!: PaymentProcessor;
  @inject("transactionRepository")
  transactionRepository!: TransactionRepository;

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
    const transaction = Transaction.create(input.rideId, input.amount);
    try {
      const outputCreateTransaction = await this.paymentProcessor.processPayment(inputTransaction);
      if (outputCreateTransaction.status === "approved") {
        transaction.pay();
        await this.transactionRepository.saveTransaction(transaction);
        console.log("pago com sucesso");
        console.log(outputCreateTransaction);
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