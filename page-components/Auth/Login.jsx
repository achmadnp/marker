import { ErrorToast, LoadingToast } from "@/components/Toast/Toast";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import Router, { useRouter } from "next/router";

export const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [unameErr, setunameErr] = useState(null);
  const [passErr, setPassErr] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (props?.session) {
      router.push(`/`);
    }
  }, [props?.session, router]);

  const signInUser = async (e) => {
    e.preventDefault();
    toast((e) => <LoadingToast />);

    let options = { redirect: false, username, password };

    if (username.length < 4) {
      setunameErr("invalid username");

      toast.remove();
      toast.error("Username length must be longer than 4 characters", {
        style: { border: "1px solid red", padding: "16px", color: "#ff9966" },
      });
      return;
    }

    if (password.length < 6) {
      setPassErr("invalid password");
      // set error
      toast.remove();
      toast.error("Password length must be longer than 6 characters", {
        style: { border: "1px solid red", padding: "16px", color: "#ff9966" },
      });
      return;
    }

    const res = await signIn("credentials", options);

    if (res?.error) {
      toast.remove();
      toast((e) => {
        console.log(e);
        return <ErrorToast text={res.error} />;
      });
      return;
    }

    toast.remove();
    toast.success(`Auth Success, redirecting...`, {
      style: { border: "1px solid green", padding: "16px", color: "#09ff00" },
      duration: 1000,
    });

    setTimeout(() => {
      Router.push("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen mx-auto bg-[url('/imgs/assets/login.jpeg')] bg-cover bg-center">
      <div className="w-full max-w-md px-8 py-4 m-auto border-2 rounded-lg shadow-2xl bg-slate-900/50 md:px-16 md:py-16 shadow-white border-slate-200">
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
          <h1 className="inline-block text-2xl font-semibold tracking-widest text-transparent border-b-2 select-none bg-clip-text bg-gradient-to-r from-fuchsia-100 to-fuchsia-500">
            Login
          </h1>
        </div>

        <div className="relative z-0 ">
          <div className="my-2">
            <label className="font-medium leading-none text-slate-50">
              Username
            </label>
            <input
              aria-label="enter email adress"
              role="input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              onFocus={(e) => {
                setunameErr(null);
              }}
              type="text"
              className={` ${
                unameErr ? "border-red-500" : "border-white"
              } w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded text-slate-100 bg-slate-900/60`}
            />
            {unameErr && (
              <div className="text-sm font-semibold tracking-wide text-red-500">
                {unameErr}
              </div>
            )}
          </div>
          <div className="mb-2">
            <label className="font-medium leading-none text-slate-50">
              Password
            </label>
            <input
              aria-label="enter email adress"
              role="input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className={`${
                passErr ? "border-red-500" : "border-white"
              } w-full py-3 pl-3 mt-2 text-sm font-medium leading-none duration-500 bg-gray-200 border-b rounded bg-slate-900/60 text-slate-100`}
            />
            {passErr && (
              <div className="text-sm font-semibold tracking-wide text-red-500">
                {passErr}
              </div>
            )}
          </div>

          <div>
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-200">
              <Link
                href="/faq"
                className="mx-1 text-base text-blue-600 hover:underline dark:text-blue-500"
              >
                I forgot my credentials
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <button
            role="button"
            aria-label="create my account"
            className="w-full py-4 text-sm font-semibold leading-none text-white border rounded bg-indigo-700/40 hover:bg-indigo-600"
            onClick={signInUser}
          >
            Login
          </button>
        </div>
        <div>
          <h2>
            Don&apos;t have an account?{" "}
            <span className="text-lg font-semibold transition-all duration-100 border-b border-white hover:text-transparent hover:border-fuchsia-400 hover:bg-gradient-to-r hover:from-fuchsia-200 hover:to-fuchsia-600 hover:bg-clip-text">
              <Link href="/register" className="tracking-wide">
                Register Now!
              </Link>
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};
