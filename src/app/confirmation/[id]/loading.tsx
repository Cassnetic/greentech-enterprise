import { Skeleton } from '@/components/ui/skeleton';
import { CustomerHeader } from '@/components/customer/Header';

export default function ConfirmationLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <div className="gt-page">
        <div className="max-w-[780px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-10">
          {/* Status badge + ID */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-6 w-[120px] rounded-full" />
            <Skeleton className="h-4 w-[160px]" />
          </div>

          <Skeleton className="h-9 w-[70%] mb-3" />
          <Skeleton className="h-4 w-[85%] mb-1.5" />
          <Skeleton className="h-4 w-[60%] mb-8" />

          {/* Receipt card */}
          <div className="gt-card p-6 md:p-7 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-2.5 w-[50%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-4 flex items-center justify-between">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          {/* Bank transfer block */}
          <div className="gt-card mt-5 p-6 md:p-7 flex flex-col gap-4">
            <Skeleton className="h-4 w-[40%]" />
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-2.5 w-[50%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-[180px] rounded-md mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
