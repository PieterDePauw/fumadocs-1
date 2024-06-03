'use client';

import { usePathname } from 'next/navigation';
import { type HTMLAttributes, useMemo } from 'react';
import { SidebarTrigger } from 'fumadocs-core/sidebar';
import { Menu } from 'lucide-react';
import { useTreeContext } from '@/contexts/tree';
import { cn } from '@/utils/cn';
import { useSidebar } from '@/contexts/sidebar';
import { SearchToggle } from '@/components/layout/search-toggle';
import { buttonVariants } from '@/theme/variants';

export { TreeContextProvider } from './contexts/tree';
export { Nav } from './components/layout/nav';
export { Sidebar } from './components/layout/sidebar';
export { DynamicSidebar } from './components/layout/dynamic-sidebar';

export function BottomNav(): React.ReactElement {
  const ctx = useTreeContext();
  const pathname = usePathname();
  const page = useMemo(() => {
    return ctx.navigation.find((s) => s.url === pathname);
  }, [pathname, ctx.navigation]);

  return (
    <header className="sticky top-0 inline-flex h-12 w-full items-center text-sm font-medium z-50 bg-card border-b pl-4 pr-2 md:hidden">
      {page?.icon ? (
        <div className="[&_svg]:size-4 me-2">{page?.icon}</div>
      ) : null}
      <p className="flex-1 truncate">{page?.name}</p>

      <SearchToggle className="text-muted-foreground" />
      <SidebarTrigger
        className={cn(
          buttonVariants({
            size: 'icon',
            color: 'ghost',
            className: 'text-muted-foreground',
          }),
        )}
      >
        <Menu />
      </SidebarTrigger>
    </header>
  );
}

export function Container(
  props: HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const { collapsed } = useSidebar();

  return (
    <div
      {...props}
      className={cn(
        'flex flex-row justify-center lg:pr-[220px] xl:px-[260px]',
        !collapsed && 'md:pl-[240px]',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
