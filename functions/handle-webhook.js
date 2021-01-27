import fetch from 'node-fetch';

const API_ENDPOINT = `${process.env.REACT_APP_TEAMLEADER_API}webhooks.register`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async event => {

  const options = {
    method: 'POST',
    body: JSON.stringify({
      url: '',
      due_on: '2021-02-02',
      work_type_id: 'b75adf33-cdd5-0a9b-ae58-031db18509c1',
    }),
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return fetch(API_ENDPOINT, options)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(json => {
      const { data } = json;
      console.log(json);
      if (json.statusCode === 200) {
        return {
          statusCode: 200,
          body: JSON.stringify(data),
          headers,
        }
      }

      return {
        statusCode: 400,
        body: JSON.stringify(json),
        headers,
      };
    })
    .catch(error => ({
      statusCode: 422,
      body: 'something went wrong with teamleader',
      headers,
    }));
};
