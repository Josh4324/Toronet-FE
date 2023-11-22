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

export default function Admin() {
  const { chain } = useNetwork();
  const network = chain?.network;
  const scoreRef = useRef();
  const addRef = useRef();
  const [state, setState] = useState("1");
  const [mstate, setMstate] = useState(false);
  const [mstate1, setMstate1] = useState(false);
  const [mstate2, setMstate2] = useState(false);
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);

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

  const getActions = async () => {
    const contract = await createReadContract();
    const actions = await contract.getActions();
    console.log(actions);
    setData(actions);
  };

  const getAdmin = async () => {
    const contract = await createReadContract();
    const owner = await contract.owner();
    console.log(owner);
    //setData(actions);
  };

  const actionTypeRef = useRef();
  const doc1Ref = useRef();
  const doc2Ref = useRef();

  const addAdmin = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.addAdmin(addRef.current.value);

      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);

      toast.update(id, {
        render: "Transaction successfull, Admin added",
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

  const approveAction = async (id, score) => {
    const contract = await createWriteContract();

    const id1 = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.confirmAction(id, score, true);

      await tx.wait();
      setTimeout(() => {
        window.location.reload();
      }, 10000);

      toast.update(id1, {
        render: "Transaction successfull, Confirmed successfully",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id1, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

  const rejectAction = async (id) => {
    const contract = await createWriteContract();

    const id1 = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.confirmAction(id, 0, false);

      await tx.wait();
      setTimeout(() => {
        window.location.reload();
      }, 10000);

      toast.update(id1, {
        render: "Transaction successfull, Confirmed successfully",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id1, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

  const approveWaste = async (id, score) => {
    console.log(id);
  };

  const rejectWaste = async (id) => {
    console.log(id);
  };

  const approveTree = async (id, score) => {
    console.log(id);
  };

  const rejectTree = async (id) => {
    console.log(id);
  };

  useEffect(() => {
    getActions();
    getAdmin();
  }, []);

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mt-10 flex justify-between">
        <div className="w-6/12">
          <div>
            <input
              type="text"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              )}
              ref={addRef}
              placeholder="Enter Address"
            />
          </div>

          <button
            onClick={addAdmin}
            className={` ${cn(buttonVariants())} mt-3 `}
          >
            Add Admin
          </button>
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

      {state === "1" ? (
        <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
          <div className="mb-3 text-lg font-bold">Actions</div>
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <tbody>
              <tr className="font-heading">
                <th>Id</th>
                <th>Action Type</th>
                <th>Description Doc Link</th>
                <th>Proof Doc Link</th>
                <th>Creator</th>
                <th></th>
              </tr>
              {data.map((item) => {
                return (
                  <tr className="text-center">
                    <td className="py-6">{String(item?.id)}</td>
                    <td>{item.action_type}</td>
                    <td>{item.description}</td>
                    <td>{item.proof}</td>
                    <td>{item.creator}</td>
                    <td>
                      <button
                        onClick={() => {
                          setMstate(true);
                          setId(String(item?.id));
                        }}
                        className={` ${cn(buttonVariants())} `}
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}
      {state === "2" ? (
        <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
          <div className="mb-3 text-lg font-bold">Waste</div>
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <tbody>
              <tr className="font-heading">
                <th>Id</th>
                <th>Weight</th>
                <th>Sorted</th>
                <th>Creator</th>
                <th></th>
              </tr>
              <tr className="text-center">
                <td className="py-6">1</td>
                <td>100</td>
                <td>100</td>
                <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
                <td>
                  <button
                    onClick={() => setMstate1(true)}
                    className={` ${cn(buttonVariants())} `}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
              <tr className="text-center">
                <td className="py-6">1</td>
                <td>100</td>
                <td>100</td>
                <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
                <td>
                  <button
                    onClick={() => setMstate(true)}
                    className={` ${cn(buttonVariants())} `}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}
      {state === "3" ? (
        <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
          <div className="mb-3 text-lg font-bold">Tree Planting</div>
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <tbody>
              <tr className="font-heading">
                <th>Id</th>
                <th>Number of Trees</th>
                <th>Locations Doc Link</th>
                <th>Creator</th>
                <th></th>
              </tr>
              <tr className="text-center">
                <td className="py-6">1</td>
                <td>100</td>
                <td>100</td>
                <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
                <td>
                  <button
                    onClick={() => setMstate2(true)}
                    className={` ${cn(buttonVariants())} `}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
              <tr className="text-center">
                <td className="py-6">1</td>
                <td>100</td>
                <td>100</td>
                <td>0x1443498Ef86df975D8A2b0B6a315fB9f49978998</td>
                <td>
                  <button
                    onClick={() => setMstate(true)}
                    className={` ${cn(buttonVariants())} `}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}

      {mstate ? (
        <div
          style={{ background: "black" }}
          className="w-1/2 mx-auto px-10 py-10 rounded-md modal"
        >
          <div onClick={() => setMstate(false)} className="close">
            Close
          </div>
          <input
            type="text"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            )}
            placeholder="Enter Score"
            ref={scoreRef}
          />

          <div className="flex w-full justify-between">
            <button
              onClick={() => approveAction(id, scoreRef.current.value)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Approve
            </button>
            <button
              onClick={() => rejectAction(1)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}

      {mstate1 ? (
        <div
          style={{ background: "black" }}
          className="w-1/2 mx-auto px-10 py-10 rounded-md modal"
        >
          <div onClick={() => setMstate1(false)} className="close">
            Close
          </div>
          <input
            type="text"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            )}
            placeholder="Enter Score"
            ref={scoreRef}
          />

          <div className="flex w-full justify-between">
            <button
              onClick={() => approveWaste(1, scoreRef.current.value)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Approve
            </button>
            <button
              onClick={() => rejectWaste(1)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}

      {mstate2 ? (
        <div
          style={{ background: "black" }}
          className="w-1/2 mx-auto px-10 py-10 rounded-md modal"
        >
          <div onClick={() => setMstate2(false)} className="close">
            Close
          </div>
          <input
            type="text"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            )}
            placeholder="Enter Score"
            ref={scoreRef}
          />

          <div className="flex w-full justify-between">
            <button
              onClick={() => approveTree(1, scoreRef.current.value)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Approve
            </button>
            <button
              onClick={() => rejectTree(1)}
              className={` ${cn(buttonVariants())} mt-3 `}
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
