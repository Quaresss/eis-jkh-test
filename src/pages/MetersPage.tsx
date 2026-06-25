import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { MetersTable } from '../components/MetersTable';
import { Pagination } from '../components/Pagination';
import { metersStore } from '../store/metersStore';
import { buildPaginationItems } from '../utils/meterFormat';

export const MetersPage = observer(() => {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void metersStore.fetchPage(1);
  }, []);

  const paginationItems = buildPaginationItems(metersStore.page, metersStore.maxPage);

  return (
    <PageSection>
      <PageTitle>Список счётчиков</PageTitle>

      <MetersTable
        meters={metersStore.meters}
        page={metersStore.page}
        addressByAreaId={(areaId) => metersStore.addressByAreaId(areaId)}
        deletingIds={metersStore.deletingIds}
        onDelete={(meterId) => void metersStore.deleteMeter(meterId)}
        loading={metersStore.loading}
      />

      <Pagination
        items={paginationItems}
        currentPage={metersStore.page}
        onPageClick={(page) => void metersStore.fetchPage(page)}
      />

      {metersStore.error && <ErrorText>{metersStore.error}</ErrorText>}
    </PageSection>
  );
});

const PageSection = styled.section`
  padding: 24px;
`;

const PageTitle = styled.h1`
  margin: 0 0 16px;
  color: #1f2939;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 500;
`;

const ErrorText = styled.p`
  margin: 12px 0 0;
  color: #c53030;
  font-size: 14px;
`;
