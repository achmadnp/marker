import {
  createColumn,
  deleteField,
  editHeader,
  getTableFields,
} from "@/api-lib/db/table/fields";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const fields = await getTableFields(req.query.fieldId);
    if (fields) {
      return res.status(200).json(fields);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {
    const created = await createColumn({
      tableId: req.query.fieldId,
      fields: req.body.fields,
      user: req.body.userId,
    });

    if (created.length != 0) {
      return res.status(201).json({
        operation: "POST",
        createdData: created,
        status: "success",
        message: `field ${created.colField._id} has been created`,
      });
    } else {
      const err = "data does not exists or access not allowed";
      return res.status(400).json({
        operation: "POST",
        status: "failed",
        message: `operation failed: ${err}`,
      });
    }
  })
  .put(async (req, res) => {
    const updated = await editHeader({
      fieldId: req.body.fieldId,
      hname: req.body.fieldName,
      user: req.body.userId,
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
    // LOGGING rework API to contain userId,(problematic)
    // need rework
    const deleted = await deleteField({
      tableId: `64f63fbc2dcbb4e3ad750230`,
      fieldId: req.query.fieldId,
    });
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
