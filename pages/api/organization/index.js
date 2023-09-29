import { ncOpts } from '@/api-lib/nc';
import nextConnect from 'next-connect';
import Organization from '@/lib/model/OrganisationModel';
import User from '@/lib/model/UserModel';
import Role from '@/lib/model/UserRoles';
import mongoose from 'mongoose';

export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const orgs = await Organization.find();

    res.status(200).json(orgs);
  })
  .post(async (req, res) => {
    const org = await Organization.find({ name: req.body.name });

    if (org.length > 0) {
      res.status(500).json({ message: 'Organization name already taken' });
      console.log(org);
      return;
    }

    const user = await User.findOne({ email: req.body.createdBy });

    const savedOrg = await Organization({
      name: req.body.name,
      orgCode: req.body.orgCode,
      createdBy: user._id,
    }).save();

    const assignRole = await new Role({
      role: 'Creator',
      organisation: savedOrg._id,
    });

    await assignRole.save();

    const setUserRole = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          roles: [assignRole._id],
        },
      }
    );

    res.status(200).json({
      message: `Organization ${savedOrg.name}, UUID: ${savedOrg.orgCode} has been successfully created`,
    });
  });
