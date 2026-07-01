import { FadeIn } from './FadeIn';
import { accentLastWord } from '@/components/common/DisplayHeading';
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
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn className={cn(align === 'center' && 'text-center', className)}>
      <p className="text-label">{label}</p>
      <h2 className="text-editorial mt-6 text-[clamp(2.75rem,9vw,5.5rem)] uppercase">
        {accentLastWord(title)}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-8 max-w-xl text-[clamp(1.0625rem,2vw,1.25rem)] leading-relaxed font-light text-text-secondary',
          align === 'center' && 'mx-auto',
        )}>
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
