import { Request, Response } from "express";
import { CustomError } from "../../core/utils/customError";

import walletService from "../../services/walletService";

const getWallet = async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload: { accountId },
    } = res.locals;

    const result = await walletService.getWalletByAccountId(accountId);

    if (result) {
      return res
        .status(200)
        .send({ message: "GET_WALLET_SUCCESSFULLY", wallet: result });
    }
  } catch (error) {
    console.log("error", error);
    if (error.name === "CustomError") {
      return res.status(error.status).send(error);
    }
    return res.status(500).send({ message: "Server Error" });
  }
};

const sendFund = async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload: { accountId },
    } = res.locals;
    const { fromAdr, toAdr, currencyId, amount } = req.body;

    const foundMyWallet = await walletService.getWalletByAccountId(accountId);

    const { walletAddress } = foundMyWallet;

    if (walletAddress !== fromAdr) {
      return res.status(400).send({ message: "NOT_OWNED_WALLET_ADDRESS" });
    }

    const result = await walletService.sendFund({
      fromAdr,
      toAdr,
      currencyId,
      amount,
    });

    if (result) {
      return res.status(200).send({ message: "SEND_FUND_SUCCESSFULLY" });
    }
  } catch (error) {
    console.log("error", error);
    if (error.name === "CustomError") {
      return res.status(error.status).send(error);
    }
    return res.status(500).send({ message: "Server Error" });
  }
};

export default { getWallet, sendFund };
