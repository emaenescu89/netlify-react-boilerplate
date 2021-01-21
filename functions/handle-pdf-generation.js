exports.handler = async () => {
  const response = {
    statusCode: 301,
    headers: {
      Location: 'https://google.com',
    },
  };

  return response;
};
