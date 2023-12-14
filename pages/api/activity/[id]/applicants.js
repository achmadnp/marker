import {
  declineApplicant,
  getActivityApplicants,
  moveApplicantToUser,
} from "@/api-lib/db/activity/detail";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const users = await getActivityApplicants({
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
    const moved = await moveApplicantToUser({
      activity: req.query.id,
      user: req.body.applicantId,
      executor: req.body.userId,
    });

    if (moved) {
      return res.status(200).json(moved);
    } else {
      return res.status(409).json({ message: "Error: Conflict" });
    }
  })
  .put(async (req, res) => {
    // LOGGING
    const declined = await declineApplicant({
      activity: req.query.id,
      user: req.body.applicantId,
      executor: req.body.executor,
    });

    if (declined) {
      return res.status(200).json(declined);
    } else {
      return res.status(409).json({ message: "Error: Conflict" });
    }
  });
