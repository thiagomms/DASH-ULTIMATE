const fetch = require('node-fetch');

const slackToken = process.env.SLACK_TOKEN;

exports.handler = async function(event, context) {
  try {
    const response = await fetch('https://slack.com/api/users.profile.get', {
      headers: { 'Authorization': `Bearer ${slackToken}` }
    });
    const data = await response.json();
    if (data.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          real_name: data.profile.real_name,
          display_name: data.profile.display_name,
          image_192: data.profile.image_192,
          image_512: data.profile.image_512,
          image_72: data.profile.image_72
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Erro ao buscar perfil do Slack', slackError: data })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno', details: err.message })
    };
  }
}; 