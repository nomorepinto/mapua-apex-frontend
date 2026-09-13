export function FormPageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="border-b border-neutral-200 pb-5">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-xs font-normal text-neutral-500 sm:text-sm">
        {subtitle}
      </p>
    </div>
  )
}
