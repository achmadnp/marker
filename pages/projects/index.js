import {
  RangedDTCell,
  ExpandCell,
  DropdownCell,
  DTRangeCell,
  WithDropdown,
  AsigneeCell,
  ProgressCell,
} from "@/components/Table/Cells";

import { useCallback, useState } from "react";
import { Table, Button, IconButton, Placeholder, Modal } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import "rsuite/dist/rsuite.css";

import PlusIcon from "@rsuite/icons/Plus";
import ExpTable from "@/components/Table/Expanded/ExpTable";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import { getTableData, getTableFields } from "@/api-lib/db/tables";
import TableRenderer from "@/lib/util/tables/TableRenderer";

const ManagementTable = ({ data, fields }) => {
  return (
    <div className="min-h-screen mx-auto mt-0">
      <div>TEST123123</div>
      <TableRenderer data={data} fields={fields} />
    </div>
  );
};

export default ManagementTable;

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
  const data = await getTableData({ limit: 20 });

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
