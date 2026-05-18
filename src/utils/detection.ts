/**
 * Log detection module.
 * 
 * For MVP: sends image to backend API for processing.
 * Backend runs OpenCV/YOLO and returns detected logs.
 * 
 * Fallback: mock detection for demo/offline mode.
 */

import { volumeGost, MeasurementResult, LogMeasurement } from './gost';

const API_URL = 'http://5.129.233.22:8000';

export interface DetectionParams {
  imageUri: string;
  referenceLengthCm: number;
  logLengthM: number;
}

interface ApiResponse {
  logs_count: number;
  total_volume_m3: number;
  avg_diameter_cm: number;
  min_diameter_cm: number;
  max_diameter_cm: number;
  logs: Array<{
    id: number;
    diameter_cm: number;
    volume_m3: number;
  }>;
  result_image_base64?: string;
}

export async function detectLogs(params: DetectionParams): Promise<MeasurementResult> {
  try {
    return await detectLogsApi(params);
  } catch {
    console.log('API unavailable, using demo mode');
    return detectLogsDemo(params);
  }
}

async function detectLogsApi(params: DetectionParams): Promise<MeasurementResult> {
  const formData = new FormData();

  const filename = params.imageUri.split('/').pop() || 'photo.jpg';
  formData.append('image', {
    uri: params.imageUri,
    type: 'image/jpeg',
    name: filename,
  } as unknown as Blob);
  formData.append('reference_length_cm', String(params.referenceLengthCm));
  formData.append('log_length_m', String(params.logLengthM));

  const response = await fetch(`${API_URL}/detect`, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  return {
    imageUri: params.imageUri,
    resultImageUri: data.result_image_base64
      ? `data:image/jpeg;base64,${data.result_image_base64}`
      : undefined,
    logsCount: data.logs_count,
    totalVolumeM3: data.total_volume_m3,
    avgDiameterCm: data.avg_diameter_cm,
    minDiameterCm: data.min_diameter_cm,
    maxDiameterCm: data.max_diameter_cm,
    referenceLengthCm: params.referenceLengthCm,
    logLengthM: params.logLengthM,
    method: 'ГОСТ 2708-75',
    logs: data.logs.map(l => ({
      id: l.id,
      diameterCm: l.diameter_cm,
      volumeM3: l.volume_m3,
    })),
    timestamp: Date.now(),
  };
}

function detectLogsDemo(params: DetectionParams): MeasurementResult {
  const count = 8 + Math.floor(Math.random() * 15);
  const logs: LogMeasurement[] = [];
  let totalVol = 0;

  for (let i = 0; i < count; i++) {
    const d = 10 + Math.floor(Math.random() * 28);
    const vol = volumeGost(d, params.logLengthM);
    totalVol += vol;
    logs.push({ id: i + 1, diameterCm: d, volumeM3: Math.round(vol * 1000) / 1000 });
  }

  logs.sort((a, b) => b.diameterCm - a.diameterCm);
  const diameters = logs.map(l => l.diameterCm);

  return {
    imageUri: params.imageUri,
    logsCount: count,
    totalVolumeM3: Math.round(totalVol * 1000) / 1000,
    avgDiameterCm: Math.round(diameters.reduce((a, b) => a + b, 0) / diameters.length),
    minDiameterCm: Math.min(...diameters),
    maxDiameterCm: Math.max(...diameters),
    referenceLengthCm: params.referenceLengthCm,
    logLengthM: params.logLengthM,
    method: 'ГОСТ 2708-75 (демо)',
    logs,
    timestamp: Date.now(),
  };
}
