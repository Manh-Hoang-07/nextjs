/**
 * EXAMPLE: How to upgrade PublicHeader to use OptimizedLink
 * 
 * This is a reference implementation showing how to replace
 * standard Next.js Link with OptimizedLink for better UX
 */

// BEFORE (current implementation):
import Link from "next/link";

<Link href="/home/about">About</Link>

// AFTER (optimized implementation):
import { OptimizedLink } from "@/components/ui/OptimizedLink";

<OptimizedLink href="/home/about">About</OptimizedLink>

/**
 * Full example for PublicHeader.tsx
 */

// 1. Update import at the top:
// BEFORE:
import Link from "next/link";

// AFTER:
import { OptimizedLink } from "@/components/ui/OptimizedLink";

// 2. Replace all Link components:

// Logo link (line ~125):
// BEFORE:
<Link href="/" className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900 lg:text-gray-900'}`}>
  {siteName}
</Link>

// AFTER:
<OptimizedLink href="/" className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900 lg:text-gray-900'}`}>
  {siteName}
</OptimizedLink>

// Desktop navigation links (line ~141):
// BEFORE:
<Link
  href={item.path}
  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive(item.path) ? "bg-primary/10 text-primary" : "text-gray-700 hover:text-primary hover:bg-gray-50"}`}
>
  {item.name}
</Link>

// AFTER:
<OptimizedLink
  href={item.path}
  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive(item.path) ? "bg-primary/10 text-primary" : "text-gray-700 hover:text-primary hover:bg-gray-50"}`}
>
  {item.name}
</OptimizedLink>

// Dropdown links (line ~155):
// BEFORE:
<Link
  key={child.path}
  href={child.path}
  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
>
  <span className="text-xl opacity-80">{child.icon}</span>
  {child.name}
</Link>

// AFTER:
<OptimizedLink
  key={child.path}
  href={child.path}
  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
>
  <span className="text-xl opacity-80">{child.icon}</span>
  {child.name}
</OptimizedLink>

// CTA button (line ~173):
// BEFORE:
<Link href="/home/contact" className="hidden lg:flex">
  <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
    <PhoneIcon className="w-4 h-4" />
    <span>Tư vấn</span>
  </button>
</Link>

// AFTER:
<OptimizedLink href="/home/contact" className="hidden lg:flex">
  <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
    <PhoneIcon className="w-4 h-4" />
    <span>Tư vấn</span>
  </button>
</OptimizedLink>

// Mobile menu links (line ~239, ~254, ~270):
// Same pattern - replace Link with OptimizedLink

/**
 * Benefits of using OptimizedLink:
 * 
 * 1. ✅ Instant visual feedback (opacity change) when clicked
 * 2. ✅ Better perceived performance
 * 3. ✅ Automatic prefetching (can be disabled with prefetch={false})
 * 4. ✅ Smart handling of external links and modifier keys
 * 5. ✅ Works seamlessly with existing className and other props
 * 
 * Note: The component is fully backward compatible with Next.js Link
 */

/**
 * Quick find & replace:
 * 
 * Find:    import Link from "next/link";
 * Replace: import { OptimizedLink } from "@/components/ui/OptimizedLink";
 * 
 * Find:    <Link
 * Replace: <OptimizedLink
 * 
 * Find:    </Link>
 * Replace: </OptimizedLink>
 */
