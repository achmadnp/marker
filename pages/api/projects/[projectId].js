import { getExpandedData } from "@/api-lib/db/expanded";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const expandedData = await getExpandedData({ tableId: req.query.tableId });

    if (expandedData.length != 0) {
      return res.status(200).json({
        operation: "GET",
        status: "success",
        data: expandedData,
      });
    } else {
      return res.status(400).json({
        operation: "GET",
        status: "failed",
        message: "data does not exists or access not allowed",
      });
    }
  })
  .post(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .put(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .delete(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  });
