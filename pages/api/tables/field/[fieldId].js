import { deleteField, editHeader } from "@/api-lib/db/tables";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {
    const updated = await editHeader({
      fieldId: req.body.fieldId,
      hname: req.body.fieldName,
    });

    if (updated.length != 0) {
      return res.status(200).json({
        operation: "PUT",
        affectedData: updated.length,
        status: "success",
        message: "",
      });
    } else {
      const err = "data does not exists or access not allowed";
      return res.status(400).json({
        operation: "PUT",
        status: "failed",
        message: `operation failed: ${err}`,
      });
    }
  })
  .delete(async (req, res) => {
    const deleted = await deleteField({ fieldId: req.query.fieldId });
    console.log(`deleted, ${deleted}`);
    if (deleted.length != 0) {
      return res.status(200).json({
        operation: "DELETE",
        affectedData: deleted.length,
        status: "success",
        message: `${deleted.length} data has been removed`,
      });
    } else {
      const err = "data does not exists or access not allowed";
      return res.status(400).json({
        operation: "DELETE",
        status: "failed",
        message: `operation failed: ${err}`,
      });
    }
  });
