import dbConnect from "../mongodb";
import Company from "@/lib/model/OrganisationModel";

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
