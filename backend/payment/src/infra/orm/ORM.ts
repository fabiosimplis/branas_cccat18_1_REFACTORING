import DatabaseConnection from "../database/DataBaseConnection";

export default class ORM {

  constructor (readonly connection: DatabaseConnection) {
  }

  async save (model: Model) {
    const columns = model.columns.map((column) => column.column).join(", ");
    const params = model.columns.map((column: any, index: number) => `$${index + 1}`).join(", ");
    const statement = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`
    const values = model.columns.map((column: any) => model[column.property]);
    await  this.connection.query(statement, values);
  }
  
  async get (model: any, field: string, value: any) {
    const statement = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`
    const [data] = await this.connection.query(statement, value);
    const obj = new model();
    for (const column of model.prototype.columns ){
      obj[column.property] = data[column.column];
    }
    return obj;
  }
}

export abstract class Model {
  schema!: string;
  table!: string;
  columns!: { column: string, property: string, pk: boolean }[];
  [property: string]: any;
}

@model("ccca", "transaction")
export class TransactionModel extends Model {

  @column("transaction_id", true)
  transactionId: string;
  @column("ride_id")
  rideId: string;
  @column("amount")
  amount: number;
  @column("date")
  date: Date;
  @column("status")
  status: string;

  constructor (transactionId: string, rideId: string, amount : number, date: Date, status: string) {
    super();
    this.transactionId = transactionId;
    this.rideId = rideId;
    this.amount = amount;
    this.date = date;
    this.status = status;
  }
}

function model (schema: string, table: string) {
  return function (target: any) {
    target.prototype.schema = schema;
    target.prototype.table = table;
  }
}

function column (column: string, pk: boolean = false) {
  return function (target: any, propertyKey: string) {
    if (!target.columns){
      target.columns = []
    }
    target.columns.push({column, property: propertyKey, pk});
  }
}