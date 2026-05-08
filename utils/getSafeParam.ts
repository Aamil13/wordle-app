export const getSafeParam = (param: string | string[]) =>
  Array.isArray(param) ? param[0] : param;
