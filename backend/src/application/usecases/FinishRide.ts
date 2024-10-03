import Position from "../../domain/vo/Position";
import { inject } from "../../infra/DI/DI";
import PositionRepository from "../../infra/Repository/PositionRepository";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class FinishRide{
  @inject("rideRepository")
  rideRepository!: RideRepository;
  @inject("positionRepository")
  positionRepository!: PositionRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    // Orquestrando recursos
    const ride = await this.rideRepository.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    const positions = await this.positionRepository?.getPositionsByRideId(input.rideId);
    ride.finish(positions);
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  rideId: string
}

