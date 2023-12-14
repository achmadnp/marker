import { DateConverter } from "@/lib/util/DTConverter";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Router from "next/router";

export const ProjectOverview = ({ data, uid }) => {
  return (
    <div className="m-8">
      <div className="p-4 text-2xl font-semibold rounded-lg from-green-700 text-slate-200 via-transparent to-transparent bg-gradient-to-r">
        Project Overview
      </div>
      {!data && (
        <div className="m-4 text-xl text-center font-extralight">
          You currently have no active project.
        </div>
      )}
      {data && data.length > 0 && (
        <table className="w-full my-12 text-sm text-gray-500 rounded-lg dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Activity Name
              </th>
              <th scope="col" className="px-6 py-3">
                Owner
              </th>
              <th scope="col" className="px-6 py-3">
                Last Update
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>

            {/* <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Action</div>
              </th> */}
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={i}
                onClick={() =>
                  Router.push(`${Router.asPath}activities/${d._id}`)
                }
                className="text-center bg-gray-800 border-b border-gray-700 hover:cursor-pointer hover:bg-gray-600 hover:text-blue-100"
              >
                <td className="px-6 py-4">{d.name}</td>
                <td className="px-6 py-4">
                  {d.owner === uid ? "You are the owner" : d.owner}
                </td>
                <td className="px-6 py-4">
                  {d.updatedAt && DateConverter(new Date(d.updatedAt))}
                </td>
                <td className="px-6 py-4 space-x-10">
                  <button
                    onClick={() =>
                      Router.push(`${Router.asPath}activities/${d._id}`)
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
            href={"activities"}
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
