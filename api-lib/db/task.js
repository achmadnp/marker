import dbConnect from "../mongodb";
import Organisations from "@/lib/model/OrganisationModel";
import mongoose from "mongoose";

export async function getUserTask(userId) {
  await dbConnect();

  const query = Organisations.aggregate([
    {
      $match: {
        members: mongoose.Types.ObjectId(userId),
      },
    },
    { $unwind: "$projects" },
    {
      $lookup: {
        from: "projects",
        localField: "projects",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    { $unwind: "$projectDetails" },
    { $unwind: "$projectDetails.tasks" },
    {
      $lookup: {
        from: "tasks",
        localField: "projectDetails.tasks",
        foreignField: "_id",
        as: "taskDetails",
      },
    },
    { $unwind: "$taskDetails" },
    { $unwind: "$taskDetails.PIC" },
    {
      $lookup: {
        from: "users",
        localField: "$taskDetails.PIC",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $match: {
        "userDetails._id": mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 0,
        OrganizationName: "$name",
        ProjectName: "$projectDetails.name",
        TaskName: "$taskDetails.taskName",
        TaskStatus: "$taskDetails.taskStatus",
        AssignedUser: "$userDetails",
      },
    },
  ]);

  return query;
}
