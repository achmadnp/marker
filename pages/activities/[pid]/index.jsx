import { getSession } from "next-auth/react";
import { TableRenderer } from "@/page-components/Table/TableRenderer";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { NotePopup } from "@/page-components/Home/section/NoteSection";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";

const ActivityTable = ({ session }) => {
  const router = useRouter();
  const { pid: actId } = router.query;

  // useswr
  const { data, error, isLoading } = useSWR(
    `/api/activity/${actId}/overview`,
    fetcher
  );

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex min-h-screen mx-auto mt-0 flex-nowrap">
      <Sidebar isOpen={false} />
      <div className="w-full">
        <NotePopup />
        <div className="container flex justify-between w-full text-5xl">
          <div className="font-bold underline ">{data.name}</div>

          {/* <button className="px-2 py-1 text-2xl no-underline bg-blue-200 rounded-lg group hover:text-blue-200 hover:bg-blue-500">
            <i className="mx-1 mb-2 border rounded animate-blink pi pi-plus border-slate-600 group-hover:animate-none" />
            Invite to Collaborate
          </button> */}
        </div>
        <div className="container mt-2">
          <p className="text-sm italic">{data.description}</p>
          <p className="text-sm italic">owner: {data.owner}</p>
          <p className="text-sm italic">date created: {data.createdAt}</p>
        </div>

        <TableRenderer activityId={actId} session={session} />
      </div>
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
