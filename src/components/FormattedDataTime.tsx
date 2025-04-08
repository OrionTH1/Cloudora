import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDataTimeProps {
  date: number | string;
  className?: string;
}
function FormattedDataTime({ date, className }: FormattedDataTimeProps) {
  console.log(date);

  return (
    <p className={cn("body-1 text-light-200", className)}>
      {date.toString() !== "0" ? (
        formatDateTime(new Date(date).toISOString())
      ) : (
        <span>The files is not yet updated</span>
      )}
    </p>
  );
}

export default FormattedDataTime;
