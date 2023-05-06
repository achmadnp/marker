import { Login } from "@/page-components/Auth/Login";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

export default function Home(props) {
  useEffect(() => {
    if (!props?.session) {
      Router.push("/login");
    }
  }, [props?.session]);

  return (
    <div className="flex min-h-screen flex-nowrap">
      <Sidebar />
      <div className="w-full">CONTENT</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
