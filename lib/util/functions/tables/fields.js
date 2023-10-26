"use server";

export const modifySelectCellOption = async ({
  optValue,
  optColor,
  fieldId,
  operation,
}) => {
  try {
    const res = await fetch(`/api/tables/field/${fieldId}/options`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optValue,
        optColor,
        fieldId,
        operation,
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
