import Link from "next/link";
import { AiOutlineTool, AiOutlineUserAdd } from "react-icons/ai";

export const OrgCard = ({ org, isHome, isManageAble }) => {
  return (
    <div className="min-h-[14rem] flex items-center justify-center w-full h-full">
      <div className="relative flex flex-col justify-between w-full h-full max-w-md px-4 py-5 bg-gray-800 border border-gray-400 rounded-lg ">
        <div className="z-10 h-full">
          <h4 className="mb-3 font-bold ">{org.name}</h4>
          <p className="text-gray-100">Total member : {org.member}</p>
          <p className="text-gray-100">Total Project : {org.project}</p>

          {isHome && (
            <div>
              {isManageAble && (
                <div className="my-4">
                  <Link href={"#"}>
                    <button className="dashboardbtn hover:text-transparent min-w-[8rem] bg-blue-600">
                      Manage
                      <AiOutlineTool className="dashboardSvg" />
                    </button>
                  </Link>
                </div>
              )}
              <div className={`${isManageAble ? "mt-1" : "mt-4"}`}>
                <Link href={"#"}>
                  <button className="dashboardbtn min-w-[8rem] bg-blue-600">
                    View Projects
                  </button>
                </Link>
              </div>
            </div>
          )}
          {!isHome && (
            <div className="my-4">
              <Link href={"#"}>
                <button className="dashboardbtn hover:text-transparent min-w-[8rem] bg-blue-600">
                  Apply
                  <AiOutlineUserAdd className="dashboardSvg" />
                </button>
              </Link>
            </div>
          )}
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
  );
};
