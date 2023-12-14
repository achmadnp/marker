import { getUserInvitations, onInvitationChange } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getUserInvitations(req.query.userId);

    if (data instanceof Error) {
      return res
        .status(404)
        .json({ message: "Error: data empty or not found" });
    } else {
      return res.status(200).json(data);
    }
  })
  .post(async (req, res) => {
    const modifyInvitation = await onInvitationChange(
      req.query.userId,
      req.body.actId,
      req.body.isAccepting
    );

    if (modifyInvitation instanceof Error) {
      return res.status(406).json({ message: "Error: failed to modify data" });
    } else {
      return res.status(200).json(modifyInvitation);
    }
  })
  .put(async (req, res) => {});
