# Stripe na Ronrom em Casa

Use uma fatura por reserva, em reais, com uma linha para cada serviço. No pagamento antecipado, o gatilho é a confirmação da reserva e a fatura usa os serviços aprovados no orçamento. No pós-pago, o gatilho é a conclusão da última visita e a fatura usa os serviços prestados. O campo de vencimento registra o prazo combinado com o cliente.

## Testar o primeiro rascunho

1. Use Node.js 22.18 ou posterior e rode `npm install`.
2. No painel Stripe, selecione a conta **Ronrom em Casa** em modo de teste e cadastre um cliente fictício. Copie o ID `cus_…` do cliente e o ID `acct_…` da conta.
3. Copie `.env.example` para `.env.local` e configure `STRIPE_ACCOUNT_ID` e `STRIPE_SECRET_KEY` localmente. Pode usar a chave secreta de teste da Ronrom. Para uma chave restrita, dê leitura da conta e acesso de escrita às faturas e seus itens, conforme as permissões disponíveis no painel. O script confirma o ID e o país da conta antes de escrever. Mantenha as chaves fora do Git e de variáveis `VITE_`.

Salve este exemplo em um arquivo local fora do repositório, como `/tmp/ronrom-reserva-teste.json`. Substitua `cus_Exemplo` pelo ID do cliente fictício.

```json
{
  "id": "ronrom-teste-001",
  "stripeCustomerId": "cus_Exemplo",
  "paymentMethod": "stripe",
  "timing": "advance",
  "status": "confirmed",
  "daysUntilDue": 3,
  "approved": {
    "plan": "companhia",
    "visits": 2,
    "cats": 1,
    "medicationCatVisits": 2,
    "nailTrimCatSessions": 1,
    "treatVisits": 2
  }
}
```

```sh
npm run stripe:draft -- /tmp/ronrom-reserva-teste.json
npm run stripe:draft -- /tmp/ronrom-reserva-teste.json --write
```

O primeiro comando mostra a prévia sem usar a rede. O segundo salva **R$ 171,00** no painel de teste como rascunho, com avanço automático e Stripe Tax desativados. Execute novamente com a mesma reserva e confira que o ID retornado continua igual. Se o orçamento ou o cliente já vinculado mudar, revise o rascunho no painel antes de seguir.

Para testar o pós-pago, use outro ID de reserva, `"timing": "after"`, `"status": "completed"` e coloque as quantidades efetivamente cobradas em `performed`. Os planos aceitos são `essencial`, `companhia` e `premium`. No Premium, informe `treatVisits: 0`, pois o mimo está incluído. Para vários gatos, inclua o `multiCatSupplementCents` acordado, inclusive se for zero. Reserve um ID interno estável por reserva e guarde o ID de fatura retornado no controle privado.

## Ligar às reservas e liberar pagamentos

1. Faça os gatilhos de confirmação e de última visita concluída partirem do controle privado, com dados e preços do servidor. Persista o ID da fatura e o orçamento aprovado na reserva para retomar falhas e dispensar a busca de faturas do teste. O pedido público via WhatsApp ainda é uma solicitação.
2. Quando a emissão for liberada, use a página hospedada da própria fatura após finalizá-la. Confirme no painel da Ronrom quais meios de pagamento estão habilitados. Teste cartão e, se disponível, boleto, inclusive pagamento pendente e confirmação tardia. Um Checkout separado criaria outra cobrança para o mesmo pedido.
3. Receba eventos assinados da Stripe em um endpoint de servidor. Valide a assinatura sobre o corpo original, use o ID do evento para deduplicar e atualize a reserva pelo ID da fatura. Use `invoice.paid` para confirmar que a fatura está quitada e consulte o estado atual se os eventos chegarem fora de ordem. Ative lembretes só após testar o fluxo de envio.
4. Se o cliente escolher Pix direto, a Lela confere o saldo no Nubank e registra **Pix recebido** no controle privado. Se uma fatura Stripe já estiver aberta, registre o pagamento externo nela após confirmar o crédito e verificar se já houve pagamento por cartão ou boleto. Assim, o cliente tem uma única pendência.

Referências da Stripe:
- [Criar uma fatura](https://docs.stripe.com/api/invoices/create)
- [Página hospedada da fatura](https://docs.stripe.com/invoicing/hosted-invoice-page)
- [Boleto e disponibilidade](https://docs.stripe.com/payments/boleto)
- [Chaves de API](https://docs.stripe.com/keys)
- [Webhooks](https://docs.stripe.com/webhooks)
