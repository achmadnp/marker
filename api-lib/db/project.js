import dbConnect from "../mongodb";
import Organisations from "@/lib/model/OrganisationModel";
import mongoose from "mongoose";

export async function getUserPermissions(userid, projectid) {
  return {
    isAllowedRead: true,
    isAllowedWrite: true,
  };
}

export async function getProjectOverview(userId, limit = 3) {
  await dbConnect();

  const result = await Organisations.aggregate([
    // Match the organization by _id
    {
      $match: { members: mongoose.Types.ObjectId(userId) },
    },
    // Lookup projects using the projects array from the organization
    {
      $lookup: {
        from: "projects", // The name of the projects collection
        localField: "projects",
        foreignField: "_id",
        as: "projects",
      },
    },
    // Unwind the projects array to work with individual projects
    {
      $unwind: "$projects",
    },
    // Sort projects based on latestUpdated in descending order
    {
      $sort: { "projects.latestUpdated": -1 },
    },
    // Limit the number of projects to retrieve
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "projects.projectAsignee",
        foreignField: "_id",
        as: "asigneesData",
      },
    },
    {
      $project: {
        _id: 0,
        organizationName: "$name",
        projectName: "$projects.projectName",
        projectStatus: "$projects.projectStatus",
        latestUpdated: "$projects.latestUpdated",
        assignees: "$assigneesData.username", // Populate the assignees field with the username
      },
    },
  ]);

  return result;
}
