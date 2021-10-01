import { Request, Response } from "express";

import walletService from "../../services/walletService";

const getWallet = async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload: { accountId },
    } = res.locals;

    const result = await walletService.getWalletByAccountId(accountId);

    return res.status(200).send(result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: "Server Error" });
  }
};

const sendFund = async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload: { accountId },
    } = res.locals;
    const { fromAdr, toAdr, currency, amount } = req.body;

    const foundMyWallet = await walletService.getWalletByAccountId(accountId);

    const { walletAddress } = foundMyWallet;

    if (walletAddress !== fromAdr) {
      return res.status(400).send({ message: "NOT_OWNED_WALLET_ADDRESS" });
    }

    const result = await walletService.sendFund({
      fromAdr,
      toAdr,
      currency,
      amount,
    });

    return res.status(200).send(result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: "Server Error" });
  }
};

export default { getWallet, sendFund };
