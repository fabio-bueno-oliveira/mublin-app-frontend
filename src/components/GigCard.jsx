import dayjs from 'dayjs';
import { Group, Flex, Card, Avatar, Badge, Image, Title, Text, Anchor } from '@mantine/core';
import { IconClock, IconMapPin, IconCoin } from '@tabler/icons-react';

export function GigCard({ gig, gigRoles }) {
  const {
    id,
    projects: project,
    profiles: profile,
    hasRemuneration,
    title,
    venue_name,
    slug,
    applications_count,
    created_at,
    cities: city,
    date_start,
    time_stage_start,
    time_stage_end,
    featured,
  } = gig;

  const displayFees = (minValue, maxValue) => {
    if (minValue === maxValue) {
      return `R$ ${minValue}`;
    } else {
      return `R$ ${minValue} a R$ ${maxValue}`;
    }
  }

  return (
    <Card p={10} key={id} withBorder={featured}>
      {featured &&
        <Flex justify='space-between' p={10}>
          <Flex direction='column'>
            <Badge variant='light' size='sm' mb={2}>Destaque</Badge>
            <Anchor mb={6} size='lg' href={'/gig/'+slug} fw={600} lh={1.2}>
              {title}
            </Anchor>
          </Flex>
          <Image
            radius="md"
            h={120}
            w="auto"
            fit="contain"
            src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-240,w-240,c-maintain_ratio/'+project.picture : undefined}
          />
        </Flex>
    }
      <Flex justify='space-between' align='flex-start' mb={8} >
        <Flex gap={6} align='center'>
          <Avatar size='md' radius='sm' src={project.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+project.picture : undefined} />
          <Flex gap={0} direction='column'>
            <Title order={4} fz='sm' fw='normal'>
              {project.name}
            </Title>
            <Text size='xs' opacity={0.9} lh={0.9}>
              {project.project_types.name_ptbr} · {project.genres.name}
            </Text>
          </Flex>
        </Flex>
        {hasRemuneration &&
          <Badge
            mt={3}
            color='mublin-green'
            variant='light'
            size='md'
            fw='500'
            radius='md'
            leftSection={<IconCoin size={14} />}
          >
            {displayFees(Math.min(...gigRoles.filter((x) => x.gig_id === id).map(x => x.fee)), Math.max(...gigRoles.filter((x) => x.gig_id === gig.id).map(x => x.fee)))}
          </Badge>
        }
      </Flex>
      <Anchor mb={6} size='lg' href={'/gig/'+slug} fw={600} lh={1.2}>
        {title}
      </Anchor>
      {!!gigRoles.filter((x) => x.gig_id === id && !x.is_filled)?.length &&
        <Flex gap={3} mb={8} align='center' wrap='wrap'>
          <Text size='xs' fw={400} mr={3}>Vagas para:</Text>
          {gigRoles.filter((x) => x.gig_id === id).map(role => (
            <Badge
              key={role.id}
              color={role.is_filled ? 'gray' : 'pink'}
              variant='light'
              fw={400}
              size='sm'
              radius='sm'
              opacity={role.is_filled ? 0.6 : 1}
              td={role.is_filled ? 'line-through' : undefined}
            >
              {role.roles.description_ptbr}
            </Badge>
          ))}
        </Flex>
      }
      <Flex gap={6} align='center'>
        <Text size='xs' lh={0}>
          {dayjs(date_start).format('DD/MM/YYYY')} ({dayjs().format('YYYY-MM-DD') === dayjs(date_start).format('YYYY-MM-DD') ? ('Hoje') : (dayjs(date_start).locale('pt-br').format('dddd'))})
        </Text>
        <Flex align='center' gap={2}>
          <IconClock size={14} />
          <Text size='xs' lh={0}>
              das {time_stage_start.slice(0, 5)} às {time_stage_end.slice(0, 5)}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={8} align='center' mt={4}>
        <Text size='xs' lh={0}>{venue_name}</Text>
        <Flex align='center' gap={2}>
          <IconMapPin size={14} />
          <Text size='xs' lh={0}>{city?.name}/{city.regions?.uf} ({city.countries.code?.toUpperCase()})</Text>
        </Flex>
      </Flex>
      <Group align='center' gap={5} mt={8} mb={4}>
        <Text c='dimmed' size='xs'>
          Publicada por
        </Text>
        <Avatar 
          size={20}
          radius='xl' 
          src={project.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-40,w-40,c-maintain_ratio/'+profile.avatar : undefined} 
        />
        <Text c='dimmed' size='xs'>
          {profile.username}
        </Text>
        <Text c='dimmed' size='xs'>
          {dayjs(created_at).locale("pt-br").fromNow()}
        </Text>
        {applications_count[0].count > 0 &&
          <Text c='dimmed' size='xs'>
            · {applications_count[0].count} candidaturas
          </Text>
        }
      </Group>
      <Group gap={4} align='center'>
        <Anchor href={'/gig/'+slug} fz='sm'>
          Ver mais detalhes
        </Anchor>
      </Group>
    </Card>
  );
}
