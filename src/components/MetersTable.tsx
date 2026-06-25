import { useState } from 'react';
import styled, { css } from 'styled-components';
import { PAGE_SIZE } from '../types/meter';
import type { MeterApi } from '../types/meter';
import { formatDate, mapMeterType } from '../utils/meterFormat';

type Props = {
  meters: MeterApi[];
  page: number;
  addressByAreaId: (areaId: string) => string;
  deletingIds: string[];
  onDelete: (meterId: string) => void;
  loading: boolean;
};

export const MetersTable = ({ meters, page, addressByAreaId, deletingIds, onDelete, loading }: Props) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <TableCard>
      <HeaderRow>
        <CellNo>№</CellNo>
        <CellType>Тип</CellType>
        <CellDate>Дата установки</CellDate>
        <CellAuto>Автоматический</CellAuto>
        <CellValue>Значение</CellValue>
        <CellAddress>Адрес</CellAddress>
        <CellDescription>Примечание</CellDescription>
        <CellAction />
      </HeaderRow>

      <BodyWrapper>
        {meters.map((meter, index) => {
          const type = mapMeterType(meter._type);
          const initialValue = meter.initial_values?.[0];
          const isDeleting = deletingIds.includes(meter.id);

          return (
            <BodyRow
              key={meter.id}
              onMouseEnter={() => setHoveredRow(meter.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <CellNo>{(page - 1) * PAGE_SIZE + index + 1}</CellNo>
              <CellType>
                <TypeIcon type={type.kind} />
                {type.label}
              </CellType>
              <CellDate>{formatDate(meter.installation_date)}</CellDate>
              <CellAuto>{meter.is_automatic ? 'да' : 'нет'}</CellAuto>
              <CellValue>{typeof initialValue === 'number' ? initialValue : '—'}</CellValue>
              <CellAddress>{addressByAreaId(meter.area.id)}</CellAddress>
              <CellDescription>{meter.description?.trim() || '—'}</CellDescription>
              <CellAction>
                {hoveredRow === meter.id && (
                  <DeleteButton
                    type="button"
                    disabled={isDeleting}
                    aria-label="Удалить счётчик"
                    title="Удалить счётчик"
                    onClick={() => onDelete(meter.id)}
                  >
                    <TrashIcon />
                  </DeleteButton>
                )}
              </CellAction>
            </BodyRow>
          );
        })}

        {!loading && meters.length === 0 && <StateMessage>Данные не найдены</StateMessage>}
        {loading && <StateMessage>Загрузка...</StateMessage>}
      </BodyWrapper>
    </TableCard>
  );
};

const TableCard = styled.section`
  border: 1px solid #e0e5eb;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
`;

const rowCell = css`
  padding: 0 12px;
  font-size: 14px;
  line-height: 20px;
  border-right: 1px solid #eef0f4;
  display: flex;
  align-items: center;
  height: 52px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 56px 130px 170px 130px 150px minmax(240px, 1fr) minmax(220px, 1fr) 128px;
  background: #f0f3f7;
  border-bottom: 1px solid #e0e5eb;
  color: #697180;
  font-size: 13px;
`;

const BodyWrapper = styled.div`
  max-height: calc(100vh - 250px);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #c7ced8 transparent;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #c7ced8;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const BodyRow = styled.div`
  display: grid;
  grid-template-columns: 56px 130px 170px 130px 150px minmax(240px, 1fr) minmax(220px, 1fr) 128px;
  border-bottom: 1px solid #e0e5eb;
  color: #1f2939;

  &:hover {
    background: #f7f8f9;
  }
`;

const CellNo = styled.div`
  ${rowCell};
  justify-content: center;
`;
const CellType = styled.div`
  ${rowCell};
  gap: 8px;
`;
const CellDate = styled.div`
  ${rowCell};
`;
const CellAuto = styled.div`
  ${rowCell};
`;
const CellValue = styled.div`
  ${rowCell};
`;
const CellAddress = styled.div`
  ${rowCell};
`;
const CellDescription = styled.div`
  ${rowCell};
  border-right: 0;
`;
const CellAction = styled.div`
  ${rowCell};
  border-right: 0;
  justify-content: center;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #fee3e3;
  color: #c53030;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: #fbd1d1;
    color: #9b2424;
  }

  &:disabled {
    cursor: not-allowed;
    background: #f3f4f6;
    color: #98a2b3;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StateMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #697180;
`;

const TypeIcon = ({ type }: { type: 'hot' | 'cold' | 'unknown' }) => {
  if (type === 'hot') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.89218 1.42C8.89442 1.39678 8.89999 1.36673 8.89999 1.34146C8.89999 1.15298 8.76063 1 8.5889 1C8.51579 1 8.46441 1.03005 8.44452 1.03859C7.3883 1.49137 3.29999 5.95669 3.29999 9.87803C3.29999 12.7067 5.38941 15 7.96665 15C10.8006 15 12.6333 12.38 12.6333 9.87803C12.6333 5.71663 8.16486 4.94834 8.89218 1.42Z"
          fill="#F46B4D"
        />
      </svg>
    );
  }

  if (type === 'cold') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.89218 1.42C8.89442 1.39678 8.89999 1.36673 8.89999 1.34146C8.89999 1.15298 8.76063 1 8.5889 1C8.51579 1 8.46441 1.03005 8.44452 1.03859C7.3883 1.49137 3.29999 5.95669 3.29999 9.87803C3.29999 12.7067 5.38941 15 7.96665 15C10.8006 15 12.6333 12.38 12.6333 9.87803C12.6333 5.71663 8.16486 4.94834 8.89218 1.42Z"
          fill="#3698FA"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="5" fill="#CED5DE" />
    </svg>
  );
};

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.33333 6V12H6V6H7.33333Z" fill="currentColor" />
    <path d="M10 6V12H8.66667V6H10Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.85285 0.666626H11.1472L11.8139 2.66663H14.6667V3.99996H13.3333L12.6667 15.3333H3.33333L2.66667 3.99996H1.33333V2.66663H4.18618L4.85285 0.666626ZM5.59163 2.66663H10.4084L10.1862 1.99996H5.81389L5.59163 2.66663ZM4 3.99996L4.66667 14H11.3333L12 3.99996H4Z"
      fill="currentColor"
    />
  </svg>
);
