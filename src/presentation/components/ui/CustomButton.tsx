import { TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function CustomButton({
  title,
  onPress,
  loading,
  variant = 'primary',
}: Props) {
  return (
    <ButtonContainer onPress={onPress} disabled={loading} $variant={variant}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#2563eb'}
        />
      ) : (
        <ButtonText $variant={variant}>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled(TouchableOpacity)<{ $variant: 'primary' | 'secondary' }>`
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? '#2563eb' : 'transparent'};
  border-width: ${({ $variant }) => ($variant === 'secondary' ? '2px' : '0px')};
  border-color: #2563eb;
  border-radius: 16px;
  padding: 16px 24px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  elevation: ${({ $variant }) => ($variant === 'primary' ? 6 : 0)};
  shadow-color: #2563eb;
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ $variant }) => ($variant === 'primary' ? 0.35 : 0)};
  shadow-radius: 8px;
`;

const ButtonText = styled.Text<{ $variant: 'primary' | 'secondary' }>`
  color: ${({ $variant }) => ($variant === 'primary' ? '#fff' : '#2563eb')};
  font-size: 17px;
  font-weight: 700;
  text-align: center;
`;
