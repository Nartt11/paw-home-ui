import PetCardSkeleton from "./PetCardSkeleton";

interface GridSkeletonProps {
  cards: number;
}

export default function GridSkeleton({ cards }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <PetCardSkeleton key={index} />
      ))}
    </div>
  );
}
