import { Skeleton } from '@/components/ui/skeleton';
import { CustomerHeader } from '@/components/customer/Header';

export default function AdminLoginLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <div className="gt-page flex items-center justify-center px-4 py-12">
        <div className="gt-card w-full max-w-[420px] p-7 md:p-8 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-3.5 w-[200px]" />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <Skeleton className="h-11 w-full rounded-md mt-1" />
          <Skeleton className="h-3 w-[60%] mx-auto" />
        </div>
      </div>
    </div>
  );
}
