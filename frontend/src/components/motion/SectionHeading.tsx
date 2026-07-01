import { FadeIn } from './FadeIn';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn className={cn(align === 'center' && 'text-center', className)}>
      <p className="text-label">{label}</p>
      <h2 className="text-editorial mt-6 text-[clamp(2.75rem,9vw,5.5rem)] uppercase">
        <span className="text-gradient-ice">{title}</span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-8 max-w-xl text-[clamp(1.0625rem,2vw,1.25rem)] leading-relaxed font-light text-text-secondary">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
