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

const revealLinkedDrawer = () => {
  if (!location.hash) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  const drawer = target?.closest('details.excursion-drawer');
  if (drawer) drawer.open = true;
};

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => requestAnimationFrame(revealLinkedDrawer));
});
window.addEventListener('hashchange', revealLinkedDrawer);
revealLinkedDrawer();
