import dbConnect from "../mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import TableField from "@/lib/model/Tables/TableFieldSchema";
import Data from "@/lib/model/Data/DataModel";
import TaskTable from "@/lib/model/Tables/TaskTableModel";
import mongoose from "mongoose";

// To table/expanded
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

// To table/expanded (existed)
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

// To table/expanded
export async function assignExpanded({ dataId }) {
  await dbConnect();
  let taskTableId;
  const tasktable = await new TaskTable({
    tablefields: [],
    tasks: [],
  }).save();

  taskTableId = new mongoose.Types.ObjectId(tasktable._id);

  const data = await Data.findOneAndUpdate(
    { _id: dataId },
    { $set: { expanded: true, taskRef: taskTableId } },
    { new: true }
  );

  return data;
}
