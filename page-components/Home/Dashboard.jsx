import { fetcher } from "@/lib/fetcher";
import { LatestLogs } from "./section/LatestLogs";
import { NotePopup } from "./section/NoteSection";
import { ProjectOverview } from "./section/ProjectOverview";
import useSWR from "swr";

export const Dashboard = (props) => {
  // current organization
  // orga name
  // orga member
  // total project

  const session = props.session;

  const {
    data: projectData,
    error,
    isLoading,
  } = useSWR(`/api/users/${session.userId}/activities/overview`, fetcher);

  const logs = [
    {
      text: "Violets are blue",
      link: "link",
    },
    {
      text: "Violets are blue",
      link: "link",
    },
    {
      text: "Violets are blue",
      link: "link",
    },
  ];

  return (
    <div className="w-full">
      <NotePopup />
      <ProjectOverview
        data={projectData && projectData.activities}
        uid={session.userId}
      />
      <LatestLogs latestLogs={logs} />
    </div>
  );
};
