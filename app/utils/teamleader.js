const Teamleader = () => {
  const createTask = async (token, body) => {
    const response = await fetch(`${process.env.REACT_APP_LAMBDA_URL}create-task`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...body, token }),
        isBase64Encoded: false,
      },
    );

    return response.json();
  };

  const getTokens = async () => {
    const response = await fetch(`${process.env.REACT_APP_LAMBDA_URL}get-tokens`,
      {
        method: 'GET',
      },
    );

    return response.json();
  };

  return {
    createTask,
    getTokens,
  };
};

export default Teamleader;
