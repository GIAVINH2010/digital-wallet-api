import { Schema, model } from "mongoose";

interface Account {
  username: string;
  password: string;
}

const schema = new Schema<Account>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const AccountModel = model<Account>("Account", schema);

export default AccountModel;
