import crypto from "crypto";

// Value Object DDD
export default class UUID {
  value: string;

  constructor (value : string) {
    this.value = value;
  }

  static create () {
    const uuid = crypto.randomUUID();
    return new UUID(uuid);
  }

  getValue(){
    return this.value;
  }
}