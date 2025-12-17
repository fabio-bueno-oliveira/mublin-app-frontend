import { Paper, Title, Text, Button, Stack } from '@mantine/core';

export function GuestCTA() {
  return (
    <Paper p="lg" m='md' radius="md" withBorder style={{ backgroundColor: 'transparent' }}>
      <Stack align="center" gap="sm">
        <Title order={3} ta="center">Sua carreira musical merece um palco maior.</Title>
        <Text c="dimmed" ta="center" size="sm" maw={400}>
          Crie seu perfil profissional no Mublin para se candidatar a vagas, 
          encontrar músicos e gerenciar seus projetos.
        </Text>
        <Button color="mublin-color" size="md" radius="xl" mt="md">
          Cadastrar agora
        </Button>
      </Stack>
    </Paper>
  );
}
