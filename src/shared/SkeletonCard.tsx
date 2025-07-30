export const SkeletonCard = () => (
  <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4 animate-pulse">
    <div className="h-40 w-full bg-white/10 rounded-lg mb-4" />
    <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
    <div className="h-3 w-1/2 bg-white/10 rounded mb-3" />
    <div className="h-5 w-1/3 bg-white/10 rounded" />
  </div>
);
