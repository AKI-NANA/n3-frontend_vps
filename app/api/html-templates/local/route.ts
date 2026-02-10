import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// GET - ローカルHTMLテンプレートファイルを読み込む
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File parameter is required' },
        { status: 400 }
      )
    }

    // 許可されたファイル名のみ
    const allowedFiles = [
      'ebay-template-en-final.html',
      'ebay_template_german.html',
      'ebay_template_italian.html',
      'ebay_template_spanish.html',
    ]

    if (!allowedFiles.includes(file)) {
      return NextResponse.json(
        { success: false, message: 'File not allowed' },
        { status: 403 }
      )
    }

    // ファイルパスを構築（public/html/ からの読み込み - Vercel/VPS対応）
    const filePath = path.join(process.cwd(), 'public', 'html', file)

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({
        success: true,
        content,
        file,
      })
    } catch (readError) {
      console.error('File read error:', readError)
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Failed to load local template:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to load template' },
      { status: 500 }
    )
  }
}
