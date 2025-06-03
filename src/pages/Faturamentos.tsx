import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Filter, DollarSign, CreditCard, ShoppingCart, CheckCircle, AlertTriangle, XCircle, Ban, Barcode, ArrowDown, QrCode } from 'lucide-react';
import { AdvancedFilters } from '../components/filters/AdvancedFilters';
import { supabase } from '../utils/supabaseClient';

function getStatusIcon(status: string) {
  switch (status) {
    case 'approved': return <CheckCircle className="text-green-500" size={20} />;
    case 'pending':
    case 'waiting_payment': return <AlertTriangle className="text-yellow-500" size={20} />;
    case 'canceled':
    case 'abandoned': return <XCircle className="text-red-500" size={20} />;
    case 'expired': return <Ban className="text-gray-400" size={20} />;
    case 'billet_printed': return <Barcode className="text-blue-500" size={20} />;
    case 'refunded': return <ArrowDown className="text-purple-500" size={20} />;
    default: return <AlertTriangle className="text-gray-400" size={20} />;
  }
}

function getPaymentIcon(payment: string) {
  switch (payment) {
    case 'credit_card': return <CreditCard className="text-blue-500" size={20} />;
    case 'pix': return <QrCode className="text-green-500" size={20} />;
    case 'billet': return <Barcode className="text-yellow-500" size={20} />;
    case 'free': return <CheckCircle className="text-emerald-500" size={20} />;
    default: return <AlertTriangle className="text-gray-400" size={20} />;
  }
}

export const Faturamentos: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'Todos',
    paymentMethod: 'Todas',
    products: [] as string[],
  });

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      let query = supabase.from('vendas_guru').select('*');

      // Filtro de status
      if (filters.status && filters.status !== 'Todos') {
        if (filters.status === 'Aprovada') query = query.eq('status', 'approved');
        else if (filters.status === 'Pendente') query = query.in('status', ['pending', 'waiting_payment']);
        else if (filters.status === 'Cancelada') query = query.eq('status', 'canceled');
      }

      // Filtro de data
      if (filters.startDate) query = query.gte('data_criada', filters.startDate);
      if (filters.endDate) query = query.lte('data_criada', filters.endDate);

      // Filtro de pagamento
      if (filters.paymentMethod && filters.paymentMethod !== 'Todas') {
        if (filters.paymentMethod === 'Pix') query = query.eq('pagamento', 'pix');
        else if (filters.paymentMethod === 'Cartão de Crédito') query = query.eq('pagamento', 'credit_card');
        else if (filters.paymentMethod === 'Boleto') query = query.eq('pagamento', 'billet');
      }

      // Filtro de produtos
      if (filters.products && filters.products.length > 0) {
        query = query.in('product_name', filters.products);
      }

      // Ordenação
      query = query.order('data_criada', { ascending: false });

      const { data, error } = await query;
      if (!error && data) setVendas(data);
      setLoading(false);
    };
    fetchVendas();
  }, [filters]);

  // Filtros e paginação
  const filteredVendas = useMemo(() => vendas, [vendas]);
  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendas = filteredVendas.slice(startIndex, startIndex + itemsPerPage);

  // Métricas
  const vendasAprovadas = filteredVendas.filter(v => v.status === 'approved');
  const faturamento = vendasAprovadas.reduce((sum, v) => sum + Number(v.total_value || 0), 0);
  const ticketMedio = vendasAprovadas.length ? faturamento / vendasAprovadas.length : 0;
  const somaAprovadas = vendasAprovadas.reduce((sum, v) => sum + Number(v.total_value || 0), 0);

  // Prospecção Comercial
  const nomesComercial = ['DENISE', 'THAIS', 'GISLAYNE'];
  const vendasPorComercial = nomesComercial.map(nome => ({
    nome,
    total: filteredVendas.filter(v => (v.offer_name || '').toUpperCase().includes(nome)).length
  }));

  const handleApplyFilters = (f: any) => {
    setFilters(f);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Faturamento</p>
                  <p className="text-2xl font-bold">{faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p className="text-sm text-gray-500">Total do período</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                  <DollarSign size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
                  <p className="text-2xl font-bold">{ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p className="text-sm text-gray-500">Por venda</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <CreditCard size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vendas</p>
                  <p className="text-2xl font-bold">{filteredVendas.length}</p>
                  <p className="text-sm text-gray-500">Vendas registradas</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                  <ShoppingCart size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Soma das Compras Aprovadas (com filtros)</p>
                  <p className="text-xl font-semibold">{somaAprovadas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                  <DollarSign size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prospecção Comercial Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Prospecção Comercial</h3>
            <div className="flex items-center space-x-8">
              {vendasPorComercial.map((v, idx) => (
                <div key={v.nome}>
                  <span className="text-sm opacity-80">{v.nome}:</span>
                  <span className="ml-2 font-bold">{v.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Vendas */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <Button 
                variant="outline" 
                icon={<Filter size={16} />}
                onClick={() => setIsFiltersOpen(true)}
              >
                Filtros
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">STATUS/PAGAMENTO</th>
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">CONTATO</th>
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">PRODUTO</th>
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">DATA CRIADA</th>
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">VALOR TOTAL</th>
                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">OFERTA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedVendas.map((venda, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 flex items-center space-x-2">
                        {getStatusIcon(venda.status)}
                        {getPaymentIcon(venda.pagamento)}
                      </td>
                      <td className="p-4">{venda.name}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {venda.product_name}
                          <span className="ml-1 text-green-500">{venda.product_qty ? `x${venda.product_qty}` : ''}</span>
                        </div>
                      </td>
                      <td className="p-4">{venda.data_criada ? new Date(venda.data_criada).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '-'}</td>
                      <td className="p-4 text-green-500">{venda.total_value !== undefined && venda.total_value !== null ? Number(venda.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                      <td className="p-4">{venda.offer_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredVendas.length)} de {filteredVendas.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      className={`min-w-[32px] h-8 px-2`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  {totalPages > 5 && <span className="px-2 text-zinc text-lg">...</span>}
                  {totalPages > 5 && (
                    <Button
                      variant={currentPage === totalPages ? 'primary' : 'outline'}
                      className={`min-w-[32px] h-8 px-2`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
                <select
                  className="ml-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  value={itemsPerPage}
                  onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Filtros Avançados */}
        <AdvancedFilters
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      </div>
    </DashboardLayout>
  );
};