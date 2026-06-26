import heatIconUrl from '../assets/icons/heat.svg';
import coldIconUrl from '../assets/icons/cold.svg';
import hotIconUrl from '../assets/icons/hot.svg';
import electricityIconUrl from '../assets/icons/electricity.svg';

export type IconType = 'hot' | 'cold' | 'heat' | 'electricity' | 'unknown';

interface TypeIconProps {
  type: IconType;
}

export const TypeIcon = ({ type }: TypeIconProps) => {
  const iconsMap: Record<Exclude<IconType, 'unknown'>, string> = {
    heat: heatIconUrl,
    cold: coldIconUrl,
    hot: hotIconUrl,
    electricity: electricityIconUrl,
  };

  if (type === 'unknown' || !iconsMap[type]) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://w3.org"
      >
        <circle cx="8" cy="8" r="5" fill="#CED5DE" />
      </svg>
    );
  }

  return (
    <img
      src={iconsMap[type]}
      alt={type}
      width="16"
      height="16"
      style={{ display: 'block' }}
    />
  );
};
