import { flow, types } from 'mobx-state-tree';
import { metersApi } from '../api/metersApi';
import { buildAddress } from '../utils/meterFormat';
import { PAGE_SIZE } from '../types/meter';
import type { MeterApi } from '../types/meter';

const MetersStore = types
  .model('MetersStore', {
    meters: types.array(types.frozen<MeterApi>()),
    page: types.optional(types.number, 1),
    totalCount: types.optional(types.number, 0),
    addressCache: types.map(types.string),
    loading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    deletingIds: types.array(types.string),
  })
  .views((self) => ({
    get maxPage() {
      return Math.max(1, Math.ceil(self.totalCount / PAGE_SIZE));
    },
    addressByAreaId(areaId: string) {
      return self.addressCache.get(areaId) ?? '—';
    },
  }))
  .actions((self) => {
    const setError = (error: string | null) => {
      self.error = error;
    };

    const setLoading = (value: boolean) => {
      self.loading = value;
    };

    const setPageData = (meters: MeterApi[], count: number, page: number) => {
      self.meters.replace(meters);
      self.totalCount = count;
      self.page = page;
    };

    const addDeletingId = (id: string) => {
      if (!self.deletingIds.includes(id)) {
        self.deletingIds.push(id);
      }
    };

    const removeDeletingId = (id: string) => {
      self.deletingIds.replace(
        self.deletingIds.filter((deletingId) => deletingId !== id)
      );
    };

    const fetchMissingAddresses = flow(function* fetchMissingAddresses() {
      const uniqueAreaIds = Array.from(
        new Set(
          self.meters
            .map((meter) => meter.area.id)
            .filter((areaId) => areaId && !self.addressCache.has(areaId))
        )
      );

      if (uniqueAreaIds.length === 0) return;

      const payload: Awaited<ReturnType<typeof metersApi.fetchAreas>> =
        yield metersApi.fetchAreas(uniqueAreaIds);
      payload.results.forEach((area) => {
        self.addressCache.set(
          area.id,
          buildAddress(area.house?.address, area.str_number?.trim())
        );
      });
    });

    const fetchPage = flow(function* fetchPage(page: number) {
      try {
        setLoading(true);
        setError(null);

        const safePage = Math.max(1, page);
        const offset = (safePage - 1) * PAGE_SIZE;
        const payload: Awaited<ReturnType<typeof metersApi.fetchMeters>> =
          yield metersApi.fetchMeters(PAGE_SIZE, offset);
        setPageData(payload.results, payload.count, safePage);
        yield fetchMissingAddresses();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    });

    const deleteMeter = flow(function* deleteMeter(meterId: string) {
      addDeletingId(meterId);
      setError(null);

      try {
        yield metersApi.deleteMeter(meterId);

        self.meters.replace(
          self.meters
            .filter((meter) => meter.id !== meterId)
            .map((meter) => ({ ...meter }))
        );
        self.totalCount = Math.max(0, self.totalCount - 1);

        const pageOffset = (self.page - 1) * PAGE_SIZE;
        const needOneMore =
          self.meters.length < PAGE_SIZE &&
          pageOffset + self.meters.length < self.totalCount;

        if (needOneMore) {
          const payload: Awaited<ReturnType<typeof metersApi.fetchMeters>> =
            yield metersApi.fetchMeters(1, pageOffset + self.meters.length);
          self.totalCount = payload.count;
          self.meters.replace([...self.meters, ...payload.results]);
          yield fetchMissingAddresses();
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Ошибка удаления');
      } finally {
        removeDeletingId(meterId);
      }
    });

    return { fetchPage, deleteMeter };
  });

export const metersStore = MetersStore.create({
  meters: [],
  addressCache: {},
  deletingIds: [],
});
