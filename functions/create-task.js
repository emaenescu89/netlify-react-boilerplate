// import fetch from 'node-fetch';
// import faunadb from 'faunadb';
const fetch = require('node-fetch');
const faunadb = require('faunadb');

// Environment variables
const { FAUNA_SECRET, TEAMLEADER_API_URL } = process.env;

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
});

const CREATE_TASK_URL = `${process.env.TEAMLEADER_API_URL}tasks.create`;
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
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
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
