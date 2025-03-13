import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDataTimeProps {
  date: string;
  className?: string;
}
function FormattedDataTime({ date, className }: FormattedDataTimeProps) {
  return (
    <p className={cn("body-1 text-light-200", className)}>
      {formatDateTime(date)}
    </p>
  );
}

export default FormattedDataTime;
