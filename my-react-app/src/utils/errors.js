export const getErrorMessage = (error, fallback) => {
  if (error?.code === 'API_URL_NOT_CONFIGURED') {
    return "Server manzili sozlanmagan. Sayt egasi VITE_API_URL ni sozlab, saytni qayta joylashi kerak.";
  }

  const message = error?.response?.data?.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
};
