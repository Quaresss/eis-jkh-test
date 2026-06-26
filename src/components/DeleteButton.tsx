import React from 'react';
import styled from 'styled-components';

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://w3.org"
  >
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

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDeleting: boolean;
}

export const DeleteButton = ({ isDeleting, ...props }: DeleteButtonProps) => {
  return (
    <StyledButton disabled={isDeleting} type="button" {...props}>
      <TrashIcon />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
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

  opacity: 0;
  visibility: hidden;

  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease,
    visibility 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    background: #fbd1d1;
    color: #9b2424;
  }

  &:disabled {
    cursor: not-allowed;
    background: #f3f4f6 !important;
    color: #98a2b3 !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
`;
