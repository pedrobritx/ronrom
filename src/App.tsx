import { useMemo, useState } from 'react';
import Salem from './Salem';
import { brl, estimate, plans, type PlanId } from './pricing';

const features = [
  { icon: '◒', title: 'Comidinha na hora certa', copy: 'Alimentação conforme a rotina combinada com você.' },
  { icon: '◌', title: 'Água sempre fresquinha', copy: 'Renovamos a água e cuidamos dos recipientes.' },
  { icon: '✧', title: 'Areia limpinha', copy: 'Recolhemos os resíduos e organizamos o cantinho.' },
  { icon: '♡', title: 'Carinho no ritmo dele', copy: 'Brincamos ou fazemos companhia, sempre respeitando os limites.' },
  { icon: '▣', title: 'Notícias pelo WhatsApp', copy: 'Atualizações com fotos e, nos planos maiores, vídeo curto.' },
  { icon: '✦', title: 'Cuidados especiais', copy: 'Podemos avaliar necessidades e medicações previamente.' },
];
const comparison = [
  ['Alimentação, água e areia', true, true, true],
  ['Verificação do bem-estar', true, true, true],
  ['Notícias pelo WhatsApp', true, true, true],
  ['Brincadeiras', 'Breves', 'Mais tempo', 'Variadas'],
  ['Escovação dos pelos', false, true, true],
  ['Enriquecimento ambiental', false, 'Simples', 'Ampliado'],
  ['Vídeo curto', false, true, true],
  ['Mimo fornecido pela equipe', false, false, '1 incluso'],
];

function Shelf({ side = 'right' }: { side?: 'left' | 'right' }) {
  return <div className={'scenery-shelf shelf-' + side} aria-hidden="true"><span /></div>;
}

function App() {
  const [plan, setPlan] = useState<PlanId>('companhia');
  const [compare, setCompare] = useState(false);
  const [medication, setMedication] = useState(false);
  const [nails, setNails] = useState(false);
  const [treat, setTreat] = useState(false);
  const [visits, setVisits] = useState(3);
  const [cats, setCats] = useState(1);
  const [name, setName] = useState('');
  const [catName, setCatName] = useState('');
  const [dates, setDates] = useState('');
  const [quadra, setQuadra] = useState('');
  const [notes, setNotes] = useState('');
  const [copyState, setCopyState] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const quote = useMemo(() => estimate({ plan, visits, cats, medication, nails, treat }), [plan, visits, cats, medication, nails, treat]);
  const phone = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  const validPhone = /^55\d{10,11}$/.test(phone);
  const message = [
    'Olá, Ronrom em Casa! Quero solicitar uma visita (ainda não é reserva confirmada).',
    'Tutor(a): ' + (name.trim() || 'não informado'),
    'Gatinho(s): ' + (catName.trim() || 'não informado') + ' | Quantidade: ' + cats,
    'Plano: ' + quote.plan.label + ' (' + quote.plan.time + ' minutos)',
    'Visitas: ' + quote.visits,
    'Datas/horários pretendidos: ' + (dates.trim() || 'a combinar'),
    'Quadra na Asa Norte: ' + (quadra.trim() || 'a combinar'),
    'Adicionais: ' + ([medication && 'medicação simples', nails && 'corte de unhas (uma sessão)', treat && 'mimo especial'].filter(Boolean).join(', ') || 'nenhum'),
    'Estimativa ' + (quote.needsQuote ? 'parcial (múltiplos gatos; confirmar valor): ' : 'para um gato: ') + brl(quote.total),
    'Observações: ' + (notes.trim() || 'nenhuma'),
    'Aguardo disponibilidade e confirmação do valor final. Obrigado(a)!',
  ].join('\n');

  async function sendInquiry() {
    if (!privacyAccepted) {
      setCopyState('Confirme primeiro que leu o aviso sobre o envio de informações pelo WhatsApp.');
      return;
    }
    if (validPhone) {
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
      setCopyState('O WhatsApp foi aberto. O pedido ainda precisa ser enviado e confirmado por nós.');
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopyState('Resumo copiado! Número comercial ainda não configurado; esta é uma demonstração.');
    } catch {
      setCopyState('Número comercial ainda não configurado. Copie o texto de resumo abaixo.');
    }
  }

  function choosePlan(next: PlanId) {
    setPlan(next);
    document.getElementById('solicitar')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <a href="#inicio" className="brand" aria-label="Ronrom em Casa, início"><span className="brand-spark">✳</span> ronrom <em>em casa.</em></a>
        <nav aria-label="Menu principal">
          <a href="#cuidados">Cuidados</a>
          <a href="#planos">Planos</a>
          <a className="nav-cta" href="#solicitar">Solicitar visita <span aria-hidden="true">↗</span></a>
        </nav>
      </header>
      <main id="conteudo">
        <div id="journey">
          <Salem />
          <section id="inicio" className="scene hero">
            <Shelf side="right" />
            <div className="hero-topline"><span className="dot" /> ATENDIMENTO DOMICILIAR · ASA NORTE, BRASÍLIA</div>
            <div className="hero-content">
              <span className="eyebrow">Bem-vindo ao Ronrom em Casa</span>
              <h1>O cantinho é dele.<br /><em>O carinho é nosso.</em></h1>
              <p>Vai viajar ou passar uns dias fora? Seu gatinho continua no conforto de casa. A gente cuida da rotina, faz companhia e manda notícias para matar a saudade.</p>
              <div className="hero-actions"><a href="#solicitar" className="button button-primary">Planejar uma visita <span>↗</span></a><a href="#sobre" className="text-link">Conheça a gente ↓</a></div>
            </div>
            <div className="hero-note">Role para conhecer a nossa casa <span>↓</span></div>
            <div className="hero-stamp" aria-label="Inspirado por gatos de verdade">feito com<br />ronrom ♡</div>
          </section>

          <section id="sobre" className="scene about">
            <Shelf side="left" />
            <div className="content-card wide-card">
              <span className="eyebrow">01 · A NOSSA TURMA</span>
              <h2>Uma casa cheia de <em>personalidade.</em></h2>
              <p>Somos um casal apaixonado por gatos. Nossa experiência cuidando dos bichinhos de amigos e familiares nos inspirou a levar atenção, carinho e responsabilidade para outros lares na Asa Norte.</p>
              <p>Aqui, ninguém precisa gostar de colo ou de brincar o tempo todo. A gente respeita o jeitinho de cada gato.</p>
              <div className="cat-family" aria-label="Nossos gatinhos">
                {['Salem', 'Artemis', 'Lisa', 'Caju'].map((cat, i) => (
                  <div className="cat-chip" key={cat}><span className={'cat-medallion medallion-' + i}>✦</span><span>{cat}</span></div>
                ))}
              </div>
              <p className="photo-note">Fotos reais e apresentação dos cuidadores serão incluídas com autorização antes da publicação.</p>
            </div>
          </section>

          <section id="cuidados" className="scene care">
            <Shelf side="right" />
            <div className="section-head">
              <span className="eyebrow">02 · O QUE A GENTE FAZ</span>
              <h2>A rotina continua.<br /><em>O carinho também.</em></h2>
              <p>Água, comida, areia e atenção — com cuidado pensado para cada temperamento.</p>
            </div>
            <div className="care-grid">
              {features.map((feature) => <article className="care-tile" key={feature.title}><span className="tile-icon" aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.copy}</p></article>)}
            </div>
          </section>

          <section id="planos" className="scene plans">
            <Shelf side="left" />
            <div className="section-head">
              <span className="eyebrow">03 · UM PLANO PARA CADA GATINHO</span>
              <h2>Mais tempo de visita.<br /><em>Mais tempo de dengo.</em></h2>
              <p>Todos os planos incluem os cuidados essenciais. O que muda é o tempo de companhia e as atividades extras.</p>
            </div>
            <div className="plan-grid">
              {plans.map((item) => <article className={'plan-card ' + (item.id === 'companhia' ? 'featured' : '')} key={item.id}>
                {item.id === 'companhia' && <span className="ribbon">Mais equilibrado</span>}
                <span className="plan-icon" aria-hidden="true">{item.id === 'essencial' ? '⌂' : item.id === 'companhia' ? '♡' : '✦'}</span>
                <p className="plan-time">{item.time} MINUTOS</p>
                <h3>{item.label}</h3>
                <p className="plan-summary">{item.summary}</p>
                <div className="price">{brl(item.price)}<span> / visita</span></div>
                <p className="plan-detail">{item.detail}</p>
                <button type="button" className={'button ' + (item.id === 'companhia' ? 'button-primary' : 'button-outline')} onClick={() => choosePlan(item.id)}>Escolher plano <span>↗</span></button>
              </article>)}
            </div>
            <button type="button" aria-expanded={compare} aria-controls="comparison" className="compare-toggle" onClick={() => setCompare(!compare)}>{compare ? 'Ocultar comparação' : 'Comparar todos os cuidados'} <span aria-hidden="true">{compare ? '−' : '+'}</span></button>
            {compare && <div id="comparison" className="table-wrap" role="region" aria-label="Comparação de planos" tabIndex={0}>
              <table><thead><tr><th scope="col">Cuidados inclusos</th><th scope="col">30 min</th><th scope="col">60 min</th><th scope="col">90 min</th></tr></thead>
                <tbody>{comparison.map((row) => <tr key={String(row[0])}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, index) => <td key={index}>{cell === true ? <span className="check" aria-label="Incluso">✓</span> : cell === false ? <span aria-label="Não incluso">—</span> : String(cell)}</td>)}</tr>)}</tbody></table>
              <p className="table-footnote">Atividades dependem do bem-estar e da aceitação do gato. Nenhum procedimento opcional será forçado.</p>
            </div>}
          </section>

          <section id="mimos" className="scene extras">
            <Shelf side="right" />
            <div className="section-head">
              <span className="eyebrow">04 · UM DENGUINHO A MAIS</span>
              <h2>Pequenos mimos.<br /><em>Grandes ronrons.</em></h2>
              <p>Personalize o atendimento com cuidados adicionais, sempre avaliados antes da confirmação.</p>
            </div>
            <div className="extras-grid">
              <article className="extra-card"><span className="extra-symbol">✚</span><h3>Medicação simples</h3><strong>+ R$ 10</strong><p>Por gato e por visita. Apenas medicação oral ou tópica, com orientação veterinária e avaliação prévia.</p></article>
              <article className="extra-card"><span className="extra-symbol">✂</span><h3>Corte de unhas</h3><strong>+ R$ 15</strong><p>Por gato e por sessão, somente quando o bichinho aceita manuseio tranquilo e seguro.</p></article>
              <article className="extra-card"><span className="extra-symbol">♡</span><h3>Mimo especial</h3><strong>+ R$ 8</strong><p>Petisco ou catnip adequado e autorizado, fornecido por nós. Um mimo já está incluso no Premium.</p></article>
            </div>
            <div className="wellbeing"><span className="wellbeing-symbol">♡</span><div><h3>O carinho respeita os limites.</h3><p>Não forçamos brincadeiras, escovação ou corte de unhas. Se o gato demonstrar medo ou desconforto, interrompemos a atividade. Medicamentos são tratados com atenção especial, mas sem contenção arriscada: se não for possível administrá-los com segurança, avisamos o tutor imediatamente e seguimos o plano combinado.</p></div></div>
          </section>

          <section id="solicitar" className="scene booking">
            <Shelf side="left" />
            <div className="booking-intro">
              <span className="eyebrow">05 · VAMOS COMBINAR?</span>
              <h2>Seu gatinho fica em casa.<br /><em>A gente vai até ele.</em></h2>
              <p>Monte uma estimativa para os cuidados do seu bichinho. A solicitação ainda precisa ser confirmada por nossa equipe.</p>
            </div>
            <div className="booking-grid">
              <form className="booking-form" onSubmit={(event) => { event.preventDefault(); void sendInquiry(); }}>
                <h3>Planeje uma visita</h3>
                <label htmlFor="plan">Plano</label>
                <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value as PlanId)}>{plans.map((p) => <option key={p.id} value={p.id}>{p.label} · {p.time} min</option>)}</select>
                <div className="two-cols"><div><label htmlFor="visits">Visitas</label><input id="visits" type="number" min="1" max="30" value={visits} onChange={(e) => setVisits(Math.min(30,Math.max(1,Number(e.target.value)||1)))} /></div><div><label htmlFor="cats">Gatos</label><input id="cats" type="number" min="1" max="12" value={cats} onChange={(e) => setCats(Math.min(12,Math.max(1,Number(e.target.value)||1)))} /></div></div>
                <fieldset className="checkboxes"><legend>Cuidados adicionais</legend>
                  <label><input type="checkbox" checked={medication} onChange={(e) => setMedication(e.target.checked)} /> Medicação simples (+ R$ 10/gato/visita)</label>
                  <label><input type="checkbox" checked={nails} onChange={(e) => setNails(e.target.checked)} /> Corte de unhas (+ R$ 15/gato/sessão)</label>
                  <label><input type="checkbox" checked={treat} onChange={(e) => setTreat(e.target.checked)} /> Mimo especial {plan === 'premium' ? '(incluso)' : '(+ R$ 8/visita)'}</label>
                </fieldset>
                <div className="two-cols"><div><label htmlFor="name">Seu nome (opcional)</label><input id="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos chamar você?" /></div><div><label htmlFor="catname">Nome do gatinho</label><input id="catname" maxLength={100} value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Ex.: Mingau" /></div></div>
                <label htmlFor="dates">Datas e horários pretendidos</label><input id="dates" maxLength={180} value={dates} onChange={(e) => setDates(e.target.value)} placeholder="Ex.: 12 a 15/12, pela manhã" />
                <label htmlFor="quadra">Quadra na Asa Norte</label><input id="quadra" maxLength={80} value={quadra} onChange={(e) => setQuadra(e.target.value)} placeholder="Ex.: SQN 300 (sem endereço completo)" />
                <label htmlFor="notes">Observações (opcional)</label><textarea id="notes" maxLength={500} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Rotina, necessidades especiais, preferências..." />
                <label className="consent"><input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} /> Entendi que as informações preenchidas serão incluídas numa mensagem de WhatsApp apenas quando eu decidir enviá-la, e que o pedido não confirma uma reserva.</label>
                <button className="button button-primary submit" type="submit">{validPhone ? 'Continuar pelo WhatsApp ↗' : 'Copiar pedido de demonstração ↗'}</button>
                <div role="status" className="form-status">{copyState}</div>
              </form>
              <aside className="estimate">
                <span className="eyebrow">SEU RESUMO</span>
                <h3>Um ronrom feito para você.</h3>
                <div className="estimate-line"><span>{quote.plan.label} · {quote.plan.time} min × {quote.visits}</span><strong>{brl(quote.base)}</strong></div>
                {medication && <div className="estimate-line"><span>Medicação ({quote.cats} gato(s))</span><strong>{brl(quote.medication)}</strong></div>}
                {nails && <div className="estimate-line"><span>Unhas (1 sessão por gato)</span><strong>{brl(quote.nails)}</strong></div>}
                {treat && <div className="estimate-line"><span>Mimo {plan === 'premium' ? '(incluso)' : ''}</span><strong>{brl(quote.treat)}</strong></div>}
                <div className="estimate-total"><span>{quote.needsQuote ? 'Estimativa parcial, a partir de' : 'Valor estimado'}</span><strong>{brl(quote.total)}</strong></div>
                {quote.needsQuote && <p className="estimate-warning">Para mais de um gato, o valor final depende da avaliação dos cuidados e será confirmado antes da reserva.</p>}
                <p>Valores por visita, sujeitos a avaliação, disponibilidade e eventuais condições especiais. O envio não garante a reserva.</p>
                <p className="demo-label">{validPhone ? 'WhatsApp comercial configurado.' : 'Modo demonstração: número de WhatsApp ainda não configurado.'}</p>
                {!validPhone && <details><summary>Prévia da mensagem</summary><textarea readOnly rows={10} value={message} aria-label="Mensagem para copiar" /></details>}
              </aside>
            </div>
          </section>
        </div>
        <section id="faq" className="faq-section">
          <span className="eyebrow">PERGUNTAS FREQUENTES</span><h2>Mais algumas <em>coisinhas.</em></h2>
          <details><summary>Onde vocês atendem?</summary><p>Inicialmente, na Asa Norte, Brasília. Outras regiões exigem consulta prévia.</p></details>
          <details><summary>Como sei que minha visita está confirmada?</summary><p>Enviamos uma confirmação pelo WhatsApp após verificar disponibilidade, condições do serviço e valor final.</p></details>
          <details><summary>Meu gato é tímido. Tudo bem?</summary><p>Claro. Respeitamos o espaço dele e nunca forçamos interações ou procedimentos opcionais.</p></details>
          <details><summary>Vocês podem dar remédio?</summary><p>Avaliamos medicações orais ou tópicas simples mediante orientação veterinária, informações do tutor e condições de administração segura.</p></details>
          <details><summary>Como funciona o acesso ao imóvel?</summary><p>Combinamos previamente um método seguro para chaves ou acesso ao condomínio.</p></details>
        </section>
      </main>
      <footer><div className="footer-brand">ronrom <em>em casa.</em></div><p>O cantinho é dele. O carinho é nosso.</p><span>Cat sitting · Asa Norte, Brasília — DF</span><a href="#inicio">Voltar ao topo ↑</a><small>Protótipo em desenvolvimento. Regras comerciais, contato e privacidade deverão ser aprovados antes da publicação.</small></footer>
    </>
  );
}

export default App;
