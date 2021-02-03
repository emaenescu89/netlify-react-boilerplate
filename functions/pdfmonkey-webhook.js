// import fetch from 'node-fetch';
// const fetch = require('node-fetch');

// const REFRESH_TOKEN_URL = `${process.env.LAMBDA_URL}refresh-token`;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async event => {
  // Try to create a new task in teamleader
  const body = JSON.parse(event.body);
  console.log(body);
  // const resCreateTask = await createTask(body);

  // if (resCreateTask.status === 200) {
  //   return {
  //     statusCode: 200,
  //     body: 'Task created',
  //     headers,
  //   };
  // }

  // if (resCreateTask.status === 401) {
  //   // Refresh token
  //   const { accessToken } = await fetch(REFRESH_TOKEN_URL);

  //   if (accessToken) {
  //     const resCreateTask2 = await createTask(body);
  //     console.log(resCreateTask2)
  //     if (resCreateTask2.status === 200) {
  //       return {
  //         statusCode: 200,
  //         body: 'Task created',
  //         headers,
  //       };
  //     }
  //   }
  // }
  // return {
  //   statusCode: 422,
  //   body: 'Something went wrong',
  //   headers,
  // };

  return {
    statusCode: 200,
    body: 'Test pdf webhook',
    headers,
  };
};
