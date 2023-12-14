export const DateConverter = (date) => {
  const year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return day + "/" + month + "/" + year;
};

export const TimeConverter = (date) => {
  let HH = date.getHours();
  let MM = date.getMinutes();
  if (HH.toString().length < 2) {
    HH = "0" + HH;
  }
  if (MM.toString().length < 2) {
    MM = "0" + MM;
  }
  return HH + ":" + MM;
};
