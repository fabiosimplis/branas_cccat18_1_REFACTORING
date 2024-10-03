import RideCompletedEvent from "../../domain/event/RideCompletedEvent";
import Position from "../../domain/vo/Position";
import { inject } from "../../infra/DI/DI";
import Mediator from "../../infra/mediator/Mediator";
import PositionRepository from "../../infra/Repository/PositionRepository";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class FinishRide{
  @inject("rideRepository")
  rideRepository!: RideRepository;
  @inject("positionRepository")
  positionRepository!: PositionRepository;
  @inject("mediator")
  mediator!: Mediator;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    // Orquestrando recursos
    const ride = await this.rideRepository.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.register(RideCompletedEvent.eventName, async (event: RideCompletedEvent) => {
      await this.rideRepository.updateRide(ride);
      await this.mediator.notify("rideCompleted", event);
    });
    const positions = await this.positionRepository?.getPositionsByRideId(input.rideId);
    ride.finish(positions);
  }
}

type Input = {
  rideId: string
}

