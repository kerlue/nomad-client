import { Orders } from '../../shared/interface';

export class CsvExporter {

  static toLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase())
      .trim();
  }

  static toCSV(data: Orders[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]) as (keyof Orders)[];
    const labels = headers.map(h => this.toLabel(h as string));

    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return /[,"\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    );

    return [labels.join(','), ...rows].join('\n');
  }

  static download(data: Orders[], filename: string = 'export.csv'): void {
    const csv = this.toCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
