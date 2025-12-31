import { Group } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

// Número total de estrelas a serem exibidas
const MAX_STARS = 3;

/**
 * Exibe estrelas preenchidas com base no nível de experiência numérico.
 * 1 = Iniciante, 2 = Intermediário, 3 = Experiente.
 * Estrelas não preenchidas são exibidas esmaecidas.
 * * @param {number} level - O nível de experiência (1, 2 ou 3).
 */
export function ExperienceStars({ level, levelName }) {
  // Garante que o nível seja um número (útil para dados de API) e limita entre 0 e 3
  const activeStars = Math.min(MAX_STARS, Math.max(0, Number(level)));
  
  // Cria um array de 3 elementos para iterar sobre as estrelas
  const starsArray = Array(MAX_STARS).fill(null);

  return (
    <Group gap={2} title={`Nível ${levelName}`}>
      {starsArray.map((_, index) => {
        // A estrela é ativa se o índice (0, 1, 2) for menor que o valor de 'level'
        const isActive = index < activeStars;
        
        return (
          <IconStarFilled
            key={index}
            size={11} 
            style={{
              color: isActive ? 'var(--mantine-color-yellow-6)' : 'var(--mantine-color-gray-6)',
              opacity: isActive ? 1 : 0.3,
            }}
          />
        );
      })}
    </Group>
  );
}