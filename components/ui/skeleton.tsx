import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Skeleton Component with subtle pulse & shimmer gradient styling.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800/60 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
};

/**
 * Card Skeleton: Ideal for Events, Clubs, Deals, PG Rooms, Free Courses, AI Tools, YouTube channels.
 */
export const CardSkeleton: React.FC<{
  hasImage?: boolean;
  imageHeight?: string;
  className?: string;
}> = ({
  hasImage = true,
  imageHeight = "h-48",
  className = ""
}) => {
  return (
    <div className={cn("bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/50 p-5 space-y-4 shadow-xs overflow-hidden flex flex-col justify-between", className)}>
      <div className="space-y-4">
        {hasImage && (
          <Skeleton className={cn("w-full rounded-2xl", imageHeight)} />
        )}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/5 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-1/2 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
      </div>
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800/40">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * List Skeleton: Ideal for Duty Leaves, Notifications, Notes files, etc.
 */
export const ListSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 4, className = "" }) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-900 rounded-[2rem] p-5 flex items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-2/5 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
};

/**
 * Hero Skeleton: Ideal for spotlight banners in Home, Events, Notifications.
 */
export const HeroSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={cn("relative w-full rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-sm overflow-hidden", className)}>
      <Skeleton className="w-full lg:w-[380px] aspect-[4/3] lg:aspect-[4/5] rounded-3xl shrink-0" />
      <div className="flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-4/5 rounded-2xl" />
          <Skeleton className="h-10 w-2/3 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-36 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Detail Skeleton: Ideal for EventDetail, PGDetail, SubjectNotes inspection modal.
 */
export const DetailSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={cn("max-w-5xl mx-auto px-4 py-8 space-y-8 text-left", className)}>
      <Skeleton className="w-full h-80 rounded-[2.5rem]" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
    </div>
  );
};

export default Skeleton;
