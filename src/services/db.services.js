import pool from "../config/database.connection.js";

const accessById = async (table, id) => {
  const query = `SELECT * FROM ?? WHERE id = ?`;
  const [result] = await pool.query(query, [table, id]);
  return result;
};
const checkUserExist = async (email, col = "email") => {
  const query = `SELECT * FROM users where ?? = ? limit 1`;
  const [result] = await pool.query(query, [col, email]);
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

const updatePassword = async (email, pass) => {
  const query = "UPDATE users SET password = ? WHERE email = ? LIMIT 1";
  const result = await pool.query(query, [pass, email]);
  return result[0].affectedRows > 0;
};

const createPost = async (data) => {
  const query = `INSERT into posts(${Object.keys(data)
    .map((ele) => "??")
    .join(",")}) value (${Object.values(data)
    .map((ele) => "?")
    .join(",")})`;
  const result = await pool.query(query, [
    ...Object.keys(data),
    ...Object.values(data),
  ]);
  return result[0].affectedRows;
};

const getPostsData = async (limit, page, category) => {
  const offset = (page - 1) * limit;
  if (category) {
    const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner, posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id where category = ? LIMIT ? OFFSET ?`;
    const result = await pool.query(query, [category, limit, offset]);
    return result[0];
  } else {
    const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner,posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id LIMIT ? OFFSET ?`;
    const result = await pool.query(query, [limit, offset]);
    return result[0];
  }
};

const accessPostById = async (id) => {
  const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner, posts.category as category , posts.des as content, posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id where posts.id = ?`;
  const result = await pool.query(query, [id]);
  return result[0];
};

const updateViewsOfPost = async (id) => {
  const query = "UPDATE posts SET views = views + ? where id = ?";
  const result = await pool.query(query, [1, id]);
  return result[0]?.affectedRows;
};

const insertRow = async (data, tabel) => {
  const query = `INSERT into ??(${Object.keys(data)
    .map((ele) => "??")
    .join(",")}) value (${Object.values(data)
    .map((ele) => "?")
    .join(",")})`;
  const result = await pool.query(query, [
    tabel,
    ...Object.keys(data),
    ...Object.values(data),
  ]);
  return result[0]?.affectedRows;
};

export {
  accessById,
  createUser,
  checkUserExist,
  updatePassword,
  createPost,
  getPostsData,
  accessPostById,
  updateViewsOfPost,
  insertRow,
};
