import { Schema, model } from "mongoose";
import { Currency } from "./currencySchema";

interface Wallet {
  account: Schema.Types.ObjectId;
  walletAddress: number;
  assets: Asset[];
}

interface Asset {
  currency: Currency;
  balance: number;
}

const schema = new Schema<Wallet>({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  walletAddress: { type: Number, required: true },
  assets: [
    {
      _id: false,
      currency: { type: Schema.Types.ObjectId, ref: "Currency" },
      balance: { type: Number, required: true, default: 0 },
    },
  ],
});

const WalletModel = model<Wallet>("Wallet", schema);

export default WalletModel;
