import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { CustomButton } from '@/presentation/components/ui/CustomButton';
import { CustomInput } from '@/presentation/components/ui/CustomInput';
import { LoaderLottie } from '@/presentation/components/ui/LoaderLottie';

export function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'vendedor' | 'cliente' | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !role) return;
    const user = await register(name.trim(), email.trim(), password.trim(), role);
    if (user) {
      router.replace('/(chat)/list');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Container>
        <HeaderSection>
          <LogoIcon>
            <LogoText>C</LogoText>
          </LogoIcon>
          <Title>Crear Cuenta</Title>
          <Subtitle>Regístrate para empezar a chatear</Subtitle>
        </HeaderSection>

        <FormSection>
          <CustomInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre completo"
            autoCapitalize="words"
          />
          <Spacer />
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Spacer />
          <CustomInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry
          />
        </FormSection>

        <RoleLabel>Eres...</RoleLabel>
        <RoleGroup>
          <RoleButton
            onPress={() => setRole('vendedor')}
            $active={role === 'vendedor'}
          >
            <RoleIcon $active={role === 'vendedor'}>🏪</RoleIcon>
            <RoleButtonText $active={role === 'vendedor'}>
              Vendedor
            </RoleButtonText>
            <RoleBadge $active={role === 'vendedor'} />
          </RoleButton>
          <RoleButton
            onPress={() => setRole('cliente')}
            $active={role === 'cliente'}
          >
            <RoleIcon $active={role === 'cliente'}>🛒</RoleIcon>
            <RoleButtonText $active={role === 'cliente'}>
              Cliente
            </RoleButtonText>
            <RoleBadge $active={role === 'cliente'} />
          </RoleButton>
        </RoleGroup>

        <ButtonGroup>
          <CustomButton
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={loading}
            variant="primary"
          />
        </ButtonGroup>

        {loading && (
          <LoaderWrapper>
            <LoaderLottie size={60} />
          </LoaderWrapper>
        )}

        <Footer>
          <FooterText>¿Ya tienes cuenta? </FooterText>
          <FooterLink onPress={() => router.push('/(auth)/login')}>
            <FooterLinkText>Inicia sesión aquí</FooterLinkText>
          </FooterLink>
        </Footer>
      </Container>
    </KeyboardAvoidingView>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding-horizontal: 32px;
`;

const HeaderSection = styled.View`
  align-items: center;
  margin-top: 60px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.View`
  width: 72px;
  height: 72px;
  background-color: #2563eb;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  elevation: 8;
  shadow-color: #2563eb;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
`;

const LogoText = styled.Text`
  font-size: 32px;
  color: #ffffff;
  font-weight: 700;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const FormSection = styled.View`
  width: 100%;
  margin-bottom: 24px;
`;

const Spacer = styled.View`
  height: 14px;
`;

const RoleLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-align: center;
`;

const RoleGroup = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 28px;
`;

const RoleButton = styled.TouchableOpacity<{ $active: boolean }>`
  flex: 1;
  align-items: center;
  padding: 20px 16px;
  border-radius: 16px;
  border-width: 2px;
  border-color: ${({ $active }) => ($active ? '#2563eb' : '#e5e7eb')};
  background-color: ${({ $active }) => ($active ? '#eff6ff' : '#ffffff')};
`;

const RoleIcon = styled.Text<{ $active: boolean }>`
  font-size: 28px;
  margin-bottom: 8px;
`;

const RoleButtonText = styled.Text<{ $active: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#2563eb' : '#6b7280')};
`;

const RoleBadge = styled.View<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  margin-top: 8px;
`;

const ButtonGroup = styled.View`
  width: 100%;
  margin-bottom: 8px;
`;

const LoaderWrapper = styled.View`
  margin-top: 16px;
  align-items: center;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 40px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const FooterLink = styled.TouchableOpacity``;

const FooterLinkText = styled.Text`
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
`;
