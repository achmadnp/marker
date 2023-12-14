import {
  editActivityOverview,
  getActivityOverview,
} from "@/api-lib/db/activity/detail";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getActivityOverview(req.query.id);

    if (data) {
      return res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {
    const edit = await editActivityOverview(req.query.id, req.body);

    if (edit) {
      return res.status(200).json(edit);
    } else {
      return res.status(409).json({ message: "Error: data not updated" });
    }
  })
  .put(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {});
