export const isValidArray = <T>(arr: T): boolean => {
  return !Array.isArray(arr) || arr.length === 0 ? false : true;
};
