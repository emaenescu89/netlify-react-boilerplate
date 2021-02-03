const fetch = require('node-fetch');
const faunadb = require('faunadb');

// Environment variables
const {
  FAUNA_SECRET,
  TEAMLEADER_APP_URL,
  TEAMLEADER_CLIENT_ID,
  TEAMLEADER_CLIENT_SECRET,
} = process.env;

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: FAUNA_SECRET,
});
const API_ENDPOINT = `${TEAMLEADER_APP_URL}oauth2/access_token`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET',
};
const authData = {
  client_id: TEAMLEADER_CLIENT_ID,
  client_secret: TEAMLEADER_CLIENT_SECRET,
  grant_type: 'refresh_token',
};

/**
 * Save generated tokens in the DB
 * @param {*} data
 */
const queryUpdateTokens = data => {
  return client.query(
    q.Update(q.Ref(q.Collection('tokens'), '288792223626035713'), { data })
  );
};

/**
 * Get refresh token from DB
 */
const queryRefreshToken = async () => {
  const response = await client.query(q.Get(q.Match(q.Index('refreshToken'))));

  return response.data.refreshToken;
};

exports.handler = async () => {
  const refreshToken = await queryRefreshToken();
  const options = {
    method: 'POST',
    body: JSON.stringify({ ...authData, refresh_token: refreshToken }),
    headers: {
      'Content-type': 'application/json',
    },
  };

  // Refresh Teamleader tokens
  return fetch(API_ENDPOINT, options)
    .then(response => {
      return response.json();
    })
    .then(async json => {
      if (json.errors) {
        return {
          statusCode: json.errors[0].status,
          body: JSON.stringify(json.errors),
          headers,
        };
      }

      const { access_token, refresh_token } = json;

      await queryUpdateTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ accessToken: access_token }),
        headers,
      };
    })
    .catch(error => ({ statusCode: 422, body: String(error), headers }));
};
