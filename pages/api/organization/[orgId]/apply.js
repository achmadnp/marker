import { ncOpts } from '@/api-lib/nc';
import nextConnect from 'next-connect';
import User from '@/lib/model/UserModel';
import Organization from '@/lib/model/OrganisationModel';

// applicant management
export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const orgId = req.query?.orgId;
    const applicants = await Organization.findById(
      orgId,
      'applicants'
    ).populate('applicants');

    res.status(200).json(applicants);
  })
  .post(async (req, res) => {
    const applicant = await User.findById(req.applicantId);

    const postApplicant = await Organization.findOneAndUpdate(
      { _id: req.query?.orgId },
      {
        $push: {
          applicants: applicant._id,
        },
      }
    );

    res.status(200).json({
      message: `Applicant ${applicant._id} has been added to ${postApplicant.name} applicant's list`,
    });
  })
  .put(async (req, res) => {
    const pulledUserId = req.pulledUser;

    const updateApplicants = await Organization.findOneAndUpdate(
      {
        _id: req.query?.orgId,
      },
      {
        $pull: {
          applicants: pulledUserId,
        },
      }
    );

    res.status(200).json({
      message: `Applicant ${pulledUserId} has been removed from ${updateApplicants.name} applicant's list`,
    });
  });
