const mysql = require("mysql2");

let db = null;
class DB {
  constructor() {
    db = mysql.createConnection({
      host: "localhost",
      user: "xxxx",
      password: "xxxx",
      database: "chat_db_lys",
    });

    db.connect(function (err) {
      if (err) console.log(err);
    });
  }

  listUsers(){
    return new Promise(async (resolve, reject) => {
      // db.execute("SELECT * FROM users WHERE name = ? and password=?", [data.name, data.password],
      db.execute("SELECT * FROM users WHERE 1",
        function (err, rows) {
          if (err) reject(new Error(err));
          else {
            //console.log(" users :", rows);
            resolve(rows);
          }
        });

    });
  }

  addUser(data) {

    return new Promise(async (resolve, reject) => {

      let isUser;

      if (!data.online) {
        db.execute("UPDATE users SET online=? WHERE user_id=?",
          [data.online, data.user_id],
          function (err, rows) {
            if (err) reject(new Error(err));
            else {
              //resolve(rows);
              resolve(rows);
            }
          }
        );
      } else {
        isUser = await this.isUserExist(data);
        console.log("isUser :", isUser);
        if (isUser.length > 0) {
          db.execute("UPDATE users SET user_id=? , online=? WHERE name=? and password=?",
            [data.user_id, data.online, data.name, data.password],
            function (err, rows) {
              if (err) reject(new Error(err));
              else {
                //resolve(rows);
                resolve(rows);
              }
            }
          );
          //resolve(true);
        } else {
          db.execute("INSERT INTO users (name, password, user_id, online) VALUES (?,?,?,?)",
            [data.name, data.password, data.user_id, data.online],
            function (err, rows) {
              if (err) reject(new Error(err));
              else {
                // resolve(rows);
                console.log("db insert :", rows);
                resolve(rows);
              }
            }
          );
        } //else

      }

    });
  }

  isUserExist(data) {
    return new Promise((resolve, reject) => {
      db.execute("SELECT * FROM users WHERE name = ? and password=?", [data.name, data.password],
        function (err, rows) {
          if (err) reject(new Error(err));
          else {
            console.log(" isUserExist :", rows);
            resolve(rows);
          }
        });
    });
  }

  fetchUserMessages(data) {
    const messages = [];
    return new Promise((resolve, reject) => {
      db.query("SELECT * from messages where name =?", [data.name], function (err, rows) {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  storeUserMessage(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO messages (message, user_id, name) VALUES (?,?,?)", [data.message, data.user_id, data.name], function (err, rows) {
        if (err) reject(new Error(err));
        else resolve(rows);
      });
    });
  }
}

module.exports = DB;