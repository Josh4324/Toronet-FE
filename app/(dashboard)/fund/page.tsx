/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAccount, useNetwork } from "wagmi";
import { erc20ABI } from "wagmi";
import { toro } from "@/utils/constant";
import toroABI from "../../../abi/toro.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export default function Fund() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [allowance, setAllowance] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(0);

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const toroContract = new ethers.Contract(toro, toroABI.abi, signer);
    return toroContract;
  };

  const createTokenContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0xff0dFAe9c45EeB5cA5d269BE47eea69eab99bf6C",
      erc20ABI,
      signer
    );
    return contract;
  };

  const amountRef = useRef();

  const allowanceCheck = async () => {
    const contract = await createTokenContract();
    const amount = await contract.allowance(address, toro);
    const balance = await contract.balanceOf(address);
    setBalance(Number(balance) / 10 ** 18);
    setAllowance(Number(amount) / 10 ** 18);
  };

  const getBalance = async () => {
    const contract = await createTokenContract();
    const balance = await contract.balanceOf(address);
    const balance1 = await contract.balanceOf(toro);
    setBalance(Number(balance) / 10 ** 18);
    setBalance1(Number(balance1) / 10 ** 18);
  };

  const approve = async (evt) => {
    evt.preventDefault();
    const contract = await createTokenContract();
    const amount = ethers.parseEther(amountRef.current.value);

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.approve(toro, amount);
      await tx.wait();
      toast.update(id, {
        render: "Approval successfull, You can now add your funds",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
      allowanceCheck();
      const allowance = await contract.allowance(address, toro);
      setAllowance(Number(allowance) / 10 ** 18);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const fund = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const amount = ethers.parseEther(amountRef.current.value);

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.donateOrFund(amount);
      await tx.wait();
      toast.update(id, {
        render: "Funded Successfully",
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
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    getBalance();
    allowanceCheck();
  }, []);

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
        <div className="w-full">
          <div className="mb-6">
            Contract Balance -{" "}
            <span className="text-lg pt-6  font-bold">{balance1}</span>
          </div>
          <div className="mb-6">
            My Balance -{" "}
            <span className="text-lg pt-6  font-bold">{balance}</span>
          </div>
          <div>
            <input
              type="text"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              )}
              placeholder="Enter the amount (toro)"
              ref={amountRef}
              onChange={() => setCurrentAmount(amountRef.current.value)}
            />
          </div>

          {allowance >= currentAmount ? (
            <button
              className={` ${cn(buttonVariants())} mt-3 w-1/2 mx-auto`}
              style={{ display: "block" }}
              onClick={fund}
            >
              Fund
            </button>
          ) : (
            <button
              className={` ${cn(buttonVariants())} mt-3 w-1/2 mx-auto`}
              style={{ display: "block" }}
              onClick={approve}
            >
              Approve
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
