import { addLog } from "@/api-lib/db/log";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    res.status(404).json({ message: "unimplemented route" });
  })

  .post(async (req, res) => {
    const { actId, userId, dataId, operation } = req.body;
    const log = await addLog({
      actId,
      user: userId,
      data: dataId,
      operation: operation,
    });

    if (log) {
      return res.status(200);
    } else {
      return res.status(400);
    }
  });
