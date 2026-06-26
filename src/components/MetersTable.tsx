import styled, { css } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { PAGE_SIZE } from '../types/meter';
import type { MeterApi } from '../types/meter';
import { formatDate, mapMeterType } from '../utils/meterFormat';
import { TypeIcon } from '../components/TypeIcon'; // Импортируем иконку типа
import { DeleteButton } from '../components/DeleteButton';

type Props = {
  meters: MeterApi[];
  page: number;
  addressByAreaId: (areaId: string) => string;
  deletingIds: string[];
  onDelete: (meterId: string) => void;
  loading: boolean;
};

export const MetersTable = observer(
  ({
    meters,
    page,
    addressByAreaId,
    deletingIds,
    onDelete,
    loading,
  }: Props) => {
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
          {loading ? (
            // Если идет загрузка новой страницы — показываем ТОЛЬКО сообщение о загрузке
            <StateMessage>Загрузка...</StateMessage>
          ) : (
            <>
              {meters.map((meter, index) => {
                const type = mapMeterType(meter._type);
                const initialValue = meter.initial_values?.[0];
                const isDeleting = deletingIds.includes(meter.id);

                return (
                  <BodyRow key={meter.id}>
                    <CellNo>{(page - 1) * PAGE_SIZE + index + 1}</CellNo>
                    <CellType>
                      <TypeIcon type={type.kind} />
                      {type.label}
                    </CellType>
                    <CellDate>{formatDate(meter.installation_date)}</CellDate>
                    <CellAuto>
                      {meter.is_automatic === true && 'да'}
                      {meter.is_automatic === false && 'нет'}
                      {meter.is_automatic === null && '—'}
                    </CellAuto>
                    <CellValue>
                      {typeof initialValue === 'number' ? initialValue : '—'}
                    </CellValue>
                    <CellAddress>{addressByAreaId(meter.area.id)}</CellAddress>
                    <CellDescription>
                      {meter.description?.trim() || '—'}
                    </CellDescription>
                    <CellAction>
                      <DeleteButton
                        isDeleting={isDeleting}
                        aria-label="Удалить счётчик"
                        title="Удалить счётчик"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(meter.id);
                        }}
                      />
                    </CellAction>
                  </BodyRow>
                );
              })}

              {meters.length === 0 && (
                <StateMessage>Данные не найдены</StateMessage>
              )}
            </>
          )}
        </BodyWrapper>
      </TableCard>
    );
  }
);

const gridLayout = css`
  display: grid;
  grid-template-columns:
    48px 120px 160px 128px 146px 430px minmax(220px, 1fr)
    128px;
`;

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
`;

const HeaderRow = styled.div`
  ${gridLayout};
  display: grid;
  background: #f0f3f7;
  border-bottom: 1px solid #e0e5eb;
  height: 32px;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  font-size: 13px;
  & > * {
    color: #697180 !important;
  }
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
  ${gridLayout};
  display: grid;
  border-bottom: 1px solid #e0e5eb;
  color: #1f2939;
  height: 52px;
  position: relative;

  &:hover {
    background: #f7f8f9;
  }
  &:hover ${'button'} {
    opacity: 1;
    visibility: visible;
  }
`;

const CellNo = styled.div`
  ${rowCell};
  justify-content: center;
  color: #5e6674;
`;
const CellType = styled.div`
  ${rowCell};
  gap: 8px;
  color: #1d2432;
`;
const CellDate = styled.div`
  ${rowCell};
  color: #1f2939;
`;
const CellAuto = styled.div`
  ${rowCell};
  color: #1f2939;
`;
const CellValue = styled.div`
  ${rowCell};
  color: #1f2939;
`;
const CellAddress = styled.div`
  ${rowCell};
  color: #1f2939;
`;
const CellDescription = styled.div`
  ${rowCell};
  border-right: 0;
  color: #5e6674;
`;
const CellAction = styled.div`
  ${rowCell};
  border-right: 0;
  justify-content: center;
`;

const StateMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #697180;
`;
