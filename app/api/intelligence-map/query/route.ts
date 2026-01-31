import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

/**
 * N3 Intelligence Map API
 * n3_local_brain.sqliteにクエリを実行してデータを返す
 */

const DB_PATH = path.join(process.cwd(), 'lib', 'data', 'n3_local_brain.sqlite');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;

    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      );
    }

    // SELECTクエリのみ許可（セキュリティ）
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return NextResponse.json(
        { error: 'Only SELECT queries are allowed' },
        { status: 403 }
      );
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    // クエリを実行
    const results = await db.all(sql);

    await db.close();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Intelligence Map API Error:', error);
    return NextResponse.json(
      { error: 'Failed to query database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
