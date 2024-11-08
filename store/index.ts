import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { challengeReducer } from "./challenge";
import { withdrawReducer } from "./withdraw";
import { poolchallengeReducer } from "./poolchallenge";
import Withdraw from "@/pages/withdraw";

export interface IState {
  auth: {
    currentUser: {
      id: string;
      email: string;
      password: string;
      username: string;
      firstname: string;
      lastname: string;
      role: number;
      avatar: string;
      referralCnt: number;
      airdropIndex: number;
      money: {
        busd: number;
        usdt: number;
        usd: number;
        bitp: number;
        quest: number;
        cake: number;
      };
      bonus: {
        busd: number;
        usdt: number;
        usd: number;
        bitp: number;
        quest: number;
        cake: number;
      };
      earnMoney: {
        busd: number;
        usdt: number;
        bitp: number;
        cake: number;
        usd: number;
      };
      address: {
        ether: { privateKey: string; address: string };
        bitcoin: { privateKey: string; address: string };
        tron: { privateKey: string; address: string };
      };
      buy_BitpAddr: {
        privateKey: string;
        address: string;
      };
      index: number;
      latestEarnAmount: number;
      latestEarnUnit: string;
    };
    type: string;
  };
  challenge: {
    flag: boolean;
    model: object;
  };
  poolchallenge: {
    model: object[];
  };
  withdraw: {
    flag: boolean;
    model: object[];
  };
}

const reducer = combineReducers({
  auth: authReducer,
  challenge: challengeReducer,
  poolchallenge: poolchallengeReducer,
  withdraw: withdrawReducer,
});

const store = configureStore({
  reducer,
  middleware: () => getDefaultMiddleware(),
});

export default store;
