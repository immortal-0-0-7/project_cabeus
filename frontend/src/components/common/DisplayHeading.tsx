type DisplayHeadingTag = 'h1' | 'h2' | 'h3';

export interface DisplayHeadingProps {
  children: string;
  as?: DisplayHeadingTag;
  className?: string;
  accent?: 'cool' | 'warm' | 'none';
}

const accentClasses = {
  cool: 'text-gradient-accent',
  warm: 'text-gradient-warm',
  none: '',
} as const;

export function DisplayHeading({
  children,
  as: Tag = 'h2',
  className,
  accent = 'cool',
}: DisplayHeadingProps) {
  const words = children.trim().split(/\s+/);

  if (accent === 'none' || words.length <= 1) {
    return <Tag className={className}>{children}</Tag>;
  }

  const lastWord = words.pop()!;

  return (
    <Tag className={className}>
      {words.join(' ')}
      {words.length > 0 ? ' ' : null}
      <span className={accentClasses[accent]}>{lastWord}</span>
    </Tag>
  );
}

export function accentLastWord(title: string, accent: 'cool' | 'warm' = 'cool') {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;

  const lastWord = words.pop()!;
  const accentClass = accentClasses[accent];

  return (
    <>
      {words.join(' ')} <span className={accentClass}>{lastWord}</span>
    </>
  );
}
