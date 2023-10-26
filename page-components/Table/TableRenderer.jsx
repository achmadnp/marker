import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ButtonCell } from "@/components/Table/Cell";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";
import { ProgressBar } from "primereact/progressbar";
import {
  AvatarCell,
  DTPCell,
  DTRangeCell,
  MultipleAvatarCell,
  SelectCell,
} from "@/components/Table/Cell";
import { NewColumnEditor } from "@/page-components/Table/NewColEditor";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Divider } from "primereact/divider";
import { ContextMenu } from "primereact/contextmenu";
import {
  handleColumnDelete,
  handleColumnHeaderEdit,
  handleEmptyCol,
} from "@/lib/util/functions/tables/tables";
import {
  handleCreateData,
  handleDeleteRow,
  handleEditCell,
} from "@/lib/util/functions/data/data";
import { modifySelectCellOption } from "@/lib/util/functions/tables/fields";

export const TableRenderer = ({ ...props }) => {
  const toast = useRef(null);
  const cm = useRef(null);
  const headerExt = useRef([]);
  const [selectedCM, setSelectedCM] = useState(undefined);
  const [expandedRows, setExpandedRows] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [header, setHeader] = useState();
  const { mutate } = useSWRConfig();
  const {
    data: tableData,
    error: errData,
    isLoading: loadingData,
    mutate: mutateData,
  } = useSWR(`/api/activity`, fetcher);

  const {
    data: tableFields,
    error: errFields,
    isLoading: loadingFields,
    mutate: mutateFields,
  } = useSWR(`/api/tables/field`, fetcher);

  const {
    data: userData,
    error: errUser,
    isLoading: loadingUser,
  } = useSWR(`/api/tables/users`, fetcher);

  if (errData || errFields) {
    return <div>ERROR</div>;
  }

  if (loadingData || loadingFields) {
    return <LoadingPage />;
  }

  const generateLabel = (name) => name.charAt(0).toUpperCase();

  let userList = userData?.map((user) => {
    return {
      id: user._id,
      name: user.fullname,
      label: generateLabel(user.fullname),
    };
  });

  const getUserNames = (ids) => {
    if (ids && ids.length !== 0) {
      return userList?.filter((user) => ids.includes(user.id));
    }
    return;
  };

  const contextMenuModel = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => previewTableData(selectedCM),
    },
    {
      label: "Insert Data",
      icon: "pi pi-fw pi-plus",
      command: () => insertRowData(selectedCM),
    },
    { separator: true },
    {
      label: "Insert Column",
      icon: "pi pi-hashtag",
      command: () => setDialogOpen(true),
    },
    {
      label: "Insert Column Left",
      icon: "pi pi-arrow-left",
    },
    {
      label: "Insert Column Right",
      icon: "pi pi-arrow-right",
    },
    { separator: true },
    {
      label: "Delete Row",
      icon: "pi pi-times",
      command: () => deleteRow(selectedCM),
    },
    {
      label: "Empty Row Data",
      icon: `pi pi-fw pi-trash`,
      command: () => emptyRowData(selectedCM),
    },
    { separator: true },
    {
      label: "Show Logs",
      icon: "pi pi-fw pi-file",
      command: () => exportRowData(selectedCM),
    },
    {
      label: "Export Row Data (.csv)",
      icon: "pi pi-fw pi-file-export",
      command: () => exportRowData(selectedCM),
    },
  ];

  //   column = field
  const footerTemplate = () => {
    return (
      <div className="w-full text-center">
        <Button
          icon="pi pi-plus"
          label="Add Row"
          className="w-full hover:bg-slate-400"
          onClick={(e) => {
            insertRowData();
          }}
        />
      </div>
    );
  };

  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Expanded",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Product Collapsed",
      detail: event.data.name,
      life: 3000,
    });
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Orders for {data.name}</h5>
      </div>
    );
  };

  const allowExpansion = (rowData) => {
    return true;
  };

  // mutate SWR
  const onCellEditComplete = async (e) => {
    setIsLoading(true);
    let { rowData, newValue, field, originalEvent: event } = e;
    if (
      newValue instanceof String &&
      newValue?.trim().length > 0 &&
      newValue !== rowData[field]
    ) {
      rowData[field] = newValue;
      const res = await handleEditCell(rowData);
      if (res.ok) {
        mutate("/api/activity");
      } else {
        rowData[field] = "";
      }
    } else if (newValue instanceof Date) {
      rowData[field] = newValue;
      const res = await handleEditCell(rowData);
      if (res.ok) {
        mutate("/api/activity");
      } else {
        rowData[field] = "";
      }
    } else if (newValue instanceof Array) {
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    setIsLoading(false);
  };

  const cellEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const handleHeaderEdit = async (e, header) => {
    if (header) {
      setIsLoading(true);

      const res = await handleColumnHeaderEdit(e.item.data.id, header);

      if (res.status === "success") {
        mutate("/api/tables/field");
        toast.current.show({
          severity: "success",
          summary: `Sucess`,
          detail: "Header has been updated",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: `Failed to edit header`,
          detail: "operation failed",
          life: 3000,
        });
      }
      setHeader();
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async (e) => {
    setIsLoading(true);
    const res = await handleColumnDelete(e.item.data.id);

    if (res.status === "success") {
      mutate("/api/tables/field");
      toast.current.show({
        severity: "success",
        summary: "Column Deleted",
        detail: `Column ${e.item.data.headerName} has been Deleted`,
        life: 1000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Column Deletion Failed",
        detail: `Failed to delete column ${e.item.data.headerName}`,
        life: 1000,
      });
    }

    setIsLoading(false);
  };

  const handleEmptyColumn = async (e) => {
    setIsLoading(true);
    const res = await handleEmptyCol(e.item.data.id);

    if (res.status === "success") {
      mutate("/api/tables/field");
      toast.current.show({
        severity: "success",
        summary: "Column's data cleared",
        detail: `Column ${e.item.data.headerName} has been cleared`,
        life: 1000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Column Emptied Failed",
        detail: `Failed to empty column ${e.item.data.headerName}`,
        life: 1000,
      });
    }

    setIsLoading(false);
  };

  // this
  const handleInsertSelectOpt = async (value, color, data, fieldId) => {
    const res = await modifySelectCellOption({
      optValue: value,
      optColor: color,
      fieldId,
      operation: "push",
    });

    if (res.ok) {
      mutate("/api/tables/field");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add SelectCell`,
        life: 1000,
      });
    }
  };

  // this
  const handleDeleteSelectOption = async (value, color, data, fieldId) => {
    const res = await modifySelectCellOption({
      optValue: value,
      optColor: color,
      fieldId,
      operation: "pull",
    });
    if (res.ok) {
      mutate("/api/tables/field");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add SelectCell`,
        life: 1000,
      });
    }
  };

  // this
  const handleSelectCell = async (data) => {
    const res = await handleEditCell(data);

    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  // this
  const handleAssignMulti = async (rowData) => {
    const res = await handleEditCell(rowData);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  // should be same as above
  const handleUnassignMulti = async (rowData) => {
    const res = await handleEditCell(rowData);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  const handleRemoveMulti = async (data) => {
    const res = await onRemoveMulti(data);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  // should be same as above
  const handleChangeSinglePerson = async (rowData) => {
    const res = await handleEditCell(rowData);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  // should be same as above
  const handleDTPChange = async (rowData) => {
    const res = await handleEditCell(rowData);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  // should be same as above
  const handleDTRangeChange = async (rowData) => {
    console.log(rowData);
    const res = await handleEditCell(rowData);
    if (res.ok) {
      mutate("/api/activity");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Select Option`,
        life: 1000,
      });
    }
  };

  const RenderColumn = ({
    dataKey,
    headerName,
    cellType,
    index,
    id,
    options,
  }) => {
    const renderBody = (data) => {
      switch (cellType) {
        case "base":
          return <>{data[dataKey]}</>;

        case "progress":
          return <ProgressBar className="h-4 rounded-lg" value={50} />;

        case "multipleAsignee":
          const names = getUserNames(data[dataKey]);
          if (names && names.length !== 0) {
            return (
              <MultipleAvatarCell
                data={data}
                dataKey={dataKey}
                currents={names}
                items={userList}
                onAssign={handleAssignMulti}
                onUnassign={handleUnassignMulti}
              />
            );
          } else {
            return (
              <MultipleAvatarCell
                items={userList}
                data={data}
                dataKey={dataKey}
                onAssign={handleAssignMulti}
                onUnassign={handleUnassignMulti}
              />
            );
          }

        case "dropdown":
          return (
            <SelectCell
              onInput={handleInsertSelectOpt}
              onDeleteOpt={handleDeleteSelectOption}
              fieldId={id}
              dataKey={dataKey}
              value={data[dataKey]}
              color={data[`${dataKey}Color`]}
              options={options}
              onSelect={handleSelectCell}
              data={data}
            />
          );

        case "select":
          return (
            <SelectCell
              onInput={handleInsertSelectOpt}
              onDeleteOpt={handleDeleteSelectOption}
              fieldId={id}
              dataKey={dataKey}
              value={data[dataKey]}
              color={data[`${dataKey}Color`]}
              options={options}
              onSelect={handleSelectCell}
              data={data}
            />
          );
        case "singleUser":
          const namesSgnl = getUserNames(data[dataKey]);
          if (namesSgnl) {
            return (
              <AvatarCell
                data={data}
                dataKey={dataKey}
                current={namesSgnl[0]}
                items={userList}
                onChange={handleChangeSinglePerson}
              />
            );
          } else {
            return (
              <AvatarCell
                data={data}
                dataKey={dataKey}
                items={userList}
                onChange={handleChangeSinglePerson}
              />
            );
          }

        case "datepick":
          return (
            <DTPCell
              data={data}
              dataKey={dataKey}
              date={data[dataKey]}
              onChange={handleDTPChange}
            />
          );

        case "daterange":
          return (
            <DTRangeCell
              data={data}
              dataKey={dataKey}
              dates={data[dataKey]}
              onChange={handleDTRangeChange}
            />
          );

        default:
          return <>{data[dataKey]}</>;
      }
    };

    const headerExtMenu = [
      {
        template: (item, options) => {
          return (
            <div className="flex overflow-hidden ">
              <InputText
                value={header || headerName}
                onChange={(e) => setHeader(e.target.value)}
                className="p-2 m-4 text-lg border border-gray-300 rounded-lg"
                onBlur={(e) => {
                  options.onClick(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    options.onClick(e);
                  }
                }}
              />
            </div>
          );
        },
        command: (e) => {
          handleHeaderEdit(e, header);
        },
        data: { headerName, id },
      },
      {
        template: (item, options) => {
          return (
            <Button
              className="bg-transparent border-0 w-full py-[2px] pl-8 m-1 mx-auto text-lg text-red-600 hover:bg-red-200 hover:text-red-700"
              label="Empty Column"
              icon="pi pi-times"
              disabled
              pt={{ icon: { className: "" }, label: { className: "-ml-12" } }}
            />
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
      {
        template: (item, options) => {
          return (
            <Button
              className="bg-transparent border-0 w-full py-[2px] pl-8 m-1 mx-auto text-lg text-red-600 hover:bg-red-200 hover:text-red-700"
              label="Delete Column"
              icon="pi pi-trash"
              onClick={(e) => {
                options.onClick(e);
              }}
              pt={{ icon: { className: "" }, label: { className: "-ml-12" } }}
            />
          );
        },
        command: (e) => {
          handleDeleteColumn(e);
        },
        data: { headerName, id },
      },
      {
        template: (item, options) => {
          return (
            <Divider
              type="solid"
              className="bg-transparent border-0 max-w-[70%] -mb-0 mx-auto overflow-hidden h-[1px] bg-black"
            />
          );
        },
      },
      {
        template: (item, options) => {
          return (
            <Button
              className="w-full pl-8 m-1 mx-auto text-lg text-orange-400 bg-transparent border-0 hover:bg-orange-200 hover:text-orange-500"
              label="Change Permission"
              icon="pi pi-lock"
              disabled
              pt={{ icon: { className: "" }, label: { className: "-ml-6" } }}
            />
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
    ];

    const renderHeader = () => {
      return (
        <div className="w-[150px] h-full cursor-pointer">
          <div
            onClick={(e) => {
              headerExt.current[index].toggle(e);
            }}
            className="flex"
          >
            {headerName}
            <i className="mx-4 mt-1 text-violet-600 pi pi-ellipsis-v"></i>
          </div>
          <Menu
            className="min-w-fit"
            ref={(el) => (headerExt.current[index] = el)}
            model={headerExtMenu}
            popup
          />
        </div>
      );
    };

    return (
      <Column
        editor={cellType === "base" ? (options) => cellEditor(options) : null}
        onCellEditComplete={onCellEditComplete}
        key={headerName}
        field={dataKey}
        header={renderHeader}
        body={renderBody}
      ></Column>
    );
  };

  const handleCreateColumn = async ({ fields }) => {
    setDialogOpen(false);
    setIsLoading(true);

    try {
      const res = await fetch(`../api/tables/field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            tableId: "",
            headerName: fields.headerName,
            dataKey: fields.columnName,
            cellType: fields.columnType,
            cellName: fields.columnName,
            editableCol: true,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const data = await res.json();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Column Created",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Column Creation Failed ${error}`,
        life: 3000,
      });
    }
    mutate("/api/tables/field");
    setIsLoading(false);
  };

  // todo
  const previewTableData = (data) => {
    toast.current?.show({
      severity: "info",
      summary: `Rowdata #${data.order} Selected`,
      selected: data,
    });
  };

  // todo
  const exportRowData = (data) => {
    toast.current?.show({
      severity: "info",
      summary: "Exporting Row Data",
      selected: data,
    });
  };

  const deleteRow = async (data) => {
    setIsLoading(true);
    const res = await handleDeleteRow(data);

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "ROW DELETED",
        detail: `Column `,
        life: 1000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `Failed to delete rowdata `,
        life: 1000,
      });
    }
    mutate("/api/activity");
    setIsLoading(false);
  };

  // todo
  const emptyRowData = (data) => {
    toast.current?.show({
      severity: "error",
      summary: "ROW DATA EMPTIED",
      selected: selectedCM,
    });
  };

  const insertRowData = async (data) => {
    setIsLoading(true);
    let colKeys = [];
    tableFields.map((field) => {
      colKeys.push(field.dataKey);
    });
    const res = await handleCreateData({ colKeys });
    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Column Deleted",
        detail: `Column `,
        life: 1000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Column Deletion Failed",
        detail: `Failed to `,
        life: 1000,
      });
    }
    mutate("/api/activity");
    setIsLoading(false);
  };

  if (tableData && tableFields) {
    tableData.map((data) => {
      data.id = data._id;
    });

    return (
      <div className="p-5 border border-white max-w-[95%] mx-auto">
        <Toast ref={toast} />
        <ContextMenu
          model={contextMenuModel}
          ref={cm}
          onHide={() => setSelectedCM(undefined)}
        />
        <DataTable
          editMode="cell"
          resizableColumns
          reorderableColumns
          showGridlines
          onContextMenu={(e) => cm.current.show(e.originalEvent)}
          contextMenuSelection={selectedCM}
          onContextMenuSelectionChange={(e) => setSelectedCM(e.value)}
          loading={isLoading}
          value={tableData}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          onRowExpand={onRowExpand}
          onRowCollapse={onRowCollapse}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          {tableFields.map(
            ({ dataKey, headerName, cellType, _id, options }, index) => {
              return RenderColumn({
                dataKey,
                headerName,
                cellType,
                id: _id,
                index,
                options,
              });
            }
          )}
          <Column
            header={
              <ButtonCell
                text={"+ Column"}
                onClick={(e) => setDialogOpen(true)}
              />
            }
          ></Column>
        </DataTable>
        {footerTemplate()}
        <NewColumnEditor
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateColumn}
        />
      </div>
    );
  }
};
