import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Grid, Center, Loader, Button, Flex, Group, Title, Text, Container, Card, Paper, Badge, Avatar, Anchor } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import TopNavPublic from '../components/layout/TopNavPublic';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

function BrowseGigs () {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const CDN_PATH = 'https://ik.imagekit.io/mublin/';

  const handleLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    async function getGigsAndRoles() {
      const { data: gigs, error } = await supabase
        .from('gigs')
        .select(`
          id, 
          created_at, 
          slug, 
          title, 
          description, 
          stage_name, 
          time_stage_start, 
          time_stage_end, 
          has_remuneration, 
          iteration_id, 
          featured, 

          projects(name, picture, genres(name), project_types(name_ptbr), on_tour), 
          profiles!gigs_posted_by_fkey(username, full_name, avatar), 
          gig_iterations(name_ptbr), 
          events(date_start, date_end, name, description, event_types(name), venues(name, cities(name, regions(id, uf), countries(id, code)))), 
          applications_count:gig_applications(count),
          roles_count:gig_roles(count),

          gig_roles(
            id, 
            fee, 
            is_filled, 
            is_sub, 
            description,
            roles(name_ptbr, description_ptbr),
            experience_levels(id, name_pt)
          )
        `)
        .limit(10)
        .eq('active', true)
        .gte('created_at', dayjs('2025-01-01').format('YYYY-MM-DD')) 
        .order('featured', { ascending: false }) 
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao carregar Gigs:", error);
      }
      
      if (gigs?.length > 0) {
        setGigs(gigs);
      }

      setLoading(false);
    }

    getGigsAndRoles();    
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/home')
      }
    };
    checkUser()
  }, [navigate]);

  const displayFees = (minValue, maxValue) => {
    if (minValue === maxValue) {
      return ` R$ ${minValue}`;
    } else {
      return ` R$ ${minValue} a R$ ${maxValue}`;
    }
  }

  return (
    <>
      <TopNavPublic /> 
      <Container size='md' mt={20} mb={50}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 3 }} visibleFrom='md'>
            <Title order={3} mb='sm'>
              Encontre gigs e oportunidades reais
            </Title>
            <Text size='sm' mb='md' c='dimmed'>
              Quer ver todas as gigs disponíveis e se candidatar diretamente?
            </Text>
            <Button fullWidth variant='light' color='mublin-color' onClick={() => handleLogin()}>
              Faça login para ver mais
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
            <Flex direction='column' gap={14}>
              {loading ? (
                <Center py={40}>
                  <Loader />
                </Center>
              ) : ( 
                gigs.map((gig) => (
                  <Card p={10} key={gig.id} data-active={gig.featured ? 'true' : 'false'}>
                    <Flex justify='space-between' align='flex-start' mb={8} >
                      <Flex gap={8} align='center'>
                        <Avatar 
                          size='md' 
                          radius='sm' 
                          src={
                            gig.projects.picture
                              ? CDN_PATH + 'projects/tr:h-60,w-60,c-maintain_ratio/'+gig.projects.picture 
                              : undefined
                          }
                        />
                        <Flex gap={0} direction='column'>
                          <Group align='center' gap={7}>
                            <Title order={4} fw='300' size='13px'>
                              {gig.projects.name}
                            </Title>
                          </Group>
                          <Text size='xs' lh={0.9} opacity={0.7}>
                            {gig.projects.project_types.name_ptbr} · {gig.projects.genres.name} {gig.projects.on_tour && ' (Em Turnê)'}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Anchor mb={2} size='lg' href={'/gig/'+gig.slug} fw={550} lh={1.2}>
                      {gig.title}
                    </Anchor>
                    <Group align='center' gap={5} mb={8}>
                      <Text size='xs' opacity={0.7}>
                        Publicada por
                      </Text>
                      <Avatar 
                        size={20}
                        radius='xl' 
                        src={
                          gig.profiles.avatar 
                            ? CDN_PATH + 'users/avatars/tr:h-40,w-40,c-maintain_ratio/'+gig.profiles.avatar 
                            : undefined
                        } 
                      />
                      <Text size='xs' opacity={0.7}>
                        {gig.profiles.username} {dayjs(gig.created_at).locale("pt-br").fromNow()}
                      </Text>
                      {gig.applications_count[0].count > 0 &&
                        <Text size='xs' opacity={0.7}>
                          · {gig.applications_count[0].count} {gig.applications_count[0].count === 1 ? 'candidatura' : 'candidaturas'}
                        </Text>
                      }
                    </Group>
                    {!!gig.gig_roles.length &&
                      <Flex gap={4} mb={11} align='center' wrap='wrap'>
                        <Text size='xs' fw={400} mr={3}>{gig.roles_count[0].count} {gig.roles_count[0].count === 1 ? 'vaga' : 'vagas'}:</Text>
                        {gig.gig_roles.map(role => (
                          <Badge
                            key={role.id}
                            color={role.is_filled ? 'gray' : 'mublin-color'}
                            variant='outline'
                            fw={400}
                            size='sm'
                            radius='lg'
                            opacity={role.is_filled ? 0.6 : 1}
                            td={role.is_filled ? 'line-through' : undefined}
                          >
                            {role.roles.description_ptbr}
                          </Badge>
                        ))}
                      </Flex>
                    }
                    <Text size='xs'>
                      Remuneração: 
                      {gig.has_remuneration ? (
                        displayFees(
                          Math.min(...gig.gig_roles.filter((x) => !x.is_filled).map(x => x.fee)), 
                          Math.max(...gig.gig_roles.filter((x) => !x.is_filled).map(x => x.fee))
                        )
                      ) : (
                        ' Não informado'
                      )}
                    </Text>
                    <Text size='xs'>Recorrência: {gig.gig_iterations?.name_ptbr}</Text>
                    {gig.events ? (
                      <>
                        <Paper mt={6} px={12} py={6} withBorder>
                          <Text size='xs' mb={4} c='dimmed'>Evento relacionado:</Text>
                          <Text size='sm' fw='bolder'>
                            {gig.events.name}
                          </Text>
                          <Text size='xs'>Tipo de evento: {gig.events.event_types?.name}</Text>
                          <Flex gap={6} align='center' mt={2}>
                            <Text size='xs'>
                              {dayjs(gig.events.date_start).format('DD/MM/YYYY')} ({dayjs().format('YYYY-MM-DD') === dayjs(gig.events.date_start).format('YYYY-MM-DD') ? ('Hoje') : (dayjs(gig.events.date_start).locale('pt-br').format('dddd'))}) das {gig.time_stage_start.slice(0, 5)} às {gig.time_stage_end.slice(0, 5)} {gig.stage_name && '('+gig.stage_name+')'}
                            </Text>
                          </Flex>
                          <Text size='xs' mt={4} opacity={0.7}>
                            {gig.events.venues.name} em {gig.events.venues.cities?.name}/{gig.events.venues.cities.regions?.uf} ({gig.events.venues.cities.countries.code?.toUpperCase()})
                          </Text>
                        </Paper>
                      </>
                    ) : 
                      <></>
                    }
                  </Card>
                )
              ))}
              <Button
                fullWidth
                variant='light'
                color='gray'
                onClick={() => handleLogin()}
              >
                Faça login para carregar mais gigs
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
};

export default BrowseGigs;
