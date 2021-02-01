import fetch from 'node-fetch';
import faunadb from 'faunadb'; /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const API_ENDPOINT = `${
  process.env.REACT_APP_TEAMLEADER_APP
}oauth2/access_token`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET',
};
const authData = {
  client_id: process.env.REACT_APP_TEAMLEADER_CLIENT_ID,
  client_secret: process.env.REACT_APP_TEAMLEADER_CLIENT_SECRET,
  grant_type: 'refresh_token',
};

/**
 * Save generated tokens in the DB
 * @param {*} data
 */
const updateTokens = data =>
  client.query(
    q.Update(q.Ref(q.Collection('tokens'), '288792223626035713'), { data }),
  );

/**
 * Get refresh token from DB
 */
const getRefreshToken = async () => {
  const response = await client.query(q.Get(q.Match(q.Index('refreshToken'))));

  return response.data.refreshToken;
};

exports.handler = async () => {
  const refreshToken = await getRefreshToken();

  const options = {
    method: 'POST',
    body: JSON.stringify({ ...authData, refresh_token: refreshToken }),
    headers: {
      'Content-type': 'application/json',
    },
  };

  return fetch(API_ENDPOINT, options)
    .then(response => response.json())
    .then(async json => {
      console.log(json);
      if (json.errors) {
        return {
          statusCode: json.errors[0].status,
          body: JSON.stringify(json.errors),
          headers,
        };
      }

      const { access_token, refresh_token } = json;

      await updateTokens({
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
