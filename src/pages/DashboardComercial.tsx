import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChartCard } from '../components/widgets/ChartCard';
import { DollarSign, ShoppingCart, Package, CreditCard } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';


export const DashboardComercial: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<any[]>([]);

  // NPS
  const [nps, setNps] = useState({ respostas: 0, promotor: 0, neutro: 0, detrator: 0, score: 0 });

  // Dados processados para os cards e gráficos
  const [stats, setStats] = useState({ faturamento: 0, vendas: 0, produtosVendidos: 0, ticketMedio: 0 });
  const [vendasStatusData, setVendasStatusData] = useState<any>(null);
  const [formasPagamentoData, setFormasPagamentoData] = useState<any>(null);
  const [vendasSemanaData, setVendasSemanaData] = useState<any>(null);
  const [topEstadosData, setTopEstadosData] = useState<any>(null);
  const [volumeVendasData, setVolumeVendasData] = useState<any>(null);
  const [topProdutos, setTopProdutos] = useState<any[]>([]);
  const [prospeccaoData, setProspeccaoData] = useState<any>(null);

  // Funções utilitárias para tradução
  function traduzirStatus(status: string) {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'waiting_payment':
        return 'Aguardando Pagamento';
      case 'abandoned':
        return 'Abandonado';
      case 'billet_printed':
        return 'Boleto Impresso';
      case 'refunded':
        return 'Reembolsado';
      case 'expired':
        return 'Expirado';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      default:
        return status || '-';
    }
  }
  function traduzirMetodoPagamento(metodo: string) {
    switch (metodo) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'pix':
        return 'Pix';
      case 'billet':
        return 'Boleto';
      case 'other':
        return 'Outros';
      default:
        return metodo || '-';
    }
  }

  // Estados para filtros e paginação
  const [sortField, setSortField] = useState<string>('data_criada');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [pagamentoFiltro, setPagamentoFiltro] = useState('');
  const [produtoFiltro, setProdutoFiltro] = useState('');

  useEffect(() => {
    const fetchVendasComFiltro = async () => {
      setLoading(true);
      let query = supabase.from('vendas_guru').select('*');
      if (startDate) query = query.gte('data_criada', startDate);
      if (endDate) query = query.lte('data_criada', endDate);
      const { data, error } = await query;
      if (!error && data) {
        setVendas(data);
        processarDados(data);
      }
      setLoading(false);
    };
    fetchVendasComFiltro();
    fetchNps();
    fetchProspeccao(startDate, endDate);
  }, [startDate, endDate]);

  async function fetchNps() {
    // Busca todos os dados de NPS
    const { data, error } = await supabase
      .from('nps_dash')
      .select('nota_utilidade');
    if (!error && data) {
      const respostas = data.length;
      const promotor = data.filter((d: any) => d.nota_utilidade >= 9).length;
      const neutro = data.filter((d: any) => d.nota_utilidade >= 7 && d.nota_utilidade <= 8).length;
      const detrator = data.filter((d: any) => d.nota_utilidade <= 6).length;
      const score = respostas > 0 ? Math.round(((promotor - detrator) / respostas) * 100) : 0;
      setNps({ respostas, promotor, neutro, detrator, score });
    }
  }

  function processarDados(data: any[]) {
    // Faturamento: soma de total_value das vendas aprovadas
    const vendasAprovadas = data.filter(v => typeof v.status === 'string' && v.status.toLowerCase().includes('approved'));
    const faturamento = vendasAprovadas.reduce((acc, v) => acc + Number(v.total_value || 0), 0);
    const vendasCount = vendasAprovadas.length;
    const produtosVendidos = vendasAprovadas.reduce((acc, v) => acc + Number(v.product_qty || 0), 0);
    const ticketMedio = vendasCount > 0 ? faturamento / vendasCount : 0;

    setStats({
      faturamento,
      vendas: vendasCount,
      produtosVendidos,
      ticketMedio
    });

    // Vendas por status (ajustado para valores reais do banco)
    const statusMap = {
      approved: 'Aprovada',
      waiting_payment: 'Ag. Pagamento',
      expired: 'Expirada',
      abandoned: 'Abandonada',
      billet_printed: 'Boleto Impresso'
    };
    const statusLabels = Object.values(statusMap);
    const statusData = Object.keys(statusMap).map(
      key => data.filter(v => v.status === key).length
    );
    setVendasStatusData({
      labels: statusLabels,
      datasets: [{
        label: 'Vendas por Status',
        data: statusData,
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']
      }]
    });

    // Formas de pagamento (ajustado para valores reais do banco)
    const pagamentoMap = {
      pix: 'Pix',
      credit_card: 'Cartão de Crédito',
      billet: 'Boleto Bancário',
      other: 'Outro'
    };
    const pagamentoLabels = Object.values(pagamentoMap);
    const pagamentoData = Object.keys(pagamentoMap).map(
      key => data.filter(v => v.pagamento === key).length
    );
    setFormasPagamentoData({
      labels: pagamentoLabels,
      datasets: [{
        label: 'Formas de Pagamento',
        data: pagamentoData,
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6']
      }]
    });

    // Vendas por dia da semana
    const semanaLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const semanaData = [0, 1, 2, 3, 4, 5, 6].map(dia =>
      vendasAprovadas.filter(v => {
        const dataAprovada = v.data_aprovada ? new Date(v.data_aprovada) : null;
        return dataAprovada && dataAprovada.getDay() === dia;
      }).length
    );
    setVendasSemanaData({
      labels: semanaLabels,
      datasets: [{
        label: 'Vendas por Dia da Semana',
        data: semanaData,
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1']
      }]
    });

    // Top estados
    const estadosMap: Record<string, number> = {};
    vendasAprovadas.forEach(v => {
      if (v.contact_state) {
        estadosMap[v.contact_state] = (estadosMap[v.contact_state] || 0) + 1;
      }
    });
    const estadosSorted = Object.entries(estadosMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    setTopEstadosData({
      labels: estadosSorted.map(e => e[0]),
      datasets: [{
        label: 'Vendas por Estado',
        data: estadosSorted.map(e => e[1]),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F59E42']
      }]
    });

    // Volume de vendas por dia (últimos 12 dias)
    const dias: string[] = [];
    const vendasPorDia: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      dias.push(label);
      vendasPorDia[label] = 0;
    }
    vendasAprovadas.forEach(v => {
      const dataAprovada = v.data_aprovada ? new Date(v.data_aprovada) : null;
      if (dataAprovada) {
        const label = dataAprovada.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        if (label in vendasPorDia) {
          vendasPorDia[label]++;
        }
      }
    });
    setVolumeVendasData({
      labels: dias,
      datasets: [{
        label: 'Volume de Vendas',
        data: dias.map(d => vendasPorDia[d]),
        borderColor: '#8B5CF6',
        backgroundColor: ['rgba(139, 92, 246, 0.1)']
      }]
    });

    // Top produtos
    const produtosMap: Record<string, { nome: string, categoria: string, unidades: number, valor: number }> = {};
    vendasAprovadas.forEach(v => {
      if (v.product_id && v.product_name) {
        if (!produtosMap[v.product_id]) {
          produtosMap[v.product_id] = {
            nome: v.product_name,
            categoria: v.product_id,
            unidades: 0,
            valor: 0
          };
        }
        produtosMap[v.product_id].unidades += Number(v.product_qty || 0);
        produtosMap[v.product_id].valor += Number(v.unit_value || 0) * Number(v.product_qty || 0);
      }
    });
    const produtosSorted = Object.values(produtosMap).sort((a, b) => b.unidades - a.unidades).slice(0, 5);
    setTopProdutos(produtosSorted.map(p => ({
      nome: p.nome,
      categoria: p.categoria,
      unidades: p.unidades,
      valor: p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })));
  }

  async function fetchProspeccao(startDate: string, endDate: string) {
    let query = supabase.from('vendas_guru').select('offer_name, data_criada');
    if (startDate) query = query.gte('data_criada', startDate);
    if (endDate) query = query.lte('data_criada', endDate);
    const { data, error } = await query;
    if (error) {
      console.error('Erro ao buscar prospecção:', error);
      return;
    }
    if (!data) {
      console.warn('Nenhum dado retornado da prospecção');
      return;
    }
    const nomes = ['DENISE', 'THAIS', 'GISLAYNE'];
    const map: Record<string, number> = { DENISE: 0, THAIS: 0, GISLAYNE: 0 };
    data.forEach((v: any) => {
      nomes.forEach(nome => {
        if (v.offer_name && v.offer_name.toUpperCase().includes(nome)) {
          map[nome]++;
        }
      });
    });
    setProspeccaoData({
      labels: nomes,
      datasets: [{
        label: 'Prospecções',
        data: nomes.map(n => map[n]),
        backgroundColor: ['#10B981', '#3B82F6', '#A855F7']
      }]
    });
  }

  // Função para filtrar vendas
  const filteredVendas = useMemo(() => {
    return vendas.filter(v => {
      const dataCriada = v.data_criada ? new Date(v.data_criada) : null;
      const dentroData = (!startDate || (dataCriada && new Date(startDate) <= dataCriada)) &&
        (!endDate || (dataCriada && dataCriada <= new Date(endDate)));
      const statusOk = !statusFiltro || traduzirStatus(v.status) === traduzirStatus(statusFiltro);
      const pagamentoOk = !pagamentoFiltro || traduzirMetodoPagamento(v.pagamento) === traduzirMetodoPagamento(pagamentoFiltro);
      const produtoOk = !produtoFiltro || (v.product_name || '').toLowerCase().includes(produtoFiltro.toLowerCase());
      return dentroData && statusOk && pagamentoOk && produtoOk;
    });
  }, [vendas, startDate, endDate, statusFiltro, pagamentoFiltro, produtoFiltro]);

  // Paginação
  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendas = filteredVendas.slice(startIndex, startIndex + itemsPerPage);

  // Ordenação
  const sortedVendas = useMemo(() => {
    return [...paginatedVendas].sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    });
  }, [paginatedVendas, sortField, sortDirection]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Inicial:
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="ml-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="dd/mm/aaaa"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Final:
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="ml-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="dd/mm/aaaa"
            />
          </label>
          <button
            className="ml-4 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="button"
            disabled
          >
            Filtrar
          </button>
        </div>
        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Faturamento</p>
                  <p className="text-2xl font-bold mt-1">{stats.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p className="text-sm text-gray-500 mt-1">Total geral aprovado</p>
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
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vendas</p>
                  <p className="text-2xl font-bold mt-1">{stats.vendas}</p>
                  <p className="text-sm text-gray-500 mt-1">Total de vendas</p>
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
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Produtos Vendidos</p>
                  <p className="text-2xl font-bold mt-1">{stats.produtosVendidos}</p>
                  <p className="text-sm text-gray-500 mt-1">Unidades aprovadas</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-violet-500 flex items-center justify-center text-white">
                  <Package size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
                  <p className="text-2xl font-bold mt-1">{stats.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p className="text-sm text-gray-500 mt-1">Por venda</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <CreditCard size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Gráficos principais (Vendas por Status, Formas de Pagamento, Vendas por Dias da Semana) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Status</CardTitle>
            </CardHeader>
            <CardContent>
              {vendasStatusData && (
                <ChartCard
                  title=""
                  chartData={vendasStatusData}
                  type="doughnut"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {formasPagamentoData && (
                <ChartCard
                  title=""
                  chartData={formasPagamentoData}
                  type="doughnut"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Dias da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              {vendasSemanaData && (
                <ChartCard
                  title=""
                  chartData={vendasSemanaData}
                  type="doughnut"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* NPS Card */}
        <div className="flex gap-4 w-full">
          <div className="w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>NPS - Net Promoter Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Respostas</p>
                    <p className="text-2xl font-bold">{nps.respostas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-500">Bom</p>
                    <p className="text-2xl font-bold text-green-500">{nps.promotor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-500">Médio</p>
                    <p className="text-2xl font-bold text-yellow-500">{nps.neutro}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-500">Ruim</p>
                    <p className="text-2xl font-bold text-red-500">{nps.detrator}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ChartCard
                    title=""
                    chartData={{
                      labels: ['NPS'],
                      datasets: [{
                        label: 'NPS',
                        data: [nps.score],
                        backgroundColor: ['#10B981']
                      }]
                    }}
                    type="gauge"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Prospecção Comercial</CardTitle>
              </CardHeader>
              <CardContent>
                {prospeccaoData && (
                  <ChartCard
                    title=""
                    chartData={prospeccaoData}
                    type="bar"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              {volumeVendasData && (
                <ChartCard
                  title=""
                  chartData={volumeVendasData}
                  type="bar"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Estados com Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              {topEstadosData && (
                <ChartCard
                  title=""
                  chartData={topEstadosData}
                  type="pie"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4">Produtos</th>
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-left py-3 px-4">Unidades vendidas</th>
                    <th className="text-left py-3 px-4">Valores</th>
                  </tr>
                </thead>
                <tbody>
                  {topProdutos.map((produto, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-3 px-4">{produto.nome}</td>
                      <td className="py-3 px-4">{produto.categoria}</td>
                      <td className="py-3 px-4">{produto.unidades}</td>
                      <td className="py-3 px-4">{produto.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};