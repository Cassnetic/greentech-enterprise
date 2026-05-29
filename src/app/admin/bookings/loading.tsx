import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebarSkeleton } from '@/components/admin/SidebarSkeleton';

export default function BookingsLoading() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebarSkeleton />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 px-4 md:px-6 border-b border-line flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[220px] rounded-md" />
            <Skeleton className="h-9 w-[110px] rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 md:px-6 py-3 border-b border-line flex gap-2 overflow-x-auto bg-surface-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-[90px] rounded-full shrink-0" />
          ))}
        </div>

        {/* Kanban-like 3 columns */}
        <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-3 min-h-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-4 w-8 rounded-full" />
              </div>
              {Array.from({ length: 3 + col }).map((_, i) => (
                <div
                  key={i}
                  className="gt-card p-3.5 flex flex-col gap-2.5"
                  style={{ animationDelay: `${(col * 3 + i) * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[55%]" />
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
