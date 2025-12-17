import { Container, Box, Button, Flex,Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import MublinLogo from '../../assets/mublin-logo-w.svg';
import { IconArrowRight } from '@tabler/icons-react';

function TopNavPublic () {
  const navigate = useNavigate();
  let currentPath = window.location.pathname;

  return (
    <Container size='xl'>
      <Flex justify='space-between' gap='xs'>
        <Flex align='center' gap={4} component='a' href='/'>
          <Image 
            w='44' 
            src="https://ik.imagekit.io/mublin/logos/mublin-m-color-transparent.png"
          />
          <Image 
            src={MublinLogo} 
            h={28} 
            w='auto'
            aria-label="Mublin Logo"
          />
        </Flex>
        <Flex gap={12} align='center'>
          {currentPath !== '/login' &&
            <Button 
              variant='light'
              color='mublin-color'
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
          }
          {currentPath !== '/signup' &&
            <Button 
              variant='outline' 
              color='white'
              onClick={() => navigate('/signup')}
              rightSection={<IconArrowRight size={14} />}
            >
              Criar conta
            </Button>
          }
        </Flex>
      </Flex>
    </Container>
  )
};

export default TopNavPublic;