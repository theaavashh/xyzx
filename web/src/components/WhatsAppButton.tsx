import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '1234567890';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20RaphArch%2C%20I%20have%20a%20question.`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#22c35e] transition-all duration-200 hover:scale-105"
    >
      <span className="text-sm font-medium">Chat with us</span>
      <MessageCircle className="w-5 h-5" />
    </a>
  );
}
