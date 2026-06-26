import type { AreaApi, MeterApi, PaginatedResponse } from '../types/meter';

const API_BASE = import.meta.env.DEV ? '/api' : 'http://eis24.me';

export const metersApi = {
  async fetchMeters(
    limit: number,
    offset: number
  ): Promise<PaginatedResponse<MeterApi>> {
    const response = await fetch(
      `${API_BASE}/meters/?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Не удалось загрузить счётчики');
    }
    return (await response.json()) as PaginatedResponse<MeterApi>;
  },

  async fetchAreas(areaIds: string[]): Promise<PaginatedResponse<AreaApi>> {
    if (areaIds.length === 0) {
      return { count: 0, next: null, previous: null, results: [] };
    }

    const params = new URLSearchParams();
    areaIds.forEach((id) => params.append('id__in', id));

    const response = await fetch(`${API_BASE}/areas/?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить адреса');
    }

    return (await response.json()) as PaginatedResponse<AreaApi>;
  },

  async deleteMeter(meterId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/meters/${meterId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Не удалось удалить счётчик');
    }
  },
};
