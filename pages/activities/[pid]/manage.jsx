// participants
// logs

import { isActivityMaintainer } from "@/api-lib/db/activity/detail";
import { fetcher } from "@/lib/fetcher";
import {
  acceptApplicant,
  rejectApplicant,
} from "@/lib/util/functions/activity/manage";
import { Applicants } from "@/page-components/Activity/manage/Applicants";
import { ActOverview } from "@/page-components/Activity/manage/Overview";
import { Settings } from "@/page-components/Activity/manage/Settings";
import { ActivitiyLogs } from "@/page-components/Activity/manage/logs";
import { ErrorSection } from "@/page-components/Error/ErrorSection";
import { Unauthorized } from "@/page-components/Error/Unauthorized";
import { NotePopup } from "@/page-components/Home/section/NoteSection";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import { Participants } from "page-components/Activity/manage/Participants";
import { Badge } from "primereact/badge";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import useSWR, { mutate } from "swr";

const Manage = ({ pid, isMaintainer, session }) => {
  const currUser = session.userId;
  const toast = useRef(null);
  const {
    data: actData,
    error,
    isLoading,
  } = useSWR(`/api/activity/${pid}/detail`, fetcher);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(`/api/activity/${pid}/users`, fetcher);

  const {
    data: applicantData,
    error: applicantError,
    isLoading: applicantLoading,
  } = useSWR(`/api/activity/${pid}/applicants`, fetcher);

  const {
    data: inviteeData,
    error: inviteeError,
    isLoading: inviteLoading,
  } = useSWR(`/api/activity/${pid}/invite`, fetcher);

  const {
    data: logsData,
    error: logsError,
    isLoading: logsLoading,
  } = useSWR(`/api/activity/${pid}/logs`, fetcher);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorSection />;
  }

  if (!isMaintainer) {
    return <Unauthorized />;
  }

  const panelClassName = (parent, index) => {
    if (parent.state.activeIndex === index) return "text-blue-400";
    return "text-violet-400";
  };

  const applicantPanel = (options) => {
    return (
      <div
        onClick={options.onClick}
        className="flex items-center w-full h-full px-3 my-auto text-lg cursor-pointer"
      >
        {options.titleElement}
        {applicantData && applicantData.length > 0 && (
          <Badge
            className="mb-2 -mt-2 -ml-1 text-red-600 bg-transparent animate-blink"
            value={applicantData.length}
            severity="info"
          />
        )}
      </div>
    );
  };

  const handleAcceptApplicant = async (data) => {
    const res = await acceptApplicant({
      actId: pid,
      applicantId: data._id,
      userId: currUser,
    });
    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Applicant accepted",
        life: 1300,
      });
      mutate(`/api/activity/${pid}/applicants`);
      mutate(`/api/activity/${pid}/users`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to perform action",
        life: 100,
      });
    }
  };

  const handleDeclineApplicant = async (data) => {
    const res = await rejectApplicant({
      actId: pid,
      applicantId: data._id,
      executor: currUser,
    });
    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Applicant accepted",
        life: 1300,
      });
      mutate(`/api/activity/${pid}/applicants`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to perform action",
        life: 100,
      });
    }
  };

  const inviteUser = async (data) => {
    const res = await fetch(`/api/activity/${pid}/invite`, {
      method: "POST",
      body: JSON.stringify({
        username: data,
        executorId: currUser,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `User ${data} invited`,
        life: 1300,
      });
      mutate(`/api/activity/${pid}/invite`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to invite user",
        life: 1000,
      });
    }
  };

  const cancelInvite = async (data) => {
    const res = await fetch(`/api/activity/${pid}/invite`, {
      method: "PUT",
      body: JSON.stringify({
        username: data,
        executorId: currUser,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `User ${data} removed from invitation list`,
        life: 1300,
      });
      mutate(`/api/activity/${pid}/invite`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to remove invited user",
        life: 1000,
      });
    }
  };

  const removeUser = async (data) => {
    const res = await fetch(`/api/activity/${pid}/users`, {
      method: "PUT",
      body: JSON.stringify({
        username: data?.username,
        executor: currUser,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `User ${data?.username} has been removed`,
        life: 1300,
      });
      mutate(`/api/activity/${pid}/users`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to remove user",
        life: 1000,
      });
    }
  };

  const handleRoleChange = async (value, data) => {
    const res = await fetch(`/api/activity/${pid}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data?._id,
        executor: currUser,
        role: value.label?.toLowerCase(),
      }),
    });

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `User ${data._username}'s role has been updated`,
        life: 2000,
      });
      mutate(`/api/activity/${pid}/detail`);
      mutate(`/api/activity/${pid}/users`);
      mutate(`/api/activity/${pid}/logs`);
    } else {
      const resJson = await res.json();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: resJson.message,
        life: 2000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex min-h-screen mx-auto mt-0 flex-nowrap">
        <Sidebar isOpen={false} />
        <div className="container justify-center w-full mx-auto">
          <NotePopup />
          <TabView>
            <TabPanel header="Overview">
              <ActOverview data={actData} session={session} />
            </TabPanel>
            <TabPanel header="Participants">
              {userData && actData && (
                <Participants
                  data={userData}
                  actData={actData}
                  invitee={inviteeData}
                  onInvite={inviteUser}
                  onInviteCancel={cancelInvite}
                  onRemove={removeUser}
                  onRoleChange={handleRoleChange}
                />
              )}
            </TabPanel>
            <TabPanel
              header="Applicants"
              headerTemplate={applicantPanel}
              pt={{
                headerTitle: ({ parent }) => ({
                  className: panelClassName(parent, 2),
                }),
              }}
            >
              {applicantData && (
                <Applicants
                  data={applicantData}
                  onAccept={handleAcceptApplicant}
                  onDecline={handleDeclineApplicant}
                />
              )}
            </TabPanel>
            <TabPanel header="Logs">
              {logsData && <ActivitiyLogs data={logsData} />}
              {!logsData && (
                <div>
                  <p>No logs found</p>
                  <p className="text-sm">
                    This should not be happening, contact admin for support
                  </p>
                </div>
              )}
            </TabPanel>
            <TabPanel pt={{ headerTitle: "text-red-600" }} header="Settings">
              <Settings data={actData} />
            </TabPanel>
          </TabView>
          {/* TABS
                - overview (name, desc, joinCode, status, createdAt, latestUpdated, total Activities, total users)
                - users
                - logs
                - delete activity*/}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { pid } = context.query;

  // session checks
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  //   check if user is the owner of the activity
  const isMaintainer = await isActivityMaintainer(pid, session.userId);

  return {
    props: {
      pid: pid,
      isMaintainer,
      session,
    },
  };
}

export default Manage;
