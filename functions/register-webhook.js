import fetch from 'node-fetch';

const API_ENDPOINT_REGISTER = `${process.env.REACT_APP_TEAMLEADER_API}webhooks.register`;
const API_ENDPOINT_LIST = `${process.env.REACT_APP_TEAMLEADER_API}webhooks.list`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = event => {
  const body = JSON.parse(event.body);
  const { accessToken, types, url } = body;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      types,
      url,
    }),
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };
  const optionsList = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };
  return fetch(API_ENDPOINT_LIST, optionsList)
    .then(response => {
      return response.json();
    })
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
        body: JSON.stringify(json),
        headers,
      };
    })
    .catch(error => ({
      statusCode: 422,
      body: 'Request failed',
      headers,
    }));
  // return fetch(`API_ENDPOINT, options)
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(json => {

  //     if (json && json.errors) {
  //       return {
  //         statusCode: json.errors[0].status,
  //         body: JSON.stringify(json.errors),
  //         headers,
  //       };
  //     }

  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify('OK'),
  //       headers,
  //     };
  //   })
  //   .catch(error => ({
  //     statusCode: 422,
  //     body: 'Request failed',
  //     headers,
  //   }));
};
