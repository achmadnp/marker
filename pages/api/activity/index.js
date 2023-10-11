import { getTableData } from "@/api-lib/db/tables";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts).get(async (req, res) => {
  const data = await getTableData({ limit: 20 });

  if (data) {
    return res.status(200).json({
      operation: "GET",
      status: "success",
      message: "data has been successfully fetched",
      data: data,
    });
  } else {
    return res.status(400).json({ message: "Error: data empty or not found" });
  }
});
