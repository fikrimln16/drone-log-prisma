import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",

  port: 3304,

  user: "root",

  password: "",

  database: "droneflight",

  waitForConnections: true,

  connectionLimit: 10,
});

export default pool;