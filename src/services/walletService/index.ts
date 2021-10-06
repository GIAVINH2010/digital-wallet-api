import WalletModel from "../../core/utils/database/schemas/walletSchema";
import { FundPayload, Asset, Wallet } from "./types";
import mongoose from "mongoose";
import { CustomError } from "../../core/utils/customError";

const getWalletByAccountId = async (accountId) => {
  const foundWallet = await WalletModel.findOne({
    account: accountId,
  }).populate({
    path: "assets",
    populate: { path: "currency" },
  });
  return foundWallet;
};

const sendFund = async (payload: FundPayload) => {
  const { fromAdr, toAdr, currencyId, amount } = payload;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const remitter = await WalletModel.findOne({
      walletAddress: fromAdr,
    }).populate({
      path: "assets",
      populate: { path: "currency" },
    });

    if (!remitter) {
      throw new Error("REMITTER_NOT_FOUND");
    }

    const remitterAssetIdx = remitter.assets.findIndex(
      (asset) => String(asset.currency._id) === currencyId
    );

    if (remitter.assets[remitterAssetIdx].balance < amount) {
      throw new Error("NOT_ENOUGH_BALANCE");
    }

    remitter.assets[remitterAssetIdx].balance -= amount;

    const remitterResult = await remitter.save({ session: session });
    console.log(
      "🚀 ~ file: index.ts ~ line 49 ~ sendFund ~ remitterResult",
      remitterResult
    );

    const beneficiary = await WalletModel.findOne({
      walletAddress: toAdr,
    }).populate({
      path: "assets",
      populate: { path: "currency" },
    });

    if (!beneficiary) {
      throw new Error("BENEFICIARY_NOT_FOUND");
    }

    const beneficiaryAssetIdx = beneficiary.assets.findIndex(
      (asset) => String(asset.currency._id) === currencyId
    );

    beneficiary.assets[beneficiaryAssetIdx].balance += amount;

    const beneficiaryResult = await beneficiary.save({ session: session });
    console.log(
      "🚀 ~ file: index.ts ~ line 73 ~ sendFund ~ beneficiaryResult",
      beneficiaryResult
    );

    await session.commitTransaction();
    session.endSession();
    return { message: "SEND_FUND_SUCCESSFULLY" };
  } catch (error) {
    const { message } = error;
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw new CustomError(400, message); // Rethrow so calling function sees error
  }
};
export default { getWalletByAccountId, sendFund };
