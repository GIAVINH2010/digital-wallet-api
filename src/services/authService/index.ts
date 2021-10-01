import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import AccountModel from "../../core/utils/database/schemas/accountSchema";
import WalletModel from "../../core/utils/database/schemas/walletSchema";
import CurrencyModel from "../../core/utils/database/schemas/currencySchema";

import { LoginPayload, RegisterPayload } from "./types";
import { CustomError } from "../../core/utils/customError";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "tuheumapdit";

const register = async (payload: RegisterPayload) => {
  // logger.info(`[${SERVICE_NAME}] signUp`);
  const saltRounds = process.env.SALT_ROUNDS || 10;

  const { username, password } = payload;

  const foundAccount: any = await AccountModel.findOne({ username });

  if (foundAccount) {
    throw new CustomError(400, "USERNAME_ALREADY_EXIST");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const salt = bcrypt.genSaltSync(Number(saltRounds));
    const hash = bcrypt.hashSync(password, salt);

    const dataAccount = new AccountModel({ username, password: hash });

    const createdAccount = await dataAccount.save({ session: session });

    if (createdAccount) {
      const { _id } = createdAccount;

      // create wallet
      const currencies = await CurrencyModel.find().session(session);

      if (!currencies.length) {
        throw new CustomError(400, "CANNOT_REGISTER");
      }

      const wallet = new WalletModel({
        account: _id,
        walletAddress: Date.now(),
        assets: currencies.map((currency) => ({
          currency: currency._id,
          balance: 1000,
        })),
      });

      await wallet.save({ session: session });
    }

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow so calling function sees error
  }
};

const login = async (payload: LoginPayload) => {
  // logger.info(`[${SERVICE_NAME}] signIn`)

  const { username, password } = payload;

  const foundAccount: any = await AccountModel.findOne({ username });

  if (foundAccount && foundAccount._id) {
    const { _id: accountId } = foundAccount;

    const { password: hashedPassword } = foundAccount;
    const isCorrectPassword = bcrypt.compareSync(password, hashedPassword);

    if (isCorrectPassword) {
      const token = jwt.sign({ accountId }, jwtSecretKey);
      return token;
    }
  }
  throw new CustomError(400, "INCORRECT_EMAIL_OR_PASSWORD");
};

export default { login, register };
