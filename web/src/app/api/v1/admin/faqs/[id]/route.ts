import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'faqs.json');

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

function readFAQs(): FAQItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFAQs(faqs: FAQItem[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(faqs, null, 2));
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const faqs = readFAQs();
    const index = faqs.findIndex((f) => f.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    faqs[index] = { ...faqs[index], ...body, id };
    writeFAQs(faqs);

    return NextResponse.json({ success: true, data: faqs[index] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const faqs = readFAQs();
    const filtered = faqs.filter((f) => f.id !== id);

    if (filtered.length === faqs.length) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    writeFAQs(filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
