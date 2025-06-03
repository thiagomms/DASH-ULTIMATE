import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Calendar, CreditCard, ShoppingBag } from 'lucide-react';

interface Purchase {
  id: string;
  product: string;
  offer: string;
  amountPaid: number;
  date: string;
  category?: string;
}

interface Customer {
  id: string;
  name: string;
  cpf: string;
  averageTicket: number;
  since: string;
  purchases: Purchase[];
  ultimaCompra: string;
}

export const TicketMedio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    setErrorMessage('');
    setCustomer(null);
    if (!searchTerm.trim()) {
      setErrorMessage('Digite um CPF ou nome para buscar');
      return;
    }
    setLoading(true);
    try {
      const param = /\d{11}/.test(searchTerm.replace(/\D/g, '')) ? `doc=${encodeURIComponent(searchTerm)}` : `name=${encodeURIComponent(searchTerm)}`;
      // URL fixa para produção
      const baseUrl = 'https://dash-comercial.netlify.app/.netlify/functions/contatos';
      const response = await fetch(`${baseUrl}?${param}`);
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const cliente = data.data[0];
        // Buscar histórico de compras do cliente
        const transBaseUrl = 'https://dash-comercial.netlify.app/.netlify/functions/contatoTransactions';
        const transRes = await fetch(`${transBaseUrl}/${cliente.id}`);
        const transData = await transRes.json();
        // Filtrar apenas transações aprovadas
        const aprovadas = (transData.data || []).filter((t: any) => (t.status || '').toLowerCase() === 'approved');
        // Calcular ticket médio
        const ticketMedio = aprovadas.length > 0 ? aprovadas.reduce((acc: number, t: any) => acc + (t.payment?.total || 0), 0) / aprovadas.length : 0;
        // Extrair datas das compras aprovadas
        const datasCompras = aprovadas.map((t: any) => {
          if (t.dates?.confirmed_at) return new Date(t.dates.confirmed_at * 1000);
          if (t.date) return new Date(t.date);
          if (t.created_at) return new Date(t.created_at);
          return new Date();
        });
        let since = cliente.created_at || new Date().toISOString();
        let ultimaCompra = new Date().toISOString();
        if (datasCompras.length > 0) {
          // Pega a menor data (primeira compra)
          const primeiraCompra = new Date(Math.min(...datasCompras.map((d: Date) => d.getTime())));
          // Pega a maior data (última compra)
          ultimaCompra = new Date(Math.max(...datasCompras.map((d: Date) => d.getTime()))).toISOString();
          since = primeiraCompra.toISOString();
        }
        setCustomer({
          id: cliente.id,
          name: cliente.name,
          cpf: cliente.doc,
          averageTicket: ticketMedio,
          since: since,
          purchases: aprovadas.map((t: any) => ({
            id: t.id,
            product: t.product?.name || (t.items && t.items[0]?.name) || 'Produto',
            offer: t.product?.offer?.name || (t.items && t.items[0]?.offer?.name) || '',
            amountPaid: t.payment?.total || 0,
            date: t.dates?.confirmed_at ? new Date(t.dates.confirmed_at * 1000).toISOString() : (t.date || t.created_at || new Date().toISOString()),
            category: t.items && t.items[0]?.category || '',
          })),
          ultimaCompra: ultimaCompra,
        });
        setErrorMessage('');
      } else {
        setErrorMessage('Cliente não encontrado');
      }
    } catch (err) {
      setErrorMessage('Erro ao buscar cliente');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const calculateTimeAsCustomer = (sinceDate: string, endDate?: string) => {
    const startDate = new Date(sinceDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays} dias`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} meses`;
    }
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold">Ticket Médio de Compras</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Busque clientes por nome ou CPF para ver o ticket médio e tempo de relacionamento.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-md bg-gray-100 dark:bg-gray-800/50 
                         border border-gray-200 dark:border-gray-700/50 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button onClick={handleSearch} className="px-8" disabled={loading}>
              Buscar
            </Button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 mt-2 text-purple-500">
              <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Buscando...
            </div>
          )}
          {errorMessage && <p className="text-red-400 text-sm mt-4">{errorMessage}</p>}
        </div>

        {customer && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                      <p className="text-lg font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CPF</p>
                      <p className="text-lg font-medium">{customer.cpf}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <CreditCard className="text-purple-600 dark:text-purple-400" size={20} />
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ticket Médio</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                          {formatCurrency(customer.averageTicket)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <ShoppingBag className="text-purple-600 dark:text-purple-400" size={20} />
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Compras</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                          {customer.purchases.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.purchases.length === 0 && (
                    <p className="text-gray-400">Nenhuma compra encontrada.</p>
                  )}
                  {customer.purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="space-y-2 mb-4 md:mb-0">
                        <h4 className="font-medium">{purchase.product}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{purchase.offer}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(purchase.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(purchase.amountPaid)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TicketMedio;