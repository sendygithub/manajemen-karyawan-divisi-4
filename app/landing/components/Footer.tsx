import { COMPANY_INFO } from "../mock-data";

export default function Footer() {
  return (
    <footer className="relative bg-[#121110] border-t border-white/10 py-12 text-[#F4F1EA] overflow-hidden">
      {/* Texture overlay matching Hero section */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #F5B700 0px, #F5B700 1px, transparent 1px, transparent 14px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-[#F5B700] text-black font-black text-[10px] tracking-tighter">
                GT
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                {COMPANY_INFO.name}
              </h3>
            </div>
            <p className="text-sm text-[#B8B5AC] leading-relaxed">
              {COMPANY_INFO.division} — Mengelola departemen ABC, ASQ, dan ASM
              dengan integritas dan profesionalisme.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#F5B700] uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-[#B8B5AC] hover:text-[#F5B700] transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm text-[#B8B5AC] hover:text-[#F5B700] transition-colors"
                >
                  Departemen
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-sm text-[#B8B5AC] hover:text-[#F5B700] transition-colors"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-[#F5B700] uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B8B5AC]">
              <li>Plant A - Divisi 4</li>
              <li>Email: divisi4@gajahtunggal.co.id</li>
              <li>Telp: (021) 1234-5678</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#75726A]">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name} —{" "}
            {COMPANY_INFO.division}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
            <span className="uppercase tracking-widest text-[10px]">
              Sistem Aktif
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
