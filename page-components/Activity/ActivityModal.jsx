import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

export const NewActivityModal = ({ open = false, onClose, onSubmit }) => {
  const [newActivity, setNewActivity] = useState({
    activityName: "",
    activityDescription: "",
    activityJoinCode: null,
  });

  const handleSubmit = () => {
    onSubmit(newActivity);
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
      header="Create New Activity"
      visible={open}
      modal
      onHide={onClose}
      footer={footer}
      dismissableMask
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <span className="font-bold">Activity Name</span>
          <InputText
            onChange={(e) =>
              setNewActivity((prev) => ({
                ...prev,
                activityName: e.target.value,
              }))
            }
            className="p-2 text-lg border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Activity Description</span>
          <InputText
            onChange={(e) =>
              setNewActivity((prev) => ({
                ...prev,
                activityDescription: e.target.value,
              }))
            }
            className="p-2 text-lg border border-gray-300 rounded-lg"
          />
        </div>

        <Tooltip target=".tooltipCName" position="top" autoHide={true}>
          {" "}
          <div className="text-lg">This is your current Join code.</div>
          <div className="italic">
            With this code you can invite your friends to join your activity.
          </div>
        </Tooltip>

        <div className="flex flex-col tooltipCName">
          <span className="font-bold">Activity Join Code</span>
          <InputText
            type="text"
            className="p-2 text-lg border border-gray-300 rounded-lg"
            tooltipOptions={{ position: "top" }}
            onChange={(e) =>
              setNewActivity((prev) => ({
                ...prev,
                activityJoinCode: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </Dialog>
  );
};

export const JoinActivityModal = ({ open = false, onClose, onSubmit }) => {
  const [activityJoinCode, setactivityJoinCode] = useState(null);

  const handleSubmit = () => {
    onSubmit(activityJoinCode);
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
      header="Create New Activity"
      visible={open}
      modal
      onHide={onClose}
      footer={footer}
      dismissableMask
    >
      <div className="flex flex-col space-y-4">
        <Tooltip target=".tooltipCName" position="top" autoHide={true}>
          <div className="text-lg">Code to join an existing Activity.</div>
          <div className="italic">
            This code is provided by the owner of the Activity.
          </div>
        </Tooltip>

        <div className="flex flex-col tooltipCName">
          <span className="font-bold">Activity Join Code</span>
          <InputText
            type="text"
            className="p-2 text-lg border border-gray-300 rounded-lg"
            tooltipOptions={{ position: "top" }}
            onChange={(e) =>
              setactivityJoinCode((prev) => ({
                ...prev,
                activityJoinCode: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </Dialog>
  );
};
