export default function AdminLoading() {
  return (
    <div className="flex flex-col space-y-4 lg:space-y-6 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}
