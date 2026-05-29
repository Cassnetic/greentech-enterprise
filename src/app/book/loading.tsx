import { Skeleton } from '@/components/ui/skeleton';
import { CustomerHeader } from '@/components/customer/Header';

export default function BookLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <div className="gt-page">
        <div className="max-w-[920px] mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-10">
          {/* Stepper */}
          <div className="flex items-center gap-3 mb-7">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-3.5 w-[68%] max-w-[110px]" />
                {i < 3 && <Skeleton className="h-px flex-1" />}
              </div>
            ))}
          </div>

          {/* Heading */}
          <Skeleton className="h-8 w-[55%] mb-3" />
          <Skeleton className="h-4 w-[80%] mb-7" />

          {/* Card with form fields */}
          <div className="gt-card p-6 md:p-7 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-[40%]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-[24%]" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="h-11 w-[140px] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
