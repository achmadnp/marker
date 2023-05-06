/* eslint-disable react/display-name */
import {
  Avatar,
  AvatarGroup,
  Button,
  DatePicker,
  DateRangePicker,
  Dropdown,
  IconButton,
  Popover,
  Progress,
  SelectPicker,
  Tooltip,
  Whisper,
  Table,
} from "rsuite";
import { forwardRef, memo, useState } from "react";
import Image from "next/image";
import CollaspedOutlineIcon from "@rsuite/icons/CollaspedOutline";
import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";
import { TrashIcon } from "@heroicons/react/20/solid";

const { Cell } = Table;

export const BaseCell = forwardRef((props, ref) => {
  const { children, rowData, ...rest } = props;

  return (
    <Cell ref={ref} rowData={rowData} onClick={props?.onClick} {...rest}>
      {children}
    </Cell>
  );
});

export const InputCell = memo(
  ({ rowData, data, value, onChange, ...props }) => {
    const handleChange = (e) => {
      onChange(rowData.id, e.target.value);
    };

    return (
      <BaseCell rowData={rowData} {...props}>
        <input
          type={props?.type ? props.type : "text"}
          value={rowData.amountSold}
          onChange={handleChange}
          className={` ${
            props?.disabled && "cursor-not-allowed"
          } border-2 border-gray-800 text-gray-900 text-center text-sm rounded-lg w-10/12 py-2.5 placeholder-gray-400`}
          required
          placeholder={props?.placeholder || ""}
          disabled={props?.disabled}
        />
      </BaseCell>
    );
  }
);

export const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props}>
    <Image
      src={rowData[dataKey]}
      alt={rowData[dataKey]}
      width={100}
      className="mx-auto"
    />
  </Cell>
);

export const ExpandCell = ({
  rowData,
  dataKey,
  expandedRowKeys,
  modifier = "no",
  onChange,
  ...props
}) => (
  <Cell {...props}>
    <IconButton
      appearance="ghost"
      color="cyan"
      onClick={() => {
        onChange(rowData);
      }}
      icon={
        expandedRowKeys.some((key) => key === rowData[modifier]) ? (
          <CollaspedOutlineIcon />
        ) : (
          <ExpandOutlineIcon />
        )
      }
    />
  </Cell>
);

export const DTRangeCell = ({
  rowData,
  data,
  value,
  onChange,
  name,
  ...props
}) => {
  const handleSelect = (value, name) => {
    onChange(rowData.no, value, name);
  };

  return (
    <Cell {...props} name={name}>
      <DateRangePicker
        block
        placement="autoVerticalEnd"
        appearance="subtle"
        format="dd/MM/yyyy"
        value={rowData.pStartEnd}
        style={{ width: 230 }}
        onChange={(value, e) => {
          handleSelect(value, name);
        }}
      />
    </Cell>
  );
};

// not yet ready
export const AsigneeCell = ({
  rowData,
  data,
  value,
  onChange,
  name,
  maxValue = 3,
  ...props
}) => {
  const [max, setMax] = useState(3);
  const handleSelections = (value, name) => {
    onChange(rowData.no, value, name);
    ref.current.close();
  };

  const handleRemove = (value, name) => {
    onChange(rowData.no, value, name, "pop");
    ref.current.close();
  };
  const ref = useRef();

  return (
    <Cell {...props} name={name}>
      <Whisper
        ref={ref}
        placement="autoVerticalStart"
        trigger="click"
        speaker={
          <Popover ref={ref}>
            <Dropdown.Menu className="overflow-y-scroll max-h-72">
              {rowData.pPIC.map((user, index) => (
                <Dropdown.Item key={index} eventKey={user}>
                  <div className="flex border-b">
                    <div className="flex flex-grow mb-1">
                      <Avatar
                        circle
                        key={user.name}
                        src={user.avatar}
                        alt={user.name}
                      />
                      <div className="mx-2 my-auto">{user.name}</div>
                    </div>
                    <Button
                      className="font-extrabold"
                      onClick={() => {
                        handleRemove(user, name);
                      }}
                      style={{
                        background: "transparent",
                        font: "#ffffff bold",
                      }}
                    >
                      <TrashIcon height={18} width={18} />
                    </Button>
                  </div>
                </Dropdown.Item>
              ))}

              <Dropdown.Item eventKey={data.length}>
                <div className="flex">
                  <Avatar circle>
                    <Button
                      onClick={() => {}}
                      style={{
                        background: "transparent",
                        font: "#ffffff bold",
                      }}
                    >
                      +
                    </Button>
                  </Avatar>
                  <div className="mx-2 my-auto">Assign New Person</div>
                </div>
              </Dropdown.Item>
              {data.map((user, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={user}
                  onSelect={(value, e) => {
                    handleSelections(value, name);
                  }}
                >
                  <div className="flex border-b">
                    <div className="flex flex-grow mb-1">
                      <Avatar
                        circle
                        key={user.name}
                        src={user.avatar}
                        alt={user.name}
                      />
                      <div className="mx-2 my-auto">{user.name}</div>
                    </div>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Popover>
        }
      >
        <AvatarGroup stack>
          {rowData.pPIC
            .filter((user, i) => i < max)
            .map((user, i) => (
              <Whisper
                key={i}
                placement="topEnd"
                speaker={<Tooltip>{user.name}</Tooltip>}
              >
                <Avatar
                  circle
                  key={user.name}
                  src={user.avatar}
                  alt={user.name}
                />
              </Whisper>
            ))}
          {rowData.pPIC.length - max > 0 && (
            <Avatar circle style={{ background: "#111" }}>
              <Button onClick={() => setMax(data.length)}>
                +{rowData.pPIC.length - max}
              </Button>
            </Avatar>
          )}
          {rowData.pPIC.length === 0 && (
            <Avatar>
              <Button>+</Button>
            </Avatar>
          )}
        </AvatarGroup>
      </Whisper>
    </Cell>
  );
};

export const DropdownCell = ({
  rowData,
  data,
  value,
  onChange,
  name,
  ...props
}) => {
  const handleSelect = (value, name) => {
    onChange(rowData.no, value, name);
    ref.current.close();
  };
  const ref = useRef();

  return (
    <Cell {...props} name={name} className="link-group">
      <Whisper
        ref={ref}
        placement="autoVerticalStart"
        trigger="click"
        speaker={
          <Popover ref={ref}>
            <Dropdown.Menu
              onSelect={(value, e) => {
                handleSelect(value, name);
              }}
            >
              {data.map((item, index) => (
                <Dropdown.Item key={index} eventKey={item}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Popover>
        }
      >
        <Button color={rowData.pStatus.color} appearance="ghost">
          {rowData.pStatus.name}
        </Button>
      </Whisper>
    </Cell>
  );
};
