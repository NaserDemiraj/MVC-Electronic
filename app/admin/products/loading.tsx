import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}
