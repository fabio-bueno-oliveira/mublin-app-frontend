import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getTrendingMusicians } from '../services/musicianService';
import { Grid, Flex, Stack, Center, Card, Title, Text, Avatar, Image, ActionIcon, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Menu } from '../components/Menu'; 
import { MusicianMiniCard } from '../components/MusicianMiniCard';
import { GigCard } from '../components/GigCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

function Home() {
  dayjs.extend(relativeTime);

  const [gigs, setGigs] = useState([]);
  const [gigRoles, setGigRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingMusicians, setTrendingMusicians] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    async function getGigs() {
      // 1. Busca as Gigs (Query limpa e rápida)
      const { data: fetchedGigs } = await supabase
        .from('gigs')
        .select(`
          id, created_at, slug, title, description, date_start, date_end, 
          time_event_start, time_event_end, time_stage_start, time_stage_end, 
          has_remuneration, featured, 
          projects(name, genres(name), picture, project_types(name_ptbr)), 
          profiles(username, full_name, avatar), 
          iteration_id, gig_iterations(name_ptbr), 
          cities(id, name, regions(uf), countries(code)), 
          venue_name, venue_types(id, name), 
          applications_count:gig_applications(count)
        `)
        .eq('status', true)
        .gte('date_start', dayjs().format('2024-12-12'))
        .order('created_at', { ascending: false })
        .limit(10);

      if (fetchedGigs && fetchedGigs.length > 0) {
        // 2. Extrai os IDs das gigs carregadas
        const gigIds = fetchedGigs.map(g => g.id);

        // 3. Busca apenas os roles dessas gigs específicas
        const { data: fetchedRoles } = await supabase
          .from('gig_roles')
          .select('id, gig_id, roles(name_ptbr, description_ptbr), description, fee, is_filled, is_sub, experience_levels(id, name_pt)')
          .in('gig_id', gigIds);

        setGigs(fetchedGigs);
        setGigRoles(fetchedRoles || []);
      }

      setLoading(false);
    };

    async function loadTrending() {
      const musicians = await getTrendingMusicians(3);
      setTrendingMusicians(musicians);
      setLoadingTrending(false);
    }

    getGigs();
    loadTrending();
  }, []);

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
            <Title order={4}>Feed</Title>
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
              <Stack gap="md">
                {loading ? (
                  <Text>Carregando vagas...</Text>
                ) : (
                  gigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      gigRoles={gigRoles}
                    />
                  ))
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card w='100%' shadow="sm" padding="lg" radius="md">
                <Title order={5} fw='normal' mb='lg'>Músicos em destaque</Title>
                {loadingTrending ? (
                  <Center>
                    <Loader />
                  </Center>
                ) : (
                  <Stack spacing="xs">
                    {trendingMusicians.map((musician) => (
                      <MusicianMiniCard
                        key={musician.id}
                        avatarSrc={musician.avatar}
                        name={musician.name}
                        username={musician.username}
                        role={musician.mainRole}
                        profileLink={musician.profileLink}
                      />
                    ))}
                  </Stack>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Home;
