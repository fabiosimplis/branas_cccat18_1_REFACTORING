import amqp from "amqplib"

async function main () {
  const connection = await amqp.connect("amqp://localhost");
  /* 
  * Criando seção dentro do tcp para reuso
  * não havendo necessidade de ficar abrindo conexão
  */
  const channel = await connection.createChannel();
  // Criando a Exchange, durable pois a mensagem é mantida enquanto não for consumida.
  await channel.assertExchange("rideCompleted", "direct", { durable: true });
  // Criando filas
  await channel.assertQueue("rideCompleted.processPayment", { durable: true });
  await channel.assertQueue("rideCompleted.generateInvoice", { durable: true });
  await channel.assertQueue("rideCompleted.sendReceipt", { durable: true });
  // Associando as filas
  await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
  await channel.bindQueue("rideCompleted.generateInvoice", "rideCompleted", "");
  await channel.bindQueue("rideCompleted.sendReceipt", "rideCompleted", "");
  const input = {
    rideId: "1",
    amount: 100
  }
  channel.publish("rideCompleted", "", Buffer.from(JSON.stringify(input)));
}

main();