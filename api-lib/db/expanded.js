import dbConnect from "../mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import TableField from "@/lib/model/Tables/TableFieldSchema";
import Data from "@/lib/model/Data/DataModel";

export async function getExpandedFields({ tableId }) {
  await dbConnect();

  const data = await TableSchema.findById(tableId).populate({
    path: "tablefields",
    model: TableField,
    options: { path: "tablefields" },
  });

  if (!data) {
    return "undefined";
  }

  return data;
}

export async function getExpandedData({ tableId, limit = 50 }) {
  await dbConnect();

  const data = await TableSchema.findById(tableId).populate({
    path: "data",
    model: Data,
    options: { path: "data" },
  });

  if (!data) {
    return "undefined";
  }

  return data;
}
