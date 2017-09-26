import * as sqlite from 'sqlite';

export class Database {
  dbPromise: Promise<any>;

  constructor() {
    this.dbPromise = sqlite.open('database.sqlite');
  }

  run(sql: string, params: any | any[] = []) {
    console.log(sql, params);
    return this.dbPromise.then(db => db.run(sql, params));
  }

  all(sql: string, params: any | any[] = []) {
    console.log(sql, params);
    return this.dbPromise.then(db => db.all(sql, params));
  }

  get(sql: string, params: any | any[] = []) {
    console.log(sql, params);
    return this.dbPromise.then(db => db.get(sql, params));
  }
}
