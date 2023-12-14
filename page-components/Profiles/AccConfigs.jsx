import { InputText } from "primereact/inputtext";
import { useState } from "react";

export const Security = ({ uid, onPwdFail, onPwdSuccess }) => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const onChangeSubmit = async () => {
    const res = await fetch(`/api/users/${uid}/sec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cPwd: passwords.current,
        nPwd: passwords.new,
        nPwdMatch: passwords.confirm,
      }),
    });

    if (!res.ok) {
      const jsonData = await res.json();
      onPwdFail(jsonData.message);
    } else {
      onPwdSuccess("Password changed");
    }
  };

  return (
    <div className="col-span-3 p-2 px-6 border border-blue-800 rounded-lg">
      <div className="text-4xl font-bold tracking-wide">Change Password</div>
      <div className="mt-5">
        <div className="text-lg font-semibold">Current Password</div>
        <InputText
          type="password"
          value={passwords.current}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChangeSubmit();
            }
          }}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
          className="p-2 text-lg min-w-[50%] border border-gray-300 rounded-lg"
        />
        <div className="py-8">
          <div className="text-lg font-semibold">New Password</div>
          <InputText
            type="password"
            value={passwords.new}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChangeSubmit();
              }
            }}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            className="p-2 text-lg min-w-[50%] border border-gray-300 rounded-lg"
          />
          <div className="mt-4 text-lg font-semibold">Confirm New Password</div>
          <InputText
            type="password"
            value={passwords.confirm}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChangeSubmit();
              }
            }}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            className="p-2 text-lg min-w-[50%] border border-gray-300 rounded-lg"
          />
          <div className="flex justify-end">
            <button
              onClick={onChangeSubmit}
              className="px-4 py-2 mt-5 font-semibold text-white transition-all duration-500 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
