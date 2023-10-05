"use server";

export const handleColumnHeaderEdit = async (fieldId, fieldName) => {
  try {
    const res = await fetch(`/api/tables/field/${fieldId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldId,
        fieldName,
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

export const handleColumnDelete = async (fieldId) => {
  console.log("server executed");
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

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

export const handleEmptyCol = async (fieldId) => {
  console.log("server executed");

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
