import { fetcher } from "@/lib/fetcher";
import { NotePopup } from "@/page-components/Home/section/NoteSection";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import useSWR, { useSWRConfig } from "swr";

// create in activity page -> tab to invitation

const InvitationList = ({ session }) => {
  const { mutate } = useSWRConfig();
  const toast = useRef(null);
  const uid = session.userId;

  const {
    data: invitationData,
    error: invitationError,
    isLoading: loadingInvitation,
  } = useSWR(`/api/users/${uid}/invitations`, fetcher);

  if (loadingInvitation) {
    return <LoadingPage />;
  }

  const onAccept = async (actId) => {
    const res = await fetch(`/api/users/${uid}/invitations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actId,
        isAccepting: true,
      }),
    });

    if (res.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Invitation accepted",
        life: 3000,
      });
      mutate(`/api/users/${uid}/invitations`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to perform action",
        life: 3000,
      });
    }
  };
  const onDecline = async (actId) => {
    const res = await fetch(`/api/users/${uid}/invitations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actId,
        isAccepting: false,
      }),
    });

    if (res.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Invitation declined",
        life: 3000,
      });
      mutate(`/api/users/${uid}/invitations`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to perform action",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex min-h-screen mx-auto mt-0 flex-nowrap">
        <Sidebar isOpen={false} />
        <div className="w-full">
          <NotePopup />
          <div className="container mx-24 text-lg font-bold underline">
            Current pending invitations
          </div>
          {invitationData.empty && (
            <div>
              <div className="flex justify-center w-full mx-auto text-lg">
                {invitationData.message}
              </div>
            </div>
          )}

          {!invitationData.empty && invitationData && (
            <Invitation
              invitations={invitationData}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          )}

          {invitationError && (
            <div>
              <div className="flex justify-center w-full mx-auto text-lg">
                Network Error
              </div>
              <div className="flex justify-center w-full mx-auto text-lg">
                Failed to retrive invitations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Invitation = ({ invitations, onAccept, onDecline }) => {
  return (
    <div className="container w-full col-span-1 text-5xl">
      {invitations.map((invitation, i) => (
        <div
          key={i}
          className="justify-between grid-cols-6 p-4 mx-12 my-4 text-2xl bg-transparent border rounded-lg md:grid glass-blue"
        >
          <div className="col-span-3 space-y-3 2xl:col-span-5">
            <p className="underline">{invitation.name}</p>
          </div>
          <div className="flex justify-end col-span-3 space-x-3 2xl:col-span-1 justify-items-end md:space-x-8">
            <button
              onClick={() => onAccept(invitation._id)}
              className="p-1 text-sm bg-green-400 rounded-md xl:text-lg 2xl:p-2 hover:underline"
            >
              Accept
            </button>
            <button
              onClick={() => onDecline(invitation._id)}
              className="p-1 text-sm bg-red-500 rounded-md 2xl:text-base 2xl:p-2 hover:underline"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default InvitationList;
