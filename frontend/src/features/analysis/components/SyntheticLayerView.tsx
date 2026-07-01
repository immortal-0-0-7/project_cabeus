import { LAYER_IMAGES } from '../constants';
import type { AnalysisLayerId } from '../types';

interface SyntheticLayerViewProps {
  layer: AnalysisLayerId;
  className?: string;
}

export function SyntheticLayerView({ layer, className }: SyntheticLayerViewProps) {
  return (
    <div className={`relative size-full overflow-hidden rounded-lg bg-space-deep ${className ?? ''}`}>
      <img
        src={LAYER_IMAGES[layer]}
        alt={`${layer} SAR layer`}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
