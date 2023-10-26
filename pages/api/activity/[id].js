import { deleteRowData, editRowData } from "@/api-lib/db/activity";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {})
  .post(async (req, res) => {
    // const assigned = await createExpanded({
    //   pid: req.body.pid,
    // });
    // if (assigned.length != 0) {
    //   return res.status(201).json(assigned);
    // } else {
    //   const err = "data does not exists or access not allowed";
    //   return res.status(400).json({
    //     operation: "POST",
    //     status: "failed",
    //     message: `operation failed: ${err}`,
    //   });
    // }
  })
  .put(async (req, res) => {
    const editCell = await editRowData({
      tableId: "64f63fbc2dcbb4e3ad750230",
      rowData: req.body.rowData,
    });

    if (editCell) {
      return res.status(204).end();
    } else {
      return res.status(401).json({ message: "Error: Failed to edit Data" });
    }
  })
  .patch(async (req, res) => {})
  .delete(async (req, res) => {
    const deleteRow = await deleteRowData({
      tableId: `64f63fbc2dcbb4e3ad750230`,
      rowId: req.query.id,
    });
    if (deleteRow.length != 0) {
      return res.status(200).json(deleteRow);
    } else {
      return res.status(401).json({ message: "Error: Failed to delete Data" });
    }
  });
