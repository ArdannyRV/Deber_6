import { useState } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onSubmitEditing?: () => void;
}

export function CustomInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  onSubmitEditing,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      onSubmitEditing={onSubmitEditing}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      $isFocused={isFocused}
    />
  );
}

const StyledInput = styled(TextInput)<{ $isFocused: boolean }>`
  border-width: 2px;
  border-color: ${({ $isFocused }) => ($isFocused ? '#2563eb' : '#e5e7eb')};
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 16px;
  color: #111827;
  background-color: ${({ $isFocused }) =>
    $isFocused ? '#fafafa' : '#f9fafb'};
`;
