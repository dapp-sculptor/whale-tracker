import { Request, Response, Router } from "express";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";

import { DEX_API_URL, connection } from "../../config/config";
import { getTopTradersList, isValidSolanaAddress } from "../../utils";


// Create a new instance of the Express Router
const Token = Router();

// @route    GET api/tokens
// @desc     Ping
// @access   Public
Token.get("/", async (req: Request, res: Response) => {
  try {
    return res.json("API is working")
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})
// @route    GET api/tokens/pair
// @desc     Fetch Pairs List
// @params   baseToken:string, quoteToken?:string
// @access   Public
Token.get("/pair", async (req: Request, res: Response) => {
  try {
    const baseToken = req.query.baseToken
    const quoteToken = req.query.quoteToken
    if (typeof baseToken !== 'string') {
      return res.status(400).json({ error: 'Base token must be a string' });
    }
    if (!isValidSolanaAddress(baseToken)) return res.status(400).json({ error: 'Invalid Base Token address' });
    if (quoteToken) {
      if (typeof quoteToken !== 'string') {
        return res.status(400).json({ error: 'Quote token must be a string' });
      }
      if (!isValidSolanaAddress(baseToken)) return res.status(400).json({ error: 'Invalid Quote Token address' });
    }
    const result = await axios.get(`${DEX_API_URL}/tokens/${baseToken}`)
    const pairList = result.data.pairs
    if (quoteToken) {
      res.json(pairList.filter((item: any) => (item.dexId === "raydium") && (
        (item.baseToken.address === baseToken && item.quoteToken.address === quoteToken) ||
        (item.baseToken.address === quoteToken && item.quoteToken.address === baseToken)
      )))
      // res.json(pairList.filter((item: any) => (item.baseToken.address == baseToken) && (item.quoteToken.address == quoteToken) || (item.baseToken.address == quoteToken) && (item.quoteToken.address == baseToken)))
    } else {
      res.json(pairList.filter((item: any) => ((item.baseToken.address == baseToken) || (item.quoteToken.address == baseToken)) && item.dexId == "raydium"))
      // res.json(pairList.filter((item: any) => (item.baseToken.address == baseToken) || (item.quoteToken.address == baseToken)))
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route    GET api/tokens/topholders
// @desc     Get top holders of current token
// @params   address:string
// @access   Public
Token.get("/topholders", async (req: Request, res: Response) => {
  try {
    const address = req.query.tokenMint

    if (typeof address !== 'string') {
      return res.status(400).json({ error: 'Base token must be a string' });
    }

    if (!isValidSolanaAddress(address)) return res.status(400).json({ error: 'Invalid Base Token address' });
    const holders = await connection.getTokenLargestAccounts(new PublicKey(address))

    if (holders && holders.value.length) {
      res.json(holders.value)
    } else res.status(404).json({ error: 'Not found' })
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

// @route    GET api/tokens/toptrader
// @desc     Get top traders of current token
// @params   address:string
// @access   Public
Token.get("/toptraders", async (req: Request, res: Response) => {
  try {
    const address = req.query.pair
    if (typeof address !== 'string') {
      return res.status(400).json({ error: 'Base token must be a string' });
    }
    if (!isValidSolanaAddress(address)) return res.status(400).json({ error: 'Invalid Base Token address' });

    const result = await axios.get(`${DEX_API_URL}/pairs/solana/${address}`)
    const pairData = result.data.pair.pairAddress

    const data = await getTopTradersList(pairData)
    res.json(data)
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default Token;
