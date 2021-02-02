const fetch = require('node-fetch');
const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const API_ENDPOINT_REGISTER = `${
  process.env.REACT_APP_TEAMLEADER_API
}webhooks.register`;
const API_ENDPOINT_LIST = `${
  process.env.REACT_APP_TEAMLEADER_API
}webhooks.list`;
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

const getWebhooks = accessToken => {
  const options = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(API_ENDPOINT_LIST, options).then(response => response.json());
};

exports.handler = async event => {
  const body = JSON.parse(event.body);
  const accessToken = await getAccessToken();
  const { types, url } = body;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      types,
      url,
    }),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { data } = await getWebhooks(accessToken);
  if (!data.find(item => item.url === url)) {
    return fetch(API_ENDPOINT_REGISTER, options)
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
