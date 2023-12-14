"use server";
import dbConnect from "@/api-lib/mongodb";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import Message from "@/lib/model/MessageModel";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import Users from "@/lib/model/UserModel";
import mongoose from "mongoose";

// TO detail
export async function getActivityOverview(activityId) {
  await dbConnect();
  try {
    const activity = await TableSchema.findOne({ _id: activityId }).select([
      "name",
      "description",
      "joincode",
      "createdAt",
      "owner",
    ]);

    if (!activity) {
      throw new Error("Error: failed to retrieve activity");
    }
    return activity;
  } catch (error) {
    return new Error(error);
  }
}

// TO detail
export async function getActivityDetail(activityId) {}

// TO detail
export async function isActivityMaintainer(activityId, userId) {
  await dbConnect();

  try {
    const activity = await TableSchema.findOne({
      _id: activityId,
      owner: userId,
    });

    if (!activity) {
      return false;
    }
    return true;
  } catch (error) {
    return new Error(error);
  }
}

// TO detail
export async function editActivityOverview(actId, data) {
  try {
    const activity = await TableSchema.findOneAndUpdate(
      { _id: actId },
      {
        name: data.name,
        description: data.description,
        joincode: data.joincode,
      },
      {
        upsert: false,
        new: true,
      }
    );
    if (!activity) {
      throw new Error("Error: failed to edit activity");
    }
    await new ActivityLog({
      activity: activity._id,
      user: data.userId,
      operation: "user %user% changed activity detail on activity %activity%",
      datetime: Date.now(),
    }).save();
    return activity;
  } catch (error) {
    return new Error(error);
  }
}

// TO detail
export async function getActivityApplicants({ activity }) {
  await dbConnect();

  try {
    const table = await TableSchema.findOne({
      _id: activity,
    });
    const applIds = table.applicants;

    const users = await Users.find({
      _id: { $in: applIds },
    }).select(["username", "fullname"]);

    if (users) {
      return users;
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

// LOGGING
export async function moveApplicantToUser({ activity, user, executor }) {
  await dbConnect();

  try {
    const table = await TableSchema.findOneAndUpdate(
      {
        _id: activity,
      },
      {
        $pull: {
          applicants: new mongoose.Types.ObjectId(user),
        },
        $push: {
          users: new mongoose.Types.ObjectId(user),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const userToActivity = await Users.findOneAndUpdate(
      { _id: user },
      {
        $push: {
          activities: new mongoose.Types.ObjectId(activity),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (table && userToActivity) {
      await new ActivityLog({
        activity: table._id,
        user: executor,
        operation: `user %user% accepted join request from user ${userToActivity?.username} on activity %activity%`,
        datetime: Date.now(),
      }).save();

      await new Message({
        title: "Activity Join Request Accepted",
        sender: executor,
        receiver: userToActivity._id,
        message: `Your request to join activity ${table.name} has been accepted`,
        datetime: Date.now(),
      }).save();

      return { table, userToActivity };
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

// LOGGING
export async function declineApplicant({ activity, user, executor }) {
  await dbConnect();

  try {
    const userExist = await Users.findOne({
      _id: user,
    });
    if (!userExist) {
      return { notExist: true, message: "User does not exist" };
    }

    const table = await TableSchema.findOneAndUpdate(
      {
        _id: activity,
        applicants: {
          $in: [userExist._id],
        },
      },
      {
        $pull: {
          applicants: userExist._id,
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    console.log(`table: ${table}`);

    if (table) {
      await new ActivityLog({
        activity: table._id,
        user: executor,
        operation: "user %user% deleted rowdata %data% on activity %activity%",
        datetime: Date.now(),
      }).save();

      await new Message({
        title: "Activity Join Request Declined",
        sender: executor,
        receiver: userToActivity._id,
        message: `Your request to join activity ${table.name} has been declined`,
        datetime: Date.now(),
      }).save();

      return table;
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

export async function getActivityInvitationList({ activity }) {
  await dbConnect();

  try {
    const list = await TableSchema.findOne({
      _id: activity,
    })
      .populate({
        path: "pendinginvites",
        select: ["username", "fullname"],
      })
      .select(["pendinginvites", "-_id"]);

    if (list) {
      return list.pendinginvites;
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return Error(error);
  }
}

export async function inviteUser({ activity, username, executor }) {
  await dbConnect();

  try {
    const userExist = await Users.findOne({
      username: username,
    });

    if (!userExist) {
      throw new Error("User not found");
    }

    const table = await TableSchema.findOneAndUpdate(
      {
        _id: activity,
        users: {
          $nin: [userExist._id],
        },
        pendinginvites: {
          $nin: [userExist._id],
        },
        applicants: {
          $nin: [userExist._id],
        },
      },
      {
        $push: {
          pendinginvites: userExist._id,
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const user = await Users.findOneAndUpdate(
      {
        _id: userExist._id,
      },
      {
        $push: {
          pendinginvites: table._id,
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (table && user) {
      await new Message({
        title: "Activity Invitation",
        sender: executor,
        receiver: user._id,
        message: `You have been invited to join activity ${table.name}`,
        datetime: Date.now(),
      }).save();

      await new ActivityLog({
        activity: table._id,
        user: executor,
        operation: `user %user% invited ${username} to join activity %activity%`,
        datetime: Date.now(),
      }).save();

      return { table, user };
    } else {
      throw new Error(
        "Failed, please ensure the user has not joined/applied/invited to the activity yet"
      );
    }
  } catch (error) {
    return Error(error);
  }
}

export async function cancelInvitation({ activity, username, executor }) {
  await dbConnect();

  try {
    const userExist = await Users.findOneAndUpdate(
      {
        username: username,
        pendinginvites: {
          $elemMatch: {
            $eq: new mongoose.Types.ObjectId(activity),
          },
        },
      },
      {
        $pull: {
          pendinginvites: new mongoose.Types.ObjectId(activity),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (!userExist) {
      throw new Error("User not found");
    }

    const table = await TableSchema.findOneAndUpdate(
      {
        _id: activity,
      },
      {
        $pull: {
          pendinginvites: userExist._id,
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (table && userExist) {
      await new Message({
        title: "Activity Invitation Cancelled",
        sender: executor,
        receiver: userExist._id,
        message: `Your invitation to join activity ${table.name} has been cancelled`,
        datetime: Date.now(),
      }).save();

      await new ActivityLog({
        activity: table._id,
        user: executor,
        operation: `user %user% cancelled invitation on ${username} to join activity %activity%`,
        datetime: Date.now(),
      }).save();

      return { table, userExist };
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return Error(error);
  }
}
