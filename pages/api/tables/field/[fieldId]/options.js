import { modifySelectCellOption } from "@/api-lib/db/fields";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {})
  .put(async (req, res) => {
    // maybe switch case to other opt?

    const insert = await modifySelectCellOption(
      req.query.fieldId,
      req.body.optValue,
      req.body.optColor,
      req.body.operation
    );

    if (insert) {
      return res.status(200).json(insert);
    } else {
      return res.status(400).json({ message: "Error" });
    }
  })
  .post(async (req, res) => {})
  .delete(async (req, res) => {
    // delete one option?????
  });
