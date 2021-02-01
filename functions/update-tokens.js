import faunadb from 'faunadb'; /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const getRefreshToken = async () => {
  const response = await client.query(
    q.Get(
      q.Match(
        q.Index('refreshToken')
      )
    )
  );
  return response.data.refresh_token;
}

const updateTokens = async data => {
  return client.query(
    q.Update(
      q.Ref(q.Collection('tokens'), '181388642581742080'),
      { data },
    )
  );
}

const createTokens = async data => {
  return client.query(
    q.Create(
      q.Ref(q.Collection('tokens')),
      { data },
    )
  );
}

exports.handler = async (accessToken, refreshToken) => {
  const resRefreshToken = await getRefreshToken();

  let res;
  if (resRefreshToken) {
    res = await updateTokens({ accessToken, refreshToken });
  } else {
    res = await createTokens({ accessToken, refreshToken });
  }

  if (res.statusCode === 200) {
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken, refreshToken }),
    };
  }

  return {
    statusCode: res.statusCode,
    body: JSON.stringify(res),
  }
};
