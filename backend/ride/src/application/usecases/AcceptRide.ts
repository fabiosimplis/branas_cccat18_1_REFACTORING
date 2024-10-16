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
  async execute(input: Input): Promise<void>{
    
    // Orquestrando recursos
    const account = await this.accountGateway?.getAccountById(input.driverId)
    if(!account) throw new Error("Account does not exist");
    if(!account.isDriver) throw new Error("Account must be from a driver");
    const ride = await this.rideRepository?.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.accept(input.driverId);
    await this.rideRepository?.updateRide(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string
}

