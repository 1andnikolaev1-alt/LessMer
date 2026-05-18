import * as SQLite from 'expo-sqlite';
import type { MeasurementResult } from './gost';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('lessmer.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        logs_count INTEGER NOT NULL,
        total_volume_m3 REAL NOT NULL,
        avg_diameter_cm REAL NOT NULL,
        min_diameter_cm REAL NOT NULL,
        max_diameter_cm REAL NOT NULL,
        reference_length_cm REAL NOT NULL,
        log_length_m REAL NOT NULL,
        method TEXT NOT NULL,
        image_uri TEXT,
        result_image_uri TEXT,
        logs_json TEXT NOT NULL
      );
    `);
  }
  return db;
}

export async function saveMeasurement(result: MeasurementResult): Promise<number> {
  const database = await getDb();
  const row = await database.runAsync(
    `INSERT INTO measurements 
     (timestamp, logs_count, total_volume_m3, avg_diameter_cm, min_diameter_cm, max_diameter_cm, 
      reference_length_cm, log_length_m, method, image_uri, result_image_uri, logs_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    result.timestamp,
    result.logsCount,
    result.totalVolumeM3,
    result.avgDiameterCm,
    result.minDiameterCm,
    result.maxDiameterCm,
    result.referenceLengthCm,
    result.logLengthM,
    result.method,
    result.imageUri,
    result.resultImageUri ?? null,
    JSON.stringify(result.logs),
  );
  return row.lastInsertRowId;
}

export interface SavedMeasurement {
  id: number;
  result: MeasurementResult;
}

export async function getMeasurements(): Promise<SavedMeasurement[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: number;
    timestamp: number;
    logs_count: number;
    total_volume_m3: number;
    avg_diameter_cm: number;
    min_diameter_cm: number;
    max_diameter_cm: number;
    reference_length_cm: number;
    log_length_m: number;
    method: string;
    image_uri: string | null;
    result_image_uri: string | null;
    logs_json: string;
  }>('SELECT * FROM measurements ORDER BY timestamp DESC');

  return rows.map(row => ({
    id: row.id,
    result: {
      imageUri: row.image_uri ?? '',
      resultImageUri: row.result_image_uri ?? undefined,
      logsCount: row.logs_count,
      totalVolumeM3: row.total_volume_m3,
      avgDiameterCm: row.avg_diameter_cm,
      minDiameterCm: row.min_diameter_cm,
      maxDiameterCm: row.max_diameter_cm,
      referenceLengthCm: row.reference_length_cm,
      logLengthM: row.log_length_m,
      method: row.method,
      logs: JSON.parse(row.logs_json),
      timestamp: row.timestamp,
    },
  }));
}

export async function deleteMeasurement(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM measurements WHERE id = ?', id);
}
