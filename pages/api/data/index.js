import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    res.status(400).json({ message: "unimplemented route" });
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {
    res.status(404).json({ message: "unimplemented route" });
  })
  .delete(async (req, res) => {
    res.status(404).json({ message: "unimplemented route" });
  });
