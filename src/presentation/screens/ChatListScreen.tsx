import { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';
import { GetAvailableUsersUseCase } from '@/domain/usecases/GetAvailableUsersUseCase';
import { User } from '@/domain/entities/User';
import { LoaderLottie } from '@/presentation/components/ui/LoaderLottie';
import { LogoutButton } from '@/presentation/components/ui/LogoutButton';

const chatRepo = new ChatRepositoryImpl();
const getAvailableUsers = new GetAvailableUsersUseCase(chatRepo);

export function ChatListScreen() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const oppositeRole =
    user?.role === 'vendedor' ? 'cliente' : 'vendedor';

  useEffect(() => {
    if (!user) return;
    setUsersLoading(true);
    getAvailableUsers
      .execute(oppositeRole as 'vendedor' | 'cliente', user.id)
      .then(setUsers)
      .finally(() => setUsersLoading(false));
  }, [user?.id, user?.role]);

  const handleUserPress = useCallback(
    (receiver: User) => {
      if (!user) return;
      router.push({
        pathname: '/(chat)/room/[id]',
        params: {
          id: receiver.id,
          receiverName: receiver.name,
          receiverRole: receiver.role,
        },
      });
    },
    [router, user],
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const renderUser = ({ item }: { item: User }) => (
    <UserCard onPress={() => handleUserPress(item)}>
      <Avatar>
        <AvatarText>{item.name.charAt(0).toUpperCase()}</AvatarText>
      </Avatar>
      <UserInfo>
        <UserName>{item.name}</UserName>
        <UserRoleBadge $role={item.role}>
          <UserRoleText $role={item.role}>
            {item.role === 'vendedor' ? 'Vendedor' : 'Cliente'}
          </UserRoleText>
        </UserRoleBadge>
      </UserInfo>
      <Chevron>{'›'}</Chevron>
    </UserCard>
  );

  if (!user) {
    return (
      <Container>
        <LoaderWrapper>
          <LoaderLottie size={80} />
        </LoaderWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderTitle>Mis Chats</HeaderTitle>
          <HeaderSubtitle>
            {oppositeRole === 'vendedor' ? 'Vendedores' : 'Clientes'} disponibles
          </HeaderSubtitle>
        </HeaderLeft>
        <LogoutButton onPress={handleLogout} loading={authLoading} />
      </Header>

      {usersLoading ? (
        <LoaderWrapper>
          <LoaderLottie size={80} />
        </LoaderWrapper>
      ) : (
        <UserList
          data={users}
          keyExtractor={(item: User) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListEmptyComponent={
            <EmptyState>
              <EmptyIcon>👥</EmptyIcon>
              <EmptyText>No hay usuarios disponibles</EmptyText>
              <EmptySubtext>Espera a que alguien se conecte</EmptySubtext>
            </EmptyState>
          }
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 60px 20px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
`;

const UserList = styled(FlatList)`
  flex: 1;
` as unknown as typeof FlatList;

const UserCard = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
`;

const Avatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #2563eb;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const UserRoleBadge = styled.View<{ $role: string }>`
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 8px;
  background-color: ${({ $role }) =>
    $role === 'vendedor' ? '#dbeafe' : '#d1fae5'};
`;

const UserRoleText = styled.Text<{ $role: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $role }) =>
    $role === 'vendedor' ? '#1d4ed8' : '#065f46'};
`;

const Chevron = styled.Text`
  font-size: 24px;
  color: #9ca3af;
  margin-left: 8px;
`;

const LoaderWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 80px;
`;

const EmptyIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const EmptySubtext = styled.Text`
  font-size: 14px;
  color: #9ca3af;
  margin-top: 4px;
`;
