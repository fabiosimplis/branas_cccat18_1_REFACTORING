import axios from "axios";

axios.defaults.validateStatus = function() {
  return true;
}

export default class PaymentGateway {
  async processPayment (input: any): Promise<void> {
    const response = await axios.post("http://localhost:3002/processPayment", input);
    return response.data;
  }
}