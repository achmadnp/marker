import { deleteRowData, editRowData } from "@/api-lib/db/activity/data";
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
    const editCell = await editRowData({
      actId: req.query.id,
      rowData: req.body.rowData,
      user: req.body.userId,
    });

    if (editCell) {
      return res.status(204).end();
    } else {
      return res.status(401).json({ message: "Error: Failed to edit Data" });
    }
  })
  .patch(async (req, res) => {})
  .delete(async (req, res) => {
    // perform checks to see if user is allowed to delete data
    const deleteRow = await deleteRowData({
      tableId: req.query.id,
      rowId: req.query.rowdataId,
    });
    if (deleteRow.length != 0) {
      return res.status(200).json(deleteRow);
    } else {
      return res.status(401).json({ message: "Error: Failed to delete Data" });
    }
  });
