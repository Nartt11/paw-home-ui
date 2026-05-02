export default function PetCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="h-56 w-full bg-slate-200" />
      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-40 rounded bg-slate-200" />
          </div>
          <div className="h-5 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="h-3 w-32 rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1 rounded-xl bg-slate-100 p-2">
            <div className="h-3 w-14 rounded bg-slate-200" />
            <div className="h-3 w-10 rounded bg-slate-200" />
          </div>
          <div className="space-y-1 rounded-xl bg-slate-100 p-2">
            <div className="h-3 w-14 rounded bg-slate-200" />
            <div className="h-3 w-10 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
