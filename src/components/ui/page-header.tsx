export default function PageHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return <h2 className={`text-3xl ${className}`}>{title}</h2>;
}
