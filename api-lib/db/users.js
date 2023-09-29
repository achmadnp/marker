import dbConnect from "../mongodb";
import Users from "@/lib/model/UserModel";
import Organisation from "@/lib/model/OrganisationModel";

export async function getUserRole(userId) {
  await dbConnect();

  const cUser = Users.findById(userId);

  return cUser.populate("roles");
}

export async function getOrgUser(orgId) {
  try {
    const org = await Organisation.findById(orgId).populate("members");
    if (!org) {
      throw new Error("Organisation with given data does not exist");
    }

    return org.members;
  } catch (error) {
    throw error;
  }
}

export async function getOrgApplicant(orgId) {
  try {
    const org = await Organisation.findById(orgId).populate("applicants");
    if (!org) {
      throw new Error("Organisation with given data does not exist");
    }

    return org.applicants;
  } catch (error) {
    throw error;
  }
}

// Usage example
// const organizationId = 'your_organization_id_here'; // Replace this with the actual organization ID
// getApplicantsDetailsByOrganizationId(organizationId)
//   .then((applicants) => {
//     console.log('Applicants:', applicants);
//   })
//   .catch((error) => {
//     // Handle the error
//   });
