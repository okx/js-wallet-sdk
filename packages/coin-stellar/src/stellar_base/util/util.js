export const trimEnd = (input, char) => {
  const isNumber = typeof input === 'number';
  let str = String(input);

  while (str.endsWith(char)) {
    str = str.slice(0, -1);
  }

  return isNumber ? Number(str) : str;
};
