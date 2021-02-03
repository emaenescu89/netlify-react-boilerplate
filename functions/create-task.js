const fetch = require('node-fetch');
const faunadb = require('faunadb');

// Environment variables
const { FAUNA_SECRET, TEAMLEADER_API_URL } = process.env;

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: FAUNA_SECRET,
});

const CREATE_TASK_URL = `${TEAMLEADER_API_URL}tasks.create`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Get access token from DB
const queryAccessToken = async () => {
  const response = await client.query(q.Get(q.Match(q.Index('accessToken'))));
  return response.data.accessToken;
};

exports.handler = async event => {
  const accessToken = await queryAccessToken();
  const body = JSON.parse(event.body);

  // Create Teamleader Task
  return fetch(CREATE_TASK_URL, {
    method: 'POST',
    body: JSON.stringify({
      customer: body.subject,
      description: 'Pool customer',
      due_on: '2021-02-10',
      work_type_id: '3541cc99-33c0-0d74-b15c-f6e04b850fc1',
    }),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(json => {
      const { data } = json;

      if (json.errors) {
        return {
          statusCode: json.errors[0].status,
          body: JSON.stringify(json.errors),
          headers,
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers,
      };
    })
    .catch(error => ({
      statusCode: 422,
      body: 'something went wrong with teamleader',
      headers,
    }));
};
