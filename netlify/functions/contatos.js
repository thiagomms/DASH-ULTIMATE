const axios = require('axios');

const TOKEN = process.env.GURU_TOKEN;

exports.handler = async function(event, context) {
  try {
    const params = [];
    const { cursor, doc, name } = event.queryStringParameters || {};
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (doc) params.push(`doc=${encodeURIComponent(doc)}`);
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    let url = 'https://digitalmanager.guru/api/v2/contacts';
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 