export type PlanId = 'essencial' | 'companhia' | 'premium';
export type ExtraId = 'medication' | 'nails' | 'treat';

export const plans = [
  {
    id: 'essencial' as const,
    label: 'Ronrom Essencial',
    time: 30,
    price: 40,
    summary: 'O básico bem cuidado, com carinho e atenção.',
    detail: 'Alimentação, água, areia, verificação do bem-estar e notícias pelo WhatsApp.',
  },
  {
    id: 'companhia' as const,
    label: 'Ronrom Companhia',
    time: 60,
    price: 60,
    summary: 'Mais tempo para brincar e fazer companhia.',
    detail: 'Tudo do Essencial, mais brincadeiras, escovação quando aceita e vídeo curto.',
  },
  {
    id: 'premium' as const,
    label: 'Ronrom Dengo Premium',
    time: 90,
    price: 80,
    summary: 'Tempo extra para um cuidado ainda mais especial.',
    detail: 'Tudo do Companhia, mais enriquecimento ambiental, mimo aprovado e relato detalhado.',
  },
];

export type EstimateInput = {
  plan: PlanId;
  visits: number;
  cats: number;
  medication: boolean;
  nails: boolean;
  treat: boolean;
};

export function estimate(input: EstimateInput) {
  const plan = plans.find((item) => item.id === input.plan)!;
  const visits = Math.max(1, Math.floor(input.visits) || 1);
  const cats = Math.max(1, Math.floor(input.cats) || 1);
  const base = plan.price * visits;
  const medication = input.medication ? 10 * cats * visits : 0;
  const nails = input.nails ? 15 * cats : 0; // uma sessão por gato no período solicitado
  const treat = input.treat && input.plan !== 'premium' ? 8 * visits : 0;
  return {
    base,
    medication,
    nails,
    treat,
    total: base + medication + nails + treat,
    needsQuote: cats > 1, // tabela-base corresponde a um gato: acréscimos não definidos
    visits,
    cats,
    plan,
  };
}

export const brl = (amount: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(amount);
