/**
 * Prashant Nursery — Core Client-Side Scripts
 * Mobile menu toggle, sticky header, gallery lightbox, form handler,
 * and AUTOMATIC IMAGE SCANNING & INFINITE LOOP TRACK.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  // 2. Sticky Header Elevation
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 3. Lightbox setup
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.innerText = title || 'Prashant Nursery';
      lightbox.classList.add('active');
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // 4. AUTOMATIC IMAGE FOLDER SCANNER & LOOP POPULATOR
  // Scans get-images.php (Hostinger live), falls back to images/images.json or default array
  const loopTrack = document.getElementById('autoImageLoop');
  const dynamicGalleryGrid = document.getElementById('dynamicGalleryGrid');

  const defaultImages = [
    { src: 'images/turf-harvesting-wide.jpg', title: 'Turf Harvesting Wide' },
    { src: 'images/turf-vertical-roll.jpg', title: 'Turf Vertical Roll' },
    { src: 'images/landscape-lawn-1.jpg', title: 'Landscape Lawn Installation' },
    { src: 'images/landscape-lawn-2.jpg', title: 'Manicured Lawn Garden' },
    { src: 'images/turf-field-workers.jpg', title: 'Turf Field Harvesting Workers' }
  ];

  function renderImages(images) {
    if (!Array.isArray(images) || images.length === 0) {
      images = defaultImages;
    }

    // A. Render into Infinite Auto-scrolling Loop (duplicated for seamless 100% infinite scroll)
    if (loopTrack) {
      loopTrack.innerHTML = '';
      const loopSet = images.length < 6 ? images.concat(images, images) : images.concat(images);
      loopSet.forEach(item => {
        const card = document.createElement('div');
        card.className = 'loop-card';
        card.innerHTML = `
          <img src="${item.src}" alt="${item.title}" loading="lazy">
          <div class="loop-badge">${item.title}</div>
        `;
        card.addEventListener('click', () => openLightbox(item.src, item.title));
        loopTrack.appendChild(card);
      });
    }

    // B. Render into Dynamic Gallery Grid
    if (dynamicGalleryGrid) {
      dynamicGalleryGrid.innerHTML = '';
      images.forEach(item => {
        const gItem = document.createElement('div');
        gItem.className = 'gallery-item';
        gItem.setAttribute('data-cat', 'all');
        gItem.innerHTML = `
          <img src="${item.src}" alt="${item.title}" loading="lazy">
          <div class="gallery-overlay">
            <h4>${item.title}</h4>
            <p>Direct from Prashant Nursery farm & projects</p>
          </div>
        `;
        gItem.addEventListener('click', () => openLightbox(item.src, item.title));
        dynamicGalleryGrid.appendChild(gItem);
      });
    }
  }

  // First try get-images.php (Live PHP folder scanner on Hostinger)
  fetch('get-images.php')
    .then(res => res.json())
    .then(images => {
      if (images && images.length > 0) {
        renderImages(images);
      } else {
        fetchFallbackJson();
      }
    })
    .catch(() => {
      fetchFallbackJson();
    });

  function fetchFallbackJson() {
    fetch('images/images.json')
      .then(res => res.json())
      .then(images => {
        renderImages(images);
      })
      .catch(() => {
        renderImages(defaultImages);
      });
  }

  // 5. Existing static gallery items click handling
  document.querySelectorAll('.gallery-item:not(#dynamicGalleryGrid .gallery-item)').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay h4')?.innerText || 'Prashant Nursery';
      if (img) openLightbox(img.src, caption);
    });
  });

  // 6. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');

        document.querySelectorAll('.gallery-item').forEach(item => {
          if (category === 'all' || item.getAttribute('data-cat') === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 7. Contact / Quote Form Handling
  const quoteForm = document.getElementById('enquiryForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const service = document.getElementById('custService').value;
      const area = document.getElementById('custArea')?.value.trim() || 'Not specified';
      const location = document.getElementById('custLocation')?.value.trim() || 'Not specified';
      const message = document.getElementById('custMsg')?.value.trim() || 'No extra notes';

      if (!name || !phone) {
        showToast('Please enter your name and contact number.');
        return;
      }

      const waText = encodeURIComponent(
        `Hi Prashant Nursery,\n` +
        `New Enquiry From: ${name}\n` +
        `Phone: ${phone}\n` +
        `Service Needed: ${service}\n` +
        `Area/Quantity: ${area}\n` +
        `Location: ${location}\n` +
        `Details: ${message}`
      );

      fetch(quoteForm.action || 'send-mail.php', {
        method: 'POST',
        body: new FormData(quoteForm)
      }).then(() => {
        showToast('Enquiry Sent! Opening WhatsApp for instant reply...');
        setTimeout(() => {
          window.open(`https://wa.me/917398869340?text=${waText}`, '_blank');
        }, 1000);
        quoteForm.reset();
      }).catch(() => {
        showToast('Opening WhatsApp with your enquiry details...');
        window.open(`https://wa.me/917398869340?text=${waText}`, '_blank');
      });
    });
  }
});

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
