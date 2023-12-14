import dbConnect from "../mongodb";
import Users from "@/lib/model/UserModel";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import Organisation from "@/lib/model/OrganisationModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

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

export async function getUserActivity(userId, limit = 0) {
  await dbConnect();

  const activity = await Users.findOne({ _id: userId })
    .populate({
      path: "activities",
      model: TableSchema,
      options: { path: "activities", limit: limit, sort: { createdAt: -1 } },
    })
    .select(["activities", "-_id"]);

  if (!activity) {
    return "undefined";
  }

  return activity;
}

// user User schema instead
export async function getUserInvitations(userId) {
  await dbConnect();

  try {
    const invitations = await TableSchema.find({
      pendinginvites: {
        $elemMatch: {
          $eq: new mongoose.Types.ObjectId(userId),
        },
      },
    });

    if (!invitations || invitations.length == 0) {
      return {
        empty: true,
        message: "You currently do not have any pending invitation.",
      };
    }

    return invitations;
  } catch (error) {
    return error;
  }
}

export async function applyToActivity(userId, joinCode) {
  await dbConnect();

  // check if exists

  const exists = await TableSchema.findOne({ joincode: joinCode });

  if (!exists) {
    return { notExist: true, message: "Activity does not exist" };
  }

  if (exists.users?.includes(userId)) {
    return { inside: true, message: "You are already inside activity" };
  }

  if (exists.applicants?.includes(userId)) {
    return { applied: true, message: "You have already applied" };
  }

  if (exists.pendinginvites?.includes(userId)) {
    return { invited: true, message: "You have already been invited" };
  }

  const activity = await TableSchema.findOneAndUpdate(
    { joincode: joinCode },
    {
      $push: {
        applicants: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      upsert: false,
      new: true,
    }
  );

  await new ActivityLog({
    activity: exists._id,
    user: userId,
    operation: "user %user% applied to activity %activity%",
    datetime: Date.now(),
  }).save();

  return activity;
}

export async function onInvitationChange(userId, actId, isAccepting) {
  await dbConnect();
  try {
    if (isAccepting) {
      const actToUser = await Users.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { pendinginvites: actId },
          $push: { activities: actId },
        }
      );

      if (!actToUser) {
        throw new Error("user not found");
      }

      const userToAct = await TableSchema.findOneAndUpdate(
        { _id: actId },
        {
          $pull: { pendinginvites: actToUser._id },
          $push: { users: actToUser._id },
        }
      );

      if (!userToAct) {
        throw new Error("activitiy not found");
      }
      // Logging
      await new ActivityLog({
        activity: userToAct._id,
        user: userId,
        operation:
          "user %user% accepted activity invitation to join %activity%.",
        datetime: Date.now(),
      }).save();

      return { actToUser, userToAct };
    } else {
      const pullFromUser = await Users.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { pendinginvites: actId },
        }
      );

      if (!pullFromUser) {
        throw new Error("user not found");
      }

      const pullFromAct = await TableSchema.findOneAndUpdate(
        { _id: actId },
        {
          $pull: { pendinginvites: userId },
        }
      );
      if (!pullFromAct) {
        throw new Error("activity not found");
      }
      // Logging
      await new ActivityLog({
        activity: pullFromAct._id,
        user: pullFromUser._id,
        operation: "user %user% declined to join activity %activity%",
        datetime: Date.now(),
      }).save();
      return { pullFromUser, pullFromAct };
    }
  } catch (error) {
    return new Error(error);
  }
}

export async function getUserProfile(userId) {
  await dbConnect();

  try {
    const userProfile = await Users.findById(userId);

    if (!userProfile) {
      throw new Error("User not found");
    }

    return userProfile;
  } catch (error) {
    return error;
  }
}

export async function changeUserDetail(userId, newData) {
  await dbConnect();

  try {
    const changedUserDetail = await Users.findOneAndUpdate(
      { _id: userId },
      {
        email: newData?.email,
        fullname: newData?.fullname,
      },
      { new: true }
    );

    if (!changedUserDetail) {
      throw new Error("User not found");
    }
    return changedUserDetail;
  } catch (error) {
    return error;
  }
}

// get user by id, match userPassword
export async function changeUserPwd(userId, cPwd, nPwd, nPwdMatch) {
  await dbConnect();

  try {
    if (cPwd == nPwd) {
      throw new Error("New password cannot be the same as current password");
    }
    if (nPwd != nPwdMatch) {
      throw new Error("New passwords do not not match each other");
    }

    if (nPwd.length < 6) {
      throw new Error("New passwords must be at least 6 characters long");
    }

    if (nPwd == cPwd) {
      throw new Error("New password cannot be the same as current password");
    }

    // check cPwd if match
    const user = await Users.findById(userId).select("password");
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(cPwd, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(nPwd, salt);
    const test = await Users.findById(userId);
    const changedUserPwd = await Users.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        password: hashedPass,
      }
    );

    if (!changedUserPwd) {
      throw new Error(
        "Failed to find user after found, this should not be happening"
      );
    }
    return changedUserPwd;
  } catch (error) {
    return error;
  }
}

// get user by id
// getAll user activities and remove user from corresponding activities
// find and delete all activities member created by userId
// finally delete the activity and user
export async function deleteUserAccount(userId) {}

// get all user activities and remove this user from corresponding activities
export async function revokeAllActivities(userId) {}
