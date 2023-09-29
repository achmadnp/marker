import { BasicModal } from "@/components/Modal/Modal";
import { usernameGenerator } from "@/lib/util/unameGen";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiRefresh } from "react-icons/bi";

export const Register = (props) => {
  const [step, setStep] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(null);

  const [passFocus, setPassFocus] = useState(false);
  const [passError, setPassError] = useState(null);

  const [FNErr, setFnErr] = useState(null);

  const [confirmPassError, setConfirmPassError] = useState(null);

  const [registerData, setRegisterData] = useState(null);

  const signupUser = async (e) => {
    e.preventDefault();

    if (
      email.length < 10 ||
      password.length < 6 ||
      confirmPassword.length < 6 ||
      fullName.length < 4
    ) {
      toast.remove();
      toast.error("Some data does not meet the requirements", {
        style: { border: "1px solid red", padding: "16px", color: "#e90404" },
      });
      return;
    }

    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName, username }),
    });

    let data = await res.json();

    if (data.err) {
      toast.remove();
      toast.error("Register failed: " + data.message, {
        style: { border: "1px solid red", padding: "16px", color: "#e90404" },
      });
      return;
    }

    setShowModal(true);

    if (data.message) {
      setRegisterData(data);
      toast.success("Register success");
      setMessage(data.message);
    }
  };

  const regenerateUName = () => {
    if (username == "" || fullName == "") {
      setFnErr("Please fill in your fullname");
      return;
    }
    setUsername(usernameGenerator(fullName));
  };

  const checkPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPassError("password doesnt match each other");
      setPassError("password doesnt match each other");
    }
  };

  return (
    <div className="flex min-h-screen mx-auto bg-[url('/imgs/assets/login.jpeg')] bg-cover bg-center">
      <div className="w-full max-w-lg min-h-[660px] sm:min-h-[800px] px-8 py-4 m-auto border-2 rounded-lg shadow-2xl bg-slate-900/50 md:px-16 md:py-16 shadow-white border-slate-200">
        <div className="grid grid-cols-1 place-content-center">
          <Image
            width={480}
            height={80}
            className="mx-auto pointer-events-none select-none rounded-3xl"
            src="/imgs/assets/logo.png"
            alt="Logo"
          />
        </div>
        <div className="text-center">
          <h1 className="inline-block text-2xl font-semibold tracking-widest text-transparent bg-white border-b-2 select-none bg-clip-text">
            Register
          </h1>
        </div>

        <ol className="flex items-center my-4 text-sm font-medium text-center text-gray-500 w-fit dark:text-gray-400 sm:text-base">
          <li
            className={`${
              step === 0 ? "text-orange-500" : "text-slate-200"
            } flex md:w-full font-semibold  items-center  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
          >
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="mr-2">1</span>Account
              <span className="hidden sm:inline-flex sm:ml-2">Info</span>
            </span>
          </li>
          <li
            className={`${
              step === 1 ? "text-orange-500" : "text-slate-200"
            } flex md:w-full font-semibold items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
          >
            <span className="flex items-center sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="mr-2">2</span>
              Personal
              <span className="hidden sm:inline-flex sm:ml-2">Info</span>
            </span>
          </li>
        </ol>

        {step === 0 && (
          <div className="relative z-0 ">
            <div className="my-2">
              <label className="font-medium leading-none text-slate-50">
                E-mail
              </label>
              <input
                aria-label="enter email adress"
                role="input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded text-slate-100 bg-slate-900/60 "
              />
            </div>
            <div className="mb-2">
              <label className="font-medium leading-none text-slate-50">
                Password
              </label>
              <input
                aria-label="enter email adress"
                role="input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onFocus={(e) => {
                  setPassError(null);
                  setPassFocus(true);
                }}
                onBlur={(e) => {
                  setPassFocus(false);
                }}
                className="w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded bg-slate-900/60 text-slate-100"
              />
              {passError && (
                <div className="text-sm font-semibold tracking-wide text-red-500">
                  {passError}
                </div>
              )}
              {passFocus && (
                <div className="mt-1 text-xs font-semibold tracking-wide sm:text-sm text-slate-300">
                  password needs to be at least 6 characters long
                </div>
              )}
            </div>
            <div className="mb-2">
              <label className="font-medium leading-none text-slate-50">
                Confirm Password
              </label>
              <input
                aria-label="enter email adress"
                role="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onFocus={(e) => {
                  setConfirmPassError(null);
                }}
                onBlur={(e) => {
                  checkPassword();
                }}
                className="w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded bg-slate-900/60 text-slate-100"
              />
              {confirmPassError && (
                <div className="text-sm font-semibold tracking-wide text-red-500">
                  {confirmPassError}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="relative z-0 ">
            <div className="my-2">
              <label className="font-medium leading-none text-slate-50">
                Fullname
              </label>
              <input
                role="input"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                onFocus={(e) => {
                  setFnErr(null);
                }}
                onBlur={(e) => {
                  if (username == "" && fullName !== "") {
                    setUsername(usernameGenerator(fullName));
                  }
                }}
                className="w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded text-slate-100 bg-slate-900/60 "
              />
              {FNErr && (
                <div className="text-sm font-semibold tracking-wide text-red-500">
                  {FNErr}
                </div>
              )}
            </div>
            <div className="mb-2">
              <label className="font-medium leading-none text-slate-50">
                Username
              </label>

              <div className="relative flex items-center ">
                <button
                  className="absolute right-5 focus:outline-none"
                  onClick={regenerateUName}
                >
                  <BiRefresh size={"20px"} />
                </button>

                <input
                  role="input"
                  type="text"
                  disabled
                  value={username}
                  className="block w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded hover:cursor-not-allowed bg-slate-900/60 text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 mb-4">
          {step === 0 && (
            <div className="flex justify-end">
              <button
                role="button"
                aria-label="create my account"
                className="px-8 py-4 text-sm font-semibold leading-none text-white border rounded bg-indigo-700/40 hover:bg-indigo-600"
                onClick={() => {
                  setStep(1);
                }}
              >
                Next
              </button>
            </div>
          )}
          {step === 1 && (
            <div className="flex justify-between">
              <button
                role="button"
                aria-label="create my account"
                className="px-8 py-4 text-sm font-semibold leading-none text-white border rounded bg-red-500/40 hover:bg-red-600"
                onClick={() => {
                  setStep(0);
                }}
              >
                Back
              </button>

              <button
                role="button"
                aria-label="create my account"
                className="px-8 py-4 text-sm font-semibold leading-none text-white border rounded bg-indigo-700/40 hover:bg-indigo-600"
                onClick={signupUser}
              >
                Register
              </button>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-[1rem] text-white font-thin">
            already have an account?
            <span className="ml-2 font-semibold transition-all duration-100 border-b border-white hover:text-transparent hover:border-fuchsia-400 hover:bg-gradient-to-r hover:from-fuchsia-200 hover:to-fuchsia-600 hover:bg-clip-text">
              <Link href={"/login"} className="tracking-wide">
                Login
              </Link>
            </span>
          </h2>
        </div>
      </div>

      <BasicModal
        shown={showModal}
        header={"Register success"}
        close={() => setShowModal(false)}
        status={"success"}
      >
        <div className="mt-4 text-center text-slate-700">
          Registration completed successfully.
          <div>Your Username is:</div>
          <div className="my-2 text-lg font-semibold">
            {registerData?.uname}
          </div>
          <div>You need this information to login.</div>
          <div className="mt-4 ">
            <Link
              className="p-2 text-lg font-semibold text-green-500 border-2 border-green-300 rounded-lg"
              href="/login"
            >
              Login Now
            </Link>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};
