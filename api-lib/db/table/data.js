"use server";
import dbConnect from "@/api-lib/mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import Data from "@/lib/model/Data/DataModel";

// TO data
export async function getTableData({ limit = 50, activityId }) {
  await dbConnect();

  const activity = await TableSchema.findOne({ _id: activityId }).populate({
    path: "data",
    model: Data,
    options: { path: "data", limit: limit },
  });

  if (!activity.data) {
    return null;
  }

  return activity.data;
}

// TO data
export async function getActivityDetail({ limit = 50, activityId }) {
  await dbConnect();

  const activity = await TableSchema.findOne({ _id: activityId }).populate({
    path: "data",
    model: Data,
    options: { path: "data", limit: limit },
  });

  if (!activity) {
    return null;
  }

  return activity;
}
