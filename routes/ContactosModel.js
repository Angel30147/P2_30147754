const sqlite3 = require("sqlite3").verbose();
const path = require('path');



class ContactosModel {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, "/basededatos", "base.db"), (err) => {
      if (err) {
        console.log('Error en la base de datos')
      }
      console.log('Base de datos creada')
    });
  }

  conectardb() {
    this.db.run('CREATE TABLE IF NOT EXISTS contactos(nombre VARCHAR(255), correo VARCHAR(255), comentario TEXT,ip TEXT,fecha TEXT, country TEXT)');
  }

  guardardb(name, email, commentary, ip, fecha, country) {
    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?, ?)", [name, email, commentary, ip, fecha, country]);
  }

  obtenerContactos() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM contactos", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
}
  
module.exports = ContactosModel