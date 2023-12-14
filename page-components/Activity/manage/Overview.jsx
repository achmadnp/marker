import { DateConverter, TimeConverter } from "@/lib/util/DTConverter";
import { editActivity } from "@/lib/util/functions/activity/manage";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

export const ActOverview = ({ data, session }) => {
  const currentUser = session.userId;
  const toast = useRef(null);
  const nameRef = useRef();
  const joinCodeRef = useRef();
  const descRef = useRef();

  const [disabled, setDisabled] = useState({
    name: true,
    joinCode: true,
    desc: true,
  });

  const [activity, setActivity] = useState({
    name: data.name,
    joinCode: data.joincode,
    desc: data.description,
  });

  const onChangeSubmit = async ({ name, joinCode, desc } = newData) => {
    const res = await editActivity({
      name: name,
      joincode: joinCode,
      description: desc,
      id: data._id,
      userId: currentUser,
    });
    if (res.ok) {
      setDisabled({
        name: true,
        joinCode: true,
        desc: true,
      });
      toast.current.show({
        severity: "success",
        summary: `Sucess`,
        detail: "Header has been updated",
        life: 3000,
      });
    }
  };

  return (
    <div>
      {/* overview (name, desc, joinCode, status, createdAt,
       latestUpdated, total Activities, total users) */}
      <Toast ref={toast} />
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="actName">Activity Name</label>
          <div className="flex">
            <InputText
              disabled={disabled.name}
              ref={nameRef}
              value={activity.name}
              onChange={(e) => {
                setActivity({ ...activity, name: e.target.value });
              }}
              className="max-w-md border-0 border-b-2 border-black rounded-none focus:border-b-0"
              id="actName"
            />
            <Button
              type="button"
              size="small"
              icon="pi pi-pencil"
              rounded
              onClick={() => {
                setDisabled({ ...disabled, name: false });
                setTimeout(() => {
                  nameRef.current.focus();
                }, 100);
              }}
              className="text-blue-600 bg-transparent border-0 w-max h-max"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="actJoinCode">Activity JoinCode</label>
          <div className="flex">
            <InputText
              disabled={disabled.joinCode}
              onChange={(e) => {
                setActivity({ ...activity, joinCode: e.target.value });
              }}
              ref={joinCodeRef}
              value={activity.joinCode}
              className="max-w-lg border-0 border-b-2 border-black rounded-none focus:border-b-0"
              id="actJoinCode"
            />
            <Button
              type="button"
              size="small"
              icon="pi pi-pencil"
              rounded
              onClick={() => {
                setDisabled({ ...disabled, joinCode: false });
                setTimeout(() => {
                  joinCodeRef.current.focus();
                }, 100);
              }}
              className="text-blue-600 bg-transparent border-0 w-max h-max"
            />
          </div>
          <small id="username-help">
            Join code is used to apply to join the activity.
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="actDesc">Activity Description</label>
        <div className="grid grid-cols-8">
          <InputTextarea
            readOnly={disabled.desc}
            value={activity.desc}
            ref={descRef}
            onChange={(e) => {
              setActivity({ ...activity, desc: e.target.value });
            }}
            className="col-span-7 border-0 border-b-2 border-black rounded-none focus:border-b-0"
            id="actDesc"
          />
          <Button
            type="button"
            size="small"
            icon="pi pi-pencil"
            rounded
            onClick={() => {
              setDisabled({ ...disabled, desc: false });
              setTimeout(() => {
                descRef.current.focus();
              }, 100);
            }}
            className="col-span-1 text-blue-600 bg-transparent border-0 w-max h-max"
          />
        </div>
      </div>
      <div className="grid grid-cols-5 mt-8 gap-x-4 place-items-center ">
        <div className="flex flex-col w-full h-full gap-2 border border-black rounded-lg place-items-center">
          <label htmlFor="username" className="font-semibold">
            Date Created
          </label>
          <p>{DateConverter(new Date(data.createdAt))}</p>
        </div>
        <div className="flex flex-col w-full h-full gap-2 border border-black rounded-lg place-items-center">
          <label htmlFor="username" className="font-semibold">
            Last Update At
          </label>
          <p className="-mb-3">{DateConverter(new Date(data.updatedAt))}</p>
          <p>{TimeConverter(new Date(data.updatedAt))}</p>
        </div>
        <div className="flex flex-col w-full h-full gap-2 border border-black rounded-lg place-items-center">
          <label htmlFor="username" className="font-semibold">
            Total Activities
          </label>
          <p>{data.data?.length}</p>
        </div>
        <div className="flex flex-col w-full h-full gap-2 border border-black rounded-lg place-items-center">
          <label htmlFor="username" className="font-semibold">
            Total Users
          </label>
          <p>{data.users?.length || "UNKNOWN"} Users</p>
        </div>
        <div className="flex flex-col w-full h-full gap-2 border border-black rounded-lg place-items-center">
          <label htmlFor="username" className="font-semibold">
            Current Applicants
          </label>
          <p>{data.applicants?.length}</p>
        </div>
      </div>
      <div className="flex flex-row-reverse mt-5">
        <Button className="" onClick={() => onChangeSubmit(activity)}>
          Save
        </Button>
      </div>
    </div>
  );
};
