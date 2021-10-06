import { Types } from "mongoose";

export interface FundPayload {
  fromAdr: number;
  toAdr: number;
  currencyId: string;
  amount: number;
}
export interface Asset {
  _id?: Types.ObjectId;
  currency: Currency;
  balance: number;
}

export interface Currency {
  _id?: Types.ObjectId;
  name: string;
  exchangeRate: number;
}

export interface Wallet {
  _id?: Types.ObjectId;
  account: string;
  walletAddress: number;
  assets: [Asset];
}
