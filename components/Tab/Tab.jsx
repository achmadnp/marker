import { useState } from "react";
import { Animation } from "rsuite";

export const Tab = ({ tabs, children }) => {
  const [active, setActive] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  return (
    <div>
      {/* responsive */}
      <div className="relative w-11/12 mx-auto bg-white rounded sm:hidden">
        <select
          aria-label="Selected tab"
          className="relative z-10 block w-full p-3 text-gray-600 bg-transparent border border-gray-300 rounded appearance-none form-select"
        >
          {tabs.map((tab, i) => (
            <option className="text-sm text-gray-600" key={i}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden h-12 bg-white rounded shadow xl:w-full xl:mx-0 sm:block">
        <ul className="flex px-5 ml-4 first:mx-0">
          {tabs.map((tab, i) => (
            <li
              key={i}
              onClick={() => setActive(i)}
              className={
                active == i
                  ? "text-sm border-indigo-600 pt-3 rounded-t text-indigo-600 mr-12"
                  : "text-sm text-gray-600 py-3 flex items-center mr-12 hover:text-indigo-700 cursor-pointer"
              }
            >
              <div className="flex items-center mb-3">
                {tab.icon && <span>{icon}</span>}
                <span className="ml-1 font-normal whitespace-nowrap">
                  {tab.name}
                </span>
              </div>
              <Animation.Fade in={active === i}>
                <div className="w-full h-1 bg-indigo-700 rounded-t-md" />
              </Animation.Fade>
            </li>
          ))}
        </ul>

        <div className="overflow-y-hidden">
          {tabs.map((tab, i) => (
            <Animation.Collapse
              key={i}
              in={active === i}
              unmountOnExit={true}
              dimension={"height"}
            >
              {tab.content}
            </Animation.Collapse>
          ))}
        </div>
      </div>
    </div>
  );
};
