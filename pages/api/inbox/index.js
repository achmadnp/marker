import { createActivity } from "@/api-lib/db/activity/updates";
import { getUserActivity } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts).get(async (req, res) => {
  const inbox = await getUserActivity(userId);

  if (inbox instanceof Error) {
    return res.status(404).json({ message: "Error: data empty or not found" });
  } else {
    return res.status(200).json(inbox);
  }
});
