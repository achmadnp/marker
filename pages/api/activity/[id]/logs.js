import { getActivityLog } from "@/api-lib/db/activity/log";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts).get(async (req, res) => {
  const actLog = await getActivityLog({
    limit: 20,
    activityId: req.query.id,
    page: 1,
    itemsPerPage: 25,
  });

  if (actLog) {
    return res.status(200).json(actLog);
  } else {
    return res.status(400).json({ message: "Error: data empty or not found" });
  }
});
