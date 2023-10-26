import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState } from "react";
import { CBadge } from "../Badge/Badge";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { classNames } from "primereact/utils";

export const ButtonCell = ({ onClick, text }) => {
  return (
    <button className="p-1 border rounded border-slate-300" onClick={onClick}>
      {text}
    </button>
  );
};

export const ImageCell = () => {};

export const SelectCell = ({
  data,
  dataKey,
  fieldId,
  value,
  options,
  color,
  onSelect,
  onInput,
  onDeleteOpt,
}) => {
  const op = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [inputColor, setInputColor] = useState("#ffffff");
  const [selects, setSelects] = useState([
    { label: "On Going", value: "Active", bgcolor: "#52da59" },
    { label: "Expired", value: "Active", bgcolor: "#ce6a5d" },
    { label: "Finished", value: "Active", bgcolor: "#432fb3" },
    { label: "Failed", value: "Active", bgcolor: "#52da59" },
    { label: "Staged", value: "Active", bgcolor: "#52da59" },
    { label: "Active", value: "Active", bgcolor: "#52da59" },
    { label: "Active", value: "Active", bgcolor: "#52da59" },
    { label: "Active", value: "Active", bgcolor: "#52da59" },
  ]);

  const handleShowInput = (e) => {
    setShowInput(false);

    setTimeout(() => {
      setShowInput(true);
    }, 600);
  };

  const handleOptionKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.value !== "") {
        onInput(
          e.target.value,
          inputColor.startsWith("#") ? inputColor : `#${inputColor}`,
          data,
          fieldId
        );
        selects.push({
          label: e.target.value,
          value: e.target.value,
          bgcolor: inputColor.startsWith("#") ? inputColor : `#${inputColor}`,
        });
        setInputColor("#ffffff");
      }
      setShowInput(false);
    }
  };

  const handleSelect = (e, option) => {
    op.current.toggle(e);
    data[dataKey] = option?.value;
    data[`${dataKey}Color`] = option?.color;

    onSelect(data);
  };

  const handleDeleteBadge = (e, option) => {
    e.stopPropagation();
    onDeleteOpt(option.value, option.color, data, fieldId);
  };

  const badgeHovProps =
    "hover:z-10 hover:text-red-400 duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg";

  const hovCloseProps = "hover:scale-110 hover:rotate-180 duration-300";

  return (
    <div className="">
      <div className="" onClick={(e) => op.current.toggle(e)}>
        <CBadge
          value={value || "## N/A ##"}
          backgroundColor={color || "#bdbdbd"}
        >
          Active
        </CBadge>
      </div>
      <OverlayPanel ref={op} showCloseIcon className="max-w-xs min-w-[120px]">
        <div className="flex flex-wrap gap-4">
          {options &&
            options.map((option, i) => (
              <div
                className="relative duration-1000 animate-fadeIn1s"
                key={i}
                onClick={(e) => handleSelect(e, option)}
              >
                <CBadge
                  icon={
                    <i
                      onClick={(e) => handleDeleteBadge(e, option)}
                      className={`ml-2 pi pi-trash ${badgeHovProps}`}
                    />
                  }
                  value={option.value}
                  backgroundColor={option.color}
                ></CBadge>
              </div>
            ))}
          {showInput && (
            <div className="relative">
              <InputText
                className="p-1 text-lg border rounded-md bg-slate-400 border-slate-600"
                type="text"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleOptionKeyDown}
              />
              <div
                onClick={() => setShowInput(false)}
                className={`absolute right-0 z-30 p-0 text-lg text-red-500 transform translate-x-1.5 rounded-full border border-red-500 -translate-y-1/2 bg-slate-200 top-1 pi pi-times ${hovCloseProps}`}
              />
              <ColorPicker
                className="absolute z-10 p-0 text-lg transform -translate-y-1/2 top-1/2 right-2 text-slate-100"
                value={inputColor}
                onChange={(e) => setInputColor(e.value)}
              />
            </div>
          )}
          <div onClick={handleShowInput}>
            <CBadge value={"+"} backgroundColor={"#bdbdbd4e"}></CBadge>
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export const DTPCell = ({ data, dataKey, date, onChange }) => {
  const d = date ? new Date(date) : undefined;

  const handleChange = (e) => {
    data[dataKey] = e.value;
    onChange(data);
  };

  return (
    <Calendar
      placeholder="DD/MM/YYYY"
      value={d}
      dateFormat="dd/mm/yy"
      onSelect={handleChange}
      onChange={handleChange}
      className="p-2"
      showIcon
      pt={{
        dropdownButton: {
          root: { className: "bg-teal-500 border-teal-500" },
        },
      }}
    />
  );
};

export const DTRangeCell = ({ data, dataKey, dates, onChange }) => {
  const toDates = (dates) => {
    return dates?.map((date) => new Date(date));
  };
  const [d, setD] = useState(toDates(dates));
  const handleChange = (e) => {
    data[dataKey] = d;
    onChange(data);
  };

  return (
    <Calendar
      value={d || toDates(dates)}
      onChange={(e) => {
        setD(e.value);
      }}
      onHide={handleChange}
      selectionMode="range"
      readOnlyInput
      className="p-2"
      dateFormat="dd/mm/yy"
      placeholder="DD/MM/YYYY"
      showIcon
      pt={{
        dropdownButton: {
          root: { className: "bg-teal-500 border-teal-500" },
        },
      }}
    />
  );
};

export const AvatarCell = ({ current, items, data, dataKey, onChange }) => {
  const avatarRef = useRef();

  const showMenu = (event) => {
    avatarRef.current.toggle(event);
  };

  const handleChange = (e, user, op) => {
    if (op === "select") {
      data[dataKey] = user.id;
      onChange(data);
    } else if (op === "remove") {
      data[dataKey] = null;
      onChange(data);
    } else {
      e.preventDefault();
    }
  };

  let userPool = [
    {
      label: "Selected",
      items: current
        ? [
            {
              id: current.id,
              template: (item, options) => {
                return (
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={classNames(
                      options.className,
                      "w-full p-link flex align-items-center p-2 pl-4 text-color hover:hover:bg-slate-200 border-noround"
                    )}
                  >
                    <Avatar
                      // image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                      className="mr-2"
                      shape="circle"
                      label={current.label}
                    />
                    <div className="flex flex-col align">
                      <span className={` font-bold `}>{current.name}</span>
                      <span className="text-sm">Member</span>
                    </div>
                    {item && (
                      <i
                        onClick={(e) => handleChange(e, current, "remove")}
                        className="p-1 ml-auto text-red-600 duration-300 bg-red-200 rounded-full hover:z-10 hover:scale-110 hover:rotate-12 hover:shadow-lg pi pi-times"
                      ></i>
                    )}
                  </button>
                );
              },
              command: (e) => {
                toast.current.show({
                  severity: "success",
                  summary: "Updated",
                  detail: "Data Updated",
                  life: 3000,
                });
              },
            },
          ]
        : [
            {
              template: (item, options) => {
                return (
                  <div className="flex w-full">
                    <span className="mx-auto">No User Selected</span>
                  </div>
                );
              },
            },
          ],
    },
    {
      label: "User Pool",
      items: items?.map((user) => {
        return {
          id: user.id,
          selected: current?.id === user.id,
          template: (item, options) => {
            return (
              <button
                onClick={(e) => handleChange(e, user, "select")}
                className={classNames(
                  options.className,
                  item.selected && "bg-green-100 ",
                  "w-full relative p-link flex align-items-center p-2 pl-4 text-color hover:bg-slate-200 border-noround"
                )}
              >
                <Avatar
                  // image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  className="mr-2"
                  shape="circle"
                  label={user.label}
                />
                <div className="flex flex-col align">
                  <span
                    className={`${
                      item.selected ? "text-green-500" : "text-slate-800"
                    } font-bold `}
                  >
                    {user.name}
                  </span>
                  <span className="text-sm">Member</span>
                </div>
                {item && (
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(user);
                      // onRemove(user);
                    }}
                    className="absolute p-1 ml-auto text-red-600 duration-300 bg-red-200 rounded-full right-2 hover:z-10 hover:scale-110 hover:rotate-12 hover:shadow-lg pi pi-trash"
                  ></i>
                )}
              </button>
            );
          },
          command: (e, op) => {
            console.log(e, op);
          },
        };
      }),
    },
  ];

  return (
    <div>
      <Tooltip target=".TooltipName" position="top" autoHide={false} />
      {current && (
        <Avatar
          className="hover:z-10 hover:border-2 hover:border-blue-500 TooltipName"
          onClick={showMenu}
          label={current.label}
          size="large"
          shape="circle"
          data-pr-tooltip={current.name}
        />
      )}
      {!current && (
        <Avatar
          className="text-sm hover:z-10 hover:border-2 hover:border-blue-500 TooltipName"
          onClick={showMenu}
          label="N/A"
          size="large"
          shape="circle"
          data-pr-tooltip={"UNASSIGNED"}
        />
      )}
      <Menu className="min-w-[320px]" ref={avatarRef} model={userPool} popup />
    </div>
  );
};

export const MultipleAvatarCell = ({
  currents,
  items,
  data,
  dataKey,
  onAssign,
  onUnassign,
  onRemove,
}) => {
  const avatarRef = useRef();

  const handleAssign = (e, user) => {
    // dataKey must be array?
    if (data[dataKey] instanceof Array) {
      if (data[dataKey].includes(user.id)) {
        e.preventDefault();
        console.log("already assigned");
      } else {
        data[dataKey] = [...data[dataKey], user.id];
        onAssign(data);
      }
      // does not exist (this should happen only once)
    } else if (!data[dataKey]) {
      data[dataKey] = [user.id];
      onAssign(data);
    }
  };

  const handleUnassign = (e, user) => {
    if (data[dataKey] instanceof Array) {
      if (data[dataKey].includes(user.id)) {
        data[dataKey] = data[dataKey].filter((id) => id !== user.id);
        console.log(data);
        onUnassign(data);
      } else {
        console.log("not assigned");
      }
    }
  };

  const handleRemove = (user) => {};

  const showMenu = (event) => {
    avatarRef.current.toggle(event);
  };

  let userPool = [
    {
      label: "Assigned",
      items: currents
        ? currents?.map((user) => {
            return {
              id: user.id,
              template: (item, options) => {
                return (
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={classNames(
                      options.className,
                      "w-full p-link flex align-items-center p-2 pl-4 text-color hover:hover:bg-slate-200 border-noround"
                    )}
                  >
                    <Avatar
                      // image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                      className="mr-2"
                      shape="circle"
                      label={user.label}
                    />
                    <div className="flex flex-col align">
                      <span className={` font-bold `}>{user.name}</span>
                      <span className="text-sm">Member</span>
                    </div>
                    {item && (
                      <i
                        onClick={(e) => handleUnassign(e, user)}
                        className="p-1 ml-auto text-red-600 duration-300 bg-red-200 rounded-full hover:z-10 hover:scale-110 hover:rotate-12 hover:shadow-lg pi pi-times"
                      ></i>
                    )}
                  </button>
                );
              },
              command: (e) => {
                toast.current.show({
                  severity: "success",
                  summary: "Updated",
                  detail: "Data Updated",
                  life: 3000,
                });
              },
            };
          })
        : [
            {
              template: (item, options) => {
                return (
                  <div className="flex w-full">
                    <span className="mx-auto">No User Assigned</span>
                  </div>
                );
              },
            },
          ],
    },
    {
      label: "User Pool",
      items: items?.map((user) => {
        return {
          id: user.id,
          selected: currents?.some((curr) => curr.id === user.id),
          template: (item, options) => {
            return (
              <button
                onClick={(e) => handleAssign(e, user)}
                className={classNames(
                  options.className,
                  item.selected && "bg-green-100 ",
                  "w-full relative p-link flex align-items-center p-2 pl-4 text-color hover:bg-slate-200 border-noround"
                )}
              >
                <Avatar
                  // image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  className="mr-2"
                  shape="circle"
                  label={user.label}
                />
                <div className="flex flex-col align">
                  <span
                    className={`${
                      item.selected ? "text-green-500" : "text-slate-800"
                    } font-bold `}
                  >
                    {user.name}
                  </span>
                  <span className="text-sm">Member</span>
                </div>
                {item && (
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(user);
                      // onRemove(user);
                    }}
                    className="absolute p-1 ml-auto text-red-600 duration-300 bg-red-200 rounded-full right-2 hover:z-10 hover:scale-110 hover:rotate-12 hover:shadow-lg pi pi-trash"
                  ></i>
                )}
              </button>
            );
          },
          command: (e, op) => {
            console.log(e, op);
            // onAssign(user);
            // toast.current.show({
            //   severity: "success",
            //   summary: "Updated",
            //   detail: "Data Updated",
            //   life: 3000,
            // });
          },
        };
      }),
    },
  ];

  return (
    <div>
      <Tooltip target=".TooltipName" position="top" autoHide={false} />
      <AvatarGroup>
        {currents &&
          currents.map((current, i) => (
            <Avatar
              key={i}
              className="hover:z-10 hover:border-2 hover:border-blue-500 TooltipName"
              onClick={showMenu}
              label={current.label}
              size="large"
              shape="circle"
              data-pr-tooltip={current.name}
            />
          ))}
        {!currents && (
          <Avatar
            className="text-sm hover:z-10 hover:border-2 hover:border-blue-500 TooltipName"
            onClick={showMenu}
            label="N/A"
            size="large"
            shape="circle"
            data-pr-tooltip={"UNASSIGNED"}
          />
        )}
      </AvatarGroup>
      <Menu className="min-w-[320px]" ref={avatarRef} model={userPool} popup />
    </div>
  );
};

export const DropdownCell = ({ current, currentColor, options }) => {
  const [selected, setSelected] = useState(current);
  const overlayPanelRef = useRef();

  const handleClick = (event) => {
    overlayPanelRef.current.toggle(event);
  };

  return (
    <div className="w-fit">
      <Dropdown
        value={selected}
        onChange={(e) => setSelected(e.value)}
        options={options}
        optionLabel="label"
        placeholder={current || "Select Item"}
        className={`w-full text-lg font-semibold mx-auto md:w-14rem border border-blue-400 ${
          selected?.color ?? `bg-${currentColor}-400`
        }`}
        dropdownIcon="none"
        itemTemplate={(option) => (
          <div
            className={`min-w-[100px] tracking-wide flex p-1 text-lg font-semibold text-center rounded-md ${option.color}`}
          >
            {option.label}
          </div>
        )}
      />
    </div>
  );
};

export const ProgressCell = ({ value }) => {};
