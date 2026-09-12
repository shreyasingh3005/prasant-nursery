document.addEventListener('DOMContentLoaded', () => {
  const calcModeLw = document.getElementById('calcModeLw');
  const calcModeDirect = document.getElementById('calcModeDirect');
  const lwInputs = document.getElementById('lwInputs');
  const directInput = document.getElementById('directInput');

  const inputLength = document.getElementById('calcLength');
  const inputWidth = document.getElementById('calcWidth');
  const inputDirectArea = document.getElementById('calcDirectArea');
  const rollSizeSelect = document.getElementById('calcRollSize');

  const resTotalArea = document.getElementById('resTotalArea');
  const resRolls = document.getElementById('resRolls');
  const resBufferArea = document.getElementById('resBufferArea');
  const resEstPrice = document.getElementById('resEstPrice');
  const btnShareEstimate = document.getElementById('btnShareEstimate');

  const BASE_PRICE_PER_SQFT = 18; // In INR (₹)
  let activeMode = 'lw';

  function updateMode(mode) {
    activeMode = mode;
    if (mode === 'lw') {
      calcModeLw?.classList.add('active');
      calcModeDirect?.classList.remove('active');
      if (lwInputs) lwInputs.style.display = 'grid';
      if (directInput) directInput.style.display = 'none';
    } else {
      calcModeLw?.classList.remove('active');
      calcModeDirect?.classList.add('active');
      if (lwInputs) lwInputs.style.display = 'none';
      if (directInput) directInput.style.display = 'block';
    }
    calculateTurf();
  }

  if (calcModeLw && calcModeDirect) {
    calcModeLw.addEventListener('click', () => updateMode('lw'));
    calcModeDirect.addEventListener('click', () => updateMode('direct'));
  }

  function calculateTurf() {
    let rawArea = 0;
    if (activeMode === 'lw') {
      const len = parseFloat(inputLength?.value) || 0;
      const wid = parseFloat(inputWidth?.value) || 0;
      rawArea = len * wid;
    } else {
      rawArea = parseFloat(inputDirectArea?.value) || 0;
    }

    if (rawArea <= 0) {
      if (resTotalArea) resTotalArea.textContent = '0 sq ft';
      if (resBufferArea) resBufferArea.textContent = '0 sq ft';
      if (resRolls) resRolls.textContent = '0 rolls';
      if (resEstPrice) resEstPrice.textContent = '₹0';
      return;
    }

    const bufferArea = Math.ceil(rawArea * 1.10);
    const rollTier = parseInt(rollSizeSelect?.value) || 10;
    const totalRolls = Math.ceil(bufferArea / rollTier);
    const estPrice = bufferArea * BASE_PRICE_PER_SQFT;

    if (resTotalArea) resTotalArea.textContent = `${Math.round(rawArea)} sq ft`;
    if (resBufferArea) resBufferArea.textContent = `${bufferArea} sq ft`;
    if (resRolls) resRolls.textContent = `${totalRolls} rolls (${rollTier} sq ft each)`;
    if (resEstPrice) resEstPrice.textContent = `₹${estPrice.toLocaleString('en-IN')}`;

    if (btnShareEstimate) {
      const msg = encodeURIComponent(
        `Hi Prashant Nursery,\n` +
        `I calculated natural turf requirement for my lawn:\n` +
        `- Net Lawn Area: ${Math.round(rawArea)} sq ft\n` +
        `- With 10% Wastage Buffer: ${bufferArea} sq ft\n` +
        `- Roll Size Tier: ${rollTier} sq ft (~${totalRolls} rolls)\n` +
        `- Estimated Cost: ~₹${estPrice.toLocaleString('en-IN')}\n\n` +
        `Please confirm grass variety availability, delivery quote, and installation.`
      );
      btnShareEstimate.href = `https://wa.me/917398869340?text=${msg}`;
    }
  }

  [inputLength, inputWidth, inputDirectArea, rollSizeSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateTurf);
      input.addEventListener('change', calculateTurf);
    }
  });

  calculateTurf();
});
