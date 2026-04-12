import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
