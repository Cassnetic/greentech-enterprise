import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-[var(--gt-radius-sm)] bg-bg-2',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/65 before:to-transparent',
        'before:animate-[gtShimmer_1.6s_ease-in-out_infinite]',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
