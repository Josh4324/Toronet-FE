/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useRef } from "react";
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

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const toroContract = new ethers.Contract(toro, toroABI.abi, signer);
    return toroContract;
  };

  const actionTypeRef = useRef();
  const doc1Ref = useRef();
  const doc2Ref = useRef();

  const createAction = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.registerAction(
        actionTypeRef.current.value,
        doc1Ref.current.value,
        doc2Ref.current.value
      );

      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);

      toast.update(id, {
        render: "Transaction successfull, Environmental Action Created",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

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
            <tr className="text-center">
              <td>1</td>
              <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
              <td>100</td>
            </tr>
            <tr className="text-center">
              <td>2</td>
              <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
              <td>100</td>
            </tr>
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
            <tr className="text-center">
              <td>1</td>
              <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
              <td>100</td>
            </tr>
            <tr className="text-center">
              <td>2</td>
              <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}
