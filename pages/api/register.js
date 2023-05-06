import bcrypt from "bcrypt";
import Users from "@/lib/model/UserModel";
import Organization from "@/lib/model/OrganisationModel";
import { randomIntFromIntervall } from "@/lib/util/random";

export default async function handler(req, res) {
  const body = req.body;
  const exist = await Users.findOne({ email: body?.email });

  if (exist) {
    res.status(200).json({ message: "Already registered", err: true });
    return;
  }

  // if org didnt exist
  const org = await Organization.findOne({ orgUUID: body?.organization });

  if (!org) {
    console.log("Couldn't find org'");
    res.status(200).json({ message: "Organization not found", err: true });
    return;
  }

  // generate username
  const uname = usernameGenerator(body?.fullName);

  const salt = await bcrypt.genSalt(10);

  const hashedPass = await bcrypt.hash(body?.password, salt);
  const user = new Users({
    username: uname,
    email: body.email,
    password: hashedPass,
    fullname: body.fullName,
  });
  await user.save();
  res.status(200).json({ message: "Register success", uname: uname });
}

const usernameGenerator = (fullname) => {
  const rndInt = randomIntFromIntervall(111, 999);

  const fn = fullname.split(" ")[0].substring(0, 2);
  const ln = fullname.split(" ").pop().substring(0, 2);

  return `${fn}${ln}${rndInt}`;
};
