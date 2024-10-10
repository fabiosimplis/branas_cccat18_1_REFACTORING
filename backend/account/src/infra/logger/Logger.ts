export default class Logger {
  private static instance: Logger;
  private level = "error";
  private levels = ["trace", "debug", "info", "warn", "error", "fatal"];

  constructor() {
    
  }

  debug (message: string, data: any) { 
    const levels = this.levels.slice(this.levels.indexOf(this.level));
    if (levels.includes("debug")){
      console.log("DEBUG", message, data);
      // process.stdout.write
    }
  }

  setLevel(level: string) {
    this.level = level;
  }

  static getInstance() {
    if (!Logger.instance){
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}