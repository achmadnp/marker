import { deleteField } from "@/api-lib/db/table/fields";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts).delete(async (req, res) => {
  // LOGGING rework API to contain userId,(problematic)
  // need rework
  const deleted = await deleteField({
    tableId: req.query.tableId,
    fieldId: req.query.fieldId,
  });
  if (deleted.length != 0) {
    return res.status(200).json(deleted);
  } else {
    const err = "data does not exists or access not allowed";
    return res.status(400).json({
      operation: "DELETE",
      status: "failed",
      message: `operation failed: ${err}`,
    });
  }
});
