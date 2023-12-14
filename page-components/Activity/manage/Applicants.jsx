/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export const Applicants = ({ data, onAccept, onDecline }) => {
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-end flex-nowrap gap-x-5">
        <Button
          className="bg-green-500 border-0"
          onClick={() => onAccept(rowData)}
          type="button"
          icon="pi pi-check"
          rounded
        ></Button>
        <Button
          className="bg-red-500 border-0"
          onClick={() => onDecline(rowData)}
          type="button"
          icon="pi pi-times"
          rounded
        ></Button>
      </div>
    );
  };

  return (
    <DataTable stripedRows value={data}>
      <Column field="username" header="username"></Column>
      <Column field="fullname" header="Full Name"></Column>
      <Column body={actionBodyTemplate}></Column>
    </DataTable>
  );
};
