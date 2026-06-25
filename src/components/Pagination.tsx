import styled from 'styled-components';

type Props = {
  items: Array<number | '...'>;
  currentPage: number;
  onPageClick: (page: number) => void;
};

export const Pagination = ({ items, currentPage, onPageClick }: Props) => (
  <PaginationRoot>
    {items.map((item, index) => (
      <PageButton
        key={`${item}-${index}`}
        type="button"
        $active={item === currentPage}
        disabled={item === '...'}
        onClick={() => typeof item === 'number' && onPageClick(item)}
      >
        {item}
      </PageButton>
    ))}
  </PaginationRoot>
);

const PaginationRoot = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const PageButton = styled.button<{ $active: boolean }>`
  min-width: 32px;
  height: 32px;
  border: 1px solid #ced5de;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#f2f5f8' : '#fff')};
  cursor: pointer;
`;
