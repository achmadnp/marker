import { useState } from "react";

const { Button } = require("primereact/button");
const { Dialog } = require("primereact/dialog");
const { Dropdown } = require("primereact/dropdown");
const { InputText } = require("primereact/inputtext");
const { Tooltip } = require("primereact/tooltip");

export const NewColumnEditor = ({ open = true, onClose, onSubmit }) => {
  const [newColumn, setNewColumn] = useState({
    headerName: "",
    columnName: "",
    columnType: null,
  });
  const options = [
    {
      label: "Text",
      value: "base",
    },
    {
      label: "Date Picker",
      value: "datepick",
    },
    {
      label: "Date Range picker",
      value: "daterange",
    },
    {
      label: "Single person",
      value: "singleUser",
    },
    {
      label: "Multiple person",
      value: "multipleAsignee",
    },
    {
      label: "Select Cell / Dropdown",
      value: "select",
    },
    {
      label: "Progression",
      value: "progress",
    },
  ];

  const handleSubmit = () => {
    onSubmit({
      fields: newColumn,
    });
  };

  const footer = (
    <div className="justify-between space-x-10">
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleSubmit}
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
    <Dialog
      className="min-w-[1000px]"
      header="New Column"
      visible={open}
      modal
      footer={footer}
      onHide={onClose}
      dismissableMask
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <span className="font-bold">Header Name</span>
          <InputText
            onChange={(e) =>
              setNewColumn((prev) => ({ ...prev, headerName: e.target.value }))
            }
            className="p-2 text-lg border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Column Type</span>
          <Dropdown
            value={newColumn.columnType}
            onChange={(e) =>
              setNewColumn((prev) => ({ ...prev, columnType: e.value }))
            }
            options={options}
            optionLabel="label"
            placeholder="Select a Column Type"
            className="border border-gray-300 rounded-lg"
          />
        </div>
        <Tooltip target=".tooltipCName" position="top" autoHide={true}>
          {" "}
          <div className="text-lg">
            This is filled with dataKey. Please don&apos;t use spaces.
          </div>
          <div className="italic">
            E.g. Header Name:{" "}
            <span className="text-red-500 underline">Project Name</span>. this
            form can be filled with{" "}
            <span className="text-red-500 underline">pName</span>
          </div>
        </Tooltip>

        <div className="flex flex-col tooltipCName">
          <span className="font-bold">Column Name</span>
          <InputText
            type="text"
            className="p-2 text-lg border border-gray-300 rounded-lg"
            tooltipOptions={{ position: "top" }}
            onChange={(e) =>
              setNewColumn((prev) => ({ ...prev, columnName: e.target.value }))
            }
          />
        </div>
      </div>
    </Dialog>
  );
};
