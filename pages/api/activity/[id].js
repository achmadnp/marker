import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {})
  .post(async (req, res) => {
    const assigned = await createExpanded({
      pid: req.body.pid,
    });

    if (assigned.length != 0) {
      return res.status(201).json({
        operation: "POST",
        createdData: assigned,
        status: "success",
        message: `${assigned.length} data has been assigned`,
      });
    } else {
      const err = "data does not exists or access not allowed";
      return res.status(400).json({
        operation: "POST",
        status: "failed",
        message: `operation failed: ${err}`,
      });
    }
  });
