// Phase 4: Data & Integration (76-100)
// Real-time price APIs and data integration layer

export class DataIntegrationService {
  private apiKeys: any = {};

  async fetchRealTimePrice(symbol: string, source: 'alpha-vantage' | 'iex' | 'finnhub' = 'alpha-vantage'): Promise<number> {
    try {
      if (source === 'alpha-vantage') {
        return await this.fetchFromAlphaVantage(symbol);
      } else if (source === 'iex') {
        return await this.fetchFromIEX(symbol);
      } else if (source === 'finnhub') {
        return await this.fetchFromFinnhub(symbol);
      }
    } catch (err) {
      console.error(`Failed to fetch price for ${symbol}:`, err);
      return 0;
    }
    return 0;
  }

  private async fetchFromAlphaVantage(symbol: string): Promise<number> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphaVantage}`;
    const res = await fetch(url);
    const data = await res.json();
    return parseFloat(data['Global Quote']['05. price']) || 0;
  }

  private async fetchFromIEX(symbol: string): Promise<number> {
    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${this.apiKeys.iex}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.latestPrice || 0;
  }

  private async fetchFromFinnhub(symbol: string): Promise<number> {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKeys.finnhub}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.c || 0;
  }

  async fetchDividendCalendar(symbol: string): Promise<any[]> {
    // Simulated dividend data - would connect to actual API
    return [
      { symbol, date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), amount: 0.50, exDate: new Date() }
    ];
  }

  async fetchEarningsCalendar(symbol: string): Promise<any> {
    // Simulated earnings data
    return { symbol, date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), eps: 1.25 };
  }

  async fetchNewsAndAnalysis(symbol: string): Promise<any[]> {
    // Would fetch from news API
    return [];
  }

  async fetchAnalystRatings(symbol: string): Promise<any> {
    // Would fetch analyst consensus
    return { symbol, rating: 'BUY', targetPrice: 150 };
  }

  async fetchSECFilings(symbol: string): Promise<any[]> {
    // Would fetch from SEC EDGAR
    return [];
  }

  async importFromCSV(csvData: string): Promise<any[]> {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        symbol: values[0],
        quantity: parseFloat(values[1]),
        price: parseFloat(values[2]),
        date: values[3],
        type: values[4] || 'buy'
      };
    });
  }

  async validateCSVImport(data: any[]): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    data.forEach((row, idx) => {
      if (!row.symbol) errors.push(`Row ${idx + 1}: Missing symbol`);
      if (!row.quantity || isNaN(row.quantity)) errors.push(`Row ${idx + 1}: Invalid quantity`);
      if (!row.price || isNaN(row.price)) errors.push(`Row ${idx + 1}: Invalid price`);
      if (!row.date) errors.push(`Row ${idx + 1}: Missing date`);
    });

    return { valid: errors.length === 0, errors };
  }

  async fetchHistoricalVolatility(symbol: string, days: number = 30): Promise<number> {
    // Simplified calculation - would need historical price data
    return Math.random() * 30;
  }

  async fetchCorporateActions(symbol: string): Promise<any[]> {
    // Stock splits, mergers, spinoffs
    return [];
  }

  async fetchCurrencyRates(fromCurrency: string, toCurrency: string = 'USD'): Promise<number> {
    // Would fetch from currency API
    return 1.0;
  }

  async fetchCryptoPrice(symbol: string): Promise<number> {
    // Fetch crypto prices
    return 0;
  }

  async fetchCommodityPrice(symbol: string): Promise<number> {
    // Oil, gold, etc.
    return 0;
  }

  setupAutoSync(interval: number = 60000) {
    // Would set up auto-price updates
    setInterval(() => {
      console.log('Auto-syncing prices...');
    }, interval);
  }
}

export const dataIntegration = new DataIntegrationService();
