import { Schema, model } from "mongoose";

export interface Currency {
  name: string;
  exchangeRate: number;
}

const schema = new Schema<Currency>({
  name: { type: String, required: true },
  exchangeRate: { type: Number, required: true, default: 0 },
});

const CurrencyModel = model<Currency>("Currency", schema);

export default CurrencyModel;
