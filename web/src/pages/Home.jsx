import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { getAccount } from "../context/metamask/actions";
import { useMetamask } from "../context/metamask/metamask";
import { shortenAccount } from "../utils/short-account";

export default function Home() {
  const { state, dispatch } = useMetamask();
  const [message, setMessage] = useState("default message");

  useEffect(() => {
    if (!state.contracts.hello) return;

    async function getMessage() {
      const msg = await state.contracts.hello.getMessage();
      setMessage(msg);
    }

    getMessage();
  }, [state.contracts.hello]);

  async function setMessageBlockchain() {
    const signer = await state.contracts.hello.connect(state.signer);
    await signer.setMessage(faker.random.words(5));
  }

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {state.account && (
          <>
            <h1 className="text-xl text-teal-600">
              Account: {shortenAccount(state.account)}
            </h1>
            <h1 className="text-2xl text-sky-600">
              Contract Message: {message}
            </h1>

            <button
              className="p-3 bg-emerald-600 rounded-lg"
              onClick={() => setMessageBlockchain()}
            >
              Mudar
            </button>
          </>
        )}
        {!state.account && (
          <button
            className="p-3 bg-red-400 rounded-lg"
            onClick={() => getAccount(dispatch, state.provider)}
          >
            login with Metamask
          </button>
        )}
      </div>
    </div>
  );
}