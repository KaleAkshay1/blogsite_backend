import pool from "../config/database.connection.js";

const accessAllData = async (table, limit = 12, offset = 0) => {
  const query = `SELECT * FROM ?? LIMIT ? OFFSET ?`;
  const [result] = await pool.query(query, [table, limit, offset]);
  return result;
};

const accessSpecificData = async (
  table,
  limit = 12,
  offset = 0,
  ...columns
) => {
  const query = `SELECT ${columns
    .map(() => "??")
    .join(", ")} FROM ?? LIMIT ? OFFSET ?`;
  const [result] = await pool.query(query, [...columns, table, limit, offset]);
  return result;
};

const accessById = async (table, id) => {
  const query = `SELECT * FROM ?? WHERE id = ?`;
  const [result] = await pool.query(query, [table, id]);
  return result;
};
const checkUserExist = async (email) => {
  const query = `SELECT * FROM users where email = ? limit 1`;
  const [result] = await pool.query(query, [email]);
  return result;
};

const accessByCondition = async (table, condition, limit = 12, offset = 0) => {
  const query = `SELECT * FROM ?? WHERE ${condition} LIMIT ? OFFSET ?`;
  const [result] = await pool.query(query, [table, limit, offset]);
  return result;
};

const createUser = async (data) => {
  const query = `INSERT INTO users(${Object.keys(data)
    .map((ele) => "??")
    .join(",")}) value(${Object.values(data)
    .map((ele) => "?")
    .join(",")})`;
  const [result] = await pool.query(query, [
    ...Object.keys(data),
    ...Object.values(data),
  ]);
  return result;
};

export {
  accessAllData,
  accessSpecificData,
  accessById,
  accessByCondition,
  createUser,
  checkUserExist,
};
