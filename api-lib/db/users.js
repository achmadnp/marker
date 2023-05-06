import dbConnect from "../mongodb";
import Users from "@/lib/model/UserModel";

export async function getUserRole(userId) {
  await dbConnect();

  const cUser = Users.findById(userId);

  return cUser.populate("roles");
}
