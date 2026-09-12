document.addEventListener('DOMContentLoaded', () => {
  const calcModeLw = document.getElementById('calcModeLw');
  const calcModeDirect = document.getElementById('calcModeDirect');
  const lwInputs = document.getElementById('lwInputs');
  const directInput = document.getElementById('directInput');

  const inputLength = document.getElementById('calcLength');
  const inputWidth = document.getElementById('calcWidth');
  const inputDirectArea = document.getElementById('calcDirectArea');

  const resBaseArea = document.getElementById('resBaseArea');
  const resTotalArea = document.getElementById('resTotalArea');
  const resRolls10 = document.getElementById('resRolls10');
  const resRolls20 = document.getElementById('resRolls20');
  const resRolls30 = document.getElementById('resRolls30');
  const resRolls40 = document.getElementById('resRolls40');
  const calcWaBtn = document.getElementById('calcWaBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  let currentMode = 'lw';

  if (calcModeLw && calcModeDirect) {
    calcModeLw.addEventListener('click', () => {
      currentMode = 'lw';
      calcModeLw.classList.add('active');
      calcModeDirect.classList.remove('active');
      lwInputs.style.display = 'grid';
      directInput.style.display = 'none';
      recalc();
    });

    calcModeDirect.addEventListener('click', () => {
      currentMode = 'direct';
      calcModeDirect.classList.add('active');
      calcModeLw.classList.remove('active');
      lwInputs.style.display = 'none';
      directInput.style.display = 'block';
      recalc();
    });
  }

  // Preset Buttons Handling
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseFloat(btn.getAttribute('data-preset'));

      if (currentMode === 'lw') {
        // Approximate square dimensions
        const side = Math.round(Math.sqrt(val));
        const otherSide = Math.round(val / side);
        if (inputLength) inputLength.value = side;
        if (inputWidth) inputWidth.value = otherSide;
      } else {
        if (inputDirectArea) inputDirectArea.value = val;
      }
      recalc();
    });
  });

  function recalc() {
    let baseArea = 0;
    if (currentMode === 'lw') {
      const l = parseFloat(inputLength?.value) || 0;
      const w = parseFloat(inputWidth?.value) || 0;
      baseArea = l * w;
    } else {
      baseArea = parseFloat(inputDirectArea?.value) || 0;
    }

    const totalWithBuffer = Math.ceil(baseArea * 1.10);

    if (resBaseArea) resBaseArea.textContent = baseArea > 0 ? baseArea : '0';
    if (resTotalArea) resTotalArea.textContent = totalWithBuffer > 0 ? totalWithBuffer : '0';

    if (resRolls10) resRolls10.textContent = totalWithBuffer > 0 ? Math.ceil(totalWithBuffer / 10) : '0';
    if (resRolls20) resRolls20.textContent = totalWithBuffer > 0 ? Math.ceil(totalWithBuffer / 20) : '0';
    if (resRolls30) resRolls30.textContent = totalWithBuffer > 0 ? Math.ceil(totalWithBuffer / 30) : '0';
    if (resRolls40) resRolls40.textContent = totalWithBuffer > 0 ? Math.ceil(totalWithBuffer / 40) : '0';

    if (calcWaBtn) {
      if (baseArea > 0) {
        const text = encodeURIComponent(
          `Hi Prashant Nursery, I used your Turf Calculator.\n` +
          `Lawn Area: ${baseArea} sq ft\n` +
          `Recommended Order with Buffer: ${totalWithBuffer} sq ft (~${Math.ceil(totalWithBuffer / 20)} rolls of 20 sq ft).\n` +
          `Please share your best direct farm rate and delivery estimate.`
        );
        calcWaBtn.href = `https://wa.me/917398869340?text=${text}`;
      } else {
        calcWaBtn.href = `https://wa.me/917398869340?text=Hi%20Prashant%20Nursery%2C%20I%20need%20a%20price%20quote%20for%20natural%20grass%20turf`;
      }
    }
  }

  if (inputLength) inputLength.addEventListener('input', recalc);
  if (inputWidth) inputWidth.addEventListener('input', recalc);
  if (inputDirectArea) inputDirectArea.addEventListener('input', recalc);

  recalc();
});
