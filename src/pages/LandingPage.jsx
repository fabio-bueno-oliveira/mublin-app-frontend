import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../hooks/useRoles';
import { BackgroundImage, NativeSelect, Box, Grid, Button, Center, Flex, Title, Text, Container, Card, Badge, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowRightDashed, IconBrandInstagram, IconCalendarPlus, IconMusicSearch, IconRocket, IconSearch, IconUserCheck } from '@tabler/icons-react';
import TopNavPublic from '../components/layout/TopNavPublic';
import { TypeAnimation } from 'react-type-animation';

function Landing () {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const { roles, loading } = useRoles();
  const [selectedRole, setSelectedRole] = useState(2);

  return (
    <>
      <Box w='100%' mx="auto">
        <BackgroundImage
          src='https://ik.imagekit.io/mublin/bg/tr:o-20,bg-000000/mublin-hero-chatgpt-musicians4.png'
          radius='sm'
          h={isMobile ? 320 : 400}
          pt={isMobile ? 22 : 20}
        >
          <TopNavPublic /> 
          <Container size='sm' mt={isMobile ? 20 : 60}>
            <Center>
              <Badge
                size='lg'
                color='mublin-color'
                variant='light'
                fw={300}
                ff='monospace'
                visibleFrom='md'
                radius='sm'
                leftSection={<IconRocket size={16} />}
              >
                <TypeAnimation
                  sequence={[
                    '275 projetos buscando músicos e staff'
                  ]}
                  speed={20}
                  wrapper="span"
                  cursor={false}
                  repeat={false}
                />
              </Badge>
            </Center>
            <Title
              mt={12}
              mb={7}
              ta='center'
              order={1}
              size={isMobile ? 34 : 46}
              px={isMobile ? 26 : 0}
            >
              Encontre gigs. Toque mais
            </Title>
            <Text
              mb={14}
              fw={300}
              size={isMobile ? 'sm' : 'lg'}
              px={isMobile ? 26 : 0}
              ta='center'
            >
              Feito pra quem vive de música. <nobr>Conecte-se</nobr> com projetos que estão contratando
            </Text>
            <Flex
              gap={14}
              justify='center'
              align='center'
              direction={isMobile ? 'column' : 'row'}
              mt={isMobile ? 30 : 26}
            >
              <Flex align='center' gap={10}>
                <Text>Sou</Text>
                <NativeSelect
                  size='md'
                  onChange={(e) => setSelectedRole(e.currentTarget.value)}
                  value={selectedRole}
                >
                  {loading ? (
                    <option value=''>Carregando...</option>
                  ) : (
                    <>
                      <option value=''>Selecione</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.description_ptbr}</option>
                      ))}
                    </>
                  )}
                </NativeSelect>
              </Flex>
              <Button
                size='md'
                variant='outline'
                color='mublin-color'
                rightSection={<IconSearch size={14} />}
                onClick={() => navigate('/browse/gigs')}
              >Procurar gigs</Button>
            </Flex>
          </Container>
        </BackgroundImage>
      </Box>
      <Container size='md' mt={30}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card h='100%' bg='transparent' withBorder>
              <IconMusicSearch size={26} stroke={1} color='#00f5d4' />
              <Title ff='monospace' order={3} fw={300} my={10}>
                Mais oportunidades para trabalhar com música
              </Title>
              <Text size='sm' c='dimmed'>Acesse oportunidades de shows na sua região em tempo real. Seja para tocar num bar, festival ou evento privado — as chances estão ao seu alcance.</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card h='100%' bg='transparent' withBorder>
              <IconCalendarPlus size={26} stroke={1} color='#00f5d4' />
              <Title ff='monospace' order={3} fw={300} my={10}>
                Acompanhe o trabalho de artistas
              </Title>
              <Text size='sm' c='dimmed'>Esteja sempre atualizado com a carreira de profissionais da música que te inspiram</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card h='100%' bg='transparent' withBorder>
              <IconUserCheck size={26} stroke={1} color='#00f5d4' />
              <Title ff='monospace' order={3} fw={300} my={10}>
                Perfil musical completo
              </Title>
              <Text size='sm' c='dimmed'>Perfil com instrumentos, estilos, experiências e mídias. Contratantes saberão exatamente o que você faz.</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
      <Container mt={36} mb={16}>
        <Title order={3} ta='center'>
          Tem um projeto e está <nobr>procurando por músicos?</nobr>
        </Title>
        <Text size='sm' ta='center' opacity={0.7}>
          Encontre freelancers, subs ou até mesmo <nobr>novos integrantes permanentes</nobr>
        </Text>
        <Center mt={18}>
          <Button 
            variant='light'
            color='mublin-color'
            rightSection={<IconArrowRightDashed />}
            onClick={() => navigate('/login')}
          >
            Anuncie sua vaga
          </Button>
        </Center>
      </Container>
      <Box 
        bg='black'
        py={26}
        mt={40}
      >
        <Container size='lg'>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Text ff='monospace' c='dimmed' size='sm' opacity={0.9}>
                © 2026 Mublin
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Flex align='center' justify='flex-end' gap={4}>
                <IconBrandInstagram size={20} stroke={1} color='#959595ff' />
                <Text 
                  ff='monospace' 
                  c='dimmed' 
                  size='sm' 
                  opacity={0.9} 
                  component='a' 
                  href='https://instagram.com/mublin'
                  target='_blank'
                >
                  Instagram
                </Text>
              </Flex>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  )
};

export default Landing;