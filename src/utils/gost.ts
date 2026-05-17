/**
 * ГОСТ 2708-75: Объём круглых лесоматериалов.
 * Таблица: {длина_м: {диаметр_см: объём_м³}}
 */

const GOST_2708: Record<number, Record<number, number>> = {
  2.0: {8:0.010,10:0.015,12:0.023,14:0.031,16:0.040,18:0.052,20:0.063,22:0.077,24:0.091,26:0.107,28:0.123,30:0.142,32:0.161,34:0.182,36:0.204,38:0.228,40:0.252},
  3.0: {8:0.016,10:0.026,12:0.037,14:0.050,16:0.065,18:0.082,20:0.103,22:0.124,24:0.148,26:0.174,28:0.202,30:0.231,32:0.264,34:0.298,36:0.334,38:0.373,40:0.414},
  4.0: {8:0.023,10:0.037,12:0.053,14:0.073,16:0.093,18:0.118,20:0.147,22:0.178,24:0.212,26:0.250,28:0.290,30:0.333,32:0.380,34:0.429,36:0.481,38:0.538,40:0.597},
  5.0: {8:0.030,10:0.049,12:0.071,14:0.097,16:0.124,18:0.156,20:0.194,22:0.235,24:0.280,26:0.331,28:0.384,30:0.441,32:0.503,34:0.569,36:0.639,38:0.714,40:0.793},
  6.0: {8:0.038,10:0.062,12:0.091,14:0.123,16:0.160,18:0.200,20:0.248,22:0.300,24:0.358,26:0.421,28:0.489,30:0.562,32:0.641,34:0.725,36:0.814,38:0.910,40:1.011},
};

const LENGTHS = Object.keys(GOST_2708).map(Number).sort((a, b) => a - b);

export function volumeGost(diameterCm: number, lengthM: number): number {
  const d = Math.max(8, Math.min(40, Math.round(diameterCm / 2) * 2));
  const cl = LENGTHS.reduce((prev, curr) =>
    Math.abs(curr - lengthM) < Math.abs(prev - lengthM) ? curr : prev
  );
  const table = GOST_2708[cl];
  if (table && d in table) {
    return table[d];
  }
  return (Math.PI / 4) * Math.pow(d / 100, 2) * lengthM;
}

export function volumeHuber(diameterCm: number, lengthM: number): number {
  return (Math.PI / 4) * Math.pow(diameterCm / 100, 2) * lengthM;
}

export interface LogMeasurement {
  id: number;
  diameterCm: number;
  volumeM3: number;
}

export interface MeasurementResult {
  imageUri: string;
  resultImageUri?: string;
  logsCount: number;
  totalVolumeM3: number;
  avgDiameterCm: number;
  minDiameterCm: number;
  maxDiameterCm: number;
  referenceLengthCm: number;
  logLengthM: number;
  method: string;
  logs: LogMeasurement[];
  timestamp: number;
}
