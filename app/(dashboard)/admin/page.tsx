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

export default function Admin() {
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
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-between px-12 py-12 rounded-md">
        <div>
          <div className="text-center text-2xl">Environmental Actions</div>
          <div className="text-center text-lg pt-6 font-bold">10</div>
        </div>
        <div>
          <div className="text-center text-2xl">
            Environmental Actions (Waste)
          </div>
          <div className="text-center text-lg pt-6 font-bold">100 kg</div>
        </div>
        <div>
          <div className="text-center text-2xl">
            Environmental Actions (Trees Planted)
          </div>
          <div className="text-center text-lg pt-6 font-bold">20 trees</div>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <div className="w-6/12">
          <div>
            <input
              type="text"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              )}
              placeholder="Enter the number of points to convert to toro coin"
            />
          </div>

          <button className={` ${cn(buttonVariants())} mt-3 `}>Withdraw</button>
        </div>

        <div className="w-4/12">
          <div>
            Overall Point - <span className="text-lg pt-6 font-bold">200</span>
          </div>
          <div>
            Payable Point - <span className="text-lg pt-6 font-bold">100</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-3/4 mb-5">
        <button
          onClick={() => setState("1")}
          className={` ${cn(buttonVariants())} mt-3 `}
        >
          Enviromental Action
        </button>

        <button
          onClick={() => setState("2")}
          className={` ${cn(buttonVariants())} mt-3 `}
        >
          Enviromental Action (Waste)
        </button>

        <button
          onClick={() => setState("3")}
          className={` ${cn(buttonVariants())} mt-3 `}
        >
          Enviromental Action (Tree Planting)
        </button>
      </div>
    </section>
  );
}
