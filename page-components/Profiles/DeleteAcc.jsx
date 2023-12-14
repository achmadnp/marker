export const DeleteSct = () => {
  // remove acc
  // remove created activities
  // pull all member from created activities
  const onDeleteAccount = async () => {};

  const onRemoveActivities = async () => {};

  return (
    <div className="col-span-3 p-2 px-6 border border-blue-800 rounded-lg">
      <div className="mb-8 text-4xl font-bold tracking-wide">
        Account Settings
      </div>
      <div className="flex flex-col items-center justify-center w-full space-y-7 ">
        <div className="flex flex-row justify-between w-full">
          <div>
            <p className="text-lg font-semibold">Delete Account</p>
            <p>
              Once you delete this account, there is no going back. Please be
              certain. Created account from this account will also be deleted
              and their members will be removed from this activities. all saved
              logs within this account remain saved. <br />
              <span className="italic text-red-500">
                This action is irreversible.
              </span>
            </p>
          </div>
          <button className="min-w-[150px] max-h-[70px] my-auto p-1 font-semibold duration-150 border border-red-500 rounded-md hover:text-red-800 hover:bg-red-300 hover:scale-105">
            Delete Account
          </button>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div>
            <p className="text-lg font-semibold">
              Remove all corresponding activity
            </p>
            <p>
              Remove all activities from this account. If this account created
              an activity, the activity will be removed and all members will be
              removed. <br />
              <span className="italic text-red-500">
                This action is irreversible.
              </span>
            </p>
          </div>
          <button className="min-w-[150px] max-h-[70px] my-auto p-1 font-semibold duration-150 border border-red-500 rounded-md hover:text-red-800 hover:bg-red-300 hover:scale-105">
            Remove activities
          </button>
        </div>
      </div>
    </div>
  );
};
