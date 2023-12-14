import {
  cancelInvitation,
  getActivityInvitationList,
  inviteUser,
} from "@/api-lib/db/activity/detail";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    // get invitation list
    try {
      const invites = await getActivityInvitationList({
        activity: req.query.id,
      });
      if (invites instanceof Error) {
        throw invites;
      }

      return res.status(200).json(invites);
    } catch (error) {
      return res.status(409).json({ message: error });
    }
  })
  .post(async (req, res) => {
    // invite user to activity
    try {
      const invite = await inviteUser({
        activity: req.query.id,
        username: req.body.username,
        executor: req.body.executorId,
      });
      if (invite instanceof Error) {
        throw invite;
      }

      return res.status(200).json(invite);
    } catch (error) {
      return res.status(409).json({ message: error });
    }
  })
  .put(async (req, res) => {
    try {
      const cancel = await cancelInvitation({
        activity: req.query.id,
        username: req.body.username,
        executor: req.body.executorId,
      });

      if (cancel instanceof Error) {
        throw cancel;
      }
      return res.status(200).json(cancel);
    } catch (error) {
      return res.status(409).json(error);
    }
  });
