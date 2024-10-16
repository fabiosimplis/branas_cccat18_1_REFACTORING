// Use case driven development - começar pelo teste de integração

import GetRide from "../src/application/usecases/GetRide";
import RequestRide from "../src/application/usecases/RequestRide";
import { PgPromiseAdapter } from "../src/infra/database/DataBaseConnection";
import { Registry } from "../src/infra/DI/DI";
import AccountGateway from "../src/infra/gateway/AccountGateway";
import { PositionRepositoryDatebase } from "../src/infra/Repository/PositionRepository";
import { RideRepositoryDataBase } from "../src/infra/Repository/RideRepository";

let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
  accountGateway = new AccountGateway();
  Registry.getInstance().provide("accountGateway", accountGateway);
  Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
  Registry.getInstance().provide("rideRepository", new RideRepositoryDataBase());
  Registry.getInstance().provide("positionRepository", new PositionRepositoryDatebase());
  requestRide = new RequestRide();
  getRide = new GetRide();
});

test ("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide.status).toBe("requested");
});

test ("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "BKL1660",
    isDriver: true
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
  };
  expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));
});

afterEach(async () => {
  const connection =  Registry.getInstance().inject("databaseConnection");
  await connection.close();
});
