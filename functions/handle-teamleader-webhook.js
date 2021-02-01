import fetch from 'node-fetch';

const API_ENDPOINT = `${process.env.REACT_APP_TEAMLEADER_API}tasks.create`;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const getAccessToken = async () => {
  const response = await client.query(
    q.Get(
      q.Match(
        q.Index('accessToken')
      )
    )
  );
  return response.data.accessToken;
}

exports.handler = async event => {
  console.log(event);
  const accessToken = await getAccessToken();
  // const body = JSON.parse(event.body);
  const options = {
    method: 'POST',
    body: JSON.stringify({
      description: 'My first task',
      due_on: '2021-02-02',
      work_type_id: 'b75adf33-cdd5-0a9b-ae58-031db18509c1',
    }),
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  return fetch(API_ENDPOINT, options)
    .then(response => {
      return response.json();
    })
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
