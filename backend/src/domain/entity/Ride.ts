import UUID from "../vo/UUID";
import Coord from "../vo/Coord"
import Position from "../vo/Position"
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import DistanceCalculator from "../service/DistanceCalculator";

export default class Ride {
  private rideId: UUID;
  private driverId?: UUID;
  private passengerId: UUID;
  private from: Coord;
  private to: Coord;
  private status: RideStatus;
  private date: Date;
  // Entity
  positions: Position[];

  constructor (rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId: string = "", positions: Position[]) {
      this.rideId = new UUID(rideId);
      this.passengerId = new UUID(passengerId);
      this.from = new Coord(fromLat, fromLong);
      this.to = new Coord(toLat, toLong);
      this.status = RideStatusFactory.create(status, this);
      this.date = date;
      if (driverId) this.driverId = new UUID(driverId);
      this.positions = positions;
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const uuid = UUID.create();
    const status = "requested"; 
    const date = new Date();
    const positions: Position[] = [];
    return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date, "", positions);
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

  updatePosition (lat: number, long: number){
    this.positions.push(Position.create(this.rideId.getValue(), lat, long));
  }

  getDistance () {
    let distance = 0;
    for (const [index, position] of this.positions.entries()) {
      const nextPosition = this.positions[index + 1];
      if (!nextPosition) continue;
      distance += DistanceCalculator.calculate(position.coord, nextPosition.coord);
    }
    return distance;
  }

  // updatePositionCoord (positionId: string, lat: number, long: number) {
  //   const position = this.positions.find((position: Position) => position.positionId.getValue() === positionId);
  //   if (!position) return;
  //   position.setCoord(lat, long);
  // }

  // deletePosition (positionId: string) {
  //   this.positions = this.positions.filter((position: Position) => position.positionId.getValue() !== positionId);
  // }

}