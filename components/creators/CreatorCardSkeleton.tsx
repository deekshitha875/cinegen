export function CreatorCardSkeleton() {
  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <div className="skeleton h-40 w-full" />
      <div className="p-4">
        <div className="flex items-start gap-3 -mt-8 mb-3">
          <div className="skeleton w-14 h-14 rounded-xl border-2 border-background" />
          <div className="pt-5 space-y-1.5 flex-1">
            <div className="skeleton h-3.5 w-28 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
        <div className="skeleton h-3 w-full rounded mb-1" />
        <div className="skeleton h-3 w-3/4 rounded mb-3" />
        <div className="flex gap-1 mb-3">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-1 mb-4">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-14 rounded" />
          <div className="skeleton h-5 w-12 rounded" />
        </div>
        <div className="flex justify-between border-t border-white/5 pt-3">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
