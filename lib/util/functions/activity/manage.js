export const editActivity = async ({
  name,
  joincode,
  description,
  id,
  userId,
}) => {
  try {
    const res = await fetch(`/api/activity/${id}/overview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, joincode, description, userId }),
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

export const acceptApplicant = async ({ actId, applicantId, userId }) => {
  console.log(actId, applicantId, userId);
  try {
    const res = await fetch(`/api/activity/${actId}/applicants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicantId, userId }),
    });
    console.log(res);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err);
    }
    return res;
  } catch (error) {
    return error;
  }
};

export const rejectApplicant = async ({ actId, applicantId, executor }) => {
  try {
    const res = await fetch(`/api/activity/${actId}/applicants`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicantId, executor }),
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
