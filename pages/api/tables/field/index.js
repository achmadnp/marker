import {
  createColumn,
  emptyFieldData,
  getTableFields,
} from "@/api-lib/db/tables";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const fields = await getTableFields();
    if (fields) {
      return res.status(200).json({
        operation: "GET",
        status: "success",
        message: "fields has been successfully fetched",
        fields: fields,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
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
    const empty = await emptyFieldData({ fieldId: req.body.fieldId });
    console.log(`deleted, ${empty}`);
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
