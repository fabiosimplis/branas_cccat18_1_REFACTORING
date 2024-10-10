// Use case driven development - começar pelo teste de integração

import AcceptRide from "../src/application/usecases/AcceptRide";
import GetRide from "../src/application/usecases/GetRide";
import RequestRide from "../src/application/usecases/RequestRide";
import { PgPromiseAdapter } from "../src/infra/database/DataBaseConnection";
import { Registry } from "../src/infra/DI/DI";
import AccountGateway from "../src/infra/gateway/AccountGateway";
import { PositionRepositoryDatebase } from "../src/infra/Repository/PositionRepository";
import { RideRepositoryDataBase } from "../src/infra/Repository/RideRepository";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let accountGateway: AccountGateway;

beforeEach(() => {
  accountGateway = new AccountGateway();
  Registry.getInstance().provide("accountGateway", accountGateway);
  Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
  Registry.getInstance().provide("rideRepository", new RideRepositoryDataBase());
  Registry.getInstance().provide("positionRepository", new PositionRepositoryDatebase());
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
  const outputSignupPassenger = await accountGateway.signup(inputPassenger);
  const inputDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "BKL1660",
    isDriver: true
  };
  const outputSignupDriver = await accountGateway.signup(inputDriver);
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
  const outputSignupPassenger = await accountGateway.signup(inputPassenger);
  const inputDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "BKL1660",
    isDriver: true
  };
  const outputSignupDriver = await accountGateway.signup(inputDriver);
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
