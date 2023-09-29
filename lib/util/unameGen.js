import { randomIntFromIntervall } from "./random";

export const usernameGenerator = (fullname) => {
  const rndInt = randomIntFromIntervall(111, 999);

  const fn = fullname.split(" ")[0].substring(0, 3);
  const ln = fullname.split(" ").pop().substring(0, 2);

  return `${fn}${ln}${rndInt}`;
};
