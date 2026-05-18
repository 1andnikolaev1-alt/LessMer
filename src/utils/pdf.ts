import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { MeasurementResult } from './gost';

export async function exportToPdf(result: MeasurementResult): Promise<void> {
  const date = new Date(result.timestamp).toLocaleString('ru-RU');

  const groups: Record<number, { count: number; vol: number }> = {};
  for (const log of result.logs) {
    const d = Math.max(8, Math.min(40, Math.round(log.diameterCm / 2) * 2));
    if (!groups[d]) groups[d] = { count: 0, vol: 0 };
    groups[d].count++;
    groups[d].vol += log.volumeM3;
  }

  const groupRows = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)
    .map(d => `
      <tr>
        <td>${d}</td>
        <td>${groups[d].count}</td>
        <td>${groups[d].vol.toFixed(3)}</td>
      </tr>
    `).join('');

  const logRows = result.logs.map(log => `
    <tr>
      <td>${log.id}</td>
      <td>${log.diameterCm}</td>
      <td>${log.volumeM3}</td>
    </tr>
  `).join('');

  const html = `
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        h1 { color: #1a5f1a; border-bottom: 2px solid #1a5f1a; padding-bottom: 8px; }
        h2 { color: #444; margin-top: 24px; }
        .summary { display: flex; gap: 20px; margin: 16px 0; }
        .stat { background: #f0f8f0; border-radius: 8px; padding: 16px; text-align: center; flex: 1; }
        .stat-value { font-size: 28px; font-weight: bold; color: #1a5f1a; }
        .stat-label { color: #666; font-size: 12px; margin-top: 4px; }
        .info { background: #f5f5f5; border-radius: 8px; padding: 12px; margin: 12px 0; }
        .info p { margin: 4px 0; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background: #1a5f1a; color: white; padding: 8px; text-align: left; }
        td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 11px; }
      </style>
    </head>
    <body>
      <h1>ЛесМер — Замер объёма</h1>
      <p style="color: #666;">${date}</p>
      
      <div class="summary">
        <div class="stat">
          <div class="stat-value">${result.logsCount}</div>
          <div class="stat-label">Брёвен</div>
        </div>
        <div class="stat">
          <div class="stat-value">${result.totalVolumeM3}</div>
          <div class="stat-label">м³</div>
        </div>
      </div>

      <div class="info">
        <p><b>Диаметры:</b> ${result.minDiameterCm} — ${result.maxDiameterCm} см (среднее ${result.avgDiameterCm} см)</p>
        <p><b>Длина брёвен:</b> ${result.logLengthM} м</p>
        <p><b>Эталон:</b> ${result.referenceLengthCm} см</p>
        <p><b>Метод расчёта:</b> ${result.method}</p>
      </div>

      <h2>Сводка по диаметрам</h2>
      <table>
        <tr><th>⌀ см</th><th>Шт</th><th>м³</th></tr>
        ${groupRows}
      </table>

      <h2>Детализация</h2>
      <table>
        <tr><th>№</th><th>⌀ см</th><th>м³</th></tr>
        ${logRows}
      </table>

      <div class="footer">
        Сформировано в приложении ЛесМер | ГОСТ 2708-75
      </div>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Экспорт замера ЛесМер',
      UTI: 'com.adobe.pdf',
    });
  }
}
