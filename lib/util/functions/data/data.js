export const handleCreateData = async ({ colKeys, actId, userId }) => {
  try {
    const res = await fetch(`/api/activity/${actId}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: colKeys,
        userId: userId,
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

export const handleDeleteRow = async (actId, rowData) => {
  try {
    const res = await fetch(`/api/activity/${actId}/${rowData._id}`, {
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

export const handleEditCell = async (activityId, rowData, userId) => {
  try {
    const res = await fetch(`/api/activity/${activityId}/${rowData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rowData: rowData,
        userid: userId,
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

    return res;
  } catch (error) {
    return error;
  }
};
