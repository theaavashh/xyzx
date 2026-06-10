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

export async function GET() {
  const faqs = readFAQs();
  return NextResponse.json({ success: true, data: faqs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const faqs = readFAQs();

    const newFAQ: FAQItem = {
      id: String(Date.now()),
      question: body.question,
      answer: body.answer,
      category: body.category,
      order: body.order ?? faqs.length,
      isActive: body.isActive ?? true,
    };

    faqs.push(newFAQ);
    writeFAQs(faqs);

    return NextResponse.json({ success: true, data: newFAQ }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 });
  }
}
