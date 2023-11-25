/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAccount, useNetwork } from "wagmi";
import { toro } from "@/utils/constant";
import toroABI from "../../../abi/toro.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export default function Leader() {
  const { chain } = useNetwork();
  const network = chain?.network;
  const [state, setState] = useState("1");
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const toroContract = new ethers.Contract(toro, toroABI.abi, signer);
    return toroContract;
  };

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const contract = new ethers.Contract(toro, toroABI.abi, provider);
    return contract;
  };

  const getuserData = async () => {
    const contract = await createReadContract();
    const data = await contract.getUserList();
    const sortCurrent = Array.from(data).sort(
      (a, b) => Number(b.score) - Number(a.score)
    );

    const sortAll = Array.from(data).sort(
      (a, b) => Number(b.overall_score) - Number(a.overall_score)
    );
    setData(sortCurrent);
    setData1(sortAll);
  };

  useEffect(() => {
    getuserData();
  }, []);

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="font-bold text-lg">Current Leaders</div>

      <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
        <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
          <tbody>
            <tr className="font-heading">
              <th>Id</th>
              <th>User</th>
              <th>Score</th>
            </tr>
            {data.map((item) => {
              return (
                <tr className="text-center">
                  <td className="py-6">{String(item?.id)}</td>
                  <td>{item.user}</td>
                  <td>{Number(item.score)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="font-bold text-lg mt-10">All Time Leaders</div>

      <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
        <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
          <tbody>
            <tr className="font-heading">
              <th>Id</th>
              <th>User</th>
              <th>Score</th>
            </tr>
            {data1.map((item) => {
              return (
                <tr className="text-center">
                  <td className="py-6">{String(item?.id)}</td>
                  <td>{item.user}</td>
                  <td>{Number(item.overall_score)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </section>
  );
}
