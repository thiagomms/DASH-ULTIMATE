import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Use a chave correta conforme a operação
const supabaseAnon = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"));
const supabaseService = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
Deno.serve(async (req)=>{
  if (req.method !== 'POST') {
    return new Response('Método não permitido', {
      status: 405
    });
  }
  const body = await req.json();
  // Extrai campos do primeiro item do array items
  const firstItem = body.items?.[0] || {};
  const product_id = firstItem.id || null;
  const product_name = firstItem.name || null;
  const total_value = firstItem.total_value || null;
  const unit_value = firstItem.unit_value || null;
  const product_qty = firstItem.qty || null;
  const marketplace_name = firstItem.marketplace_name || null;
  const offer_name = firstItem.offer?.name || null;
  // Extrai status e forma de pagamento
  const status = body.status || null;
  const pagamento = body.payment?.method || null;
  // Datas
  const dates = body.dates || {};
  const data_criada = dates.created_at ? new Date(dates.created_at).toISOString() : null;
  const data_aprovada = dates.updated_at ? new Date(dates.updated_at).toISOString() : null;
  // Extrai dados do contato
  const contact = body.contact || {};
  const name = contact.name || null;
  const email = contact.email || null;
  const doc = contact.doc || null;
  const phone_number = contact.phone_number || null;
  const contact_state = contact.address_state || null;
  // Exemplo de leitura pública (usando anon)
  // const { data: produtos } = await supabaseAnon.from('vendas_guru').select('product_name');
  // INSERT protegido (usando service_role)
  const { error } = await supabaseService.from('vendas_guru').insert([
    {
      product_id,
      product_name,
      total_value,
      unit_value,
      product_qty,
      status,
      pagamento,
      name,
      email,
      doc,
      phone_number,
      contact_state,
      marketplace_name,
      offer_name,
      data_criada,
      data_aprovada,
      payload: body
    }
  ]);
  if (error) {
    return new Response('Erro ao salvar no banco: ' + error.message, {
      status: 500
    });
  }
  return new Response('OK', {
    status: 200
  });
});
