import { createActivity } from "@/api-lib/db/activity/updates";
import { getUserActivity } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getUserActivity(userId);

    if (data) {
      return res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {
    const activity = await createActivity(req.body.activity, req.body.userId);

    if (activity) {
      return res.status(200).json(activity);
    } else {
      return res
        .status(401)
        .json({ message: "Error: Failed to create Activity" });
    }
  })
  .put(async (req, res) => {});
