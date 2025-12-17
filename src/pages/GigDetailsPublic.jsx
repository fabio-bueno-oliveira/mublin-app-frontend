import { useEffect, useState  } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Grid, Flex, Box, Stack, Breadcrumbs, ActionIcon, Title, Text, Container, Card, Badge, Avatar, Anchor, Center, Loader, Alert, Accordion, Button, Image } from '@mantine/core';
import { IconCircleDashedNumber1, IconCoin, IconIdBadge2, IconRefresh, IconRoad, IconMapPin, IconClock, IconMoodSad, IconSearch } from '@tabler/icons-react';
import { Menu } from '../components/Menu';
import { MusicianMiniCard } from '../components/MusicianMiniCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

function GigDetailsPublic () {
  const { slug } = useParams();
  const [gig, setGig] = useState(null);
  const [gigRoles, setGigRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  dayjs.extend(relativeTime);

  useEffect(() => {
    const fetchGig = async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('id, created_at, slug, title, description, date_start, date_end, time_event_start, time_event_end, time_stage_start, time_stage_end, has_remuneration, projects(id, name, genres(name), picture, project_types(name_ptbr)), profiles(username, full_name, avatar), iteration_id, gig_iterations(name_ptbr), cities(id, name, regions(id, uf), countries(id, code)), venue_name, venue_types(id, name), applications_count:gig_applications(count)')
        .eq('slug', slug)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setGig(data);
      }
      setLoading(false);
    };

    fetchGig();
  }, [slug]);

  useEffect(() => {
    const fetchGigRoles = async () => {
      const { data: roles } = await supabase
        .from('gig_roles')
        .select('id, gig_id, roles(name_ptbr, description_ptbr), description, fee, is_filled, is_sub, sub_for, profiles(username, avatar), experience_levels(id, name_pt)')
        .eq('gig_id', gig.id)
        .order('created_at', { ascending: false })

      if (roles.length > 0) {
        setGigRoles(roles);
      }

      setLoading(false);
    };

    if (gig?.id) {
      fetchGigRoles();
    }
  }, [gig?.id]);

  const displayFees = (minValue, maxValue) => {
    if (minValue === maxValue) {
      return `R$ ${minValue}`;
    } else {
      return `R$ ${minValue} a R$ ${maxValue}`;
    }
  }

  // Dados simulados para "Trending Musicians"
  const trendingMusicians = [
    {
      id: 1,
      name: 'João Silva',
      instrument: 'Guitarrista de Jazz',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWNpYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      profileLink: '/profile/joao-silva'
    },
    {
      id: 2,
      name: 'Maria Eduarda Lima',
      instrument: 'Vocalista Pop/R&B',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
      profileLink: '/profile/maria-eduarda'
    },
    {
      id: 3,
      name: 'Pedro Henrique',
      instrument: 'Baterista de Rock',
      avatar: 'https://images.unsplash.com/photo-1563829023192-9657c965e648?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZHJ1bW1lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      profileLink: '/profile/pedro-henrique'
    },
  ];

  return (
    <>
      <Grid gutter={0}>
        <Grid.Col span={{ base: 12, md: 2.5 }} pt='lg'>
          <Flex align='center' justify='flex-start' mb='lg' gap={2}>
            <Image 
              w='60' 
              src="https://ik.imagekit.io/mublin/logos/mublin-m-color-transparent.png"
              fallbackSrc="https://placehold.co/400x400?text=Sem+Foto"
            />
            <Title size="h2">Mublin</Title>
          </Flex>
          <Center mb='lg'>
            <Avatar radius="xl" size='lg' />
          </Center>
          <Menu />
        </Grid.Col>
        <Grid.Col span={9.5} pt='lg' px='lg'>
          <Flex justify='space-between' align='center' py='xs' mb='xs'>
            <Breadcrumbs fz='sm'>
              <Anchor c='mublin-green' fz='sm' href='/home'>
                Home
              </Anchor>
              <Text fz='sm'>
                Detalhes do evento
              </Text>
            </Breadcrumbs>
            <ActionIcon 
              size={42}
              radius='xl'
              variant="default"
              aria-label="Pesquisar músicos ou vagas"
            >
              <IconSearch size={24} />
            </ActionIcon>
          </Flex>
          <Grid>
            <Grid.Col span={{ base: 12, md: 9 }}>
              {loading ? (
                <Center pt='xl'>
                  <Loader />
                </Center>
              ) : (
                error ? (
                  <Alert variant='light' color='red' title='Ops...' icon={<IconMoodSad />}>
                    Ocorreu um erro ao carregar as informações desta gig. Tente novamente em instantes ou verifique se o endereço está correto.
                  </Alert>
                ) : (
                  <Card>
                    <Flex align='center' gap={5} mb={4} title={'Publicada em '+dayjs(gig.created_at).format('DD/MM/YYYY HH:mm:ss')+' por '+gig.profiles.full_name}>
                      <Text opacity={0.8} size='xs'>
                        Por
                      </Text>
                      <Avatar 
                        size={20}
                        radius='xl' 
                        src={gig.projects.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-40,w-40,c-maintain_ratio/'+gig.profiles.avatar : undefined} 
                      />
                      <Text opacity={0.8} size='xs'>
                        {gig.profiles.username}
                      </Text>
                      <Text opacity={0.8} size='xs'>
                        {dayjs(gig.created_at).locale("pt-br").fromNow()}
                      </Text>
                      {gig.applications_count[0].count > 0 &&
                        <Text opacity={0.8} size='xs'>
                          · {gig.applications_count[0].count} candidaturas
                        </Text>
                      }
                    </Flex>
                    <Title order={1} size='h3' mb={2} fw={600}>{gig?.title}</Title>
                    <Flex gap={6} align='center' mb={10}>
                      <IconMapPin size={14} />
                      <Text size='sm' fw={500} lh={0}>
                        {gig.venue_name} ({gig.venue_types.name}) em {gig.cities?.name}/{gig.cities.regions?.uf} ({gig.cities.countries.code?.toUpperCase()})
                      </Text>                      
                    </Flex>
                    <Text size='md' c='white'>
                      {dayjs(gig.date_start).format('DD/MM/YYYY')} ({dayjs().format('YYYY-MM-DD') === dayjs(gig.date_start).format('YYYY-MM-DD') ? '(Hoje)' : (dayjs(gig.date_start).locale('pt-br').format('dddd'))})
                    </Text>
                    <Flex gap={8} align='center' opacity={0.8} mt={2} mb={10}>
                      <Flex align='center' gap={2}>
                        <IconClock size={15} />
                        <Text size='xs' lh={0}>
                          Evento: {gig.time_event_start.slice(0, 5)} às {gig.time_event_end.slice(0, 5)}
                        </Text>
                      </Flex>
                      <Flex align='center' gap={2}>
                        <IconClock size={15} />
                        <Text size='xs' lh={0}>
                          Palco: {gig.time_stage_start.slice(0, 5)} às {gig.time_stage_end.slice(0, 5)}
                        </Text>
                      </Flex>
                    </Flex>
                    {gig.has_remuneration &&
                      <Box mb={8}>
                        <Badge 
                          variant='light' 
                          size='md' 
                          fw='500'
                          radius='md'
                          leftSection={<IconCoin size={14} />}
                        >
                          {displayFees(Math.min(...gigRoles.map(x => x.fee)), Math.max(...gigRoles.map(x => x.fee)))}
                        </Badge>
                      </Box>
                    }
                    <Flex mt={6} mb={12} gap={6} align='center'>
                      <Avatar size='md' radius='sm' src={gig.projects.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-60,w-60,c-maintain_ratio/'+gig.projects.picture : undefined} />
                      <Flex gap={0} direction='column'>
                        <Anchor href={'/artist/'+gig.projects.id} fz='sm' fw={600}>
                          {gig.projects.name}
                        </Anchor>
                        <Text size='xs' opacity={0.8} fw={400} lh={0.8}>
                          {gig.projects.project_types.name_ptbr} ({gig.projects.genres.name})
                        </Text>
                      </Flex>
                    </Flex>
                    <Text size='sm' opacity={0.7}>Descrição da gig:</Text>
                    <Text size='sm'>{gig?.description}</Text>
                    {!!gigRoles.filter((x) => x.gig_id === gig.id)?.length && 
                      <>
                        <Text size='sm' opacity={0.7} mt={10}>Vagas:</Text>
                        <Accordion mt={3}>
                          {gigRoles.map(role => (
                            <Accordion.Item key={role.id} value={role.id}>
                              <Accordion.Control>
                                {role.roles.description_ptbr} {!!role.is_sub && '(Sub)'} {role.is_filled ? <Badge variant='dot' color='red' size='sm' fw={400}>Vaga preenchida</Badge> : <Badge variant='dot' color='green' size='sm' fw={400}>Em aberto</Badge>}
                              </Accordion.Control>
                              <Accordion.Panel>
                                <Text size='sm'>
                                  <Text span fw={600}>Descrição:</Text> {role.description}
                                </Text>
                                <Text size='sm' mt={4}>
                                  <Text span fw={600}>Nível de experiência:</Text> {role.experience_levels.name_pt}
                                </Text>
                                {gig.has_remuneration && 
                                  <Text size='sm' mt={4}>
                                    <Text span fw={600}>Cachê:</Text> {role.fee ? role.fee.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'Não informado'}
                                  </Text>
                                }
                                {role.is_sub && 
                                  <Flex gap={5} mt={4} align='center'>
                                    <Text size='sm' fw={600}>
                                      Substituindo:
                                    </Text>
                                    <Avatar size='xs' radius='xl' src={role.profiles.avatar ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-60,w-60,c-maintain_ratio/'+role.profiles.avatar : undefined} />
                                    <Text size='sm'>
                                      {role.sub_for ? role.profiles.username : 'Nome não disponível'}
                                    </Text>
                                  </Flex>
                                }
                                <Button mt={8} variant='filled' size='xs' color='pink'>
                                  Faça login para se candidatar
                                </Button>
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </>
                    }
                    <Text size='sm' opacity={0.7} mt={10} mb={4}>
                      Reportório:
                    </Text>
                    <Text size='sm'><a href='/login'>Faça login</a> para visualizar!</Text>
                    <Text size='sm' opacity={0.7} mt={10} mb={4}>
                      Recorrência da gig:
                    </Text>
                    <Badge
                      color='gray'
                      variant='light'
                      size='md'
                      fw='500'
                      radius='md'
                      leftSection={
                        {
                          1: <IconCircleDashedNumber1 size={13} />,
                          2: <IconRefresh size={13} />,
                          3: <IconRoad size={13} />,
                          4: <IconIdBadge2 size={13} />,
                        }[gig.iteration_id]
                      }
                    >
                      {gig.gig_iterations.name_ptbr}
                    </Badge>
                  </Card>
                )
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card w='100%' shadow="sm" padding="lg" radius="md">
                <Title order={5} fw='normal' mb='lg'>Trending musicians</Title>
                <Stack spacing="xs">
                  {trendingMusicians.map((musician) => (
                    <MusicianMiniCard
                      key={musician.id}
                      avatarSrc={musician.avatar}
                      name={musician.name}
                      instrumentOrRole={musician.instrument}
                      profileLink={musician.profileLink}
                    />
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  )
};

export default GigDetailsPublic;
