# Ronrom em Casa

Site mobile-first para um serviço de cat sitting domiciliar na Asa Norte, Brasília (DF).

**Estado:** projeto em desenvolvimento. O formulário prepara uma solicitação para WhatsApp. A integração de cobrança começa com rascunhos manuais no ambiente de teste.

## Visão

Uma página narrativa e acessível em que o mascote Salem explora uma parede gatificada, apresentando os cuidadores, cuidados, planos, mimos e uma solicitação de atendimento via WhatsApp.

## Serviços propostos (por visita)

| Plano | Duração | Preço-base |
|---|---:|---:|
| Ronrom Essencial | 30 minutos | R$ 40 |
| Ronrom Companhia | 60 minutos | R$ 60 |
| Ronrom Dengo Premium | 90 minutos | R$ 80 |

**Adicionais propostos:** medicação oral/tópica simples (+R$ 10 por gato e visita, após avaliação), corte de unhas (+R$ 15 por gato e sessão, somente se bem tolerado), mimo especial fornecido (+R$ 8 quando não incluso). Escovação de pelos está prevista nos planos de 60 e 90 minutos. Valores e políticas ainda estão sujeitos a validação.

## Princípios

- Bem-estar felino sempre primeiro. Jamais forçar brincadeiras, escovação ou corte de unhas.
- Medicações somente com instrução veterinária prévia, avaliação de segurança e plano de contingência.
- Nenhum pedido vira reserva sem confirmação humana.
- Não expor publicamente fotos, contatos, endereço, agenda ou dados de clientes sem autorização.
- Site leve, responsivo e acessível, incluindo preferência por movimento reduzido.

## Roadmap

1. Protótipo interativo e comparação de planos.
2. Revisão editorial e aprovação dos materiais visuais da família.
3. Configuração de WhatsApp Business compartilhado e fluxo de solicitações.
4. Agenda privada e automação de solicitações pendentes.
5. Publicação após validar políticas, privacidade e informações de contato.
6. Cobranças no Stripe e conciliação via webhook. Veja [Stripe na Ronrom](docs/STRIPE.md) para testar a primeira etapa.
