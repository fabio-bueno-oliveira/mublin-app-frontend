import { useState, useEffect } from 'react';
import { fetchProjectRoles } from '../services/rolesService';

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectRoles()
      .then(data => setRoles(data))
      .catch(error => console.error('Erro ao buscar roles:', error))
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}
