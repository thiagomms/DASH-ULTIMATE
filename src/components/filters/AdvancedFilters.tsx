import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../utils/supabaseClient';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  currentFilters: any;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'Todos',
    paymentMethod: 'Todas',
    products: [] as string[],
  });
  const [allProducts, setAllProducts] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingProducts(true);
      supabase.from('vendas_guru')
        .select('product_name')
        .then(({ data, error }) => {
          if (!error && data) {
            const unique = Array.from(new Set(data.map((d: any) => d.product_name).filter(Boolean)));
            setAllProducts(unique);
          }
          setLoadingProducts(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentFilters) {
      setFilters(currentFilters);
      setProductSearch('');
    }
  }, [isOpen, currentFilters]);

  const handleFilter = () => {
    const status = filters.status || 'Todos';
    onApplyFilters({ ...filters, status });
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: 'Todos',
      paymentMethod: 'Todas',
      products: []
    });
    setProductSearch('');
  };

  if (!isOpen) return null;

  // Filtra produtos conforme o texto digitado
  const filteredProducts = allProducts.filter(p =>
    p.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filtros Avançados</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Final
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="Todos">Todos</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                value={filters.paymentMethod}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
              >
                <option value="Todas">Todas</option>
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Produtos
            </label>
            <input
              type="text"
              placeholder="Buscar produto..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm mb-2"
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
              {loadingProducts ? (
                <span className="text-sm text-gray-500">Carregando produtos...</span>
              ) : filteredProducts.length === 0 ? (
                <span className="text-sm text-gray-500">Nenhum produto encontrado</span>
              ) : filteredProducts.map((product, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600"
                    checked={filters.products.includes(product)}
                    onChange={(e) => {
                      const newProducts = e.target.checked
                        ? [...filters.products, product]
                        : filters.products.filter((p) => p !== product);
                      setFilters({ ...filters, products: newProducts });
                    }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{product}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleFilter}>
              Filtrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};