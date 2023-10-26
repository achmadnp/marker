export const handleCreateData = async ({ colKeys }) => {
  try {
    const res = await fetch(`/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: colKeys,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }
    return res;
  } catch (error) {
    return error;
  }
};

export const handleDeleteRow = async (rowData) => {
  try {
    const res = await fetch(`/api/activity/${rowData._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }
    return res;
  } catch (error) {
    return error;
  }
};

export const handleEditCell = async (rowData) => {
  try {
    const res = await fetch(`/api/activity/${rowData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rowData: rowData,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }
    return res;
  } catch (error) {
    return error;
  }
};

export const handleEditRowData = async (rowData) => {};

export const selectCellOption = async ({ optValue, optColor, rowId }) => {
  try {
    const res = await fetch(`/api/activity/${rowId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optValue,
        optColor,
        fieldId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }
    console.log(res);

    return res;
  } catch (error) {
    return error;
  }
};
