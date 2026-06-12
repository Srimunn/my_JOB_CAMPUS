import { Instagram, MessageCircle } from "lucide-react";

export function FloatingButtons() {
  return (
    <>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Instagram"
        className="fixed bottom-5 left-5 z-30 grid h-12 w-12 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}
      >
        <Instagram className="h-5 w-5" />
      </a>
      <a
        href="https://wa.me/919999999999?text=Hi%20My%20Job%20Campus%2C%20please%20send%20me%20instant%20job%20alerts"
        target="_blank"
        rel="noreferrer noopener"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
        Get Instant Job Alerts
      </a>
    </>
  );
}
