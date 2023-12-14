import { DateConverter, TimeConverter } from "@/lib/util/DTConverter";

export const ActivitiyLogs = ({ data }) => {
  const formatString = (str, replacements) => {
    let parts = [];
    let index = 0;
    // Replace placeholders in the string
    for (const [key, value] of Object.entries(replacements)) {
      const startIndex = str.indexOf(`%${key}%`, index);
      const endIndex = startIndex + key.length + 2;

      // Add the part before the placeholder
      parts.push(str.substring(index, startIndex));

      // Add the bold part
      parts.push(
        <span key={key} className="font-semibold">
          {value}
        </span>
      );

      // Update the index for the next iteration
      index = endIndex;
    }

    // Add the remaining part of the string
    parts.push(str.substring(index));

    return parts;
  };
  return (
    <div>
      <ul>
        {data.map((log, i) => (
          <li
            key={i}
            className="p-1 mb-1 border rounded hover:bg-slate-100 border-slate-300"
          >
            <p className="text-xs">Log id: {log._id}</p>
            <p>
              ({DateConverter(new Date(log.datetime))}{" "}
              {TimeConverter(new Date(log.datetime))}){" "}
              {formatString(log.operation, {
                user: log.user?.username,
                activity: log.activity?.name,
              })}
              .
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
