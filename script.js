(() => {
  document.documentElement.classList.add('js-enabled');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const header = $('.site-header');
  const progress = $('#scrollProgress');
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', scrollTop > 18);
    progress.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.count || 0);
      const decimals = Number(node.dataset.decimals || 0);
      const prefix = node.dataset.prefix || '';
      const duration = 1300;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${prefix}${(target * eased).toFixed(decimals)}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(node);
    });
  }, { threshold: 0.65 });
  $$('[data-count]').forEach(node => countObserver.observe(node));

  // These examples are illustrative only — not a live fraud-detection engine.
  const scenarioButtons = $$('.scenario-btn');
  const transactionAvatar = $('#transactionAvatar');
  const transactionName = $('#transactionName');
  const transactionDetail = $('#transactionDetail');
  const transactionAmount = $('#transactionAmount');
  const transactionId = $('#transactionId');
  const analysisList = $('#analysisList');
  const decisionPanel = $('#decisionPanel');
  const decisionTitle = $('#decisionTitle');
  const decisionDescription = $('#decisionDescription');
  const decisionBadge = $('#decisionBadge');
  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  const scenarios = {
    safe: {
      avatar: '✓',
      name: 'Online Purchase',
      detail: 'Expected behavior · Trusted device · Consistent pattern',
      amount: 'EGP 1,250',
      id: 'TXN_8F2A91',
      rows: [
        ['⌁', 'Behavioral fingerprint analysis', 'NORMAL', 'good'],
        ['◇', 'Cryptographic verification (ZKP)', 'VERIFIED', 'good'],
        ['◉', 'Risk score', 'LOW · 08/100', 'good']
      ],
      title: 'Transaction approved',
      description: 'No clear risk indicators were detected in this scenario.',
      badge: 'ALLOW',
      danger: false
    },
    risk: {
      avatar: '!',
      name: 'Unusual Sign-in Attempt',
      detail: 'Repeated requests · New device · Anomalous pattern',
      amount: 'EGP 8,900',
      id: 'TXN_4D91C7',
      rows: [
        ['⌁', 'Behavioral fingerprint analysis', 'ANOMALY', 'bad'],
        ['◇', 'Cryptographic verification (ZKP)', 'FLAGGED', 'bad'],
        ['◉', 'Risk score', 'HIGH · 94/100', 'bad']
      ],
      title: 'Simulated transaction blocked',
      description: 'High-risk indicators were detected in this illustrative scenario.',
      badge: 'BLOCK',
      danger: true
    }
  };
  function renderScenario(key, animate = true) {
    const scenario = scenarios[key];
    scenarioButtons.forEach(button => button.classList.toggle('active', button.dataset.scenario === key));
    analysisList.innerHTML = scenario.rows.map(row => `
      <div class="analysis-row"><span class="analysis-icon">${row[0]}</span><span>${row[1]}</span><b class="analysis-result ${row[3]}">${row[2]}</b></div>
    `).join('');
    transactionAvatar.textContent = scenario.avatar;
    transactionAvatar.style.background = scenario.danger ? 'rgba(251,83,105,.12)' : 'rgba(91,218,161,.10)';
    transactionAvatar.style.color = scenario.danger ? '#ff667b' : '#5bdaa1';
    transactionName.textContent = scenario.name;
    transactionDetail.textContent = scenario.detail;
    transactionAmount.textContent = scenario.amount;
    transactionId.textContent = scenario.id;
    decisionTitle.textContent = scenario.title;
    decisionDescription.textContent = scenario.description;
    decisionBadge.textContent = scenario.badge;
    decisionPanel.classList.toggle('danger', scenario.danger);
    decisionPanel.querySelector('.decision-icon').textContent = scenario.danger ? '!' : '✓';
    if (animate) {
      decisionPanel.animate(
        [{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 360, easing: 'ease-out' }
      );
      showToast(scenario.danger
        ? 'Suspicious scenario detected — illustrative simulation'
        : 'Safe scenario verified — illustrative simulation');
    }
  }
  scenarioButtons.forEach(button => button.addEventListener('click', () => renderScenario(button.dataset.scenario)));
  $('#currentYear').textContent = new Date().getFullYear();

  const navLinks = $$('#mainNav a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  navLinks.forEach(link => {
    const section = $(link.getAttribute('href'));
    if (section) sectionObserver.observe(section);
  });
})();
