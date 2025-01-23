import pool from "../config/database.connection.js";

const accessById = async (table, id) => {
  const query = `SELECT * FROM ?? WHERE id = ?`;
  const result = await pool.query(query, [table, id]);
  return result[0];
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

const getPostsData = async (
  limit = Number(process.env.LIMIT),
  page,
  category
) => {
  const offset = (page - 1) * limit;
  if (category) {
    const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner,c.category as category, posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id JOIN categorys c ON posts.categoryId = c.id where categoryId = ? LIMIT ? OFFSET ?`;
    const result = await pool.query(query, [category, limit, offset]);
    return result[0];
  } else {
    const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner,c.category as category,posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id JOIN categorys c ON posts.categoryId = c.id LIMIT ? OFFSET ?`;
    const result = await pool.query(query, [limit, offset]);
    return result[0];
  }
};

const accessPostById = async (id) => {
  const query = `SELECT posts.id as id, posts.title as title, posts.banner as banner,c.category as category,  posts.des as content, posts.views as views, posts.created_at as created_at,users.username as username, users.email as email,users.profile_picture as profile_picture FROM posts JOIN users ON posts.user_id = users.id JOIN categorys c ON posts.categoryId = c.id where posts.id = ?`;
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

const getCommentsOfPost = async (post_id) => {
  const query =
    "SELECT u.id as user_id, u.username as username, u.email as email, u.profile_picture as profile_picture, c.id as id, c.comment as comment, c.created_at as created_at, c.parent_comment_id as parent_comment_id from comments c JOIN users u ON u.id = c.user_id where post_id = ? ";
  const result = await pool.query(query, [post_id]);
  return result;
};

const getAllCategories = async () => {
  const query = "SELECT * FROM categorys";
  const result = await pool.query(query);
  return result[0];
};

const trendingPost = async (
  limit = Number(process.env.LIMIT),
  page = 1,
  category = null
) => {
  const offset = (page - 1) * Number(limit);
  if (category) {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id WHERE p.categoryId = ?  ORDER BY p.views DESC LIMIT ? OFFSET ?";
    const result = await pool.query(query, [category, limit, offset]);
    return result[0];
  } else {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id  ORDER BY p.views DESC LIMIT ? OFFSET ?";
    const result = await pool.query(query, [Number(limit), offset]);
    return result[0];
  }
};

const latestPost = async (
  limit = Number(process.env.LIMIT),
  page = 1,
  category = null
) => {
  const offset = (page - 1) * limit;
  if (category) {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id WHERE p.categoryId = ?  ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    const result = await pool.query(query, [category, limit, offset]);
    return result[0];
  } else {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id  ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    const result = await pool.query(query, [limit, offset]);
    return result[0];
  }
};

const randomPost = async (
  limit = Number(process.env.LIMIT),
  page = 1,
  category = null
) => {
  const offset = (page - 1) * limit;
  if (category) {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id WHERE p.categoryId = ? ORDER BY RAND() LIMIT ? OFFSET ?";
    const result = await pool.query(query, [category, limit, offset]);
    return result[0];
  } else {
    const query =
      "SELECT p.id as id, p.title as title, p.banner as banner,c.category as category, p.views as views, p.created_at as created_at, u.username as username, u.email as email, u.profile_picture as profile_picture FROM posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id ORDER BY RAND() LIMIT ? OFFSET ?";
    const result = await pool.query(query, [limit, offset]);
    return result[0];
  }
};

const updateUser = async (id, data) => {
  const query = `UPDATE users SET ${Object.entries(data)
    .map((ele) => "?? = ?")
    .join(",")}  WHERE id = ?`;
  const result = await pool.query(query, [...Object.entries(data).flat(), id]);
  return result[0].affectedRows;
};

const serchPostsResult = async (
  cat,
  limit = Number(process.env.LIMIT),
  page = 1
) => {
  const offset = (page - 1) * limit;
  const query =
    "SELECT p.id as id, p.title as title, p.banner as banner, c.category as category, p.views as views, p.created_at as created_at,u.username as username, u.profile_picture as profile_picture from posts p JOIN users u ON p.user_id = u.id JOIN categorys c ON p.categoryId = c.id where c.category Like ? OR p.title LIKE ? LIMIT ? OFFSET ?";
  const result = await pool.query(query, [
    `%${cat}%`,
    `%${cat}%`,
    limit,
    offset,
  ]);
  return result[0];
};

const userPosts = async (id, limit = Number(process.env.LIMIT), page = 1) => {
  const offset = (page - 1) * limit;
  const query =
    "SELECT id, title, banner, views,created_at from posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const result = await pool.query(query, [id, limit, offset]);
  return result[0];
};

const deletePost = async (id) => {
  const query = "DELETE FROM posts WHERE id = ?";
  const result = await pool.query(query, [id]);
  console.log(result);
  return result[0].affectedRows;
};

const deleteCommentDb = async (id) => {
  console.log(id);
  const query = "DELETE FROM comments WHERE id = ?";
  const result = await pool.query(query, [id]);
  console.log(result);
  return result[0].affectedRows;
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
  getCommentsOfPost,
  updateUser,
  getAllCategories,
  trendingPost,
  latestPost,
  randomPost,
  serchPostsResult,
  userPosts,
  deletePost,
  deleteCommentDb,
};
