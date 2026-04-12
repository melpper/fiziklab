import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const DATA_KEY = 'data/simulations.json';

async function getSimulations() {
  try {
    const { blobs } = await list({ prefix: 'data/' });
    const dataBlob = blobs.find(b => b.pathname === DATA_KEY);
    if (!dataBlob) return [];
    const response = await fetch(dataBlob.url, { cache: 'no-store' });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('getSimulations error:', e);
    return [];
  }
}

async function saveSimulations(sims) {
  // delete old file first to avoid conflicts
  try {
    const { blobs } = await list({ prefix: 'data/' });
    const dataBlob = blobs.find(b => b.pathname === DATA_KEY);
    if (dataBlob) {
      await del(dataBlob.url);
    }
  } catch (e) {
    console.error('delete old data error:', e);
  }

  // save new data
  await put(DATA_KEY, JSON.stringify(sims), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

// GET — tüm simülasyonları getir
export async function GET() {
  try {
    const sims = await getSimulations();
    return NextResponse.json(sims, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (e) {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}

// POST — yeni simülasyon ekle veya güncelle
export async function POST(request) {
  try {
    const { sim, password } = await request.json();

    if (password !== process.env.ADMIN_PASS && password !== 'fiziklab2026') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const sims = await getSimulations();

    if (sim.id) {
      // güncelle
      const idx = sims.findIndex(s => s.id === sim.id);
      if (idx >= 0) {
        sims[idx] = sim;
      } else {
        sims.push(sim);
      }
    } else {
      sim.id = 'sim-' + Date.now();
      sims.push(sim);
    }

    await saveSimulations(sims);
    return NextResponse.json({ success: true, sim, total: sims.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — simülasyon sil
export async function DELETE(request) {
  try {
    const { id, password } = await request.json();

    if (password !== process.env.ADMIN_PASS && password !== 'fiziklab2026') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    let sims = await getSimulations();
    sims = sims.filter(s => s.id !== id);
    await saveSimulations(sims);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
