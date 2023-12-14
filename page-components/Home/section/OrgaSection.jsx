import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { AiOutlineTool } from "react-icons/ai";

export const OrgaSections = ({ orgsa, max = 3 }) => {
  let orgs = orgsa || [
    {
      name: "testOrg1",
      memberCnt: 8,
      projectCnt: 10,
    },
    {
      name: "testOrg1",
      memberCnt: 8,
      projectCnt: 10,
    },
    {
      name: "testOrg1",
      memberCnt: 8,
      projectCnt: 10,
    },
    {
      name: "testOrg1",
      memberCnt: 8,
      projectCnt: 10,
    },
  ];

  return (
    <div className="m-8">
      <div className="p-4 text-2xl font-semibold rounded-lg from-blue-700 text-slate-200 via-transparent to-transparent bg-gradient-to-r">
        Organisations
      </div>
      {orgs.length === 0 && (
        <div className="m-4 text-2xl text-center font-extralight">
          You currently don&apos;t have any organisation.
          <Link
            href={"/organization"}
            className="block m-2 text-base text-blue-500 hover:underline"
          >
            create or browse organisations
          </Link>
        </div>
      )}
      {orgs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.slice(0, max).map((org, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-full py-4"
            >
              <div className="relative flex flex-col justify-between w-full h-64 max-w-xl px-2 py-5 mb-6 bg-gray-800 border border-gray-400 rounded-lg sm:px-4 sm:max-w-md ">
                <div className="z-10 h-full">
                  <h4 className="mb-3 text-lg font-bold text-center underline sm:text-start sm:no-underline text-fuchsia-300">
                    {org.name}
                  </h4>
                  <p className="text-gray-100">
                    Total member : {org.memberCnt}
                  </p>
                  <p className="text-gray-100">
                    Total Project : {org.projectCnt}
                  </p>

                  <div className="flex my-4">
                    <Link href={"#"} className="">
                      <button className="dashboardbtn hover:text-transparent min-w-[8rem] bg-blue-600">
                        Manage
                        <AiOutlineTool className="dashboardSvg" />
                      </button>
                    </Link>
                  </div>
                  <div className="flex">
                    <Link href={"#"}>
                      <button className="dashboardbtn min-w-[8rem] bg-blue-600">
                        View Projects
                      </button>
                    </Link>
                  </div>
                </div>
                <span className="absolute right-0 z-0 w-24 h-12 md:w-40 bottom-14 md:h-28 opacity-70">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 1000 1000"
                    className="stroke-white fill-slate-500"
                  >
                    <g>
                      <path d="M61,990v-40.8H939V990H61 M694,928.7H591.9l-0.4-524.5l-122.1-88L183.5,438.8v490H61v-40.8h81.7V418.3l326.7-142.9l163.3,122.5v490H694V928.7z M243.9,502.3l143.8-63.5v81.7l-142.9,61.3L243.9,502.3L243.9,502.3z M387.7,622.5v81.7L244.8,745l-0.9-77.1L387.7,622.5z M244.8,826.7l142.9-40.8v102.1H244.8V826.7z M734.8,112.1v816.7H796V184.4L734.8,112.1z M469.4,377.5v551.2h61.2V418.3L469.4,377.5z M939,928.7H836.9V173.3L734.8,50.8L346.9,214.2v61.3L306,316.2V193.7L755.2,10l122.5,163.3v714.6H939V928.7z" />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {orgs && orgs.length > 0 && (
        <Link
          href={"/organization"}
          className="block text-base text-center text-blue-500 hover:underline"
        >
          create or browse organisations
        </Link>
      )}
      {orgs && orgs.length > max && (
        <div className="flex items-center justify-center w-full">
          <div className="z-10 h-full">
            <Link
              href={"#"}
              className="inline-flex mb-3 text-lg font-bold text-center text-orange-500 underline hover:underline sm:text-start sm:no-underline"
            >
              All My Organizations
              <span>
                <ArrowRightIcon className="w-7 h-7" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
