import { LatestLogs } from "./section/LatestLogs";
import { NotePopup } from "./section/NoteSection";
import { ProjectOverview } from "./section/ProjectOverview";

export const Dashboard = (props) => {
  // current organization
  // orga name
  // orga member
  // total project

  const projects = [
    {
      pid: "pj-28",
      name: "pName123",
      memberCount: 3,
    },
    {
      pid: "pj-2123",
      name: "pName123",
      memberCount: 3,
    },
    {
      pid: "pj-2558",
      name: "pName123",
      memberCount: 3,
    },
  ];

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
      <ProjectOverview projects={projects} />
      <LatestLogs latestLogs={logs} />
    </div>
  );
};
