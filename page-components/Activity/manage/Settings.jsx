export const Settings = ({ data, onDelete, onInactive, onTransfer }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-y-5">
      <div className="flex flex-row justify-between w-full">
        <div>
          <p className="text-lg font-semibold">Delete this Activity</p>
          <p>
            Once you delete an activity, there is no going back. Please be
            certain.
          </p>
        </div>
        <button className="min-w-[150px] p-1 font-semibold duration-150 border border-red-500 rounded-md hover:text-red-800 hover:bg-red-300 hover:scale-105">
          Delete Activity
        </button>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div>
          <p className="text-lg font-semibold">Set to Inactive</p>
          <p>This activity is currently active.</p>
        </div>
        <button className="min-w-[150px] p-1 font-semibold duration-150 border border-red-500 rounded-md hover:text-red-800 hover:bg-red-300 hover:scale-105">
          Set inactivity
        </button>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div>
          <p className="text-lg font-semibold">Transfer ownership</p>
          <p>Transfer this activity to another user</p>
        </div>
        <button className="min-w-[150px] p-1 font-semibold duration-150 border border-red-500 rounded-md hover:text-red-800 hover:bg-red-300 hover:scale-105">
          Transfer
        </button>
      </div>
    </div>
  );
};
