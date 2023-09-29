import { ncOpts } from '@/api-lib/nc';
import nextConnect from 'next-connect';
import Organization from '@/lib/model/OrganisationModel';

// project oriented endpoint
export default nextConnect(ncOpts)
  .get(async (req, res) => {
    const projects = await Organization.findById(req.query?.orgId, 'projects');

    res.status(200).json(projects);
  })
  .post(async (req, res) => {
    const newProject = await Organization.findOneAndUpdate(
      { _id: req.query?.orgId },
      {
        $push: {
          projects: req.body.newProject,
        },
      }
    );

    res.status(200).json({
      message: `A new Project ${req.body.newProject.name} has been added`,
    });
  })
  .put(async (req, res) => {
    const updateProject = await Organization.findOneAndUpdate(
      {
        _id: req.query?.orgId,
      },
      {
        $set: {},
      }
    );
  })
  .delete(async (req, res) => {});
