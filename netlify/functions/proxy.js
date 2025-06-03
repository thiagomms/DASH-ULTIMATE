const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // URL base do Supabase
  const supabaseUrl = 'https://nlehoxkfbdrosttbkkud.supabase.co';

  // Remove o prefixo da função do path
  const path = event.path.replace('/.netlify/functions/proxy', '');
  const url = `${supabaseUrl}${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;

  // Monta os headers, removendo o 'host' que pode causar erro
  const headers = { ...event.headers };
  delete headers.host;

  // Faz o fetch para o Supabase
  const response = await fetch(url, {
    method: event.httpMethod,
    headers,
    body: event.body && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' ? event.body : undefined
  });

  // /Pega o corpo da resposta
  const body = await response.text();

  // Retorna a resposta para o frontend
  return {
    statusCode: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/json',
    },
    body
  };
}; 