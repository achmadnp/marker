"use server";

export const asignExpanded = async ({ dataId, fieldId }) => {
  try {
    const res = await fetch(`/api/tables/field/${fieldId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataId: dataId,
      }),
    });
  } catch (error) {}
};
