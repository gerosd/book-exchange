import {formatPhoneDisplay} from '@/lib/utils/phoneFormat';

interface FormattedPhoneProps {
  phone: string;
  className?: string;
}

export default function FormattedPhone({ phone, className = "" }: FormattedPhoneProps) {
  return (
    <span className={className}>
      {formatPhoneDisplay(phone)}
    </span>
  );
}
