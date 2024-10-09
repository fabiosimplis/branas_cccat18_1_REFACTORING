export default class RideCompletedEvent {
  static eventName = "rideCompletd";
  constructor (readonly rideId: string, readonly amount: number) {
  }
}