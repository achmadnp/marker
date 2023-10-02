import { useCallback, useState, useRef, useEffect } from "react";
import {
  Button,
  Dropdown,
  IconButton,
  Modal,
  Popover,
  Table,
  Whisper,
} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import "rsuite/dist/rsuite.css";
import PlusIcon from "@rsuite/icons/Plus";
import {
  AsigneeCell,
  DTPCell,
  DTRangeCell,
  DropdownCell,
  ExpandCell,
  HeaderPopover,
  InputCell,
  ProgressCell,
  SingleAsignee,
} from "@/components/Table/Cells";
import Link from "next/link";
import ExpandedRenderer from "./ExpandedRenderer";
import { handleColumnHeaderEdit } from "../functions/tables/tables";

const TableRenderer = ({ data, fields }) => {
  data.map((el, i) => {
    el.no = i;
  });

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRef, setEditRef] = useState();
  const [columns, setColumns] = useState(fields);
  const [expandedRowKey, setExpandedRowKeys] = useState([]);
  const [rowKey, setRowKey] = useState("no");
  const headerRef = useRef();

  // TODO: GET all users database with its role (maybe with swr?)
  const users = [
    {
      avatar: "https://avatars.githubusercontent.com/u/12592949",
      name: "superman66",
      id: "64f9aad96c8827625dc6493e",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/8225666",
      name: "SevenOutman",
      id: "64f9aaf26c8827625dc6493f",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/15609339",
      name: "hiyangguo",
      id: "64f9ab666c8827625dc64940",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/14308293",
      name: "MarvelSQ",
      id: "64f9ab6f6c8827625dc64941",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/1203827",
      name: "simonguo",
      id: "64f9ab756c8827625dc64942",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/9625224",
      name: "theJian",
      id: "64f9abdb6c8827625dc64943",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/15884443",
      name: "LeightonYao",
      id: "64f9abe56c8827625dc64944",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/10924138",
      name: "zmhawk",
      id: "personId-BV890KI",
      id: "64f9abeb6c8827625dc64945",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/2797600",
      name: "posebear1990",
      id: "personId-GO3LU7i",
      id: "64f9abf36c8827625dc64946",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/23637144",
      name: "Sleaf",
      id: "64f9abfa6c8827625dc64947",
    },
  ];

  // TODO: GET dropdown data
  const ddData = data.map((data, i) => {
    return {
      name: data.pStatus,
      color: data.pStatusColor,
    };
  });

  const renderColumns = () => {
    return columns.map((field, index) => {
      const cellType = {
        base: (
          <Cell
            className="table-cell hover:text-blue-500"
            dataKey={field.dataKey}
          ></Cell>
        ),
        input: "",
        datepick: "",
        daterange: <DTRangeCell dataKey={field.dataKey} />,
        singleUser: "",
        multipleAsignee: (
          <AsigneeCell name={"pPIC"} dataKey="pPIC" data={users} />
        ),
        dropdown: (
          <DropdownCell
            dataKey={field.dataKey}
            name={field.cellName}
            data={ddData}
            onChange={() => {}}
          />
        ),
        progress: <ProgressCell />,
      };
      const cellToRender = cellType[field.cellType] || cellType["base"];

      if (!field.editableCol) {
        return (
          <Column
            key={index}
            width={300}
            align="center"
            flexGrow={1}
            fixed={field.resizeable ? false : "left"}
          >
            <HeaderCell className="px-8 " style={{ fontSize: 20 }}>
              {field.headerName}
            </HeaderCell>
            {cellToRender}
          </Column>
        );
      }

      return (
        <Column
          key={index}
          width={300}
          align="center"
          flexGrow={1}
          fixed={field.resizeable ? false : "left"}
        >
          <HeaderCell className="px-8" style={{ fontSize: 20 }}>
            <div className="m-auto">{field.headerName}</div>
            <div className="absolute top-0 right-0 h-1">
              <Whisper
                ref={headerRef}
                trigger={"click"}
                placement="bottom"
                speaker={
                  <Popover ref={headerRef}>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        style={{ color: "blue" }}
                        onClick={() => {
                          setEditRef(field);
                          setEditOpen(true);
                          headerRef.current.close();
                        }}
                      >
                        Edit Header Label
                      </Dropdown.Item>
                      <Dropdown.Item style={{ color: "red" }}>
                        Empty Column Data
                      </Dropdown.Item>
                      <Dropdown.Separator />
                      <Dropdown.Item style={{ color: "orange" }}>
                        Edit Permission
                      </Dropdown.Item>
                      <Dropdown.Item style={{ color: "red" }} color="red">
                        Delete Column
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Popover>
                }
              >
                <Button
                  style={{ height: "18px" }}
                  color="blue"
                  appearance="subtle"
                >
                  ...
                </Button>
              </Whisper>
            </div>
          </HeaderCell>
          {cellToRender}
        </Column>
      );
    });
  };

  const handleHeaderEdit = async ({ hId, hName }) => {
    setEditRef();
    setLoading(true);
    setEditOpen(false);
    const res = await handleColumnHeaderEdit(hId, hName);
    const colArr = [];
    console.log(columns);

    if (res.status === "success") {
      for (const key in columns) {
        if (columns.hasOwnProperty(key)) {
          const index = parseInt(key);
          colArr[index] = columns[key];
        }
      }

      console.log(colArr);

      const found = colArr.findIndex((e) => e._id === hId);
      colArr[found].headerName = hName;
      setColumns(colArr);
    } else {
      // popup modal
    }
    setLoading(false);
  };

  const handleCreateColumn = async (props) => {
    setLoading(true);
    setOpenModal(false);

    try {
      const res = await fetch(`../api/tables/fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: "",
          headerName: props.data.fieldLabel,
          dataKey: props.data.dataKey,
          cellType: props.type,
          cellName: props.data.fieldLabel,
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();
    } catch (error) {
      console.log(`error creating column`);
    }

    setColumns([
      ...columns,
      {
        cellName: props.data.fieldLabel,
        cellType: props.type,
        dataKey: props.data.dataKey,
        headerName: props.data.fieldLabel,
        resizeable: false,
      },
    ]);
    setOpenModal(false);
  };

  const handleColEdit = async (id) => {
    const nextData = Object.assign([], data);
    const activeItem = nextData.find((item) => item.id === id);
    activeItem.status = activeItem.status ? null : "EDIT";
    console.log(nextData);
  };

  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKey.forEach((key) => {
      if (key == rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }

    setExpandedRowKeys(nextExpandedRowKeys);
  };

  return (
    <div className="mx-auto my-4">
      <Table
        data={data}
        headerHeight={84}
        rowHeight={80}
        height={600} //need to calculate height when expanded
        bordered
        fillHeight
        expandedRowKeys={expandedRowKey}
        rowExpandedHeight={data.length * 80} // replace with expanded data
        rowKey={rowKey}
        renderRowExpanded={(data) => {
          if (data.no === 0) {
            return <ExpandedRenderer />;
          }
          return (
            <div className="flex w-full h-full">
              <div className="m-auto text-center">
                <div className="tracking-wide text-red-600">
                  Cannot retrieve expandable content or is empty.
                </div>
                <div className="mt-2 text-sm">
                  <Link href={"/"}>Assign Expandable Content</Link> or{" "}
                  <Link href={"/"}>refetch</Link>.
                </div>
              </div>
            </div>
          );
        }}
        style={{ border: "2px solid #2626af" }}
        className="max-w-full mx-4 text-lg font-semibold shadow-sm select-none shadow-gray-500/50 rounded-2xl "
        loading={loading}
      >
        <Column width={200} fixed align="center">
          <HeaderCell>#</HeaderCell>
          <ExpandCell
            dataKey="pId"
            expandedRowKeys={expandedRowKey}
            onChange={handleExpanded}
          />
        </Column>
        {renderColumns()}
        <Column align="center" width={200}>
          <HeaderCell>
            <IconButton
              onClick={() => {
                setOpenModal(true);
              }}
              icon={<PlusIcon />}
            >
              New Column
            </IconButton>
          </HeaderCell>
          <ActionCell dataKey={"id"} onClick={handleColEdit} />
        </Column>
      </Table>
      <NewColModal
        open={openModal}
        onClose={setOpenModal}
        handleCreate={handleCreateColumn}
      />
      <EditModal
        open={editOpen}
        refField={editRef}
        onClose={setEditOpen}
        handleEdit={handleHeaderEdit}
      />
    </div>
  );
};

export default TableRenderer;

const NewColModal = ({ open, onClose: isOpen, handleCreate }) => {
  const [selectedItem, setSelectedItem] = useState("Select column Type");
  const [newColType, setNewColType] = useState("base");
  const [newColName, setNewColName] = useState("");
  const [dataKey, setdataKey] = useState("");
  const [headerStatus, setHeaderStatus] = useState("init");
  const [nameStatus, setnameStatus] = useState("init");

  const fileTypeRef = useRef();
  const accessibleRef = useRef();

  const isViolated = () => {
    setHeaderStatus("error");
  };

  const formVariant = {
    init: "bg-blue-100 border border-blue-600",
    error: "bg-red-100 border border-red-500",
  };

  const handleSelectColType = (item) => {
    setSelectedItem(item.label);
    setNewColType(item.value);
    fileTypeRef.current.close();
  };

  const handleColNameChange = (e) => {
    setNewColName(e.target.value);
  };

  const handleDataKeyChange = (e) => {
    setdataKey(e.target.value);
  };

  const dropdownItems = [
    {
      label: "Text",
      value: "base",
    },
    {
      label: "Date Picker",
      value: "datepick",
    },
    {
      label: "Date Range picker",
      value: "daterange",
    },
    {
      label: "Single person",
      value: "singleUser",
    },
    {
      label: "Multiple person",
      value: "multipleAsignee",
    },
    {
      label: "Dropdown",
      value: "dropdown",
    },
    {
      label: "Progression",
      value: "progress",
    },
  ];
  return (
    <>
      <Modal backdrop="static" open={open} onClose={() => isOpen(false)}>
        <Modal.Header>
          <Modal.Title>New Column: Column Type</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="flex mt-4 space-x-4">
            <div className="m-1">Select Column Type</div>
            <Whisper
              ref={fileTypeRef}
              trigger="click"
              placement="auto"
              speaker={
                <Popover title="Select Column Type" ref={fileTypeRef}>
                  <Dropdown.Menu onSelect={handleSelectColType}>
                    {dropdownItems.map((item) => (
                      <Dropdown.Item key={item.value} eventKey={item}>
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Popover>
              }
            >
              <Button color="blue" appearance="ghost">
                {selectedItem}
              </Button>
            </Whisper>
          </div>

          <div className="flex mt-4 space-x-4">
            <div className="m-1">Header name</div>
            <div className="mt-1">
              <input
                onSelect={() => {
                  setHeaderStatus("init");
                }}
                onBlur={() => {}}
                onChange={handleColNameChange}
                value={newColName}
                className={`px-1 min-h-[24px]  rounded-md ${formVariant[headerStatus]}`}
              />
            </div>
          </div>

          <div className="flex mt-4 space-x-4">
            <div className="m-1">Column name</div>
            <div className="mt-1">
              <Whisper
                trigger={"hover"}
                placement="rightEnd"
                followCursor
                speaker={
                  <Popover>
                    <div className="text-lg">
                      This is filled with dataKey. Please don&apos;t use spaces.
                    </div>
                    <div className="italic">
                      E.g. Header Name:{" "}
                      <span className="text-red-500 underline">
                        Project Name
                      </span>
                      . this form can be filled with{" "}
                      <span className="text-red-500 underline">pName</span>
                    </div>
                  </Popover>
                }
              >
                <input
                  onSelect={() => {
                    setnameStatus("init");
                  }}
                  onChange={handleDataKeyChange}
                  value={dataKey}
                  className={`px-1 min-h-[24px]  rounded-md ${formVariant[nameStatus]}`}
                />
              </Whisper>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              handleCreate({
                type: newColType,
                data: {
                  fieldLabel: newColName,
                  dataKey,
                },
              });

              setSelectedItem("Select column type");
              setNewColName("");
              setNewColType("base");
            }}
            appearance="primary"
          >
            Ok
          </Button>
          <Button onClick={() => isOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditModal = ({ open, onClose: isOpen, refField, handleEdit }) => {
  const [header, setHeader] = useState(refField?.headerName || "");

  useEffect(() => {
    if (open) {
      setHeader(refField.headerName);
    }
  }, []);

  return (
    <>
      <Modal backdrop="static" open={open} onClose={() => isOpen(false)}>
        <Modal.Header>
          <Modal.Title>Edit Column Header</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex mt-4 space-x-4">
            <div className="m-2 text-lg">Header name: </div>
            <div className="mt-1">
              <input
                onChange={(e) => setHeader(e.target.value)}
                value={header}
                className={`p-2 min-h-[24px]  rounded-md bg-blue-100 border border-blue-600`}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              handleEdit({
                hId: refField._id,
                hName: header,
              });
              setHeader("");
            }}
            appearance="primary"
          >
            Proceed
          </Button>
          <Button onClick={() => isOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: "6px" }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick(rowData.id);
        }}
      >
        {rowData.status === "EDIT" ? "Save" : "Edit"}
      </Button>
    </Cell>
  );
};

const Expandable = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: "6px" }}>
      <Button
        appearance="link"
        onClick={() => {
          console.log(rowData);
          onClick(rowData.id);
        }}
      >
        {rowData.status === "EDIT" ? "Save" : "Edit"}
      </Button>
    </Cell>
  );
};
