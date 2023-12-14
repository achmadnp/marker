import dbConnect from "@/api-lib/mongodb";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";

export async function getActivityLog({
  limit = 25,
  activityId,
  page = 1,
  itemsPerPage = 25,
}) {
  await dbConnect();
  try {
    const actLog = await ActivityLog.find({ activity: activityId })
      .populate("activity", "name")
      .populate("user", "username");

    if (actLog) {
      return actLog;
    } else {
      throw new Error("Error: failed to retrieve logging data");
    }
  } catch (error) {
    return error;
  }
}
