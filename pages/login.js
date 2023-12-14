import { Login } from "@/page-components/Auth/Login";
import { getSession } from "next-auth/react";

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
