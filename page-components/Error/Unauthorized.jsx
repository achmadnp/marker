import Link from "next/link";
import { useRouter } from "next/router";

export const Unauthorized = ({
  header = "UNAUTHORIZED!",
  text = "You are not authorized to access this page",
}) => {
  const router = useRouter();
  return (
    <div className="h-screen py-20 bg-white rounded-md shadow-xl lg:px-40">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-red-700 lg:text-9xl">
          {header}
        </h1>
        <h6 className="mb-2 text-lg font-bold text-center text-gray-800 lg:text-2xl md:text-3xl">
          Oops! {text}
        </h6>

        <p className="mb-8 text-sm text-center text-gray-500 md:text-lg">
          Ask the owner of the activity to give you access
        </p>

        <div className="flex gap-x-8">
          <Link
            href="/"
            className="px-6 py-2 font-semibold text-blue-800 bg-blue-100 rounded-lg"
          >
            Home
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 font-semibold text-blue-800 bg-blue-100 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
