export const createNewActivity = async (activity, userId) => {
  try {
    const res = await fetch(`/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activity, userId }),
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
