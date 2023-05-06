import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Users from "@/lib/model/UserModel";
import dbConnect from "@/api-lib/mongodb";
import bcrypt from "bcrypt";

dbConnect();

export const authOpt = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: String,
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const username = credentials.username;
        const password = credentials.password;
        const user = await Users.findOne({ username });

        if (!user) {
          throw new Error("User not found");
        }

        if (user) {
          return signInUser({
            password,
            user,
          });
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },

    session: async ({ session, token }) => {
      //   if (session) {
      // session.userRole = token.user.role;
      //   }

      return Promise.resolve(session);
    },
  },
  session: {
    strategy: "jwt",
  },

  secret: "secret",
  database: process.env.MONGODB_URI,
};

const signInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Password cannot be empty");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("credentials is invalid");
  }
  return Promise.resolve(user);
};

export default NextAuth(authOpt);
