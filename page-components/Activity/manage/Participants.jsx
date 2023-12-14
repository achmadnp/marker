/* eslint-disable react-hooks/rules-of-hooks */
import { ButtonCell } from "@/components/Table/Cell";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export const Participants = ({
  data,
  actData,
  invitee,
  onRoleChange,
  onInvite,
  onRemove,
  onInviteCancel,
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [username, setUsername] = useState("");

  const dropwdownBodyTemplate = (rowData, onChange) => {
    const role = {
      label:
        rowData._id === actData.owner
          ? "Owner"
          : actData.maintainers?.includes(rowData._id)
          ? "Maintainer"
          : "Member",
    };

    const manageUserOpt = [
      { label: "Maintainer" },
      { label: "Member" },
      { label: "Owner" },
    ];

    return (
      <div
        className={`flex justify-start flex-nowrap gap-x-5 ${
          role.label === "Owner" ? "cursor-not-allowed" : ""
        }`}
      >
        <Dropdown
          className="w-full"
          value={role}
          disabled={role.label === "Owner"}
          onChange={(e) => {
            onRoleChange(e.value, rowData);
          }}
          options={manageUserOpt}
          optionLabel="label"
          placeholder="Select a Role"
        ></Dropdown>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-end flex-nowrap gap-x-5">
        <Button
          disabled={rowData._id === actData.owner}
          className={`bg-red-500 border-0`}
          onClick={() => {
            onRemove(rowData);
          }}
          type="button"
          icon="pi pi-trash"
          rounded
        ></Button>
      </div>
    );
  };

  const inviteBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-end flex-nowrap gap-x-5">
        <Button
          className="bg-red-500 border-0"
          onClick={() => {
            onInviteCancel(rowData.username);
          }}
          type="button"
          icon="pi pi-times"
          rounded
        >
          <span className="ml-2">Cancel Invitation</span>
        </Button>
      </div>
    );
  };

  const handleInvite = () => {
    onInvite(username);
    setInviteDialogOpen(false);
    setUsername("");
  };

  const onClose = () => {
    setInviteDialogOpen(false);
  };

  const footer = (
    <div className="justify-between space-x-10">
      <Button
        label="Invite"
        icon="pi pi-check"
        onClick={handleInvite}
        autoFocus
        className="p-3 text-xl font-semibold transition-all duration-500 bg-green-400 rounded-lg hover:bg-green-500 hover:scale-105"
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onClose}
        className="p-3 text-xl font-semibold transition-all duration-500 bg-red-400 rounded-lg hover:bg-red-500 hover:scale-105"
      />
    </div>
  );
  return (
    <div>
      {" "}
      <DataTable stripedRows value={data}>
        <Column field="_id" header="UID"></Column>
        <Column field="fullname" header="Name"></Column>
        <Column
          field="Role"
          body={dropwdownBodyTemplate}
          header="Role"
        ></Column>
        <Column
          header={
            <ButtonCell
              cn={"p-2"}
              text={"+ Invite"}
              onClick={(e) => setInviteDialogOpen(true)}
            />
          }
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
      <div className="flex w-full pt-4 mt-4 mb-2 border-t-2 border-slate-400">
        <p className="mx-auto text-lg font-semibold">Pending Invites</p>
      </div>
      <DataTable stripedRows value={invitee}>
        <Column field="username" header="Username"></Column>
        <Column field="fullname" header="Name"></Column>
        <Column body={<p>Invited</p>} header="Status"></Column>
        <Column body={inviteBodyTemplate}></Column>
      </DataTable>
      <Dialog
        className="w-[50vw] mx-5"
        header="Invite Member"
        visible={inviteDialogOpen}
        modal
        footer={footer}
        onHide={onClose}
        dismissableMask
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <span className="font-bold">Username</span>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-lg border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
