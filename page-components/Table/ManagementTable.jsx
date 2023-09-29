import { useCallback, useState } from "react";
import { Table, Button, IconButton, Placeholder, Modal } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import PlusIcon from "@rsuite/icons/Plus";
import "rsuite/dist/rsuite.css";
import {
  AsigneeCell,
  DTRangeCell,
  DropdownCell,
  ExpandCell,
} from "@/components/Table/Cell";

// swr

const ManagementTable = () => {
  const [rowData, setRowData] = useState(); //data from swr or api fetch

  //this should come from fetch
  const users = [
    {
      avatar: "https://avatars.githubusercontent.com/u/12592949",
      name: "superman66",
      id: "personId-Wcy88Fd",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/8225666",
      name: "SevenOutman",
      id: "personId-Ucx8kFi",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/15609339",
      name: "hiyangguo",
      id: "personId-Al9C6y",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/14308293",
      name: "MarvelSQ",
      id: "personId-MF6aiFF",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/1203827",
      name: "simonguo",
      id: "personId-XI3Lk44",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/9625224",
      name: "theJian",
      id: "personId-AM71ULX3",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/15884443",
      name: "LeightonYao",
      id: "personId-HJ74JHX",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/10924138",
      name: "zmhawk",
      id: "personId-BV890KI",
      id: "personId-D9FiTY7G",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/2797600",
      name: "posebear1990",
      id: "personId-GO3LU7i",
      id: "personId-E4MOO9LA",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/23637144",
      name: "Sleaf",
      id: "personId-L6UV57IL",
    },
  ];

  //this should come from fetch
  const statusPool = [
    { name: "Not Started", color: "yellow" },
    { name: "on Hold", color: "orange" },
    { name: "Finished", color: "green" },
    { name: "on Going", color: "blue" },
    { name: "Discontinued", color: "red" },
  ];

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const rowKey = "no";
  const [sortCol, setSorCol] = useState("id");
  const [sortType, setSortType] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false); //for future reference: add dynamic column

  const [columnWidths, setColumnWidths] = useState({
    icon: 80,
    pName: 300,
    pDT: 250,
    pPIC: 200,
    pStatus: 220,
  });

  const sortData = () => {
    if (sortCol && sortType) {
      return rowData.sort((a, b) => {
        let x = a[sortCol];
        let y = b[sortCol];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return rowData;
  };

  const handleSortCol = (sortCol, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSorCol(sortCol);
      setSortType(sortType);
    }, 500);
  };

  const handleColumnResize = (colWidth, dataKey) => {
    setColumnWidths((prev) => {
      const nextColumnWidth = { ...prev };
      nextColumnWidth[dataKey] = colWidth;
      return nextColumnWidth;
    });
  };

  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
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

  const handleDataChange = useCallback(
    (no, value, name, modifier, distinct) => {
      if (modifier === "pop") {
        setRowData((prev) => {
          const poppedData = [...prev];
          if (Array.isArray(poppedData[no - 1][name])) {
            poppedData[no - 1][name] = poppedData[no - 1][name].filter(
              (data) => {
                return data.name !== value.name;
              }
            );
          }
          return poppedData;
        });
      } else if (modifier === "replace") {
        setRowData((prev) => {
          const nextData = [...prev];
          nextData[no - 1][name] = value;

          return nextData;
        });
      } else {
        setRowData((prev) => {
          const nextData = [...prev];
          if (Array.isArray(nextData[no - 1][name])) {
            nextData[no - 1][name].push(value);
          } else {
            nextData[no - 1][name] = value;
          }
          return nextData;
        });
      }
    },
    []
  );

  const calcHeight = data.length * 80;

  return (
    <div className="mx-auto my-4">
      <Table
        data={sortData()}
        headerHeight={84}
        rowHeight={80}
        height={600}
        bordered
        fillHeight
        style={{ border: "2px solid #2626af" }}
        className="max-w-full mx-4 text-lg font-semibold shadow-sm select-none shadow-gray-500/50 rounded-2xl "
        sortColumn={sortCol}
        sortType={sortType}
        onSortColumn={handleSortCol}
        loading={loading}
        rowKey={rowKey}
        expandedRowKeys={expandedRowKeys}
        rowExpandedHeight={calcHeight}
        renderRowExpanded={(rowData) => {
          //   return <ExpTable />;
        }}
        rowClassName={""} //use this to customize css (prolly using tailwind better)
      >
        <Column width={columnWidths.icon} fixed align="center">
          <HeaderCell>#</HeaderCell>
          <ExpandCell
            dataKey="pId"
            expandedRowKeys={expandedRowKeys}
            onChange={handleExpanded}
          />
        </Column>
        <Column
          width={columnWidths.pName}
          align="center"
          resizable
          onResize={handleColumnResize}
          sortable
          fullText
        >
          <HeaderCell style={{ fontSize: 20 }}>Project Name</HeaderCell>
          <Cell dataKey="pName" />
        </Column>
        <Column
          width={columnWidths.pDT}
          align="center"
          resizable
          onResize={handleColumnResize}
        >
          <HeaderCell style={{ fontSize: 20 }}>Timespan</HeaderCell>
          <DTRangeCell
            name={"pStartEnd"}
            dataKey="pStartEnd"
            onChange={handleDataChange}
          />
        </Column>
        <Column
          width={columnWidths.pPIC}
          align="center"
          resizable
          onResize={handleColumnResize}
        >
          <HeaderCell style={{ fontSize: 20 }}>{"Assignee(s)"}</HeaderCell>
          <AsigneeCell
            name={"pPIC"}
            dataKey="pPIC"
            data={users}
            onChange={handleDataChange}
          />
        </Column>
        <Column
          width={columnWidths.pStatus}
          align="center"
          resizable
          onResize={handleColumnResize}
        >
          <HeaderCell className="text-lg">Project Status</HeaderCell>
          <DropdownCell
            name={"pStatus"}
            dataKey="pStatus"
            data={statusPool}
            onChange={handleDataChange}
          />
        </Column>
      </Table>
    </div>
  );
};

export default ManagementTable;
