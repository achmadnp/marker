"use server";
import dbConnect from "@/api-lib/mongodb";
import Data from "@/lib/model/Data/DataModel";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import Users from "@/lib/model/UserModel";
import mongoose from "mongoose";

export async function createNewRowdata({ tableId, columnKeys, user }) {
  await dbConnect();
  let dataId;

  const newData = {};
  columnKeys.forEach((key) => {
    newData[key] = null;
  });

  try {
    const dataInsert = await new Data(newData).save();

    dataId = dataInsert._id;
    const table = await TableSchema.findOneAndUpdate(
      { _id: tableId },
      { $push: { data: dataId } },
      { upsert: false }
    );
    if (table) {
      await new ActivityLog({
        activity: table._id,
        user: user,
        data: dataInsert._id,
        operation:
          "user %user% created new rowdata %data% on activity %activity%",
        datetime: Date.now(),
      }).save();
      return {
        table,
      };
    } else {
      throw new Error("Error: 86674");
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export async function deleteRowData({ tableId, rowId }) {
  await dbConnect();
  let dataId;

  try {
    const rowDelete = await Data.findOneAndDelete({ _id: rowId });
    dataId = rowDelete._id;
    const table = await TableSchema.findOneAndUpdate(
      { _id: tableId },
      { $pull: { data: dataId } },
      { upsert: false }
    );
    if (table && rowDelete) {
      return {
        table,
        rowDelete,
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

// TO updates
export async function createActivity(activity, userId) {
  await dbConnect();

  try {
    const create = await new TableSchema({
      name: activity.activityName,
      description: activity.activityDescription,
      tablefields: [],
      data: [],
      users: [new mongoose.Types.ObjectId(userId)],
      joincode: activity.activityJoinCode,
      owner: new mongoose.Types.ObjectId(userId),
    }).save();

    const activityToUser = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          activities: create._id,
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (!create) {
      throw new Error("Error: failed to create activity");
    }
    if (!activityToUser) {
      throw new Error("Error: failed to assign activity to user");
    }

    await new ActivityLog({
      activity: create._id,
      user: userId,
      operation: "user %user% created activity %activity%",
      datetime: Date.now(),
    }).save();
    return { create, activityToUser };
  } catch (error) {
    return new Error(error);
  }
}

// TO data
export async function editRowData({ actId, rowData, user }) {
  await dbConnect();

  try {
    const rowEdit = await Data.findOneAndUpdate(
      { _id: rowData._id },
      { $set: rowData },
      { upsert: false }
    );

    if (rowEdit) {
      await new ActivityLog({
        activity: actId,
        user: user,
        data: rowEdit._id,
        operation: "user %user% editted rowdata %data% on activity %activity%",
        datetime: Date.now(),
      }).save();

      return {
        rowEdit,
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
