export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-zinc-500">
        <span>
          © {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_SITE_NAME || "Giới thiệu"}.
        </span>
        <span>Built for Nuxt → Next migration.</span>
      </div>
    </footer>
  );
}







