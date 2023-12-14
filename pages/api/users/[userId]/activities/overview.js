import { getUserActivity } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getUserActivity(req.query.userId, 4);

    if (data) {
      return res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ message: "Error: data empty or not found" });
    }
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {});
