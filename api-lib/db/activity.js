"use server";
import dbConnect from "../mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import Data from "@/lib/model/Data/DataModel";
import Users from "@/lib/model/UserModel";
import mongoose from "mongoose";

export async function createNewRowdata({ tableId, columnKeys }) {
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

export async function editRowData({ rowData }) {
  await dbConnect();

  try {
    const rowEdit = await Data.findOneAndUpdate(
      { _id: rowData._id },
      { $set: rowData },
      { upsert: false }
    );
    if (rowEdit) {
      return {
        rowEdit,
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export async function getActivityUsers({ activity }) {
  await dbConnect();

  try {
    const table = await TableSchema.findOne({
      _id: activity,
    });
    const userIds = table.users;

    const users = await Users.find({
      _id: { $in: userIds },
    }).select(["username", "fullname"]);

    if (users) {
      return users;
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

export async function pushActivityUser({ activityId, userId }) {
  await dbConnect();

  try {
    const activityToUser = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          activities: mongoose.Types.ObjectId(activityId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const userToActivity = await TableSchema.findOneAndUpdate(
      { _id: activityId },
      {
        $push: {
          users: mongoose.Types.ObjectId(userId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (activityToUser && userToActivity) {
      return {
        activityToUser,
        userToActivity,
      };
    } else {
      throw new Error("Error: user or activity not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

export async function pullActivityUser({ activityId, userId }) {
  await dbConnect();

  try {
    const activityToUser = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          activities: mongoose.Types.ObjectId(activityId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const userToActivity = await TableSchema.findOneAndUpdate(
      { _id: activityId },
      {
        $pull: {
          users: mongoose.Types.ObjectId(userId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (activityToUser && userToActivity) {
      return {
        activityToUser,
        userToActivity,
      };
    } else {
      throw new Error("Error: user or activity not found");
    }
  } catch (error) {
    return new Error(error);
  }
}
