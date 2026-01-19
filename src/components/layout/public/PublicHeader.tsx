export function PublicHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="text-lg font-semibold text-zinc-900">
          {process.env.NEXT_PUBLIC_SITE_NAME || "Giới thiệu"}
        </div>
        <nav className="flex gap-4 text-sm text-zinc-600">
          <a href="/home" className="hover:text-zinc-900">
            Trang chủ
          </a>
          <a href="/home/about" className="hover:text-zinc-900">
            Về chúng tôi
          </a>
          <a href="/home/contact" className="hover:text-zinc-900">
            Liên hệ
          </a>
        </nav>
      </div>
    </header>
  );
}







