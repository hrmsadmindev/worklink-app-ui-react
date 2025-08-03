import styled from 'styled-components';

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.border};
          
          &:hover {
            background: ${theme.colors.light};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.danger};
          
          &:hover {
            background: #5423c8ff;
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          
          &:hover {
            background: #218838;
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover {
            background: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      default:
        return '';
    }
  }}

  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.fontSize.sm};
        `;
      case 'large':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.fontSize.lg};
        `;
      default:
        return '';
    }
  }}

  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
`;

export default Button;