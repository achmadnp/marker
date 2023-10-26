import { Dashboard } from "@/page-components/Home/Dashboard";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";

export default function Home(props) {
  const data = props.data;
  const fields = props.fields;
  return (
    <div className="flex min-h-screen flex-nowrap">
      <Sidebar />
      <Dashboard data={data} fields={fields} />
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
