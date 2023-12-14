import {
  getActivityUsers,
  pullActivityUser,
  updateMemberRole,
} from "@/api-lib/db/activity/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const users = await getActivityUsers({
      activity: req.query.id,
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
    try {
      const updateRole = await updateMemberRole({
        activity: req.query.id,
        userId: req.body.userId,
        executor: req.body.executor,
        role: req.body.role,
      });

      if (updateRole instanceof Error) {
        throw updateRole;
      }
      return res.status(200).json(updateRole);
    } catch (error) {
      return res.status(409).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    const removeUser = await pullActivityUser({
      activity: req.query.id,
      username: req.body.username,
      executor: req.body.executor,
    });

    if (removeUser) {
      return res.status(200).json(removeUser);
    } else {
      return res.status(409).json({ message: "Error: Conflict" });
    }
  });
