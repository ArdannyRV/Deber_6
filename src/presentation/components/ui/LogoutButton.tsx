import { TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export function LogoutButton({ onPress, loading }: Props) {
  return (
    <ButtonContainer onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#dc2626" size="small" />
      ) : (
        <ButtonContent>
          <Icon>{'✕'}</Icon>
          <Label>Salir</Label>
        </ButtonContent>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 8px 14px;
  border-radius: 10px;
  background-color: #fef2f2;
  border-width: 1px;
  border-color: #fecaca;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Icon = styled.Text`
  font-size: 14px;
  color: #dc2626;
  font-weight: 700;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #dc2626;
  font-weight: 600;
`;
