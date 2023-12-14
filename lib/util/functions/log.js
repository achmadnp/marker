export const assignLog = async (actId, userId, dataId, operation) => {
  try {
    const res = await fetch(`/api/loggingService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actId,
        userId,
        dataId,
        operation,
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
