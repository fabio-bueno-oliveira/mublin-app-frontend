import { Group, Avatar, Text, Anchor, Paper } from '@mantine/core';

export function MusicianMiniCard({
  avatarSrc,
  name,
  role,
  profileLink = '#', // Link padrão para o perfil do músico
}) {
  return (
    <Paper
      p="xs"
      radius="md"
      styles={(theme) => ({
        root: {
          backgroundColor: theme.colors.dark[7], // Um pouco mais claro que o dark[8] do main
          transition: 'background-color 0.2s ease', // Transição suave ao passar o mouse
          '&:hover': {
            backgroundColor: theme.colors.dark[6], // Mais claro no hover para feedback
            cursor: 'pointer',
          },
        },
      })}
    >
      <Group wrap="nowrap" align="center"> {/* 'nowrap' para evitar que o avatar/texto quebrem linha */}
        <Avatar src={'https://ik.imagekit.io/mublin/users/avatars/tr:h-32,w-32,c-maintain_ratio/'+avatarSrc} alt={name} radius="xl">
          {name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
        </Avatar>

        <div style={{ flex: 1, overflow: 'hidden' }}> {/* Oculta texto que transborda */}
          <Anchor
            href={profileLink}
            underline="never"
            c="white"
            fz="sm"
            fw={500}
            style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {name}
          </Anchor>
          <Text
            c="dimmed"
            fz="xs"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {role}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
