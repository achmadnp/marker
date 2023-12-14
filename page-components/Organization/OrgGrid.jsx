import { OrgCard } from "@/components/Card/OrgCard";

export const OrgGrid = ({ orgs, isHome = false, isManageAble = false }) => {
  return (
    <>
      <div className="container grid gap-8 pt-6 mx-auto sm:grid-cols-1 md:grid-cols-2 ">
        {orgs &&
          orgs.map((org, i) => {
            return (
              <div key={i} className="rounded ">
                <OrgCard
                  org={org}
                  isHome={isHome}
                  isManageAble={isManageAble}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};
