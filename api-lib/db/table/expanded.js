"use server";
import dbConnect from "@/api-lib/mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import Data from "@/lib/model/Data/DataModel";

// TO expanded
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
