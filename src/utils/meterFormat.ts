export const mapMeterType = (typeList: string[] | undefined) => {
  if (!typeList || typeList.length === 0) {
    return { label: '—', kind: 'unknown' as const };
  }

  if (typeList.includes('HotWaterAreaMeter')) {
    return { label: 'ГВС', kind: 'hot' as const };
  }

  if (typeList.includes('ColdWaterAreaMeter')) {
    return { label: 'ХВС', kind: 'cold' as const };
  }

  if (
    typeList.includes('HeatWaterAreaMeter') ||
    typeList.includes('HeatAreaMeter')
  ) {
    return { label: 'ТПЛ', kind: 'heat' as const };
  }

  if (typeList.includes('ElectricityAreaMeter')) {
    return { label: 'ЭЛДТ', kind: 'electricity' as const };
  }

  return { label: '—', kind: 'unknown' as const };
};

export const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ru-RU').format(date);
};

export const buildAddress = (houseAddress?: string, apartment?: string) => {
  const apartmentPart = apartment ? `кв. ${apartment}` : '';
  const address = [houseAddress?.trim(), apartmentPart]
    .filter(Boolean)
    .join(', ');
  return address || '—';
};

export const buildPaginationItems = (
  current: number,
  maxPage: number
): Array<number | '...'> => {
  if (maxPage <= 7)
    return Array.from({ length: maxPage }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', maxPage];
  if (current >= maxPage - 3)
    return [
      1,
      '...',
      maxPage - 4,
      maxPage - 3,
      maxPage - 2,
      maxPage - 1,
      maxPage,
    ];
  return [1, '...', current - 1, current, current + 1, '...', maxPage];
};
