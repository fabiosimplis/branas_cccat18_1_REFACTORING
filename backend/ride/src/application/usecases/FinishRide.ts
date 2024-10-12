import RideCompletedEvent from "../../domain/event/RideCompletedEvent";
import { inject } from "../../infra/DI/DI";
import Queue from "../../infra/queue/Queue";
import PositionRepository from "../../infra/Repository/PositionRepository";
import RideRepository from "../../infra/Repository/RideRepository";

//Use Case
export default class FinishRide {
  @inject("rideRepository")
  rideRepository!: RideRepository;
  @inject("positionRepository")
  positionRepository!: PositionRepository;
  @inject("queue")
  queue!: Queue;

  // Dependency Inversion Principle - Dependency Injection
  async execute(input: Input): Promise<void>{
    // Orquestrando recursos
    const ride = await this.rideRepository.getRideById(input.rideId);
    if (!ride) throw new Error("Ride does not exist");
    ride.register(RideCompletedEvent.eventName, async (event: RideCompletedEvent) => {
      await this.rideRepository.updateRide(ride);
      await this.queue.publish("rideCompleted", event);
    });
    const positions = await this.positionRepository?.getPositionsByRideId(input.rideId);
    ride.finish(positions);
  }
}

type Input = {
  rideId: string
}

