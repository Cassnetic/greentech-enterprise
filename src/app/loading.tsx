import { Skeleton } from '@/components/ui/skeleton';
import { CustomerHeader } from '@/components/customer/Header';

export default function RootLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <div className="gt-page">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-7">
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 items-start">
            {/* Hero column */}
            <div className="flex flex-col gap-5">
              <Skeleton className="h-6 w-[260px] rounded-full" />
              <div className="flex flex-col gap-3">
                <Skeleton className="h-12 md:h-[58px] w-full" />
                <Skeleton className="h-12 md:h-[58px] w-[88%]" />
                <Skeleton className="h-12 md:h-[58px] w-[70%]" />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[78%]" />
              </div>
              <div className="flex flex-wrap gap-2.5 pt-3">
                <Skeleton className="h-11 w-[160px] rounded-md" />
                <Skeleton className="h-11 w-[140px] rounded-md" />
              </div>
              <div className="flex flex-wrap gap-5 pt-2">
                <Skeleton className="h-3.5 w-[140px]" />
                <Skeleton className="h-3.5 w-[120px]" />
                <Skeleton className="h-3.5 w-[100px]" />
              </div>
            </div>

            {/* Service cards column */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-24" />
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="gt-card flex gap-4 p-[18px]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Skeleton className="h-[100px] w-[130px] shrink-0" />
                  <div className="flex flex-1 flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-[52%]" />
                      <Skeleton className="h-4 w-[72px]" />
                    </div>
                    <Skeleton className="h-3.5 w-[88%]" />
                    <Skeleton className="h-3.5 w-[64%]" />
                    <div className="flex gap-1.5 pt-1">
                      <Skeleton className="h-5 w-12 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
