import Link from "next/link";
import { DateConverter } from "@/lib/util/DTConverter";

export const Activity = ({ activities }) => {
  return (
    <div className="container w-full col-span-1 text-5xl">
      {activities.map((activity, i) => (
        <div
          key={i}
          className="grid justify-between grid-cols-6 p-4 mx-12 my-4 text-2xl bg-transparent border rounded-lg glass-blue"
        >
          <div className="col-span-5 space-y-3">
            <Link href={`/activities/${activity._id}`} className="underline">
              {activity.name}
            </Link>
            <div className="text-sm -pt-2">{activity.description}</div>
            <div className="grid grid-cols-3 text-base">
              <div className="max-w-fit">
                Status:{" "}
                <span className="mx-1 text-xs text-green-500 pi pi-circle-fill animate-pulse"></span>
                Active
              </div>
              <div className="max-w-fit">
                Activities: {activity.data.length} Activities
              </div>
              <div className="max-w-fit">Owner: {activity.owner}</div>
              <div className="max-w-fit">
                Created At:{" "}
                {activity.createdAt &&
                  DateConverter(new Date(activity.createdAt))}
              </div>
            </div>
          </div>
          <div className="flex space-x-8">
            <Link
              href={`/activities/${activity._id}`}
              className="hover:text-blue-700 hover:underline"
            >
              View <span className="pi pi-eye" />
            </Link>
            <Link
              href={`activities/${activity._id}/manage`}
              className="hover:text-blue-700 hover:underline"
            >
              Manage <span className="pi pi-wrench" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
