import { COMPANY_INFO } from "../mock-data";

export default function Footer() {
  return (
    <footer className="bg-[#09090b] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {COMPANY_INFO.name}
            </h3>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              {COMPANY_INFO.division} — Mengelola departemen ABC, ASQ, dan ASM
              dengan integritas dan profesionalisme.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Departemen
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Plant A - Divisi 4</li>
              <li>Email: divisi4@gajahtunggal.co.id</li>
              <li>Telp: (021) 1234-5678</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name} —{" "}
            {COMPANY_INFO.division}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
