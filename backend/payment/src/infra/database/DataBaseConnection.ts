import pgp from "pg-promise"

export default interface DatabaseConnection {
  query (statment: string, params: any): Promise<any>;
  close (): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
  private static instance: PgPromiseAdapter;
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:123456@localhost:5435/app");
  }

  public static getInstance(): PgPromiseAdapter {
    if (!PgPromiseAdapter.instance) {
        PgPromiseAdapter.instance = new PgPromiseAdapter();
      }
    return PgPromiseAdapter.instance;
  }

  getConnection() {
    return this.connection;
  }

  query(statment: string, params: any): Promise<any> {
    return this.connection?.query(statment, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
  
}