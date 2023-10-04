import { deleteField, editHeader } from "@/api-lib/db/tables";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .post(async (req, res) => {
    const created = await createColumn({
      tableId: "64f63fbc2dcbb4e3ad750230",
      fields: req.body.fields,
    });

    if (created.length != 0) {
      return res.status(201).json({
        operation: "POST",
        createdData: created,
        status: "success",
        message: `${created.length} data has been created`,
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
