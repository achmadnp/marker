import { changeUserPwd } from "@/api-lib/db/users";
import { ncOpts } from "@/api-lib/nc";
import nextConnect from "next-connect";

export default nextConnect(ncOpts).post(async (req, res) => {
  const pwdChange = await changeUserPwd(
    req.query.userId,
    req.body.cPwd,
    req.body.nPwd,
    req.body.nPwdMatch
  );

  if (pwdChange instanceof Error) {
    return res.status(406).json({ message: pwdChange.message });
  } else {
    return res.status(200).json(pwdChange);
  }
});
