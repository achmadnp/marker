import { Dashboard } from "@/page-components/Home/Dashboard";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";

export default function Home(props) {
  return (
    <div className="flex min-h-screen flex-nowrap">
      <Sidebar />
      <Dashboard session={props.session} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // session checks
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
