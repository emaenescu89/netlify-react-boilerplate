const fetch = require('node-fetch');
const faunadb = require('faunadb');

// Environment variables
const { FAUNA_SECRET, TEAMLEADER_API_URL } = process.env;

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: FAUNA_SECRET,
});

const REGISTER_WEBHOOK_URL = `${TEAMLEADER_API_URL}webhooks.register`;
const LIST_WEBHOOKS_URL = `${TEAMLEADER_API_URL}webhooks.list`;
const contentType = 'application/json';
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': contentType,
};

// Get access token from DB
const queryAccessToken = async () => {
  const response = await client.query(q.Get(q.Match(q.Index('accessToken'))));
  return response.data.accessToken;
};

// Get Temaleader registered webhooks
const getRegisteredWebhooks = accessToken =>
  fetch(LIST_WEBHOOKS_URL, {
    method: 'GET',
    headers: {
      'Content-type': contentType,
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.json());

exports.handler = async event => {
  const body = JSON.parse(event.body);
  const accessToken = await queryAccessToken();
  const { types, url } = body;
  const { data } = await getRegisteredWebhooks(accessToken);

  // Register webhook only if it's not registered
  if (!data || !data.find(item => item.url === url)) {
    return fetch(REGISTER_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        types,
        url,
      }),
      headers: {
        'Content-type': contentType,
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json && json.errors) {
          return {
            statusCode: json.errors[0].status,
            body: JSON.stringify(json.errors),
            headers,
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify('OK'),
          headers,
        };
      })
      .catch(error => ({
        statusCode: 422,
        body: 'Request failed',
        headers,
      }));
  }

  return {
    statusCode: 200,
    body: JSON.stringify('Already added'),
    headers,
  };
};
