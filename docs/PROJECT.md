# Ronrom em Casa — decisões e próximos passos

## Direção aprovada
- Serviço de visitas domiciliares para gatos, inicialmente na Asa Norte, Brasília.
- Atendimento por casal; apresentação com destaque da cuidadora principal quando nomes/fotos autorizados.
- Marca: **Ronrom em Casa**. Assinatura: **O cantinho é dele. O carinho é nosso.**
- Mascote principal: Salem (gato preto, olhos amarelos). Personagens secundários: Artemis, Lisa e Caju.
- UX: página única mobile-first; parede gatificada 2,5D com movimento sincronizado à rolagem; conteúdo e ações sempre acessíveis, com redução de movimento.
- Stack: Vite + React + TypeScript + GSAP, hospedagem estática a decidir.

## Valores preliminares
- Essencial: 30 min / R$ 40; água, comida, areia, bem-estar, atualização.
- Companhia: 60 min / R$ 60; inclui tudo do Essencial, escovação opcional e mais brincadeiras, vídeo.
- Dengo Premium: 90 min / R$ 80; inclui tudo do Companhia, enriquecimento mais longo, um mimo e relato detalhado.
- Medicação simples: + R$ 10 por gato e visita; sujeita a avaliação e prescrição/instruções veterinárias.
- Corte de unhas: + R$ 15 por gato e sessão, sem forçar.
- Mimo fornecido: + R$ 8 por visita; um mimo incluso no Premium.
- Políticas de multigatos, feriados, cancelamento, pagamentos e deslocamento ainda **não definidas**.

## Privacidade e segurança
- Não publicar dados pessoais, telefones reais, fotos dos cuidadores, fotos dos clientes, endereços nem chaves neste repositório público sem aprovação.
- No protótipo, formulário funciona localmente e gera um texto para WhatsApp; não faz gravação, envio de e-mail ou reservas automáticas.
- Nunca registrar dados de saúde dos gatos no URL ou em analytics. Se houver coleta persistente, implementar aviso de privacidade, controle de acesso, retenção e descarte (LGPD).
- Medicamentos: nenhuma aplicação invasiva; avaliar limites e plano com o veterinário. Recusa ou risco requer contato imediato com tutor e contingência.

## Integrações previstas
1. Configurar WhatsApp Business exclusivo e compartilhado em aparelhos vinculados, com número armazenado como variável de ambiente.
2. Definir fluxo de solicitações: formulário autorizado -> registro privado -> pedido pendente na agenda -> confirmação humana.
3. Google Agenda compartilhado e privado, podendo ser alimentado por Apps Script depois de definir datas e armazenamento.
4. Stripe ou outro meio de pagamento somente após validação de fluxo e custos.

## Critérios para lançar
- [ ] Nome e domínio conferidos.
- [ ] Aprovação da marca e das imagens.
- [ ] Revisão e aceite das regras de serviço, política de privacidade e preço.
- [ ] Número comercial configurado.
- [ ] Testes mobile, teclado, leitor de tela, movimento reduzido e conexões lentas.
- [ ] Verificação de fluxo de pedido, agenda, cancelamentos e emergências.
