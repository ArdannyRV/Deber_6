import { useState, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useChat } from '@/presentation/hooks/useChat';
import { MessageBubble } from '@/presentation/components/chat/MessageBubble';
import { Message } from '@/domain/entities/Message';

export function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id: receiverId, receiverName, receiverRole } =
    useLocalSearchParams<{
      id: string;
      receiverName: string;
      receiverRole: string;
    }>();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const currentUserId = user?.id ?? '';

  const { messages, sendMessage } = useChat({
    currentUserId,
    receiverId: receiverId ?? '',
  });

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    Keyboard.dismiss();
    try {
      await sendMessage(text);
      setInputText('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isOwn={item.senderId === currentUserId} />
  );

  return (
    <Container
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header>
        <BackButton onPress={() => router.back()}>
          <BackIcon>{'‹'}</BackIcon>
          <BackText>Volver</BackText>
        </BackButton>
        <HeaderCenter>
          <Avatar>
            <AvatarText>
              {receiverName?.charAt(0).toUpperCase() ?? '?'}
            </AvatarText>
          </Avatar>
          <HeaderInfo>
            <HeaderName>{receiverName}</HeaderName>
            <HeaderRole>
              {receiverRole === 'vendedor' ? 'Vendedor' : 'Cliente'}
            </HeaderRole>
          </HeaderInfo>
        </HeaderCenter>
      </Header>

      <MessageList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item: Message) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 8 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <InputBar>
        <InputRow>
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSend}
          />
          <SendButton onPress={handleSend} disabled={!inputText.trim()}>
            <SendIcon>{'→'}</SendIcon>
          </SendButton>
        </InputRow>
      </InputBar>
    </Container>
  );
}

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  padding: 12px 16px;
  padding-top: 56px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
`;

const BackButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  margin-right: 8px;
  border-radius: 8px;
  background-color: #f3f4f6;
`;

const BackIcon = styled.Text`
  font-size: 22px;
  color: #374151;
  line-height: 24px;
  margin-right: 2px;
`;

const BackText = styled.Text`
  font-size: 15px;
  color: #374151;
  font-weight: 600;
`;

const HeaderCenter = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.View`
  width: 36px;
  height: 36px;
  background-color: #2563eb;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
`;

const HeaderInfo = styled.View`
  flex: 1;
`;

const HeaderName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const HeaderRole = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const MessageList = styled(FlatList)`
  flex: 1;
  padding-horizontal: 4px;
` as unknown as typeof FlatList;

const InputBar = styled.View`
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding: 12px 16px;
  padding-bottom: 24px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ChatInput = styled.TextInput`
  flex: 1;
  border-width: 2px;
  border-color: #e5e7eb;
  border-radius: 24px;
  padding: 12px 18px;
  font-size: 16px;
  color: #111827;
  background-color: #f9fafb;
`;

const SendButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  width: 48px;
  height: 48px;
  background-color: #2563eb;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  elevation: 4;
  shadow-color: #2563eb;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const SendIcon = styled.Text`
  color: #ffffff;
  font-size: 22px;
  line-height: 22px;
`;
