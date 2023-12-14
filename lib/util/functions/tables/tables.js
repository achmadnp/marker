"use server";

import { assignLog } from "../log";

export const handleColumnHeaderEdit = async (fieldId, fieldName, userId) => {
  try {
    const res = await fetch(`/api/tables/field/${fieldId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldId,
        fieldName,
        userId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const handleColumnDelete = async (fieldId, actId, user) => {
  try {
    const res = await fetch(`/api/tables/field/${fieldId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldId: fieldId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }

    await assignLog(
      actId,
      user,
      null,
      `user %user% removed a column on activity %activity%`
    );

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const handleEmptyCol = async (fieldId) => {
  try {
    const res = await fetch(`/api/tables/fields`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldId: fieldId,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};
