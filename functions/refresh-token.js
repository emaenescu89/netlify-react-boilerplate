exports.handler = async () => {
  try {
    const response = await fetch(
      `https://app.teamleader.eu/oauth2/access_token?
      client_id=${process.env.TEAMLEADER_CLIENT_ID}&
      client_secret=${process.env.TEAMLEADER_CLIENT_SECRET}&
      grant_type=refresh_token&
      refresh_token=${process.env.TEAMLEADER_REFRESH_TOKEN}
    `,
      {
        method: 'POST',
        mode: 'no-cors',
      },
    );

    process.env.TEAMLEADER_REFRESH_TOKEN = response.refresh_token;
    return {
      statusCode: 200,
      body: JSON.stringify({ token: response.access_token }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
