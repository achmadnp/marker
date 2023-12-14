"use server";
import dbConnect from "@/api-lib/mongodb";
import TableSchema from "@/lib/model/Tables/ProjectTableModel";
import ActivityLog from "@/lib/model/changelog/ActivityChangelog";
import Messaging from "@/lib/model/MessageModel";
import Users from "@/lib/model/UserModel";
import mongoose from "mongoose";

// TO users v
export async function getActivityUsers({ activity }) {
  await dbConnect();

  try {
    const table = await TableSchema.findOne({
      _id: activity,
    });
    const userIds = table.users;

    const users = await Users.find({
      _id: { $in: userIds },
    })
      .sort({ _id: 1 })
      .select(["username", "fullname"]);

    if (users) {
      return users;
    } else {
      throw new Error("Error: data empty or not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

// TO users
export async function pushActivityUser({ activityId, userId }) {
  await dbConnect();

  try {
    const activityToUser = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          activities: new mongoose.Types.ObjectId(activityId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const userToActivity = await TableSchema.findOneAndUpdate(
      { _id: activityId },
      {
        $push: {
          users: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (activityToUser && userToActivity) {
      return {
        activityToUser,
        userToActivity,
      };
    } else {
      throw new Error("Error: user or activity not found");
    }
  } catch (error) {
    return new Error(error);
  }
}

// VALIDATION: remover
export async function pullActivityUser({ activity, username, executor }) {
  await dbConnect();

  try {
    const activityToUser = await Users.findOneAndUpdate(
      {
        username: username,
        activities: {
          $in: [new mongoose.Types.ObjectId(activity)],
        },
      },
      {
        $pull: {
          activities: new mongoose.Types.ObjectId(activity),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    const userToActivity = await TableSchema.findOneAndUpdate(
      { _id: activity },
      {
        $pull: {
          users: new mongoose.Types.ObjectId(activityToUser._id),
        },
      },
      {
        upsert: false,
        new: true,
      }
    );

    if (activityToUser && userToActivity) {
      await new ActivityLog({
        activity: activity,
        user: executor,
        operation: `user %user% remove ${username} from activity %activity%`,
        datetime: Date.now(),
      }).save();

      await new Messaging({
        title: "You have been removed from activity",
        sender: executor,
        receiver: userToActivity._id,
        message: `You have been removed from activity %activity%`,
        datetime: Date.now(),
      }).save();
      return {
        activityToUser,
        userToActivity,
      };
    } else {
      throw new Error("Error: user or activity not found");
    }
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

export async function updateMemberRole({ activity, userId, executor, role }) {
  await dbConnect();

  try {
    if (role === "owner") {
      throw new Error(
        "cannot update role to owner of activity, please use transfer instead"
      );
    }
    const isOwner = await TableSchema.findOne({
      _id: activity,
      owner: new mongoose.Types.ObjectId(executor),
    });

    const updateIsOwner = await TableSchema.findOne({
      _id: activity,
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (updateIsOwner) {
      throw new Error("cannot update role to owner of activity");
    }

    const updateIsMaintainer = await TableSchema.findOne({
      _id: activity,
      maintainers: {
        $elemMatch: {
          $eq: new mongoose.Types.ObjectId(userId),
        },
      },
    });

    if (updateIsMaintainer) {
      if (!isOwner) {
        throw new Error("Only owner can update role to a maintainer");
      }

      if (role === "member") {
        const updateRole = await TableSchema.findOneAndUpdate(
          {
            _id: activity,
          },
          {
            $pull: {
              maintainers: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            upsert: false,
            new: true,
          }
        );

        if (updateRole) {
          await new ActivityLog({
            activity: activity,
            user: executor,
            operation:
              "user %user% updated role of a maintainer to member on activity %activity%",
            datetime: Date.now(),
          }).save();

          await new Messaging({
            title: "Your role has been updated",
            sender: executor,
            receiver: userId,
            message: `Your role in activity ${activity} has been updated to member`,
            datetime: Date.now(),
          }).save();
          return {
            updateRole,
          };
        } else {
          throw new Error("Action failed");
        }
      } else {
        throw new Error("maintainer can only be updated to member");
      }
    } else {
      if (role === "maintainer") {
        const updateRole = await TableSchema.findOneAndUpdate(
          {
            _id: activity,
          },
          {
            $push: {
              maintainers: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            upsert: false,
            new: true,
          }
        );

        if (updateRole) {
          await new ActivityLog({
            activity: activity,
            user: executor,
            operation:
              "user %user% updated role of a member to maintainer on activity %activity%",
            datetime: Date.now(),
          }).save();

          await new Messaging({
            title: "Your role has been updated",
            sender: executor,
            receiver: userId,
            message: `Your role in activity ${activity} has been updated to maintainer`,
            datetime: Date.now(),
          }).save();
          return {
            updateRole,
          };
        } else {
          throw new Error("Action failed");
        }
      } else {
        throw new Error(
          "member can only be updated to maintainer, please use transfer instead to give ownership"
        );
      }
    }
  } catch (error) {
    return new Error(error);
  }
}
