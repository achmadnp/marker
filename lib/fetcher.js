export const fetcher = async (...args) => {
  const res = await fetch(...args, {});
  let payload;

  try {
    if (res.status === 204) return null;
    payload = await res.json();
  } catch (error) {
    throw new Error(error.message || "Operation failed, Aborting process...");
  }

  if (res.ok) {
    return payload;
  } else {
    return Promise.reject(payload.error || new Error("Unknown error"));
  }
};
