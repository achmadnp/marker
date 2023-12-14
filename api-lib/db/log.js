import dbConnect from "../mongodb";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";

export async function addLog({ actId, user, data, operation }) {
  await dbConnect();

  try {
    const createLog = await new ActivityLog({
      activity: actId,
      user: user,
      data: data,
      operation: operation,
      datetime: Date.now(),
    }).save();

    if (createLog) {
      return {
        createLog,
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
