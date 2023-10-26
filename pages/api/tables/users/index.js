import { getActivityUsers, pushActivityUser } from "@/api-lib/db/activity";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const users = await getActivityUsers({
      activity: "64f63fbc2dcbb4e3ad750230",
    });

    if (users) {
      return res.status(200).json(users);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {
    const assignedUser = await pushActivityUser({
      activityId: req.body.activityId,
      userId: req.body.userId,
    });
  })
  .put(async (req, res) => {});
