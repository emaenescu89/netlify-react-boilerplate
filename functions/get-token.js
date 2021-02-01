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

exports.handler = async () => {
  try {
    const accessToken = await getAccessToken();
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken }),
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
