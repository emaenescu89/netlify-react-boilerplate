import fetch from 'node-fetch';

const body = {
  client_id: process.env.REACT_APP_TEAMLEADER_CLIENT_ID,
  client_secret: process.env.REACT_APP_TEAMLEADER_CLIENT_SECRET,
  grant_type: 'refresh_token',
  refresh_token: null,
};

const API_ENDPOINT = `${process.env.REACT_APP_TEAMLEADER_APP}oauth2/access_token`;

exports.handler = async (refreshToken) => {
  const defaultOptions = {
    method: 'POST',
    body: JSON.stringify({...body, refresh_token: refreshToken}),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(API_ENDPOINT, defaultOptions)
    .then(response => response.json())
    .then( json => {
      const { access_token, refresh_token } = json;

      if (res.statusCode === 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({ access_token, refresh_token }),
        }
      }

      return {
        statusCode: res.statusCode,
        body: JSON.stringify(res),
      };
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
