import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const password = formData.get('password');

    if (password !== process.env.ADMIN_PASS && password !== 'fiziklab2026') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const blob = await put(`simulations/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, filename: file.name });
  } catch (error) {
    return NextResponse.json({ error: 'Yükleme hatası: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { url, password } = await request.json();

    if (password !== process.env.ADMIN_PASS && password !== 'fiziklab2026') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası: ' + error.message }, { status: 500 });
  }
}
