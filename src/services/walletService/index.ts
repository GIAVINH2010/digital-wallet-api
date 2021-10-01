import WalletModel from "../../core/utils/database/schemas/walletSchema";
import { FundPayload, Asset, Wallet } from "./types";
import mongoose from "mongoose";

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
  const { fromAdr, toAdr, currency, amount } = payload;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const remitter = await WalletModel.findOne({
      walletAddress: fromAdr,
    }).populate({
      path: "assets",
      populate: { path: "currency" },
    });
    console.log(
      "🚀 ~ file: index.ts ~ line 21 ~ sendFund ~ remitter",
      remitter
    );

    if (!remitter) {
      throw new Error("remitter not found");
    }

    const remitterAssetIdx = remitter.assets.findIndex(
      (asset) => asset.currency.name === currency
    );

    if (remitter.assets[remitterAssetIdx].balance < amount) {
      throw new Error("balance < amount");
    }

    remitter.assets[remitterAssetIdx].balance -= amount;
    console.log(
      "🚀 ~ file: index.ts ~ line 41 ~ sendFund ~ remitter",
      remitter
    );
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
    console.log(
      "🚀 ~ file: index.ts ~ line 50 ~ sendFund ~ beneficiary",
      beneficiary
    );

    if (!beneficiary) {
      throw new Error("beneficiary not found");
    }

    const beneficiaryAssetIdx = beneficiary.assets.findIndex(
      (asset) => asset.currency.name === currency
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
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow so calling function sees error
  }
};
export default { getWalletByAccountId, sendFund };
