// Use case driven development - começar pelo teste de integração

import AcceptRide from "../src/application/usecases/AcceptRide";
import GetRide from "../src/application/usecases/GetRide";
import RequestRide from "../src/application/usecases/RequestRide";
import StartRide from "../src/application/usecases/StartRide";
import UpdatePosition from "../src/application/usecases/UpdatePosition";
import { PgPromiseAdapter } from "../src/infra/database/DataBaseConnection";
import { Registry } from "../src/infra/DI/DI";
import AccountGateway from "../src/infra/gateway/AccountGateway";
import { PositionRepositoryDatebase } from "../src/infra/Repository/PositionRepository";
import { RideRepositoryDataBase } from "../src/infra/Repository/RideRepository";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
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
  startRide = new StartRide();
  updatePosition = new UpdatePosition();
});

test ("Deve atualizar a posição de uma corrida", async function () {
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
  const inputStartRide = {
    rideId: outputRequestRide.rideId
  }
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date()
  }
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date()
  }
  await updatePosition.execute(inputUpdatePosition2);
  const inputUpdatePosition3 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date()
  }
  await updatePosition.execute(inputUpdatePosition3);
  const inputUpdatePosition4 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date()
  }
  await updatePosition.execute(inputUpdatePosition4);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.distance).toBe(30);
  //console.log(outputGetRide.positions)
});


afterEach(async () => {
  const connection =  Registry.getInstance().inject("databaseConnection");
  await connection.close();
});
