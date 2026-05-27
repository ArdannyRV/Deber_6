import { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';
import { GetAvailableUsersUseCase } from '@/domain/usecases/GetAvailableUsersUseCase';
import { User } from '@/domain/entities/User';
import { GlassHeader } from '@/presentation/components/ui/GlassHeader';
import { LogoutButton } from '@/presentation/components/ui/LogoutButton';
import { LoaderLottie } from '@/presentation/components/ui/LoaderLottie';
import { theme } from '@/presentation/theme/theme';

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
      <GlassHeader
        title="Mis Chats"
        subtitle={`${oppositeRole === 'vendedor' ? 'Vendedores' : 'Clientes'} disponibles`}
        rightElement={<LogoutButton onPress={handleLogout} loading={authLoading} />}
      />

      {usersLoading ? (
        <LoaderWrapper>
          <LoaderLottie size={80} />
        </LoaderWrapper>
      ) : (
        <UserList
          data={users}
          keyExtractor={(item: User) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ padding: 16, paddingTop: 110, gap: 12 }}
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
  background-color: ${theme.colors.backgroundBase};
`;

const UserList = styled(FlatList)`
  flex: 1;
` as unknown as typeof FlatList;

const UserCard = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg}px;
  padding: 16px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.04;
  shadow-radius: 3px;
`;

const Avatar = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #DBEAFE;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  border-width: 1.5px;
  border-color: ${theme.colors.primary};
`;

const AvatarText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 18px;
  font-weight: 700;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textMain};
  margin-bottom: 4px;
`;

const UserRoleBadge = styled.View<{ $role: string }>`
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.sm}px;
  background-color: ${({ $role }) =>
    $role === 'vendedor' ? '#DBEAFE' : '#D1FAE5'};
`;

const UserRoleText = styled.Text<{ $role: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $role }) =>
    $role === 'vendedor' ? '#1D4ED8' : '#065F46'};
`;

const Chevron = styled.Text`
  font-size: 24px;
  color: ${theme.colors.textMuted};
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
  margin-top: 100px;
`;

const EmptyIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textMain};
`;

const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;
