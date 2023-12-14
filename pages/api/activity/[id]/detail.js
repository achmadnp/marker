import { getActivityDetail } from "@/api-lib/db/table/data";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getActivityDetail({
      limit: 20,
      activityId: req.query.id,
    });

    if (data) {
      return res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {});
