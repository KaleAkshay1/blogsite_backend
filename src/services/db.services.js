import pool from "../config/database.connection.js";

const acessAllData = async (tabel, limit = 12, offset = 0) => {
  const [result] = await pool.query(
    `SELECT * FROM ${tabel} limit ${limit} offset ${offset}`
  );
  return result;
};

const acessApecificData = async (tabel, limit = 12, offset = 0, ...data) => {
  const [result] = await pool.query(
    `select ${data.join(",")} from ${tabel} limit ${limit} offset ${offset}`
  );
  return result;
};

const accessById = async (tabel, id) => {
  const [result] = await pool.query(`SELECT * FROM ${tabel} where id=${id}`);
  return result;
};

const accessByCondition = async (tabel, condition, limit = 12, offset = 0) => {
  const [result] = await pool.query(
    `SELECT * FROM ${tabel} where ${condition} limit ${limit} offset ${offset}`
  );
};

export { acessAllData, acessApecificData, accessById, accessByCondition };
