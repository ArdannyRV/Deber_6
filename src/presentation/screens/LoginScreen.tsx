import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { CustomButton } from '@/presentation/components/ui/CustomButton';
import { CustomInput } from '@/presentation/components/ui/CustomInput';
import { LoaderLottie } from '@/presentation/components/ui/LoaderLottie';

export function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return;
    try {
      const user = await login(email.trim(), password.trim());
      if (user) {
        router.replace('/(chat)/list');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Correo o contraseña incorrectos');
      } else {
        setError(msg || 'Error al iniciar sesión');
      }
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
          <Title>Chat Comercio</Title>
          <Subtitle>
            Conecta con vendedores y clientes en tiempo real
          </Subtitle>
        </HeaderSection>

        <FormSection>
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

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <ButtonGroup>
          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogin}
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
          <FooterText>¿No tienes cuenta? </FooterText>
          <FooterLink onPress={() => router.push('/(auth)/register')}>
            <FooterLinkText>Regístrate aquí</FooterLinkText>
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
  margin-top: 80px;
  margin-bottom: 40px;
`;

const LogoIcon = styled.View`
  width: 80px;
  height: 80px;
  background-color: #2563eb;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  elevation: 8;
  shadow-color: #2563eb;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
`;

const LogoText = styled.Text`
  font-size: 36px;
  color: #ffffff;
  font-weight: 700;
`;

const Title = styled.Text`
  font-size: 28px;
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

const ButtonGroup = styled.View`
  width: 100%;
`;

const LoaderWrapper = styled.View`
  margin-top: 16px;
  align-items: center;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 40px;
`;

const ErrorMessage = styled.Text`
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
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
