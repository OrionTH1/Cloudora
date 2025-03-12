import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDataTimeProps {
  data: string;
  className?: string;
}
function FormattedDataTime({ data, className }: FormattedDataTimeProps) {
  return (
    <p className={cn("body-1 text-light-200", className)}>
      {formatDateTime(data)}
    </p>
  );
}

export default FormattedDataTime;
