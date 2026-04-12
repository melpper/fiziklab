import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

const DATA_FILE = 'data/simulations.json';

async function getSimulations() {
  try {
    const { blobs } = await list({ prefix: DATA_FILE });
    if (blobs.length === 0) return [];
    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch {
    return [];
  }
}

async function saveSimulations(sims) {
  await put(DATA_FILE, JSON.stringify(sims), {
    access: 'public',
    addRandomSuffix: false,
  });
}

// GET — tüm simülasyonları getir
export async function GET() {
  const sims = await getSimulations();
  return NextResponse.json(sims);
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
      if (idx >= 0) sims[idx] = sim;
      else sims.push(sim);
    } else {
      sim.id = 'sim-' + Date.now();
      sims.push(sim);
    }

    await saveSimulations(sims);
    return NextResponse.json({ success: true, sim });
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
