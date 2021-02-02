// import fetch from 'node-fetch';
// import faunadb from 'faunadb'; /* Import faunaDB sdk */
const fetch = require('node-fetch');
const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const API_ENDPOINT = `${process.env.REACT_APP_TEAMLEADER_API}tasks.create`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const getAccessToken = async () => {
  const response = await client.query(q.Get(q.Match(q.Index('accessToken'))));
  return response.data.accessToken;
};

exports.handler = async event => {
  const accessToken = await getAccessToken();
  const body = JSON.parse(event.body);
  console.log(body);
  const options = {
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
  };

  return fetch(API_ENDPOINT, options)
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
