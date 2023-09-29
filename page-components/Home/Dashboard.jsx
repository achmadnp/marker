import { LatestLogs } from "./section/LatestLogs";
import { NotePopup } from "./section/NoteSection";
import { ProjectOverview } from "./section/ProjectOverview";

export const Dashboard = (props) => {
  // current organization
  // orga name
  // orga member
  // total project

  const data = props.data;
  const fields = props.fields;

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
      <ProjectOverview data={data} fields={fields} />
      <LatestLogs latestLogs={logs} />
    </div>
  );
};
