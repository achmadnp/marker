import bcrypt from "bcrypt";
import Users from "@/lib/model/UserModel";

export default async function handler(req, res) {
  const body = req.body;
  const exist = await Users.findOne({ email: body?.email });

  if (exist) {
    res.status(200).json({ message: "Already registered", err: true });
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPass = await bcrypt.hash(body?.password, salt);
  const user = new Users({
    username: body.username,
    email: body.email,
    password: hashedPass,
    fullname: body.fullName,
  });
  await user.save();
  res.status(200).json({ message: "Register success", uname: user.username });
}
