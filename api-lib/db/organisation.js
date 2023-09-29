import dbConnect from "../mongodb";
import Company from "@/lib/model/OrganisationModel";
import User from "@/lib/model/UserModel";
import UserRole from "@/lib/model/UserRoles";
import mongoose from "mongoose";

export async function getCompanyMember(compId) {
  await dbConnect();

  const company = await Company.findOne({ compId });

  return company.populate("members").exec((err, member) => {
    return member?.members;
  });
}

export async function getCompanyProject(compId) {
  await dbConnect();

  const company = await Company.findOne({ compId });

  return company.populate({ path: "projects", populate: { path: "tasks" } });
}

export async function createNewOrganisation() {}

export async function getOrganisationOverview(userId, limit = 3) {
  await dbConnect();

  let orgs;

  const query = User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    { $unwind: "$roles" },
    {
      $lookup: {
        from: "userroles",
        localField: "roles",
        foreignField: "_id",
        as: "roles",
      },
    },
    { $unwind: "$roles" },
    {
      $lookup: {
        from: "organisations",
        localField: "roles.organisation",
        foreignField: "_id",
        as: "$roles.organisation",
      },
    },
    { $unwind: "$roles.organisation" },
    { $limit: limit },
    {
      $project: {
        "roles.role": 1,
        "roles.organisation": 1,
      },
    },
  ]);

  query.exec((err, user) => {
    if (err) {
      console.error("Error retrieving user:", err);
    } else {
      const roles = user.map((doc) => doc.roles);
      orgs = roles;
    }
  });

  return orgs;
}
