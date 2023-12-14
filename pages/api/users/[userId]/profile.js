import { changeUserDetail, getUserProfile } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const data = await getUserProfile(req.query.userId);

    if (data instanceof Error) {
      return res
        .status(404)
        .json({ message: "Error: data empty or not found" });
    } else {
      return res.status(200).json(data);
    }
  })
  .post(async (req, res) => {
    // edit userProfile
    const modifyUserDetail = await changeUserDetail(
      req.query.userId,
      req.body.newData
    );

    if (modifyUserDetail instanceof Error) {
      return res.status(406).json({ message: modifyUserDetail.message });
    } else {
      return res.status(200).json(modifyUserDetail);
    }
  })
  .put(async (req, res) => {
    // revoke all activities
  })
  .delete(async (req, res) => {});
