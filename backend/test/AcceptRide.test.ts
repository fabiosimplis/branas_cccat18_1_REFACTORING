// Use case driven development - começar pelo teste de integração

import AcceptRide from "../src/application/usecases/AcceptRide";
import GetAccount from "../src/application/usecases/GetAccount";
import GetRide from "../src/application/usecases/GetRide";
import RequestRide from "../src/application/usecases/RequestRide";
import Signup from "../src/application/usecases/Signup";
import { PgPromiseAdapter } from "../src/infra/database/DataBaseConnection";
import { Registry } from "../src/infra/DI/DI";
import { AccountRepositoryDatabase } from "../src/infra/Repository/AccountRepository";
import { RideRepositoryDataBase } from "../src/infra/Repository/RideRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
  Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
  Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
  Registry.getInstance().provide("rideRepository", new RideRepositoryDataBase());
  signup = new Signup();
  getAccount = new GetAccount();
  requestRide = new RequestRide();
  getRide = new GetRide();
  acceptRide = new AcceptRide();
});

test ("Deve aceitar uma corrida", async function () {
  const inputPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const outputSignupPassenger = await signup.execute(inputPassenger);
  const inputDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "BKL1660",
    isDriver: true
  };
  const outputSignupDriver = await signup.execute(inputDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("accepted");
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test ("Não deve aceitar uma corrida que já foi aceita", async function () {
  const inputPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const outputSignupPassenger = await signup.execute(inputPassenger);
  const inputDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "BKL1660",
    isDriver: true
  };
  const outputSignupDriver = await signup.execute(inputDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  }
  await acceptRide.execute(inputAcceptRide);
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Invalid status"));
});


afterEach(async () => {
  const connection =  Registry.getInstance().inject("databaseConnection");
  await connection.close();
});
