import { fetcher } from "@/lib/fetcher";
import { InputText } from "primereact/inputtext";
import useSWR, { useSWRConfig } from "swr";
import { LoadingPage } from "../Loading/LoadingPage";
import { useState } from "react";

export const Profile = ({ uid, onNoChange, onEditFail, onEditSuccess }) => {
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    `/api/users/${uid}/profile`,
    fetcher
  );

  const [userData, setUserData] = useState({
    username: data?.username,
    email: data?.email,
    fullname: data?.fullname,
  });

  const onProfileChange = async () => {
    if (userData.email === "" || userData.fullname === "") {
      onEditFail("Email or fullname cannot be empty");
      return;
    }

    if (data.email !== userData.email || data.fullname !== userData.fullname) {
      const res = await fetch(`/api/users/${uid}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newData: userData,
        }),
      });

      if (!res.ok) {
        onEditFail("Failed to edit profile");
      }
      mutate(`/api/users/${uid}/profile`);
      onEditSuccess("Profile updated");
    } else {
      onNoChange("please check your inputs");
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (error) {
    return (
      <div className="col-span-3 p-2 px-6 border border-blue-800 rounded-lg">
        <div className="text-4xl font-bold tracking-wide">Profile</div>
        <div className="text-xl font-bold text-red-500">
          Failed to load user profile
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-3 p-2 px-6 border border-blue-800 rounded-lg">
      <div className="text-4xl font-bold tracking-wide">Profile</div>
      <div className="mt-5">
        <div className="text-lg font-semibold">Username</div>
        <InputText
          type="text"
          disabled
          value={data.username}
          readOnly
          className="p-2 text-lg min-w-[50%] border border-gray-600 rounded-lg cursor-not-allowed"
        />
      </div>{" "}
      <div className="mt-5">
        <div className="text-lg font-semibold">E-Mail</div>
        <InputText
          type="text"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          value={userData.email || data.email}
          className="p-2 text-lg min-w-[50%] border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mt-5">
        <div className="text-lg font-semibold">Fullname</div>
        <InputText
          type="text"
          onChange={(e) =>
            setUserData({ ...userData, fullname: e.target.value })
          }
          value={userData.fullname || data.fullname}
          className="p-2 text-lg min-w-[50%] border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onProfileChange(userData)}
          className={`px-4 py-2 mt-5 font-semibold text-white transition-all duration-500 rounded-lg bg-blue-600`}
        >
          Save
        </button>
      </div>
    </div>
  );
};
