import UUID from "../vo/UUID";
import Coord from "../vo/Coord"
import Position from "../vo/Position"
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import DistanceCalculator from "../service/DistanceCalculator";
import RideCompletedEvent from "../event/RideCompletedEvent";
import Mediator from "../../infra/mediator/Mediator";

// Obsever 1-N
export default class Ride extends Mediator {
  private rideId: UUID;
  private driverId?: UUID;
  private passengerId: UUID;
  private from: Coord;
  private to: Coord;
  private status: RideStatus;
  private date: Date;

  constructor (rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId: string = "", private distance: number = 0, private fare: number = 0) {
    super();  
    this.rideId = new UUID(rideId);
      this.passengerId = new UUID(passengerId);
      this.from = new Coord(fromLat, fromLong);
      this.to = new Coord(toLat, toLong);
      this.status = RideStatusFactory.create(status, this);
      this.date = date;
      if (driverId) this.driverId = new UUID(driverId);
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const uuid = UUID.create();
    const status = "requested"; 
    const date = new Date();
    const driveId = ""
    const distance = 0;
    const fare = 0;
    return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date, driveId, distance, fare);
  }

  getRideId () {
    return this.rideId.getValue();
  }

  getDriverId () {
    return this.driverId?.getValue();
  }

  getPassengerId () {
    return this.passengerId.getValue();
  }

  getFrom () {
    return this.from;
  }

  getTo () {
    return this.to;
  }
  
  getStatus () {
    return this.status.value;
  }

  setStatus (status: RideStatus) {
    this.status = status;
  }

  accept (driverId: string) {
    this.status.accept();
    this.driverId = new UUID(driverId);
  }

  start () {
    this.status.start();
  }

  getDate () {
    return this.date;
  }

  finish (positions: Position[]) {
    const distance = DistanceCalculator.calculatedByPositions(positions);
    this.distance = distance;
    this.fare = distance * 2.1;
    this.status.finish();
    const event = new RideCompletedEvent(this.getRideId(), this.getFare());
    this.notify(RideCompletedEvent.eventName, event);
  }

  getFare () {
    return this.fare;
  }

  getDistance () {
    return this.distance;
  }
}