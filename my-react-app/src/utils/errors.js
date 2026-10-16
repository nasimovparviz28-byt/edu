export const getErrorMessage = (error, fallback) => {
  const message = error?.response?.data?.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
};
