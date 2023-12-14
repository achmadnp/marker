import { createNewRowdata } from "@/api-lib/db/activity/data";
import { getTableData } from "@/api-lib/db/table/data";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getTableData({ limit: 20, activityId: req.query.id });

    if (data) {
      return res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {
    const created = await createNewRowdata({
      tableId: req.query.id,
      columnKeys: req.body.fields,
      user: req.body.userId,
    });
    if (created) {
      return res.status(200).json(created);
    } else {
      return res.status(401).json({ message: "Error: Failed to create Data" });
    }
  });
