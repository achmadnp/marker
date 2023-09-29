import { getTableData, getTableFields } from "@/api-lib/db/tables";
import { Dashboard } from "@/page-components/Home/Dashboard";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

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

  const fields = await getTableFields();
  const data = await getTableData({ limit: 3 });

  let tableData;
  let tableFields;

  fields.map((field) => {
    tableFields = field.tablefields;
  });

  data.map((data) => {
    tableData = data.data;
  });

  return {
    props: {
      session,
      fields: JSON.parse(JSON.stringify(tableFields)),
      data: JSON.parse(JSON.stringify(tableData)),
    },
  };
}
