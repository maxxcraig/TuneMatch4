import { Container, Button, Center, Title, Text, Loader } from '@mantine/core';
import { useState } from 'react';
import { IconBrandSpotify } from '@tabler/icons-react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = 'http://localhost:8000/api/auth/login'; // Backend Spotify OAuth Route
  };

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Center>
        <Title order={2} align="center">Welcome to TuneMatch</Title>
      </Center>
      <Text align="center" color="dimmed" mt="md">
        Log in with Spotify to see your stats and match with similar listeners.
      </Text>
      <Center mt="xl">
        {loading ? (
          <Loader size="lg" />
        ) : (
          <Button leftIcon={<IconBrandSpotify size={20} />} color="green" onClick={handleLogin} size="md">
            Login with Spotify
          </Button>
        )}
      </Center>
    </Container>
  );
};

export default LoginPage;