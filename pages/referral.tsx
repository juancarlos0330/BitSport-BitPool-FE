import { Header } from "@/components";
import Footer from "@/components/Footer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MoneyImg from "@/public/referral-money.png";
import LinkImg from "@/public/referral-link.png";
import UserImg from "@/public/referral-user.png";
import ResponsivePagination from "react-responsive-pagination";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store";
import { notification } from "antd";
import { SERVER_URI } from "@/config";
import axios from "axios";
import { getCake } from "@/service/helper";
import copy from "copy-to-clipboard";
import { IoCopyOutline, IoCopy } from "react-icons/io5";
import {
  BsFillLockFill,
  BsTwitter,
  BsTelegram,
  BsDiscord,
} from "react-icons/bs";
import jwtDecode from "jwt-decode";
import { authActions } from "@/store/auth";
import useCopy from "@/hooks/useCopy";
import { Copy } from "@/public/icons";

export default function ReferralPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useSelector((state: IState) => state.auth);
  const [cakePrice, setCakePrice] = useState(0);
  const [totalData, setTotalData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [sum, setSum] = useState<number>(0);
  const { handleCopy, render } = useCopy();
  const [isRefUrlCopied, setIsRefUrlCopied] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const getCakePrice = async () => {
    await getCake().then((price) => {
      setCakePrice(price);
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCakePrice();
    } else {
      localStorage.setItem("trypage", "buy_bitp");
      router.push("/?signin=true");
    }
  }, []);

  useEffect(() => {
    if (currentUser.id && cakePrice) {
      axios
        .post(`${SERVER_URI}/getReferalInfo`, { userId: currentUser.id })
        .then((res) => {
          // setData(res.data.models);
          let rewardSum = 0;
          const temp = res.data.data.map((item: any) => {
            console.log(rewardSum);
            rewardSum +=
              (Number(item.earnMoney.busd) +
                Number(item.earnMoney.usdt) +
                Number(item.earnMoney.usd) +
                Number(item.earnMoney.bitp) * 0.06 +
                Number(Math.round(Number(item.earnMoney.cake) * cakePrice))) *
              0.05;
            return {
              ...item,
            };
          });
          setSum(rewardSum);
          setTableData(temp.slice(0, 10));
          setTotalData(temp);
        });
    }
  }, [currentUser, cakePrice]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ... do something with `page`
    setTableData(totalData.slice(10 * (page - 1), 10 * (page - 1) + 10));
  };

  const handleRefClick = async (key: string) => {
    if (key === "twitter") {
      await axios
        .post(`${SERVER_URI}/airdrop/followTwitter`, { user: currentUser.id })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          window.location.href = "https://twitter.com/bitsportgaming";
        });
    }
    if (key === "telegram") {
      await axios
        .post(`${SERVER_URI}/airdrop/joinTelegram`, { user: currentUser.id })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          window.location.href = "https://t.me/bitsport_finance";
        });
    }
    if (key === "discord") {
      await axios
        .post(`${SERVER_URI}/airdrop/joinDiscord`, { user: currentUser.id })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
          window.location.href = "https://discord.gg/GYE4FYjsgr";
        });
    }
  };

  return (
    <div className="w-full">
      <Header />
      <div className="container text-white m-auto">
        <div className="">
          <h1 className="text-center my-9 text-3xl">
            Complete the Following steps to Qualify for BITP AirDrop
          </h1>
          <div className="flex-1 my-8 flex justify-center flex-wrap">
            <div
              onClick={() =>
                currentUser.airdropIndex === 0
                  ? handleRefClick("twitter")
                  : null
              } //https://twitter.com/bitsportgaming?ref_src=twsrc%5Etfw
              className={`py-3 px-5 mr-4 referral-card max-w-[300px] !flex-row ${
                currentUser.airdropIndex !== 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <BsTwitter />
              <span className="ml-2">
                {currentUser.airdropIndex === 0 ? "Follow" : "Followed"} Twitter
              </span>
            </div>
            <div
              onClick={() =>
                currentUser.airdropIndex === 1
                  ? handleRefClick("telegram")
                  : null
              } // https://t.me/bitsport_finance
              className={`py-3 px-5 mr-4 referral-card max-w-[300px] !flex-row ${
                currentUser.airdropIndex < 1
                  ? "opacity-50 cursor-not-allowed"
                  : currentUser.airdropIndex !== 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <BsTelegram />
              <span className="ml-2">
                {currentUser.airdropIndex <= 1 ? "Join" : "Joined"} Telegram
              </span>
            </div>
            <div
              onClick={() =>
                currentUser.airdropIndex === 2
                  ? handleRefClick("discord")
                  : null
              } //https://discord.gg/GYE4FYjsgr
              className={`py-3 px-5 referral-card max-w-[300px] !flex-row ${
                currentUser.airdropIndex < 2
                  ? "opacity-50 cursor-not-allowed"
                  : currentUser.airdropIndex !== 2
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <BsDiscord />
              <span className="ml-2">
                {currentUser.airdropIndex <= 2 ? "Join" : "Joined"} Discord
              </span>
            </div>
          </div>
          <div className="w-full flex-1">
            <p className="text-center text-2xl mb-10 max-w-[768px] w-full mx-auto">
              Last Step: Invite other users using your referral link below Earn
              10 BITP per user referred. Invite at least one user to become
              eligible for the Airdrop
            </p>
            <div className="flex justify-center gap-6 mb-20 flex-wrap">
              <div className="referral-card !flex-row max-w-[250px] w-full">
                <Image src={MoneyImg} alt="" />
                <p className="!ml-2">{sum.toFixed(2)} USD</p>
              </div>
              <div className="referral-card !flex-row max-w-[250px] w-full">
                <Image src={LinkImg} alt="" />
                <p className="flex space-x-1 !ml-2">
                  <span>
                    {" "}
                    {currentUser.index
                      ? `play.bitpool.gg?refid=${currentUser.index}`
                      : "play.bitpool.gg"}{" "}
                  </span>
                  {!isRefUrlCopied && (
                    <IoCopyOutline
                      className="cursor-pointer"
                      size={24}
                      onClick={() => {
                        copy(`play.bitpool.gg?refid=${currentUser.index}`);
                        setIsRefUrlCopied(true);
                        setTimeout(() => {
                          setIsRefUrlCopied(false);
                        }, 2000);
                      }}
                    />
                  )}
                  {isRefUrlCopied && <IoCopy size={24} />}
                </p>
              </div>
              {/* <div className="referral-card">
                <Image src={UserImg} className="mb-2" alt="" />
                <p>{currentUser.referralCnt ? currentUser.referralCnt : 0}</p>
              </div> */}
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="referral-table">
          <div className="referral-table-header">
            <span className="pl-2 max-w-[40px]">No</span>
            <span className="min-w-[150px]">Username</span>
            <span className="max-w-[120px] min-w-[120px]">
              <br />
              {"(BUSD)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(USDT)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(BITP)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(CAKE)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(USD)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              <br />
              {"(TOTAL)"}
            </span>
            <span className="max-w-[150px] min-w-[120px]">
              My Reward
              <br />
              {"(USD)"}
            </span>
          </div>
          {tableData.map((item: any, key: number) => (
            <div className="referral-table-body" key={key}>
              <span className="pl-2 max-w-[40px]">{key + 1}</span>
              <span className="min-w-[150px]">{item.username}</span>
              <span className="max-w-[120px] min-w-[120px]">
                {Number(item.earnMoney.busd).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.usdt).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.bitp).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.cake).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {Number(item.earnMoney.usd).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {(
                  Number(item.earnMoney.busd) +
                  Number(item.earnMoney.usdt) +
                  Number(item.earnMoney.usd) +
                  Number(item.earnMoney.bitp) +
                  Number(Math.round(Number(item.earnMoney.cake) * cakePrice))
                ).toFixed(2)}
              </span>
              <span className="max-w-[150px] min-w-[120px]">
                {(Number(item.earnMoney.busd) +
                  Number(item.earnMoney.usdt) +
                  Number(item.earnMoney.usd) +
                  Number(item.earnMoney.bitp) +
                  Number(Math.round(Number(item.earnMoney.cake) * cakePrice))) *
                  0.05}
              </span>
            </div>
          ))}
        </div>
        <div className="max-w-[400px] m-auto responsive-page">
          <ResponsivePagination
            total={Math.ceil(totalData.length / 10)}
            current={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
