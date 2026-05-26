import styled from 'styled-components/native';
import { Message } from '@/domain/entities/Message';

interface Props {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <Row $isOwn={isOwn}>
      <Bubble $isOwn={isOwn}>
        <MessageText $isOwn={isOwn}>{message.content}</MessageText>
        <Timestamp $isOwn={isOwn}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Timestamp>
      </Bubble>
    </Row>
  );
}

const Row = styled.View<{ $isOwn: boolean }>`
  flex-direction: row;
  justify-content: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  margin-vertical: 4px;
  padding-horizontal: 12px;
`;

const Bubble = styled.View<{ $isOwn: boolean }>`
  max-width: 80%;
  border-radius: 18px;
  padding: 12px 16px;
  background-color: ${({ $isOwn }) => ($isOwn ? '#2563eb' : '#f3f4f6')};
  border-bottom-right-radius: ${({ $isOwn }) => ($isOwn ? '4px' : '18px')};
  border-bottom-left-radius: ${({ $isOwn }) => ($isOwn ? '18px' : '4px')};
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const MessageText = styled.Text<{ $isOwn: boolean }>`
  font-size: 16px;
  line-height: 22px;
  color: ${({ $isOwn }) => ($isOwn ? '#ffffff' : '#111827')};
`;

const Timestamp = styled.Text<{ $isOwn: boolean }>`
  font-size: 11px;
  margin-top: 4px;
  color: ${({ $isOwn }) => ($isOwn ? '#93c5fd' : '#9ca3af')};
  text-align: right;
`;
