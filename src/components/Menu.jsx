import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { NavLink } from '@mantine/core';
import { IconHome2, IconUser, IconSearch, IconLogin, IconPaperclip } from '@tabler/icons-react';
import { GuestCTA } from './GuestCTA';

export function Menu() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuta mudanças (Login/Logout) para atualizar o menu em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <NavLink
        href="/"
        label="Início"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
        variant="subtle"
        active
      />

      <NavLink
        href="/busca"
        label="Buscar"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        variant="subtle"
      />

      {/* ITENS PROTEGIDOS - Só aparecem se houver session */}
      {session ? (
        <>
          <NavLink
            href="/meu-perfil"
            label="Meu perfil"
            leftSection={<IconUser size={16} stroke={1.5} />}
            variant="subtle"
          />
          <NavLink
            href="/applications"
            label="Minhas candidaturas"
            leftSection={<IconPaperclip size={16} stroke={1.5} />}
            variant="subtle"
          />
        </>
      ) : (
        <>
          <NavLink
            href="/login"
            label="Entrar / Cadastrar"
            leftSection={<IconLogin size={16} stroke={1.5} />}
            variant="subtle"
          />
          <GuestCTA />
        </>
      )}
    </>
  );
}
