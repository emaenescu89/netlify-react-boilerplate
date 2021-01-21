const https = require('https');
const data = JSON.stringify({
  client_id: process.env.TEAMLEADER_CLIENT_ID,
  client_secret: process.env.TEAMLEADER_CLIENT_SECRET,
  grant_type: 'refresh_token',
  refresh_token: process.env.TEAMLEADER_REFRESH_TOKEN,
});

const options = {
  hostname: 'https://app.teamleader.eu',
  path: '/oauth2/access_token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

exports.handler = async () => {
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.write(data);
  req.end();
};
