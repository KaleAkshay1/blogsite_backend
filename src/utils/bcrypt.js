import bcrypt from "bcrypt";

const encryptPass = (pass) => {
  const hashPass = bcrypt.hashSync(pass, 10);
  return hashPass;
};

const checkEncryptedPass = (pass, hashedPass) => {
  const result = bcrypt.compareSync(pass, hashedPass);
  return result;
};

export { encryptPass, checkEncryptedPass };
