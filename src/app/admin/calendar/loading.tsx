import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebarSkeleton } from '@/components/admin/SidebarSkeleton';

export default function CalendarLoading() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebarSkeleton />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 px-4 md:px-6 border-b border-line flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-[160px] rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="px-4 md:px-6 pt-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-[60%] mx-auto" />
          ))}
        </div>

        {/* Month grid */}
        <div className="flex-1 px-4 md:px-6 pb-6 pt-3">
          <div className="grid grid-cols-7 grid-rows-5 gap-2 h-[calc(100vh-180px)] min-h-[480px]">
            {Array.from({ length: 35 }).map((_, i) => {
              const hasEvent = i % 5 === 2 || i % 7 === 3;
              return (
                <div
                  key={i}
                  className="gt-card flex flex-col gap-1.5 p-2 min-w-0"
                  style={{ animationDelay: `${i * 14}ms` }}
                >
                  <Skeleton className="h-3 w-5" />
                  {hasEvent && <Skeleton className="h-3.5 w-[85%] rounded-md" />}
                  {hasEvent && i % 3 === 0 && <Skeleton className="h-3.5 w-[70%] rounded-md" />}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
