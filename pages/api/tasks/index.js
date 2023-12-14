import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";
import Organization from "@/lib/model/OrganisationModel";
import User from "@/lib/model/UserModel";
import Role from "@/lib/model/UserRoles";
import mongoose from "mongoose";

export default nextConnect(ncOpts)
  .get(async (req, res) => {})

  .post(async (req, res) => {
    // asign a new task to a user
  });
