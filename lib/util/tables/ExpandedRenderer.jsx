import { useCallback, useState } from "react";
import {
  Animation,
  Button,
  ButtonGroup,
  Drawer,
  List,
  Placeholder,
  Table,
  Timeline,
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import {
  AsigneeCell,
  ExpandCell,
  SingleAsignee,
} from "@/components/Table/Cells";
import { FaCreditCard } from "react-icons/fa";
import PlaneIcon from "@rsuite/icons/legacy/Plane";
import TruckIcon from "@rsuite/icons/legacy/Truck";
import UserIcon from "@rsuite/icons/legacy/User";
import CheckIcon from "@rsuite/icons/legacy/Check";
import { Tab } from "@/components/Tab/Tab";

const { Column, HeaderCell, Cell } = Table;

const data = [
  {
    no: 1,
    pId: "91d9f53f-fb0b-4c50-9399-f4af9af6a7bc",
    pName: "ProjectName1",
    pStartEnd: [new Date("01/05/2021"), new Date("01/05/2030")],
    pStatus: { name: "Discontinued", color: "red" },
    pPIC: {
      avatar: "https://avatars.githubusercontent.com/u/12592949",
      name: "superman66",
      id: "personId-Wcy88Fd",
    },
    pComment: "Transfered to project 2",
  },
  {
    no: 2,
    pId: "a360462c-f1e7-4b63-9d6c-574f3c7e8374",
    pName: "ProjectName2",
    pStartEnd: [new Date("01/05/2021"), new Date("01/05/2030")],
    pStatus: { name: "on Going", color: "blue" },
    pPIC: {
      avatar: "https://avatars.githubusercontent.com/u/23637144",
      name: "Sleaf",
      id: "personId-XF1klF9",
    },
  },
  {
    no: 3,
    pId: "1e1e0ae2-88e3-4733-8cc8-5acb42036890",
    pName: "ProjectName3",
    pStartEnd: [new Date("01/05/2021"), new Date("01/05/2030")],
    pStatus: { name: "Finished", color: "green" },
    pPIC: {
      avatar: "https://avatars.githubusercontent.com/u/14308293",
      name: "MarvelSQ",
      id: "personId-MF6aiFF",
    },
  },
  {
    no: 4,
    pId: "ab954848-f3f5-4ffe-8624-ae4529cb9afb",
    pName: "ProjectName4",
    pStartEnd: [new Date("01/05/2021"), new Date("01/05/2030")],
    pStatus: { name: "Not Started", color: "yellow" },
    pPIC: {
      avatar: "https://avatars.githubusercontent.com/u/14308293",
      name: "MarvelSQ",
      id: "personId-MF6aiFF",
    },
  },
  {
    no: 5,
    pId: "f41bd67c-7dbe-4cc7-ab06-21c3ac1a8dd9",
    pName: "ProjectName5",
    pStartEnd: [new Date("01/05/2021"), new Date("01/05/2030")],
    pStatus: { name: "on Hold", color: "orange" },
    pPIC: {
      avatar: "https://avatars.githubusercontent.com/u/10924138",
      name: "zmhawk",
      id: "personId-BV890KI",
    },
  },
];

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

const ExpandedRenderer = () => {
  const [columnWidths, setColumnWidths] = useState({
    icon: 80,
    pName: 300,
    pDT: 250,
    pPIC: 200,
    pStatus: 220,
  });

  const [rowData, setRowData] = useState(data);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleColumnResize = (colWidth, dataKey) => {
    setColumnWidths((prev) => {
      const nextColumnWidth = { ...prev };
      nextColumnWidth[dataKey] = colWidth;
      return nextColumnWidth;
    });
  };

  const populateDrawerData = (data) => {
    console.log(data);
  };

  const handleDataChange = useCallback((no, value, name) => {
    setRowData((prev) => {
      const nextData = [...prev];
      if (Array.isArray(nextData[no - 1][name])) {
        nextData[no - 1][name].push(value);
      } else {
        nextData[no - 1][name] = value;
      }
      return nextData;
    });
  }, []);

  return (
    <div className="mx-auto ">
      <Table
        headerHeight={44}
        rowHeight={50}
        height={rowData.length * 80}
        cellBordered
        fillHeight
        data={rowData}
        className="max-w-full mx-12 my-2 text-sm font-semibold shadow-sm select-none shadow-gray-500-500/50 "
      >
        <Column width={columnWidths.icon} align="center">
          <HeaderCell>#</HeaderCell>
          <Cell dataKey="pId" />
        </Column>
        <Column
          width={columnWidths.pName}
          align="center"
          resizable
          onResize={handleColumnResize}
          sortable
          fullText
        >
          <HeaderCell style={{ fontSize: 20 }}>Tasks</HeaderCell>
          <Cell dataKey="pName" />
        </Column>
        <Column
          width={columnWidths.pPIC}
          align="center"
          resizable
          onResize={handleColumnResize}
        >
          <HeaderCell style={{ fontSize: 20 }}>{"PIC"}</HeaderCell>
          <SingleAsignee
            name={"pPIC"}
            dataKey="pPIC"
            data={users}
            onChange={handleDataChange}
          />
        </Column>
        <Column width={columnWidths.pName} align="center">
          <HeaderCell>Attachments</HeaderCell>
          <Cell dataKey="pId" />
        </Column>
        <Column width={columnWidths.pName} align="center">
          <HeaderCell>Status</HeaderCell>
          <Cell dataKey="pId" />
        </Column>
        <Column width={columnWidths.pName} align="center">
          <HeaderCell>Action</HeaderCell>
          <Cell>
            <ButtonGroup>
              <Button
                color="blue"
                appearance="ghost"
                className="h-5"
                onClick={setOpenDrawer}
              >
                Detail
              </Button>
              <Button color="red" appearance="ghost" className="h-5">
                Delete
              </Button>
            </ButtonGroup>
          </Cell>
        </Column>
      </Table>

      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Drawer.Header>
          <Drawer.Title>Task Detail</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setOpenDrawer(false)}>Close</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Tab
            tabs={[
              {
                name: "Task Detail",
                content: (
                  <div>
                    <div className="my-2 text-lg font-semibold">
                      Description
                    </div>
                    <div className="ml-1 text-sm font-light">
                      Richard McClintock, a Latin professor at Hampden-Sydney
                      College in Virginia, looked up one of the more obscure
                      Latin words, consectetur, from a Lorem Ipsum passage, and
                      going through the cites of the word in classical
                      literature, discovered the undoubtable source.
                    </div>
                    <div className="my-2 text-lg font-semibold">
                      Date Published
                    </div>
                    <div className="ml-1 text-sm font-light">02 May 2022</div>
                  </div>
                ),
              },
              {
                name: "Changelogs",
                content: (
                  <div>
                    <div className="mt-2 text-lg font-semibold">Timeline</div>
                    <Timeline className="custom-timeline">
                      <Timeline.Item dot={<FaCreditCard />}>
                        {" "}
                        <p>March 1, 10:20</p>
                        <p>Your order starts processing</p>
                      </Timeline.Item>
                      <Timeline.Item>
                        <p>March 1, 11:34</p>
                        <p>
                          The package really waits for the company to pick up
                          the goods
                        </p>
                      </Timeline.Item>
                      <Timeline.Item>
                        <p>March 1, 16:20</p>
                        <p>[Packed]</p>
                        <p>Beijing company has received the shipment</p>
                      </Timeline.Item>
                      <Timeline.Item dot={<PlaneIcon />}>
                        <p>March 2, 06:12</p>
                        <p>[In transit]</p>
                        <p>Order has been shipped from Beijing to Shanghai</p>
                      </Timeline.Item>
                      <Timeline.Item dot={<TruckIcon />}>
                        <p>March 2, 09:20</p>
                        <p>[In transit]</p>
                        <p>
                          Sended from the Shanghai Container Center to the
                          distribution center
                        </p>
                      </Timeline.Item>
                      <Timeline.Item dot={<UserIcon />}>
                        <p>March 3, 14:20</p>
                        <p>[Delivery]</p>
                        <p>
                          Shanghai Hongkou District Company Deliverer: Mr. Li,
                          currently sending you a shipment
                        </p>
                      </Timeline.Item>
                      <Timeline.Item
                        dot={
                          <CheckIcon
                            className="rounded-full"
                            style={{ background: "#15b215", color: "#fff" }}
                          />
                        }
                      >
                        <p>March 3, 17:50</p>
                        <p>[Received]</p>
                        <p>
                          Your courier has arrived and the signer is the front
                          desk
                        </p>
                      </Timeline.Item>
                    </Timeline>
                  </div>
                ),
              },
              {
                name: "File attachments",
                content: (
                  <div>
                    <div className="my-2 text-lg font-semibold">
                      Attachments
                    </div>
                    <List hover>
                      <List.Item>Attachment 1</List.Item>
                      <List.Item>Attachment 2</List.Item>
                      <List.Item>Attachment 3</List.Item>
                    </List>
                  </div>
                ),
              },
            ]}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export default ExpandedRenderer;
