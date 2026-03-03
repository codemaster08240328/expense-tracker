// intentionally no default React import — using JSX runtime
import type { CSSProperties } from 'react';

type DataItem = { name: string; fill?: string; color?: string };

export default function CategoryLegend({
  data,
  align = 'center',
  gap = 12,
}: {
  data: DataItem[];
  align?: 'center' | 'left' | 'right';
  gap?: number;
}) {
  const justify: CSSProperties['justifyContent'] =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justify,
        gap,
        flexWrap: 'wrap',
      }}
    >
      {data.map((entry, idx) => (
        <div
          key={idx}
          style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 4 }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              background: entry.fill || entry.color || '#ccc',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 13 }}>{entry.name}</span>
        </div>
      ))}
    </div>
  );
}
