import { Logo } from '../ui/Logo';
import { Skeleton } from '../ui/skeleton';

export function AdminSidebarSkeleton() {
  return (
    <aside className="hidden md:flex w-[220px] shrink-0 bg-surface-2 border-r border-line py-4 px-3 flex-col gap-1 overflow-hidden">
      <div className="px-2.5 pt-1 pb-3.5">
        <Logo />
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
          >
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3.5 flex-1" />
            {i < 2 && <Skeleton className="h-4 w-6 rounded-full" />}
          </div>
        ))}
      </div>

      <div className="border-t border-line mt-1 pt-2 flex items-center gap-2 px-2.5 py-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 flex-1" />
      </div>
    </aside>
  );
}
