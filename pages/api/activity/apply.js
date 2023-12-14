import { applyToActivity } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    // get application list
  })
  .post(async (req, res) => {
    // apply to activity
    const apply = await applyToActivity(req.body.userId, req.body.joinCode);

    if (apply.notExist) {
      return res.status(404).json({ message: apply.message });
    }

    if (apply.inside) {
      return res.status(409).json({ message: apply.message });
    }

    if (apply.applied) {
      return res.status(409).json({ message: apply.message });
    }

    if (apply.invited) {
      return res.status(409).json({ message: apply.message });
    }

    return res.status(200).json(apply);
  });
