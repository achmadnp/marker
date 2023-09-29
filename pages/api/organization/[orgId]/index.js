import { ncOpts } from '@/api-lib/nc';
import nextConnect from 'next-connect';
import User from '@/lib/model/UserModel';

// core manipulation:
// get: general data retrieval (e.g. name, members)
// post: management <= for personal
export default nextConnect(ncOpts)
  .get(async (req, res) => {})
  .post(async (req, res) => {});
