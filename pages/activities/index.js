import { getSession } from "next-auth/react";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { NotePopup } from "@/page-components/Home/section/NoteSection";
import { Activity } from "@/page-components/Activity/Activity";
import {
  NewActivityModal,
  JoinActivityModal,
} from "@/page-components/Activity/ActivityModal";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { createNewActivity } from "@/lib/util/functions/activity/activity";
import { fetcher } from "@/lib/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";
import Link from "next/link";

const ActivityTable = ({ session }) => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const toast = useRef(null);
  const { mutate } = useSWRConfig();

  const {
    data: activityData,
    error: activityError,
    isLoading: loadingActivity,
  } = useSWR(`/api/users/${session.userId}/activities`, fetcher);

  if (loadingActivity) {
    return <LoadingPage />;
  }

  const handleCreateActivity = async (data) => {
    setNewDialogOpen(false);
    const res = await createNewActivity(data, session.userId);

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "New Activity Created",
        life: 1000,
      });
      mutate(`/api/users/${session.userId}/activities`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create new activity",
        life: 1000,
      });
    }
  };

  const handleJoinActivity = async (data) => {
    const res = await fetch(`/api/activity/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.userId,
        joinCode: data.activityJoinCode,
      }),
    });

    if (!res.ok) {
      const resJson = await res.json();
      setJoinDialogOpen(false);
      if (res.status === 409) {
        toast.current.show({
          severity: "error",
          summary: "Failed to join activity",
          detail: resJson.message,
          life: 2000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed to join activity",
          detail: resJson.message,
          life: 2000,
        });
      }
    }

    setJoinDialogOpen(false);
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex min-h-screen mx-auto mt-0 flex-nowrap">
        <Sidebar isOpen={false} />
        <div className="w-full">
          <NotePopup />
          <div className="flex justify-end p-4 mx-12 text-2xl gap-x-6">
            <button
              onClick={() => setNewDialogOpen(true)}
              className="p-2 bg-blue-200 border rounded-lg hover:bg-blue-300"
            >
              <div className="text-2xl">
                <span className="mx-4 pi pi-plus"></span>Create Activity
              </div>
            </button>
            <button
              onClick={() => setJoinDialogOpen(true)}
              className="p-2 bg-blue-200 border rounded-lg hover:bg-blue-300"
            >
              <div className="text-2xl">
                <span className="mx-4 pi pi-plus"></span>Join Activity
              </div>
            </button>
          </div>
          {activityData && <Activity activities={activityData.activities} />}
          {activityData && (
            <div>
              <div className="flex justify-center w-full mx-auto text-lg">
                Looking to join an Activity?
              </div>
              <div className="flex justify-center w-full mx-auto text-lg">
                <button
                  onClick={() => setJoinDialogOpen(true)}
                  href={"/"}
                  className="mx-2 text-blue-400 hover:underline"
                >
                  Join Activity
                </button>
              </div>
            </div>
          )}
          {!activityData && (
            <div>
              <div className="flex justify-center w-full mx-auto text-lg">
                You currently do not have any activity.{" "}
              </div>
              <div className="flex justify-center w-full mx-auto text-lg">
                {" "}
                <button
                  onClick={() => setNewDialogOpen(true)}
                  className="mx-2 text-blue-400 hover:underline"
                >
                  Create Now
                </button>
                or{" "}
                <button
                  onClick={() => setJoinDialogOpen(true)}
                  className="mx-2 text-blue-400 hover:underline"
                >
                  Join Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <NewActivityModal
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onSubmit={handleCreateActivity}
      />
      <JoinActivityModal
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        onSubmit={handleJoinActivity}
      />
    </div>
  );
};

export default ActivityTable;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // session checks
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
