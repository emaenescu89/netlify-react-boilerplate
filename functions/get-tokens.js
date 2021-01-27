import faunadb from 'faunadb'; /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET',
};

const getTokens = async () => {
  const response = await client.query(
    q.Get(
      q.Match(
        q.Index('refresh_token')
      )
    )
  );
  return response.data;
}

exports.handler = async () => {
  try {
    const data = await getTokens();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers,
    };
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
      headers,
    }
  }
};
