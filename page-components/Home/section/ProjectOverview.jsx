import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Router from "next/router";
import { AiOutlineTool } from "react-icons/ai";

export const ProjectOverview = ({ projects, max = 3 }) => {
  return (
    <div className="m-8">
      <div className="p-4 text-2xl font-semibold rounded-lg from-green-700 text-slate-200 via-transparent to-transparent bg-gradient-to-r">
        Project Overview
      </div>
      {!projects && (
        <div className="m-4 text-xl text-center font-extralight">
          You currently have no active project.
        </div>
      )}
      {projects && projects.length > 0 && (
        <table className="w-full my-12 text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Project Id
              </th>

              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Name</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Asignee</div>
              </th>

              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, max).map((project, i) => (
              <tr
                key={project.pid}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {project.pid}
                </th>

                <td className="px-6 py-4">{project.name}</td>
                <td className="px-6 py-4">{project.memberCount}</td>
                <td className="px-6 py-4 space-x-10">
                  <button
                    onClick={() =>
                      Router.push(`${Router.asPath}/projects/${project.pid}`)
                    }
                    className="font-semibold text-blue-500 underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex items-center justify-center w-full">
        <div className="z-10 h-full">
          <Link
            href={"projects"}
            className="inline-flex mb-3 text-lg font-bold text-center text-green-400 underline hover:underline sm:text-start sm:no-underline"
          >
            All Projects{" "}
            <span>
              <ArrowRightIcon className="w-7 h-7" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
