import { useEffect, useState  } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Flex, Title, Text, Container, Card, Badge, Avatar, Anchor, Center, Loader, Alert, Accordion, Group, List, em, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCircleDashedNumber1, IconCoin, IconIdBadge2, IconRefresh, IconRoad, IconClock, IconMoodSad, IconWindow, IconBrandSpotify, IconExternalLink } from '@tabler/icons-react';
import dayjs from 'dayjs';

function GigDetails () {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { slug } = useParams();
  const [gig, setGig] = useState(null);
  const [gigRoles, setGigRoles] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGig = async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('id, created_at, slug, title, description, date_start, date_end, time_event_start, time_event_end, time_stage_start, time_stage_end, hasRemuneration, projects(id, name, genres(name), picture, project_types(name_ptbr)), profiles(username, full_name, avatar), iteration_id, gig_iterations(name_ptbr), cities(id, name, regions(id, uf), countries(id, code)), venue_name, venue_types(id, name), dress_code_types(name)')
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
        .limit(20)
        .order('created_at', { ascending: false })

      if (roles.length > 0) {
        setGigRoles(roles);
      }

      setLoading(false);
    };

    const fetchGigPlaylist = async () => {
      const { data: playlist } = await supabase
        .from('gig_playlist')
        .select('id, order_index, song_title, artist_name, track_url, is_original')
        .eq('gig_id', gig.id)
        .order('order_index', { ascending: false })

      if (playlist.length > 0) {
        setPlaylist(playlist);
      }

      setLoading(false);
    };

    if (gig?.id) {
      fetchGigRoles();
      fetchGigPlaylist();
    }
  }, [gig?.id]);

  return (
    <>
      <Container size='md' mt={10} mb={100}>
        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          error ? (
            <Alert variant='light' color='red' title='Ops...' icon={<IconMoodSad />}>
              Ocorreu um erro ao carregar as informações desta gig. Talvez ela tenha sido encerrada ou você tenha digitado o endereço incorreto
            </Alert>
          ) : (
            <Card>
              <Flex mb={14} gap={12} align='center'>
                <Avatar 
                  size={45}
                  radius='sm' 
                  src={gig.projects.picture ? 'https://ik.imagekit.io/mublin/projects/tr:h-90,w-90,c-maintain_ratio/'+gig.projects.picture : undefined} 
                />
                <Flex direction='column'>
                  <Anchor href={'/artist/'+gig.projects.id} fz='sm' fw={600}>
                    {gig.projects.name}
                  </Anchor>
                  <Text size='xs' opacity={0.8} fw={400} lh={0.8}>
                    {gig.projects.project_types.name_ptbr} ({gig.projects.genres.name})
                  </Text>
                </Flex>
              </Flex>
              <Text size='sm' mb={6}>
                📅 {dayjs(gig.date).format('DD/MM/YYYY')} (daqui a {dayjs(gig.date_start).diff(dayjs(), 'day')} dias)
              </Text>
              <Title order={1} size='h3' fw={600}>{gig?.title}</Title>
              <Title order={2} size='h4' fw={500}>
                {gig.venue_name} <Badge variant='default' fw={400}>{gig.venue_types.name}</Badge>
              </Title>
              {gig.hasRemuneration &&
                <Badge 
                  color='brightGreen' 
                  variant='light' 
                  size='md' 
                  fw='500'
                  mt={10}
                  radius='md'
                  leftSection={<IconCoin size={13} />}
                >
                  Gig Paga
                </Badge>
              }
              <Group align='center' gap={5} mt={4} mb={8}>
                <Text c='dimmed' size='xs'>
                  Publicada em {dayjs(gig.created_at).format('DD/MM/YYYY')} por
                </Text>
                <Avatar 
                  size={20}
                  radius='xl' 
                  src={gig.projects.picture ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-40,w-40,c-maintain_ratio/'+gig.profiles.avatar : undefined} 
                />
                <Text c='dimmed' size='xs'>
                  {gig.profiles.username}
                </Text>
              </Group>
              <Text size='sm' fw={200} opacity={0.7} mb={3}>Horário do evento:</Text>
              <Flex gap={8} align='center' mb={10}>
                <Flex align='center' gap={2}>
                  <IconClock size={15} />
                  <Text size='sm' lh={0}>
                    das {gig.time_event_start.slice(0, 5)} às {gig.time_event_end.slice(0, 5)}
                  </Text>
                </Flex>
              </Flex>
              <Text size='sm' fw={200} opacity={0.7} mb={3}>Horário da gig (palco):</Text>
              <Flex gap={8} align='center' mb={10}>
                <Flex align='center' gap={2}>
                  <IconClock size={15} />
                  <Text size='sm' lh={0}>
                    das {gig.time_stage_start.slice(0, 5)} às {gig.time_stage_end.slice(0, 5)}
                  </Text>
                </Flex>
              </Flex>
              <Text size='sm' fw={200} opacity={0.7}>Descrição:</Text>
              <Text size='sm' mb={8}>{gig?.description}</Text>
              <Text size='sm' fw={200} opacity={0.7}>Dress code:</Text>
              <Text size='sm'>{gig?.dress_code_types?.name}</Text>
              {!!gigRoles.filter((x) => x.gig_id === gig.id)?.length && 
                <>
                  <Text size='sm' fw={200} opacity={0.7} mt={10}>Vagas:</Text>
                  <Accordion mt={3}>
                    {gigRoles.map(role => (
                      <Accordion.Item key={role.id} value={role.id}>
                        <Accordion.Control>
                          {role.roles.description_ptbr} {!!role.is_sub && '(Sub)'} {role.is_filled ? <Badge variant='dot' color='red' size='sm' fw={400}>Vaga preenchida</Badge> : <Badge variant='dot' color='green' size='sm' fw={400}>Em aberto</Badge>}
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Text size='xs'>
                            <Text span fw={600}>Descrição:</Text> {role.description}
                          </Text>
                          <Text size='xs' mt={4}>
                            <Text span fw={600}>Nível de experiência:</Text> {role.experience_levels.name_pt}
                          </Text>
                          {gig.hasRemuneration && 
                            <Text size='xs' mt={4}>
                              <Text span fw={600}>Cachê:</Text> {role.fee ? role.fee.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'Não disponível'}
                            </Text>
                          }
                          {role.is_sub && 
                            <Flex gap={5} mt={4} align='center'>
                              <Text size='xs' fw={600}>
                                Substituindo:
                              </Text>
                              <Avatar size='xs' radius='xl' src={role.profiles.avatar ? 'https://ik.imagekit.io/mublin/users/avatars/tr:h-60,w-60,c-maintain_ratio/'+role.profiles.avatar : undefined} />
                              <Text size='xs'>
                                {role.sub_for ? role.profiles.username : 'Nome não disponível'}
                              </Text>
                            </Flex>
                          }
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </>
              }
              <Text size='sm' fw={200} opacity={0.7} mt={10} mb={4}>
                Reportório:
              </Text>
              {playlist.length ? (
                <List type="ordered">
                  {playlist.map(song =>
                    <List.Item key={song.id}>
                      {song.artist_name} - {song.song_title}  <IconExternalLink size={16} />
                    </List.Item>
                  )}
                </List>
              ) : (
                <Text size='sm'>Não informado</Text>
              )}
              <Text size='sm' fw={200} opacity={0.7} mt={10} mb={4}>
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
              <Button variant='filled' color='pink' fullWidth mt={24}>
                Candidatar-se
              </Button>
            </Card>
          )
        )}
      </Container>
    </>
  )
};

export default GigDetails;
