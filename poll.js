(function () {
  const STORAGE_KEY = 'rgngsur-fan-vote';
  const OPTIONS = [
    { id: 'music', label: 'More Music', desc: 'New tracks, releases, and studio content', icon: '🎵' },
    { id: 'vlogs', label: 'More Vlogs', desc: 'Behind-the-scenes builds, daily life, and raw footage', icon: '🎬' },
    { id: 'merch', label: 'Sell Merch', desc: 'Official gear, apparel, and branded products', icon: '👕' }
  ];

  const pollOptions = document.getElementById('pollOptions');
  const pollTotal = document.getElementById('pollTotal');
  const pollStatus = document.getElementById('pollStatus');
  const pollResults = document.getElementById('pollResults');

  if (!pollOptions) return;

  let counts = { music: 0, vlogs: 0, merch: 0, total: 0 };
  let votedChoice = localStorage.getItem(STORAGE_KEY);
  const apiUrl = window.POLL_API_URL;

  function hasVoted() {
    return Boolean(votedChoice || localStorage.getItem(STORAGE_KEY));
  }

  function getVotedChoice() {
    return votedChoice || localStorage.getItem(STORAGE_KEY);
  }

  function renderOptions() {
    const currentVote = getVotedChoice();
    pollOptions.innerHTML = OPTIONS.map(opt => {
      const count = counts[opt.id] || 0;
      const pct = counts.total > 0 ? Math.round((count / counts.total) * 100) : 0;
      const voted = currentVote === opt.id;
      const disabled = hasVoted() || !apiUrl;

      return `
        <button
          class="poll-option${voted ? ' voted' : ''}${disabled && !voted ? ' disabled' : ''}"
          data-choice="${opt.id}"
          type="button"
          ${disabled ? 'disabled' : ''}
          aria-pressed="${voted}"
        >
          <span class="poll-option-icon" aria-hidden="true">${opt.icon}</span>
          <span class="poll-option-text">
            <span class="poll-option-label">${opt.label}</span>
            <span class="poll-option-desc">${opt.desc}</span>
          </span>
          ${hasVoted() ? `<span class="poll-option-pct">${pct}%</span>` : ''}
        </button>
      `;
    }).join('');

    if (hasVoted()) renderBars();
    bindVoteButtons();
  }

  function renderBars() {
    pollResults.innerHTML = OPTIONS.map(opt => {
      const count = counts[opt.id] || 0;
      const pct = counts.total > 0 ? Math.round((count / counts.total) * 100) : 0;
      return `
        <div class="poll-bar-row">
          <div class="poll-bar-header">
            <span>${opt.icon} ${opt.label}</span>
            <span>${count.toLocaleString()} · ${pct}%</span>
          </div>
          <div class="poll-bar-track">
            <div class="poll-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
    pollResults.hidden = false;
  }

  function setStatus(message, type) {
    if (!pollStatus) return;
    pollStatus.textContent = message;
    pollStatus.className = 'poll-status' + (type ? ` poll-status--${type}` : '');
  }

  async function fetchCounts(voteChoice) {
    if (!apiUrl) return null;
    let url = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
    if (voteChoice) {
      url += '&action=vote&choice=' + encodeURIComponent(voteChoice);
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Poll request failed');
    return res.json();
  }

  async function loadPoll(voteChoice) {
    if (!apiUrl) {
      setStatus('Fan voting is almost ready — one quick backend setup needed to start counting votes live.', 'pending');
      renderOptions();
      return;
    }

    try {
      setStatus(voteChoice ? 'Recording your vote…' : 'Loading results…', 'loading');
      const data = await fetchCounts(voteChoice);
      if (data.error) throw new Error(data.error);
      counts = data;
      if (pollTotal) pollTotal.textContent = counts.total.toLocaleString();

      if (voteChoice) {
        localStorage.setItem(STORAGE_KEY, voteChoice);
        votedChoice = voteChoice;
        setStatus('Thanks for voting! Your pick has been counted.', 'success');
      } else if (hasVoted()) {
        setStatus('You already voted. Here are the latest results.', 'success');
      } else {
        setStatus('Pick what you want to see next from Rg Ng Sur.', 'idle');
      }

      renderOptions();
    } catch (err) {
      setStatus('Could not load the poll right now. Please try again later.', 'error');
      renderOptions();
    }
  }

  function bindVoteButtons() {
    pollOptions.querySelectorAll('.poll-option:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        if (!choice || hasVoted()) return;
        loadPoll(choice);
      });
    });
  }

  loadPoll();
})();