document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Elevation
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
    }
  });

  // 3. Lightbox Viewer
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, caption) {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || 'Prashant Nursery Farm View';
      lightbox.classList.add('active');
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // 4. AUTOMATIC IMAGE FOLDER SCANNER & LOOP POPULATOR
  // Supports multiple .loop-track elements across any page!
  const loopTracks = document.querySelectorAll('.loop-track, #autoImageLoop');
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

    if (loopTracks.length > 0) {
      loopTracks.forEach(track => {
        track.innerHTML = '';
        // Duplicate array so it seamlessly scrolls infinitely without gaps
        const loopSet = images.length < 6 ? images.concat(images, images) : images.concat(images);
        loopSet.forEach(item => {
          const card = document.createElement('div');
          card.className = 'loop-card';
          card.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="loop-badge">${item.title}</div>
          `;
          card.addEventListener('click', () => openLightbox(item.src, item.title));
          track.appendChild(card);
        });
      });
    }

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

  // 5. Lightbox for static images with [data-zoom]
  document.querySelectorAll('img[data-zoom]').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });

  // 6. Lead Quotation Form Handler
  const quoteForm = document.getElementById('enquiryForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName')?.value || 'Customer';
      const phone = document.getElementById('custPhone')?.value || '';
      const service = document.getElementById('custService')?.value || 'Natural Turf / Grass';
      const area = document.getElementById('custArea')?.value || 'Not specified';
      const location = document.getElementById('custLocation')?.value || 'Not specified';

      const waText = encodeURIComponent(
        `*New Inquiry — Prashant Nursery*\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🌱 *Service:* ${service}\n` +
        `📐 *Area/Quantity:* ${area}\n` +
        `📍 *Location:* ${location}\n` +
        `Please send direct farm pricing and delivery details.`
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

  // 7. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // 8. Timed High-Conversion WhatsApp Prompt Trigger
  const waPrompt = document.getElementById('waLeadPrompt');
  const closeWaPrompt = document.getElementById('closeWaPrompt');
  if (waPrompt) {
    setTimeout(() => {
      if (!sessionStorage.getItem('waPromptDismissed')) {
        waPrompt.style.display = 'block';
      }
    }, 4500);

    if (closeWaPrompt) {
      closeWaPrompt.addEventListener('click', () => {
        waPrompt.style.display = 'none';
        sessionStorage.setItem('waPromptDismissed', 'true');
      });
    }
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
