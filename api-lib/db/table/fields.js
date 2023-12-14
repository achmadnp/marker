"use server";
import dbConnect from "@/api-lib/mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import TableField from "@/lib/model/Tables/TableFieldSchema";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import Data from "@/lib/model/Data/DataModel";
import ddPool from "@/lib/model/Data/ddPoolModel";
var mongoose = require("mongoose");

// TO fields
export async function getTableFields(actId) {
  await dbConnect();

  const tableField = await TableSchema.findOne({
    _id: actId,
  }).populate({
    path: "tablefields",
    model: TableField,
    options: { path: "tablefields" },
  });

  if (!tableField) {
    return "undefined";
  }

  return tableField.tablefields;
}

// TO fields
export async function getDDPools(id) {
  await dbConnect();

  const pool = await TableField.findById(id).populate({
    path: "ddPool",
    model: ddPool,
    options: {
      path: "ddPool",
    },
  });

  if (!pool) {
    return "err";
  }

  return pool;
}

// TO fields
export async function createColumn({ tableId, fields, user }) {
  await dbConnect();
  let fieldId;

  try {
    const colField = await new TableField({
      headerName: fields.headerName,
      dataKey: fields.dataKey,
      cellType: fields.cellType,
      resizeable: fields?.resizeable || false,
      cellName: fields.cellName,
      editableCol: true,
    }).save();
    fieldId = colField._id;

    const tableField = await TableSchema.findOneAndUpdate(
      { _id: tableId },
      { $push: { tablefields: fieldId } },
      { upsert: false }
    );

    const data = await Data.updateMany(
      {
        _id: { $in: tableField.data },
      },
      {
        $set: { [fields.dataKey]: null },
      },
      {
        upsert: false,
        multi: true,
        new: true,
      }
    );

    if (tableField) {
      await new ActivityLog({
        activity: tableField._id,
        user: user,
        operation: `user %user% created new column with dataKey ${fields.dataKey} on activity %activity%`,
        datetime: Date.now(),
      }).save();
      return { tableField, colField, data };
    } else {
      throw new Error("Error: table and/or field cannot be created");
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

// TO fields
export async function editHeader({ fieldId, hname, user }) {
  await dbConnect();

  try {
    const updated = await TableField.findOneAndUpdate(
      { _id: fieldId },
      { headerName: hname },
      { new: false }
    );

    if (updated) {
      await new ActivityLog({
        activity: updated._id,
        user: user,
        operation: `user %user% changed header from ${updated.headerName} to ${hname} on activity %activity%`,
        datetime: Date.now(),
      }).save();
      return updated;
    }
  } catch (error) {
    throw new Error("process aborted");
  }
}

// TO fields
export async function emptyFieldData({ fieldId }) {
  await dbConnect();
  let datakey;

  try {
    const field = await TableField.findById(fieldId);
    datakey = field.dataKey;
    const update = { $set: {} };
    update.$set[datakey] = null;

    const empty = await Data.updateMany(
      {
        [datakey]: { $exists: true },
      },
      update
    );

    return empty;
  } catch (error) {
    throw new Error(`process aborted ${error}`);
  }
}

// TO fields
export async function changePermission({ fieldId }) {}

// TO fields
export async function deleteField({ actId, fieldId }) {
  await dbConnect();
  let datakey;

  try {
    const deleted = await TableField.findOneAndDelete({ _id: fieldId });
    datakey = deleted.dataKey;
    const deleteQuery = { $unset: {} };
    deleteQuery.$unset[datakey] = 1;

    const removedField = await Data.updateMany(
      {
        [datakey]: { $exists: true }, // find the documents where the field exists });
      },
      deleteQuery
    );

    const fid = new mongoose.Types.ObjectId(fieldId);

    const removeFieldFromTable = await TableSchema.findOneAndUpdate(
      { tablefields: { $elemMatch: { $eq: fid } } },
      { $pull: { tablefields: fid } },
      { new: true }
    );

    return { removedField, removeFieldFromTable };
  } catch (error) {
    throw new Error(`process aborted ${error}`);
  }
}

// To table/fields
export async function modifySelectCellOption(
  fieldId,
  optValue,
  optColor,
  operation,
  user
) {
  await dbConnect();

  if (operation === "push") {
    try {
      const field = await TableField.findOneAndUpdate(
        {
          _id: fieldId,
        },
        {
          $push: {
            options: {
              value: optValue,
              color: optColor,
            },
          },
        },
        {
          upsert: false,
          new: true,
        }
      );

      if (field) {
        await new ActivityLog({
          activity: updated._id,
          user: user,
          operation: `user %user% added an option to a Select-Cell on activity %activity%`,
          datetime: Date.now(),
        }).save();
        return { field };
      } else {
        throw new Error("Error: Unknown");
      }
    } catch (error) {
      return new Error(error);
    }
  } else if (operation === "pull") {
    try {
      const field = await TableField.findOneAndUpdate(
        { _id: fieldId },
        {
          $pull: {
            options: {
              value: optValue,
              color: optColor,
            },
          },
        },
        {
          upsert: false,
          new: true,
        }
      );
      if (field) {
        await new ActivityLog({
          activity: updated._id,
          user: user,
          operation: `user %user% added an option to a Select-Cell on activity %activity%`,
          datetime: Date.now(),
        }).save();
        return { field };
      } else {
        throw new Error("Error: Unknown");
      }
    } catch (error) {
      return new Error(error);
    }
  } else {
    return new Error("Error: Unknown Operation");
  }
}

// To table/fields
export async function deleteSelectCellOption(fieldId, optValue, optColor) {
  await dbConnect();

  try {
    const field = await TableField.findOneAndUpdate(
      { _id: fieldId },
      {
        $pull: {
          options: {
            value: optValue,
            color: optColor,
          },
        },
      },
      {
        upsert: false,
        new: true,
      }
    );
  } catch (error) {}
}
