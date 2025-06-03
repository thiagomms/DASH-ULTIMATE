# Dashboard Comercial

Dashboard moderno e dinâmico para visualização de dados comerciais, integrado ao Supabase, com gráficos profissionais, dark/light mode e layout responsivo.

## ✨ Funcionalidades

- **Integração com Supabase:**  
  Busca dados em tempo real das tabelas `vendas_guru` e `nps_dash` do Supabase.
- **Cartões Dinâmicos:**  
  - Faturamento
  - Vendas
  - Produtos Vendidos
  - Ticket Médio
  - NPS (Net Promoter Score)
  - Prospecção Comercial (contagem de ofertas por colaborador)
- **Gráficos Profissionais (Recharts):**
  - Barras verticais e horizontais
  - Barras empilhadas
  - Linhas
  - Pizza e Doughnut
  - Gauge (medidor)
- **Modo Claro/Escuro:**  
  Suporte total a dark/light mode, com detecção automática e ajuste de cores dos gráficos.
- **Layout Responsivo:**  
  Visualização adaptada para desktop e mobile.
- **UI Moderna:**  
  Componentes estilizados, visual limpo e profissional.

## 🚀 Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Supabase JS](https://supabase.com/docs/reference/javascript)
- [Recharts](https://recharts.org/)
- [react-gauge-chart](https://github.com/Martin36/react-gauge-chart)
- [Tailwind CSS](https://tailwindcss.com/) (ou outro framework de UI)
- Context API para tema

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-dashboard.git
   cd seu-dashboard
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Supabase:**
   - Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
     ```
     REACT_APP_SUPABASE_URL=https://<sua-url>.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=<sua-anon-key>
     ```
   - Os dados são buscados das tabelas:
     - `vendas_guru` (dados de vendas)
     - `nps_dash` (dados de NPS)

4. **Rode o projeto:**
   ```bash
   npm start
   ```

## 🗂️ Estrutura de Pastas

```
src/
  components/
    widgets/
      ChartCard.tsx      # Componente de cartão de gráfico (Recharts)
      ...
    ui/
      Card.tsx           # Componente base de cartão
      ...
  context/
    ThemeContext.tsx     # Contexto para dark/light mode
  types/
    index.ts             # Tipos TypeScript para os dados dos gráficos
  services/
    supabaseClient.ts    # Instância do Supabase
  ...
```

## 📊 Como funciona

- **Busca de Dados:**  
  Todos os cartões e gráficos consomem dados reais do Supabase, sem mocks.
- **Gráficos:**  
  Os dados são transformados para o formato do Recharts e exibidos conforme o tipo selecionado (`bar`, `line`, `pie`, `stacked-bar`, etc).
- **Tema:**  
  O tema é controlado via Context API e aplicado em todos os componentes, inclusive nos gráficos SVG.
- **NPS:**  
  Calculado a partir dos dados da tabela `nps_dash`, exibindo promotores, neutros, detratores e score.
- **Prospecção Comercial:**  
  Conta quantas ofertas cada colaborador realizou, filtrando por nomes como "DENISE", "THAIS" e "GISLAYNE".

## 🖼️ Exemplos de Uso

```tsx
<ChartCard
  title="Vendas por Status"
  chartData={dadosVendasStatus}
  type="bar"
/>

<ChartCard
  title="NPS"
  chartData={dadosNPS}
  type="gauge"
/>
```

## 🛠️ Customização

- **Adicionar novos gráficos:**  
  Basta criar um novo objeto `chartData` e passar para o componente `ChartCard` com o tipo desejado.
- **Alterar layout:**  
  Os cartões e gráficos podem ser reordenados facilmente no arquivo de layout principal.

## 🧑‍💻 Desenvolvimento

- **Boas práticas:**  
  O projeto segue boas práticas de organização, tipagem e componentes reutilizáveis.
- **Linter:**  
  Use `npm run lint` para checar problemas de código.
- **Tipos:**  
  Tipos TypeScript definidos em `src/types`.

## 🐞 Possíveis Problemas

- **Cores dos eixos no dark mode:**  
  Caso utilize extensões como Dark Reader, pode haver conflitos na renderização das cores dos eixos dos gráficos. O projeto já implementa ticks customizados para minimizar esse problema.
- **Dependências de tipos:**  
  Se aparecer erro de tipos para `react-gauge-chart`, adicione manualmente:
  ```ts
  // src/@types/react-gauge-chart.d.ts
  declare module 'react-gauge-chart';
  ```


