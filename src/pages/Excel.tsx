import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Upload, FileSpreadsheet, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DetalhamentoVenda {
  nome: string;
  valor: number;
  link?: string;
}

interface ProdutoAgrupado {
  nome: string;
  valor: number;
  quantidade: number;
}

export const ExcelImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [detalhamento, setDetalhamento] = useState<DetalhamentoVenda[]>([]);
  const [produtosAgrupados, setProdutosAgrupados] = useState<ProdutoAgrupado[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    quantidade: 0,
    media: 0
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet, { defval: '' });

        // Detalhamento das vendas (linha a linha)
        const detalhamento = json.map((row: any) => {
          console.log('Linha do Excel:', row);
          return {
            nome: row['NOME DO PRODUTO'],
            valor: (() => {
              const raw = row['VALOR CONTRATO '];
              if (raw === undefined || raw === null || raw === '') return 0;
              const clean = String(raw).replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
              const num = parseFloat(clean);
              return isNaN(num) ? 0 : num;
            })(),
            link: row['LINK CONTRATO DO AUTENTIC'] || null,
          };
        });
        setDetalhamento(detalhamento);
        
        // Agrupamento por produto
        const agrupado: Record<string, { valor: number; quantidade: number }> = {};
        detalhamento.forEach((item) => {
          if (!item.nome) return;
          if (!agrupado[item.nome]) {
            agrupado[item.nome] = { valor: 0, quantidade: 0 };
          }
          agrupado[item.nome].valor += item.valor;
          agrupado[item.nome].quantidade += 1;
        });
        setProdutosAgrupados(
          Object.entries(agrupado).map(([nome, info]) => ({
            nome,
            valor: info.valor,
            quantidade: info.quantidade,
          }))
        );

        // Estatísticas
        const valorVendido = detalhamento.reduce((acc, item) => acc + (isNaN(item.valor) ? 0 : item.valor), 0);
        const quantidadeProdutos = detalhamento.length;
        const media = quantidadeProdutos > 0 ? valorVendido / quantidadeProdutos : 0;
        setStats({
          total: valorVendido,
          quantidade: quantidadeProdutos,
          media: media
        });
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      const input = document.createElement('input');
      input.type = 'file';
      input.files = files;
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
      handleFileUpload({ target: input } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Recorrência - Extensões e Produtos Extras</h2>
          <Button 
            variant="outline" 
            icon={<Download size={16} />}
            disabled={detalhamento.length === 0}
          >
            Exportar Relatório
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {!file ? (
                <>
                  <div className="mx-auto flex justify-center mb-4">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Arraste e solte seu arquivo XLSX ou CSV aqui
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    Limite 200MB por arquivo
                  </p>
                  <div>
                    <label htmlFor="file-upload">
                      <Button 
                        variant="outline"
                        icon={<FileSpreadsheet size={16} />}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Procurar arquivos
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-6 w-6 text-purple-500 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    icon={<X size={16} />}
                    onClick={() => {
                      setFile(null);
                      setDetalhamento([]);
                      setProdutosAgrupados([]);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {produtosAgrupados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Valor vendido</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {formatCurrency(stats.total)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Quantidade de produtos</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {stats.quantidade}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Média</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency(stats.media)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {produtosAgrupados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quantidade de produtos vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">NOME DO PRODUTO</th>
                      <th className="text-left py-3 px-4">VALOR_DA_VENDA</th>
                      <th className="text-left py-3 px-4">QUANT_DE_PRODUTOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosAgrupados.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4">{item.nome}</td>
                        <td className="py-3 px-4">{formatCurrency(item.valor)}</td>
                        <td className="py-3 px-4">{item.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {detalhamento.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento das vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr>
                      <th className="text-left py-3 px-4">VALOR CONTRATO FORMATADO</th>
                      <th className="text-left py-3 px-4">LINK CONTRATO DO AUTENTIC</th>
                      <th className="text-left py-3 px-4">NOME DO PRODUTO</th>
                      </tr>
                    </thead>
                    <tbody>
                    {detalhamento.map((item, idx) => (
                      <tr key={idx}>
                          <td className="py-3 px-4">{formatCurrency(item.valor)}</td>
                            <td className="py-3 px-4">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">Ver contrato</a>
                          ) : 'None'}
                            </td>
                        <td className="py-3 px-4">{item.nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
};