const Base = require('./Base');

class PTCategory extends Base {
  constructor() {
    super();
  }

  insertOne(toInsert) {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        'INSERT INTO ptCategory SET ?', toInsert,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  find(params) {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        'SELECT * FROM ptCategory WHERE ?', params,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        'SELECT * FROM ptCategory',
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  update(toSet, params) {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        "UPDATE ptCategory SET ? WHERE ?", [toSet, params],
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  delete(params) {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        "DELETE FROM ptCategory WHERE ?", [params],
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  customQuery(query, params) {
    return new Promise((resolve, reject) => {
      this.bdd.query(
        query, params,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }
}

module.exports = new PTCategory();
