import { emptyFieldData } from "@/api-lib/db/table/fields";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .post(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .put(async (req, res) => {
    // LOGGING
    const empty = await emptyFieldData({ fieldId: req.body.fieldId });
    if (empty.length != 0) {
      return res.status(200).json({
        operation: "PUT",
        affectedData: empty.length,
        status: "success",
        message: `${empty.length} data has been removed`,
      });
    } else {
      const err = "data does not exists or process not allowed";
      return res.status(400).json({
        operation: "PUT",
        status: "failed",
        message: `operation failed: ${err}`,
      });
    }
  });
