import dbConnect from "../mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import TableField from "@/lib/model/Tables/TableFieldSchema";
import Data from "@/lib/model/Data/DataModel";
import ddPool from "@/lib/model/Data/ddPoolModel";
var mongoose = require("mongoose");

export async function getTableFields() {
  await dbConnect();

  const tableField = await TableSchema.findOne({
    _id: "64f63fbc2dcbb4e3ad750230",
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

export async function getTableData({ limit = 50 }) {
  await dbConnect();

  const data = await TableSchema.findOne({ _id: "64f63fbc2dcbb4e3ad750230" })
    .populate({
      path: "data",
      model: Data,
      options: { path: "data", limit: limit },
    })
    .select({
      data: 1,
    });

  if (!data) {
    return "undefined";
  }

  return data.data;
}

export async function createColumn({ tableId, fields }) {
  await dbConnect();
  let fieldId;
  console.log(fields?.editableCol);

  try {
    const colField = await new TableField({
      headerName: fields.headerName,
      dataKey: fields.dataKey,
      cellType: fields.cellType,
      resizeable: fields?.resizeable || false,
      cellName: fields.cellName,
      editableCol: fields?.editableCol || true,
    }).save();
    fieldId = colField._id;

    const tableField = await TableSchema.findOneAndUpdate(
      { _id: tableId },
      { $push: { tablefields: fieldId } },
      { upsert: false }
    );

    if (tableField) {
      return { tableField, colField };
    } else {
      throw new Error("Error: table and/or field cannot be created");
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function editHeader({ fieldId, hname }) {
  await dbConnect();

  try {
    const updated = await TableField.findOneAndUpdate(
      { _id: fieldId },
      { headerName: hname },
      { new: true }
    );

    if (updated) {
      return updated;
    }
  } catch (error) {
    throw new Error("process aborted");
  }
}

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

export async function changePermission({ fieldId }) {}

export async function deleteField({ tableId, fieldId }) {
  await dbConnect();
  let datakey;
  let updateQuery;

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

export async function appendColumn({ properties, creatorId }) {}

export async function createExpanded({ pid }) {
  await dbConnect();

  try {
    const table = await new TableSchema({
      tablefields: [],
      data: [],
    }).save();

    // get table _id
    const tableId = table._id;
    // insert table _id into data table with name 'expRef'
    const update = { $set: {} };
    update.$set["expRef"] = tableId;
    // save the new data table
    const data = await new Data(update).save();

    console.log(`data: ${data}`);
    if (table) {
      return table;
    } else {
      throw new Error("Error: expandable cannot be created");
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}
