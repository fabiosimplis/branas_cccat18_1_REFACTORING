import Position from "../../domain/entity/Position";
import { inject } from "../../infra/DI/DI";
import PositionRepository from "../../infra/Repository/PositionRepository";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class UpdatePosition {

  @inject("rideRepository")
  rideRepository?: RideRepository;
  @inject("positionRepository")
  positionRepository?: PositionRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    // Orquestrando recursos
    const ride = await this.rideRepository?.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    // ride.updatePosition(input.lat, input.long);
    const position = Position.create(input.rideId, input.lat, input.long, input.date);
    await this.positionRepository?.savePosition(position);
  }
}

type Input = {
  rideId: string,
  lat: number,
  long: number,
  date: Date
}

