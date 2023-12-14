import { Toast } from "primereact/toast";
import { useCallback, useRef } from "react";
import { fetcher } from "@/lib/fetcher";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/page-components/Sidebar/Sidebar";
import { Profile } from "@/page-components/Profiles/profile";
import { Security } from "@/page-components/Profiles/AccConfigs";
import { DeleteSct } from "@/page-components/Profiles/DeleteAcc";
import { getSession } from "next-auth/react";

const Profiles = ({ session }) => {
  const userId = session.userId;
  const toast = useRef(null);
  const sctParams = useSearchParams();
  const section = sctParams.get("section");

  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name, value, operation = "set") => {
      const params = new URLSearchParams(sctParams);

      if (operation === "delete") {
        params.delete(name);
        return params.toString();
      }
      params.set(name, value);
      return params.toString();
    },
    [sctParams]
  );

  const onNoChange = (msg) => {
    toast.current.show({
      severity: "info",
      summary: "No changes made",
      detail: msg,
      life: 3000,
    });
  };
  const onEditFail = (msg) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: msg,
      life: 3000,
    });
  };
  const onEditSuccess = (msg) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
    });
  };

  const onPwdFail = (msg) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: msg,
      life: 3000,
    });
  };

  const onPwdSuccess = (msg) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
    });
  };

  // success = session destroy
  const onAccDelete = async () => {};

  const onActivityClean = async () => {};

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex min-h-screen mx-auto mt-0 flex-nowrap">
        <Sidebar />
        <div className="container w-full">
          <div className="grid grid-cols-4 mx-20 mt-10 gap-x-5">
            <div className="col-span-1 p-2 border border-blue-800 rounded-lg bg-slate-400">
              <ul className="space-y-5 tracking-widest">
                <li
                  onClick={() => {
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("section", null, "delete")
                    );
                  }}
                  className={`cursor-pointer p-1 font-semibold duration-300 border border-transparent rounded-lg from-transparent hover:bg-gradient-to-r to-green-400 hover:border-green-400 ${
                    section === null && "bg-gradient-to-r to-green-400"
                  }`}
                >
                  Profile
                </li>
                <li
                  onClick={() => {
                    router.push(
                      pathname + "?" + createQueryString("section", "secsct")
                    );
                  }}
                  className={`cursor-pointer p-1 font-semibold duration-300 border border-transparent rounded-lg from-transparent hover:bg-gradient-to-r to-green-400 hover:border-green-400 ${
                    section === "secsct" && "bg-gradient-to-r to-green-400"
                  }`}
                >
                  Security
                </li>
                <li
                  onClick={() => {
                    router.push(
                      pathname + "?" + createQueryString("section", "configs")
                    );
                  }}
                  className={`p-1 font-semibold duration-300 border border-transparent rounded-lg cursor-pointer from-transparent hover:bg-gradient-to-r to-orange-500 hover:border-orange-500 ${
                    section === "configs" && "bg-gradient-to-r to-orange-400"
                  }`}
                >
                  Configs
                </li>
              </ul>
            </div>
            {!section && (
              <Profile
                uid={userId}
                onNoChange={onNoChange}
                onEditFail={onEditFail}
                onEditSuccess={onEditSuccess}
              />
            )}
            {section === "secsct" && (
              <Security
                onPwdFail={onPwdFail}
                onPwdSuccess={onPwdSuccess}
                uid={userId}
              />
            )}
            {section === "configs" && <DeleteSct uid={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // session checks
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
