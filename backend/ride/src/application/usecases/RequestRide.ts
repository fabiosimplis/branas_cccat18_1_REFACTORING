import Ride from "../../domain/entity/Ride";
import { inject } from "../../infra/DI/DI";
import AccountGateway from "../../infra/gateway/AccountGateway";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class RequestRide {
  @inject("accountGateway")
  accountGateway?: AccountGateway;
  @inject("rideRepository")
  rideRepository?: RideRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<Output>{

    // Orquestrando recursos
    const account = await this.accountGateway?.getAccountById(input.passengerId);
    if(!account) throw new Error("Account does not exist");
    if(!account.isPassenger) throw new Error("Account must be from a passenger");
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
    await this.rideRepository?.saveRide(ride);
    return {
      rideId: ride.getRideId()
    }
  }
}

type Input = {
  passengerId:string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number
}

type Output = {
  rideId: string
}