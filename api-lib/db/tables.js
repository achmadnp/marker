import dbConnect from "../mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import TableField from "@/lib/model/Tables/TableFieldSchema";
import Data from "@/lib/model/Data/DataModel";
import ddPool from "@/lib/model/Data/ddPoolModel";

export async function getTableFields() {
  await dbConnect();

  const tableField = await TableSchema.find().populate({
    path: "tablefields",
    model: TableField,
    options: { path: "tablefields" },
  });

  if (!tableField) {
    return "undefined";
  }

  return tableField;
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

  const data = await TableSchema.find().populate({
    path: "data",
    model: Data,
    options: { path: "data", limit: limit },
  });

  if (!data) {
    return "undefined";
  }

  return data;
}

export async function createColumn({ tableId, column }) {
  await dbConnect();
  let fieldId;

  try {
    const colField = await new TableField({
      headerName: column.headerName,
      dataKey: column.dataKey,
      cellType: column.cellType,
      resizeable: column?.resizeable || false,
      cellName: column.cellName,
      editableCol: column?.editableCol || true,
    }).save();

    console.log(`col: `, colField);
    fieldId = colField._id;

    console.log(`getting field Id ${fieldId} and saving table ref`);

    const tableField = await TableSchema.findOneAndUpdate(
      { _id: tableId },
      { $push: { tablefields: fieldId } },
      { upsert: false }
    );

    if (tableField) {
      console.log(`Tfield: ${tableField}`);
      return tableField;
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
  let updateQuery;

  try {
    const field = await TableField.findById(fieldId);
    datakey = field._dataKey;

    updateQuery[datakey] = null;

    const empty = await Data.updateMany({}, { $set: updateQuery });
  } catch (error) {
    throw new Error(`process aborted ${error}`);
  }
}

export async function changePermission({ fieldId }) {}

export async function deleteField({ fieldId }) {
  await dbConnect();
  let datakey;
  let updateQuery;

  try {
    const deleted = await TableField.findOneAndDelete({ _id: fieldId });
    console.log(deleted.dataKey);
    datakey = deleted.dataKey;
    const deleteQuery = { $unset: {} };
    deleteQuery.$unset[datakey] = 1;

    const removedField = await Data.updateMany(
      {
        [datakey]: { $exists: true }, // find the documents where the field exists });
      },
      deleteQuery
    );
    console.log(`removedField, ${removedField}`);

    const removeFieldFromTable = await TableSchema.findOneAndUpdate(
      { tablefields: { $elemMatch: { _id: fieldId } } },
      { $pull: { tablefields: { _id: fieldId } } },
      { new: true }
    );

    console.log(removeFieldFromTable);

    return { removedField, removeFieldFromTable };
  } catch (error) {
    throw new Error(`process aborted ${error}`);
  }
}

export async function appendColumn({ properties, creatorId }) {}
