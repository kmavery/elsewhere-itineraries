const selectionSchema = '2';
if (localStorage.getItem('abby-cr-selection-schema') !== selectionSchema) {
  Object.keys(localStorage)
    .filter(key => key.startsWith('abby-cr-'))
    .forEach(key => localStorage.removeItem(key));
  localStorage.setItem('abby-cr-selection-schema', selectionSchema);
}

const days = [...document.querySelectorAll('.day')];
days.forEach(day => {
  const button = day.querySelector('.day-toggle');
  button.addEventListener('click', () => {
    const open = day.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

const expand = document.getElementById('expandAll');
let expanded = false;
expand.addEventListener('click', () => {
  expanded = !expanded;
  days.forEach(day => {
    day.classList.toggle('open', expanded);
    day.querySelector('.day-toggle').setAttribute('aria-expanded', String(expanded));
  });
  expand.textContent = expanded ? 'Collapse all days' : 'Expand all days';
});

document.querySelectorAll('.copy').forEach(button => {
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    const toast = document.querySelector('.toast');
    toast.textContent = 'Confirmation number copied';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.experience').forEach(card => {
      card.classList.toggle('hide', filter !== 'all' && card.dataset.kind !== filter);
    });
  });
});

document.querySelectorAll('[data-check]').forEach(box => {
  const key = 'abby-cr-' + box.dataset.check;
  box.checked = localStorage.getItem(key) === 'yes';
  box.addEventListener('change', () => localStorage.setItem(key, box.checked ? 'yes' : 'no'));
});

const selectionSlug = value => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const setDecisionComplete = (key, complete) => {
  const box = document.querySelector(`[data-check="${key}"]`);
  if (!box) return;
  box.checked = complete;
  localStorage.setItem('abby-cr-' + key, complete ? 'yes' : 'no');
};

const transferDecisionKeys = ['transfer-sjo', 'transfer-guanacaste', 'transfer-lir'];

document.querySelectorAll('.transfer').forEach((transfer, transferIndex) => {
  const leg = transfer.querySelector('h3').textContent.trim();
  const storageKey = `abby-cr-transport-${transferIndex}`;
  const savedValue = localStorage.getItem(storageKey);

  transfer.querySelectorAll('.quote').forEach((quote, quoteIndex) => {
    const provider = quote.querySelector('.quote-head span:first-child').textContent.trim();
    const price = quote.querySelector('.quote-price').textContent.trim();
    const value = `${provider} — ${price}`;
    const label = document.createElement('label');
    label.className = 'quote-choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `transport-${transferIndex}`;
    input.value = value;
    input.dataset.tripLeg = leg;
    input.dataset.transportChoice = 'true';
    input.id = `transport-${transferIndex}-${quoteIndex}`;
    input.checked = savedValue === value;
    label.append(input, document.createTextNode('Select this option'));
    quote.append(label);

    input.addEventListener('change', () => {
      if (!input.checked) return;
      localStorage.setItem(storageKey, value);
      setDecisionComplete(transferDecisionKeys[transferIndex], true);
      updateSelectionEmail();
    });
  });

  if (savedValue) setDecisionComplete(transferDecisionKeys[transferIndex], true);
});

const excursionInputs = [];

const registerExcursionInput = (input, region, value) => {
  const storageKey = 'abby-cr-interest-' + selectionSlug(`${region}-${value}`);
  input.dataset.excursion = value;
  input.dataset.region = region;
  input.checked = localStorage.getItem(storageKey) === 'yes';
  excursionInputs.push(input);
  input.addEventListener('change', () => {
    localStorage.setItem(storageKey, input.checked ? 'yes' : 'no');
    updateExcursionDecision(region);
    updateSelectionEmail();
  });
};

const updateExcursionDecision = region => {
  const hasInterest = excursionInputs.some(input => input.dataset.region === region && input.checked);
  setDecisionComplete(region === 'Arenal' ? 'arenal-choice' : 'guanacaste-choice', hasInterest);
};

document.querySelectorAll('.experience[data-kind="paid"]:not(.wide)').forEach((card, index) => {
  const region = card.closest('[aria-labelledby="tabacon-experiences"]') ? 'Arenal' : 'Guanacaste';
  const title = card.querySelector('h3').textContent.trim();
  const detail = card.querySelector('.kind').textContent.trim();
  const value = `${title} (${detail})`;
  const label = document.createElement('label');
  label.className = 'interest-toggle';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `excursion-card-${index}`;
  label.append(input, document.createTextNode("I'm interested in this"));
  const action = card.querySelector('.btn, .hotel-links');
  card.classList.add('selectable');
  card.insertBefore(label, action || null);
  registerExcursionInput(input, region, value);
});

document.querySelectorAll('.experience.wide[data-kind="paid"] .tour-list li').forEach((item, index) => {
  const card = item.closest('.experience');
  const region = card.closest('[aria-labelledby="tabacon-experiences"]') ? 'Arenal' : 'Guanacaste';
  const title = item.querySelector('b')?.textContent.trim() || item.textContent.trim();
  const label = document.createElement('label');
  label.className = 'tour-interest';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `excursion-list-${index}`;
  label.append(input, document.createTextNode('Interested'));
  item.prepend(label);
  registerExcursionInput(input, region, title);
});

const updateSelectionEmail = () => {
  const transfers = [...document.querySelectorAll('[data-transport-choice]:checked')];
  const excursions = excursionInputs.filter(input => input.checked);
  const lines = [
    'Hi Kendall,',
    '',
    'Here are my current selections for the Costa Rica trip.',
    '',
    'TRANSPORTATION'
  ];

  document.querySelectorAll('.transfer').forEach(transfer => {
    const leg = transfer.querySelector('h3').textContent.trim();
    const selected = transfer.querySelector('[data-transport-choice]:checked');
    lines.push(`- ${leg}: ${selected ? selected.value : 'Not selected yet'}`);
  });

  lines.push('', 'EXCURSIONS I’M INTERESTED IN');
  if (excursions.length) {
    ['Arenal', 'Guanacaste'].forEach(region => {
      const regionalChoices = excursions.filter(input => input.dataset.region === region);
      if (!regionalChoices.length) return;
      lines.push(`${region}:`);
      regionalChoices.forEach(input => lines.push(`- ${input.dataset.excursion}`));
    });
  } else {
    lines.push('- None selected yet');
  }

  lines.push(
    '',
    'Please confirm availability, final pricing, pickup details, and cancellation terms before booking.',
    '',
    'Thank you,',
    'Abby'
  );

  const subject = encodeURIComponent("Abby's Costa Rica selections");
  const body = encodeURIComponent(lines.join('\n'));
  document.querySelectorAll('.send-selections').forEach(link => {
    link.href = `mailto:kendall.avery@fora.travel?subject=${subject}&body=${body}`;
  });
};

updateExcursionDecision('Arenal');
updateExcursionDecision('Guanacaste');
updateSelectionEmail();

document.getElementById('clearSelections')?.addEventListener('click', () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith('abby-cr-'))
    .forEach(key => localStorage.removeItem(key));
  localStorage.setItem('abby-cr-selection-schema', selectionSchema);

  document.querySelectorAll('[data-transport-choice], [data-excursion], [data-check]')
    .forEach(input => { input.checked = false; });
  updateExcursionDecision('Arenal');
  updateExcursionDecision('Guanacaste');
  updateSelectionEmail();

  const toast = document.querySelector('.toast');
  toast.textContent = 'All selections cleared';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
});
