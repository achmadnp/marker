import { ErrorToast } from "@/components/Toast/Toast";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";

export const NotePopup = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      className={
        enabled ? "m-8 mx-auto max-w-7xl duration-300" : "hidden duration-300"
      }
    >
      <div className="flex items-center justify-between w-full p-4 space-x-4 bg-gray-200 border-2 border-white divide-gray-200 rounded-lg">
        <div className="pl-4 text-lg font-semibold tracking-wide text-slate-500">
          This is currently beta version.
        </div>
        <button onClick={() => setEnabled(false)} className="">
          <AiOutlineCloseCircle className="inline w-8 h-8 mr-2 text-gray-200 dark:text-gray-600 fill-red-700" />
        </button>
      </div>
    </div>
  );
};
