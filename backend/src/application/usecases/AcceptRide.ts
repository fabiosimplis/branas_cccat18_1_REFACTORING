import { inject } from "../../infra/DI/DI";
import AccountRepository from "../../infra/Repository/AccountRepository";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class RequestRide {
  @inject("accountRepository")
  accountRepository?: AccountRepository;

  @inject("rideRepository")
  rideRepository?: RideRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    
    // Orquestrando recursos
    const account = await this.accountRepository?.getAccountById(input.driverId)
    if(!account) throw new Error("Account does not exist");
    if(!account.isDriver) throw new Error("Account must be from a driver");
    const ride = await this.rideRepository?.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.setStatus("accepted");
    ride.setDriverId(input.driverId);
    await this.rideRepository?.updateRide(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string
}

