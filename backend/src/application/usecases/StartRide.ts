import { inject } from "../../infra/DI/DI";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class StartRide {

  @inject("rideRepository")
  rideRepository?: RideRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    
    // Orquestrando recursos
    const ride = await this.rideRepository?.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.start();
    await this.rideRepository?.updateRide(ride);
  }
}

type Input = {
  rideId: string,
}

