import amqp from "amqplib"

async function main () {
  const connection = await amqp.connect("amqp://localhost");
  /* 
  * Criando seção dentro do tcp para reuso
  * não havendo necessidade de ficar abrindo conexão
  */
  const channel = await connection.createChannel();
  channel.consume("rideCompleted.processPayment", async function (message: any) {
    const input = JSON.parse(message.content.toString());
    console.log(input);
    // channel.ack(message);
  });
  channel.consume("rideCompleted.generateInvoice", async function (message: any) {
    const input = JSON.parse(message.content.toString());
    console.log(input);
    // channel.ack(message);
  });
  channel.consume("rideCompleted.sendReceipt", async function (message: any) {
    const input = JSON.parse(message.content.toString());
    console.log(input);
    // channel.ack(message);
  });
}

main();