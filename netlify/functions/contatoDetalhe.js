const axios = require('axios');

const TOKEN = process.env.GURU_TOKEN;

exports.handler = async function(event, context) {
  const id = event.path.split('/').pop();
  try {
    const response = await axios.get(`https://digitalmanager.guru/api/v2/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json'
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