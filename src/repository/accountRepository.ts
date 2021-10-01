import AccountModel from "../core/utils/database/schemas/accountSchema";

const getAccountByUsername = async (username: string) => {
  return await AccountModel.findOne({ username });
};

const createAccount = async (
  email: string,
  username: string,
  password: string
) => {
  const data = new AccountModel({ email, username, password });
  return await data.save();
};

export default { getAccountByUsername, createAccount };
