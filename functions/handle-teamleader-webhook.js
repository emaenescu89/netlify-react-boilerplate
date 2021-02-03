// import fetch from 'node-fetch';
const fetch = require('node-fetch');

const { LAMBDA_URL } = process.env;

const CREATE_TASK_URL = `${process.env.LAMBDA_URL}create-task`;
const REFRESH_TOKEN_URL = `${process.env.LAMBDA_URL}refresh-token`;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Call create task endpoint
const createTask = async body =>
  fetch(CREATE_TASK_URL, {
    body: JSON.stringify({
      customer: body.subject,
      description: 'Pool customer',
      due_on: '2021-02-10',
      work_type_id: '3541cc99-33c0-0d74-b15c-f6e04b850fc1',
    }),
    headers: {
      Accept: 'application/json',
    },
    method: 'POST',
  });

exports.handler = async event => {
  // Try to create a new task in teamleader
  const body = JSON.parse(event.body);

  const resCreateTask = await createTask(body);

  if (resCreateTask.status === 200) {
    return {
      statusCode: 200,
      body: 'Task created',
      headers,
    };
  }

  if (resCreateTask.status === 401) {
    // Refresh token
    const { accessToken } = await fetch(REFRESH_TOKEN_URL);

    if (accessToken) {
      const resCreateTask2 = await createTask(body);
      console.log(resCreateTask2)
      if (resCreateTask2.status === 200) {
        return {
          statusCode: 200,
          body: 'Task created',
          headers,
        };
      }
    }
  }
  return {
    statusCode: 422,
    body: 'Something went wrong',
    headers,
  };
};
