export let accessToken = '';

export const setAccessToken = (s: string) => {
  return (accessToken = s);
};

export const getAccessToken = () => {
  return accessToken;
};
