import Link from "next/link";
import { List } from "rsuite";

export const LatestLogs = ({ latestLogs, max = 8 }) => {
  return (
    <div className="m-8">
      <div className="p-4 text-2xl font-semibold rounded-lg from-orange-700 text-slate-200 via-transparent to-transparent bg-gradient-to-r">
        logs
      </div>

      {!latestLogs ||
        (latestLogs.length < 0 && (
          <div className="m-4 text-xl text-center font-extralight">
            Logs are unavailable or empty
          </div>
        ))}

      {latestLogs && (
        <List hover>
          {latestLogs.map((log, i) => (
            <List.Item key={i}>
              <div className="flex justify-between max-w-7xl">
                <div>Roses are red</div>
                <Link
                  href={"#"}
                  className="font-semibold text-blue-500 underline"
                >
                  View
                </Link>
              </div>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
};
