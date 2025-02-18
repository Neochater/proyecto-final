document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  function updateActiveSection() {
    const currentPos = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (currentPos >= sectionTop && currentPos < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Special case for hero section when at top of page
    if (currentPos < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('active');
        }
      });
    }
  }

  // Update active section on scroll
  window.addEventListener('scroll', updateActiveSection);
  
  // Update active section on page load
  updateActiveSection();

  // Initialize cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCount();

  // Cart button click handler
  const cartButton = document.getElementById('cart-button');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.querySelector('.close-cart');
  const authModal = document.getElementById('auth-modal');

  if (cartButton && cartModal && closeCart) {
    cartButton.addEventListener('click', () => {
      cartModal.classList.add('show');
      renderCart();
    });

    closeCart.addEventListener('click', () => {
      cartModal.classList.remove('show');
    });

    // Close cart when clicking outside
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove('show');
      }
    });
  }

  // Add to cart button handler
  document.querySelectorAll('.primary-btn').forEach(button => {
    if (button.textContent.includes('Añadir al Carrito') || button.textContent.includes('Reservar Entrada') || button.textContent.includes('Registrarse')) {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.game-card, .console-card');
        if (card) {
          const title = card.querySelector('h3').textContent;
          const priceEl = card.querySelector('p, .console-price');
          const imgEl = card.querySelector('.game-image, .console-image');
          const imgStyle = imgEl ? imgEl.getAttribute('style') : '';
          const bgImage = imgStyle ? imgStyle.match(/url\(['"]?(.*?)['"]?\)/) : null;
          const imgUrl = bgImage ? bgImage[1] : '';
          
          if (priceEl) {
            let price = priceEl.textContent.trim();
            // Handle cases where price is inside .console-price
            if (price.includes('$')) {
              price = price.split('$').pop().trim();
            }
            if (price.toLowerCase() === 'free') {
              price = '0';
            }
            price = parseFloat(price);
            
            addToCart({
              id: title.toLowerCase().replace(/\s+/g, '-'),
              title: title,
              price: price,
              quantity: 1,
              image: imgUrl
            });
          }
        }
      });
    }
  });

  // Checkout button handler
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!currentUser) {
        if (authModal) {
          authModal.classList.add('show');
        }
        alert('Por favor, inicia sesión para completar tu compra');
        return;
      }

      if (currentUser.type === 'guest') {
        alert('Necesitas una cuenta verificada para realizar compras. Por favor, regístrate.');
        return;
      }

      if (!currentUser.verified) {
        alert('Tu cuenta necesita ser verificada para realizar compras. Por favor, verifica tu email.');
        return;
      }

      if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }

      alert('¡Gracias por tu compra! Total: $' + calculateTotal());
      cart = [];
      saveCart();
      updateCartCount();
      renderCart();
    });
  }

  // Pagination for Featured Games
  const gamesPerPage = 8;
  let currentPage = 1;
  const totalPages = 3;
  
  const gameCards = [
    {
      image: './JuegosDestacados/1.webp',
      title: 'Cyber Revolution',
      price: 59.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/2.jpg',
      title: 'Space Odyssey',
      price: 49.99,
      platforms: ['PS5', 'PC']
    },
    {
      image: './JuegosDestacados/3.webp',
      title: 'Dragon Quest XII',
      price: 69.99,
      platforms: ['PS5', 'Switch']
    },
    {
      image: './JuegosDestacados/4.jpg',
      title: 'Stellar Impact',
      price: 54.99,
      platforms: ['PC', 'Xbox Series X']
    },
    {
      image: './JuegosDestacados/5.jpg',
      title: 'Neon Warriors',
      price: 39.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/6.avif',
      title: 'Echo\'s Legacy',
      price: 64.99,
      platforms: ['PS5', 'PC']
    },
    {
      image: './JuegosDestacados/7.jpg',
      title: 'Mystic Legends',
      price: 45.99,
      platforms: ['Switch', 'PC']
    },
    {
      image: './JuegosDestacados/8.jpg',
      title: 'Urban Warfare',
      price: 59.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    // Page 2
    {
      image: './JuegosDestacados/9.webp',
      title: 'Dark Souls IV',
      price: 69.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/10.webp',
      title: 'Final Fantasy XVII',
      price: 59.99,
      platforms: ['PS5', 'PC']
    },
    {
      image: './JuegosDestacados/11.jpg',
      title: 'The Elder Scrolls VI',
      price: 69.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/12.jpg',
      title: 'God of War: Ragnarök II',
      price: 64.99,
      platforms: ['PS5']
    },
    {
      image: './JuegosDestacados/13.avif',
      title: 'Horizon: New Dawn',
      price: 59.99,
      platforms: ['PS5', 'PC']
    },
    {
      image: './JuegosDestacados/14.webp',
      title: 'Red Dead Redemption III',
      price: 69.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/15.jpg',
      title: 'The Last of Us Part III',
      price: 69.99,
      platforms: ['PS5']
    },
    {
      image: './JuegosDestacados/16.jpg',
      title: 'Cyberpunk 2078',
      price: 64.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    // Page 3
    {
      image: './JuegosDestacados/17.webp',
      title: 'Elden Ring II',
      price: 69.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/18.webp',
      title: 'Metal Gear Solid VI',
      price: 59.99,
      platforms: ['PS5', 'PC']
    },
    {
      image: './JuegosDestacados/19.jpg',
      title: 'Resident Evil 9',
      price: 64.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/20.jpg',
      title: 'Mass Effect 5',
      price: 69.99,
      platforms: ['PS5', 'Xbox Series X', 'PC']
    },
    {
      image: './JuegosDestacados/21.jpg',
      title: 'Death Stranding 2',
      price: 59.99,
      platforms: ['PS5']
    },
    {
      image: './JuegosDestacados/22.jpg',
      title: 'Ghost of Tsushima II',
      price: 64.99,
      platforms: ['PS5']
    },
    {
      image: './JuegosDestacados/23.jpg',
      title: 'Bloodborne II',
      price: 69.99,
      platforms: ['PS5']
    },
    {
      image: './JuegosDestacados/24.jpg',
      title: 'Spider-Man 3',
      price: 64.99,
      platforms: ['PS5']
    }
  ];

  function renderGames(page) {
    const gameGrid = document.querySelector('#featured-games .game-grid');
    if (!gameGrid) return;
    
    // Disable pagination during transition
    const paginationControls = document.querySelector('.pagination-controls');
    if (paginationControls) {
      paginationControls.classList.add('disabled');
    }
    
    // Start fade out animation
    gameGrid.classList.add('fade-out');
    
    // Wait for fade out to complete
    setTimeout(() => {
      const start = (page - 1) * gamesPerPage;
      const end = start + gamesPerPage;
      const currentGames = gameCards.slice(start, end);
      
      gameGrid.innerHTML = currentGames.map(game => `
        <div class="game-card">
          <div class="game-image" style="background-image: url('${game.image}');">
          </div>
          <h3>${game.title}</h3>
          <div class="platforms">
            ${game.platforms.map(platform => `
              <span class="platform-badge">${platform}</span>
            `).join('')}
          </div>
          <p>$${game.price}</p>
          <select class="platform-select">
            <option value="">Selecciona plataforma</option>
            ${game.platforms.map(platform => `
              <option value="${platform}">${platform}</option>
            `).join('')}
          </select>
          <button class="primary-btn" disabled>Añadir al Carrito</button>
        </div>
      `).join('');

      // Add event listeners for the new cards
      document.querySelectorAll('#featured-games .game-card').forEach(card => {
        const selectPlatform = card.querySelector('.platform-select');
        const addButton = card.querySelector('.primary-btn');
        const title = card.querySelector('h3').textContent;
        
        if (selectPlatform && addButton) {
          selectPlatform.addEventListener('change', () => {
            addButton.disabled = !selectPlatform.value;
          });

          // Add click handler for the image only
          const imageElement = card.querySelector('.game-image');
          if (imageElement) {
            imageElement.addEventListener('click', () => {
              const productInfo = productData[title];
              if (productInfo) {
                renderGameModal(productInfo);
              }
            });
          }

          addButton.addEventListener('click', () => {
            const platform = selectPlatform.value;
            const priceEl = card.querySelector('p');
            const imgEl = card.querySelector('.game-image');
            const imgStyle = imgEl ? imgEl.getAttribute('style') : '';
            const bgImage = imgStyle ? imgStyle.match(/url\(['"]?(.*?)['"]?\)/) : null;
            const imgUrl = bgImage ? bgImage[1] : '';
            
            if (priceEl) {
              let price = priceEl.textContent.trim();
              if (price.includes('$')) {
                price = price.split('$').pop().trim();
              }
              price = parseFloat(price);
              
              addToCart({
                id: `${title.toLowerCase().replace(/\s+/g, '-')}-${platform.toLowerCase()}`,
                title: title,
                platform: platform,
                price: price,
                quantity: 1,
                image: imgUrl
              });
            }
          });
        }
      });

      // Start fade in animation
      gameGrid.classList.remove('fade-out');
      gameGrid.classList.add('fade-in');
      
      // Re-enable pagination after transition
      if (paginationControls) {
        setTimeout(() => {
          paginationControls.classList.remove('disabled');
        }, 300);
      }
    }, 300); // Match this timing with CSS transition duration
  }

  // Create and add pagination controls
  const featuredGamesSection = document.querySelector('#featured-games');
  if (featuredGamesSection) { 
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls';
    paginationContainer.innerHTML = `
      <button class="pagination-arrow" data-direction="prev">
        <i class="fas fa-chevron-left"></i>
      </button>
      ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
        <button class="pagination-btn ${page === 1 ? 'active' : ''}" data-page="${page}">${page}</button>
      `).join('')}
      <button class="pagination-arrow" data-direction="next">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    // Insert pagination controls after game grid
    featuredGamesSection.appendChild(paginationContainer);

    // Add pagination event listeners
    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('active')) {
          const buttons = document.querySelectorAll('.pagination-btn');
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentPage = parseInt(btn.dataset.page);
          renderGames(currentPage);
        }
      });
    });

    document.querySelectorAll('.pagination-arrow').forEach(arrow => {
      arrow.addEventListener('click', () => {
        if (arrow.dataset.direction === 'prev' && currentPage > 1) {
          currentPage--;
          renderGames(currentPage);
          updatePaginationButtons();
        } else if (arrow.dataset.direction === 'next' && currentPage < totalPages) {
          currentPage++;
          renderGames(currentPage);
          updatePaginationButtons();
        }
      });
    });

    // Add function to update pagination button active state
    function updatePaginationButtons() {
      document.querySelectorAll('.pagination-btn').forEach(btn => {
        const page = parseInt(btn.dataset.page);
        btn.classList.toggle('active', page === currentPage);
      });
    }

    // Initial render
    renderGames(1);
  }

  // Product Modal Functionality
  function createProductModal() {
    const modalTemplate = `
      <div id="product-modal" class="product-modal">
        <div class="product-modal-content">
          <div class="product-details">
            <div class="product-header">
              <div class="product-title-section">
                <h2></h2>
                <div class="product-meta"></div>
              </div>
              <button class="close-product-modal">&times;</button>
            </div>
            <div class="product-gallery">
              <div class="product-image-main"></div>
              <div class="product-trailer">
                <div class="video-container">
                  <iframe frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            </div>
            <div class="product-info-grid">
              <div class="info-item">
                <h4>Plataformas</h4>
                <p class="platforms"></p>
              </div>
              <div class="info-item">
                <h4>Desarrollador</h4>
                <p class="developer"></p>
              </div>
              <div class="info-item">
                <h4>Fecha de Lanzamiento</h4>
                <p class="release-date"></p>
              </div>
              <div class="info-item">
                <h4>Género</h4>
                <p class="genre"></p>
              </div>
            </div>
            <div class="product-description">
              <h3>Sinopsis</h3>
              <p class="synopsis"></p>
            </div>
            <div class="product-features">
              <h3>Características Destacadas</h3>
              <div class="features-list"></div>
            </div>
            <div class="product-requirements">
              <h3>Requisitos del Sistema</h3>
              <div class="requirements-grid">
                <div class="requirements-column">
                  <h4>Mínimos</h4>
                  <ul class="min-requirements"></ul>
                </div>
                <div class="requirements-column">
                  <h4>Recomendados</h4>
                  <ul class="rec-requirements"></ul>
                </div>
              </div>
            </div>
            <div class="product-media">
              <h3>Galería</h3>
              <div class="media-grid"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalTemplate);

    const modal = document.getElementById('product-modal');
    const closeBtn = modal.querySelector('.close-product-modal');

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      // Stop video when closing modal
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        iframe.src = '';
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        // Stop video when closing modal
        const iframe = modal.querySelector('iframe');
        if (iframe) {
          iframe.src = '';
        }
      }
    });

    return modal;
  }

  // Update product data with more detailed information
  const productData = {
    'Cyber Revolution': {
      title: 'Cyber Revolution',
      developer: 'TechnoGames Studios',
      platforms: ['PS5', 'Xbox Series X/S', 'PC'],
      releaseDate: '15 de Septiembre, 2025',
      genre: 'Acción / RPG',
      synopsis: `En un futuro distópico donde la línea entre humano y máquina se desvanece, Cyber Revolution te sumerge en una experiencia única. Como agente mejorado cibernéticamente, te embarcarás en una misión para descubrir la verdad detrás de una conspiración global que amenaza con cambiar el curso de la humanidad.

  Explora una metrópolis futurista llena de vida, donde cada decisión que tomes afectará el desarrollo de la historia y el destino de sus habitantes.`,
      features: [
        'Mundo abierto completamente interactivo',
        'Sistema de personalización profundo',
        'Combate dinámico que combina habilidades físicas y cibernéticas',
        'Motor gráfico de última generación'
      ],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: [
        'Windows 10 64-bit',
        'AMD Ryzen 5 3600 / Intel Core i5-9600K',
        '16 GB RAM',
        'NVIDIA RTX 3060'
      ],
      recRequirements: [
        'Windows 11 64-bit',
        'AMD Ryzen 7 5800X',
        '32 GB RAM',
        'NVIDIA RTX 4070 Ti'
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500'
      ]
    },
    'Space Odyssey': {
      title: 'Space Odyssey',
      developer: 'Stellar Games',
      platforms: ['PS5', 'PC'],
      releaseDate: '1 de Octubre, 2025',
      genre: 'Aventura / Exploración',
      synopsis: 'Explora los confines del universo en esta épica aventura espacial.',
      features: ['Exploración espacial', 'Construcción de naves', 'Combate espacial'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Dragon Quest XII': {
      title: 'Dragon Quest XII',
      developer: 'Square Enix',
      platforms: ['PS5', 'Switch'],
      releaseDate: '20 de Noviembre, 2025',
      genre: 'RPG',
      synopsis: 'La nueva entrega de la legendaria saga Dragon Quest.',
      features: ['Mundo abierto', 'Sistema de combate por turnos', 'Multijugador'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['PS5 o Switch'],
      recRequirements: ['PS5 o Switch'],
      screenshots: [
        'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Stellar Impact': {
      title: 'Stellar Impact',
      developer: 'Cosmic Studios',
      platforms: ['PC', 'Xbox Series X'],
      releaseDate: '5 de Diciembre, 2025',
      genre: 'Acción / Shooter',
      synopsis: 'Un shooter espacial con elementos de estrategia.',
      features: ['Batallas espaciales', 'Modo historia', 'Multijugador'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Neon Warriors': {
      title: 'Neon Warriors',
      developer: 'Cyber Studios',
      platforms: ['PS5', 'Xbox Series X', 'PC'],
      releaseDate: '15 de Enero, 2026',
      genre: 'Acción / Fighting',
      synopsis: 'Un juego de lucha cyberpunk con elementos RPG.',
      features: ['Personalización de personajes', 'Modo historia', 'Torneos online'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Echo\'s Legacy': {
      title: 'Echo\'s Legacy',
      developer: 'Echo Games',
      platforms: ['PS5', 'PC'],
      releaseDate: '1 de Marzo, 2026',
      genre: 'Aventura / Puzzle',
      synopsis: 'Una aventura atmosférica con puzzles innovadores.',
      features: ['Puzzles únicos', 'Historia inmersiva', 'Mundo abierto'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Mystic Legends': {
      title: 'Mystic Legends',
      developer: 'Mystic Studios',
      platforms: ['Switch', 'PC'],
      releaseDate: '20 de Abril, 2026',
      genre: 'RPG / Aventura',
      synopsis: 'Un RPG mágico con elementos de mundo abierto.',
      features: ['Mundo mágico', 'Sistema de magia', 'Multijugador'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    },
    'Urban Warfare': {
      title: 'Urban Warfare',
      developer: 'City Games',
      platforms: ['PS5', 'Xbox Series X', 'PC'],
      releaseDate: '10 de Mayo, 2026',
      genre: 'Acción / Shooter',
      synopsis: 'Un shooter táctico en entornos urbanos.',
      features: ['Combate táctico', 'Modo campaña', 'Multijugador'],
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      minRequirements: ['Windows 10', '16 GB RAM', 'NVIDIA GTX 1660'],
      recRequirements: ['Windows 11', '32 GB RAM', 'NVIDIA RTX 3070'],
      screenshots: [
        'https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=500',
        'https://images.unsplash.com/photo-1536749528141-dd239987a2ee?w=500'
      ]
    }
  };

  function renderGameModal(info) {
    if (!info) {
      console.warn('No game information provided');
      return;
    }

    const modal = document.getElementById('product-modal');
    if (!modal) {
      console.warn('Modal element not found');
      return;
    }

    // Set default values for missing data
    const defaultInfo = {
      title: 'Título no disponible',
      developer: 'Desarrollador no disponible',
      platforms: [],
      releaseDate: 'Fecha por anunciar',
      genre: 'Género no especificado',
      synopsis: 'Información no disponible',
      features: [],
      trailer: '',
      minRequirements: [],
      recRequirements: [],
      screenshots: []
    };

    // Merge provided info with default values
    const gameInfo = { ...defaultInfo, ...info };

    // Update modal content with proper null checks
    modal.querySelector('.product-title-section h2').textContent = gameInfo.title;
    
    const mainImage = modal.querySelector('.product-image-main');
    if (mainImage && gameInfo.screenshots.length > 0) {
      mainImage.style.backgroundImage = `url('${gameInfo.screenshots[0]}')`;
    }
    
    const trailerContainer = modal.querySelector('.video-container iframe');
    if (trailerContainer) {
      trailerContainer.src = gameInfo.trailer;
    }
    
    modal.querySelector('.platforms').textContent = gameInfo.platforms.join(', ') || 'No disponible';
    modal.querySelector('.developer').textContent = gameInfo.developer;
    modal.querySelector('.release-date').textContent = gameInfo.releaseDate;
    modal.querySelector('.genre').textContent = gameInfo.genre;
    modal.querySelector('.synopsis').textContent = gameInfo.synopsis;

    const featuresList = modal.querySelector('.features-list');
    if (featuresList) {
      featuresList.innerHTML = gameInfo.features.map(feature => `
        <div class="feature-item">
          <i class="fas fa-check"></i>
          <span>${feature}</span>
        </div>
      `).join('');
    }

    const minReqList = modal.querySelector('.min-requirements');
    const recReqList = modal.querySelector('.rec-requirements');
    
    if (minReqList) {
      minReqList.innerHTML = gameInfo.minRequirements.map(req => `<li>${req}</li>`).join('');
    }
    if (recReqList) {
      recReqList.innerHTML = gameInfo.recRequirements.map(req => `<li>${req}</li>`).join('');
    }

    const mediaGrid = modal.querySelector('.media-grid');
    if (mediaGrid) {
      mediaGrid.innerHTML = gameInfo.screenshots.map(screenshot => `
        <div class="media-item" style="background-image: url('${screenshot}')"></div>
      `).join('');
    }

    modal.classList.add('show');
  }

  // Initialize product modals
  const modal = createProductModal();
  
  document.querySelectorAll('.game-card').forEach(card => {
    const title = card.querySelector('h3').textContent;
    
    // Add click event only to the image
    const imageElement = card.querySelector('.game-image');
    if (imageElement) {
      imageElement.addEventListener('click', (e) => {
        const productInfo = productData[title] || {
          title: title,
          description: 'Información detallada próximamente...'
        };

        renderGameModal(productInfo);
      });
    }
  });

  // Authentication State
  let currentUser = null;
  const adminUser = {
    username: 'GameVault',
    password: 'GameVault',
    email: 'gamevault.info.vault@gmail.com',
    role: 'admin',
    verified: true,
    joinDate: '2024-01-01',
    purchases: [
      {
        date: '2024-01-15',
        item: 'Cyber Revolution',
        price: 59.99
      },
      {
        date: '2024-01-20',
        item: 'PlayStation 5 Pro',
        price: 599.99
      }
    ],
    rewards: 500,
    settings: {
      notifications: true,
      newsletter: true,
      twoFactorAuth: true
    }
  };

  // Auth Modal Elements
  const authButton = document.getElementById('auth-button');
  const closeAuth = document.querySelector('.close-auth');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  const guestLogin = document.getElementById('guest-login');
  const userNameDisplay = document.getElementById('user-name');

  // Show auth modal
  authButton.addEventListener('click', () => {
    if (currentUser) {
      toggleUserMenu();
    } else {
      authModal.classList.add('show');
    }
  });

  // Close auth modal
  closeAuth.addEventListener('click', () => {
    authModal.classList.remove('show');
  });

  // Switch between login and register forms
  switchToRegister.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    switchToRegister.style.display = 'none';
    switchToLogin.style.display = 'block';
    document.querySelector('.auth-header h2').textContent = 'Registrarse';
  });

  switchToLogin.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    switchToRegister.style.display = 'block';
    switchToLogin.style.display = 'none';
    document.querySelector('.auth-header h2').textContent = 'Iniciar Sesión';
  });

  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Check if it's the admin account
    if (email === adminUser.email && password === adminUser.password) {
      currentUser = {
        ...adminUser,
        name: adminUser.username
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateUserInterface();
      authModal.classList.remove('show');
      
      // Show welcome message
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = `¡Bienvenido, ${currentUser.name}! (Administrador)`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    } else {
      // Handle regular user login
      login({
        name: email.split('@')[0],
        email: email,
        type: 'registered'
      });
    }
  });

  // Register form submission
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Here you would typically send to a backend
    // For demo purposes, we'll simulate a successful registration
    login({
      name: name,
      email: email,
      type: 'registered'
    });
  });

  // Guest login
  guestLogin.addEventListener('click', () => {
    login({
      name: 'Invitado',
      email: null,
      type: 'guest'
    });
  });

  function login(user) {
    // Check if it's the admin account
    if (user.email === adminUser.email && user.password === adminUser.password) {
      currentUser = {
        ...adminUser,
        name: adminUser.username
      };
    } else {
      user.verified = user.type === 'registered';
      currentUser = user;
    }
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateUserInterface();
    authModal.classList.remove('show');
    
    // Show welcome message
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = `¡Bienvenido, ${currentUser.name}!${currentUser.role === 'admin' ? ' (Administrador)' : ''}`;
    if (!currentUser.verified) {
      toast.textContent += ' Verifica tu email para poder realizar compras.';
    }
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateUserInterface();
    
    // Show logout message
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = '¡Hasta pronto!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  function updateUserInterface() {
    if (currentUser) {
      userNameDisplay.textContent = currentUser.name;
      const verificationStatus = currentUser.verified ? 
        '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verificado</span>' : 
        '<span class="unverified-badge"><i class="fas fa-exclamation-circle"></i> Sin verificar</span>';
      
      authButton.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${currentUser.name}</span>
        ${verificationStatus}
        <div class="user-menu">
          <a href="#" class="user-menu-item" id="view-profile">Ver Perfil</a>
          <a href="#" class="user-menu-item">Mis Compras</a>
          ${!currentUser.verified ? 
            '<a href="#" class="user-menu-item verify-account">Verificar Cuenta</a>' : 
            ''}
          <div class="user-menu-divider"></div>
          <a href="#" class="user-menu-item" id="logout-button">Cerrar Sesión</a>
        </div>
      `;
      
      // Add logout handler
      document.getElementById('logout-button').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      
      // Add verification click handler
      const verifyButton = document.querySelector('.verify-account');
      if (verifyButton) {
        verifyButton.addEventListener('click', (e) => {
          e.preventDefault();
          sendVerificationEmail();
        });
      }
      
      // Add profile view handler
      document.getElementById('view-profile').addEventListener('click', (e) => {
        e.preventDefault();
        showProfilePopup();
      });
    } else {
      userNameDisplay.textContent = 'Iniciar Sesión';
      authButton.innerHTML = `
        <i class="fas fa-user"></i>
        <span>Iniciar Sesión</span>
      `;
    }
  }

  function sendVerificationEmail() {
    alert(`Se ha enviado un email de verificación a ${currentUser.email}. Por favor, verifica tu cuenta para poder realizar compras.`);
    // Here you would typically integrate with your email service
    // For demo purposes, we'll simulate verification after 5 seconds
    setTimeout(() => {
      currentUser.verified = true;
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateUserInterface();
      
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.textContent = '¡Tu cuenta ha sido verificada! Ya puedes realizar compras.';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }, 5000);
  }

  function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.classList.toggle('show');
    }
  }

  // Check for existing session
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUserInterface();
  }

  // Close user menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.auth-btn')) {
      const userMenu = document.querySelector('.user-menu.show');
      if (userMenu) {
        userMenu.classList.remove('show');
      }
    }
  });

  // Smooth scroll navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Parallax effect on hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    });
  }

  // Animation for game cards appearance
  const cards = document.querySelectorAll('.game-card');
  if (cards.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
  }

  // FAQ functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Send the form data
    fetch('contact.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.textContent = data;
      document.body.appendChild(toast);
      
      // Reset form
      form.reset();
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.remove();
      }, 3000);
    })
    .catch(error => {
      // Show error message
      const toast = document.createElement('div');
      toast.className = 'toast error';
      toast.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.remove();
      }, 3000);
    })
    .finally(() => {
      // Reset button state
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    });
  });

  // FAQ items animation
  const faqItemsAnimation = document.querySelectorAll('.faq-item');
  if (faqItemsAnimation.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    faqItemsAnimation.forEach(item => {
      item.style.opacity = 0;
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'all 0.6s ease-out';
      observer.observe(item);
    });
  }

  function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(item);
    }
    
    saveCart();
    updateCartCount();
    renderCart();
    
    // Show confirmation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = '¡Producto añadido al carrito!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
  }

  function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="cart-item-image" style="${item.image ? `background-image: url('${item.image}')` : ''}"></div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-platform">${item.platform}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
            <button class="remove-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      cartItems.appendChild(itemElement);
    });

    document.getElementById('cart-total-price').textContent = '$' + calculateTotal();
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const item = cart.find(i => i.id === id);
        
        if (e.target.classList.contains('plus')) {
          item.quantity++;
        } else if (e.target.classList.contains('minus')) {
          item.quantity--;
          if (item.quantity === 0) {
            cart = cart.filter(i => i.id !== id);
          }
        }
        
        saveCart();
        updateCartCount();
        renderCart();
      });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.remove-item').dataset.id;
        cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartCount();
        renderCart();
      });
    });
  }

  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Soundtrack demo data and functionality
  const soundtrackDemos = {
    'Epic Orchestra': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-epic-orchestra-rose-694.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Cyber Synthwave': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Fantasy RPG': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-medieval-show-fanfare-announcement-226.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Battle Themes': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Ambient Collection': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    '8-Bit Classics': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-video-game-retro-click-237.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Electronic Dance Music': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-dancing-with-you-432.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    },
    'Horror Sound Effects': {
      demoUrl: 'https://assets.mixkit.co/music/preview/mixkit-horror-suspense-atmosphere-2839.mp3',
      duration: '0:30',
      fallbackMessage: 'Demo no disponible temporalmente'
    }
  };

  let currentlyPlaying = null;

  // Add soundtrack demo player functionality
  document.querySelectorAll('#soundtracks .game-card').forEach(card => {
    const title = card.querySelector('h3').textContent;
    const demoData = soundtrackDemos[title];
    
    if (demoData) {
      // Create audio player container
      const playerContainer = document.createElement('div');
      playerContainer.className = 'audio-player';
      
      // Create custom audio player
      const playButton = document.createElement('button');
      playButton.className = 'play-button';
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      const progress = document.createElement('div');
      progress.className = 'progress';
      progressBar.appendChild(progress);
      
      const timeDisplay = document.createElement('span');
      timeDisplay.className = 'time-display';
      timeDisplay.textContent = '0:00 / ' + demoData.duration;
      
      playerContainer.appendChild(playButton);
      playerContainer.appendChild(progressBar);
      playerContainer.appendChild(timeDisplay);
      
      // Insert player before the add to cart button
      const addToCartBtn = card.querySelector('.primary-btn');
      card.insertBefore(playerContainer, addToCartBtn);
      
      // Create audio element
      const audio = new Audio();
      
      audio.addEventListener('error', (e) => {
        console.warn(`Error loading audio for ${title}:`, e);
        timeDisplay.textContent = demoData.fallbackMessage;
        playButton.disabled = true;
        playButton.style.opacity = '0.5';
      });
      
      // Only set source after adding error listener
      audio.src = demoData.demoUrl;
      
      // Update progress bar
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          const percentage = (audio.currentTime / audio.duration) * 100;
          progress.style.width = percentage + '%';
          timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${demoData.duration}`;
        }
      });
      
      // Click on progress bar to seek
      progressBar.addEventListener('click', (e) => {
        if (audio.duration) {
          const rect = progressBar.getBoundingClientRect();
          const percentage = (e.clientX - rect.left) / rect.width;
          audio.currentTime = percentage * audio.duration;
        }
      });
      
      // Play/Pause functionality
      playButton.addEventListener('click', () => {
        if (currentlyPlaying && currentlyPlaying !== audio) {
          currentlyPlaying.pause();
          currentlyPlaying.currentTime = 0;
          document.querySelectorAll('.play-button').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
          });
        }
        
        if (audio.paused) {
          audio.play().catch(error => {
            console.warn(`Error playing audio for ${title}:`, error);
            timeDisplay.textContent = demoData.fallbackMessage;
          });
          playButton.innerHTML = '<i class="fas fa-pause"></i>';
          currentlyPlaying = audio;
        } else {
          audio.pause();
          playButton.innerHTML = '<i class="fas fa-play"></i>';
          currentlyPlaying = null;
        }
      });
      
      // Reset player when audio ends
      audio.addEventListener('ended', () => {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        progress.style.width = '0%';
        audio.currentTime = 0;
        currentlyPlaying = null;
      });
    }
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function showProfilePopup() {
    if (!currentUser) return;

    const purchasesList = currentUser.purchases ? currentUser.purchases.map(purchase => `
      <div class="purchase-item">
        <span>${purchase.date}</span>
        <span>${purchase.item}</span>
        <span>$${purchase.price.toFixed(2)}</span>
      </div>
    `).join('') : '<p>No hay compras recientes</p>';

    // Add total spent calculation
    const totalSpent = currentUser.purchases ? currentUser.purchases.reduce((total, purchase) => total + purchase.price, 0) : 0;

    const popupHTML = `
      <div class="profile-popup">
        <div class="profile-content">
          <div class="profile-header">
            <h2>Perfil de Usuario</h2>
            <button class="close-profile">&times;</button>
          </div>
          <div class="profile-info">
            <div class="profile-section">
              <h3>Información Personal</h3>
              <p><strong>Usuario:</strong> ${currentUser.name}</p>
              <p><strong>Email:</strong> ${currentUser.email || 'No disponible'}</p>
              <p><strong>Rol:</strong> ${currentUser.role || 'Usuario'}</p>
              <p><strong>Estado:</strong> ${currentUser.verified ? 'Verificado' : 'Sin verificar'}</p>
              <p><strong>Fecha de registro:</strong> ${currentUser.joinDate || 'No disponible'}</p>
            </div>
            
            <div class="profile-section">
              <h3>Historial de Compras</h3>
              <div class="purchases-header">
                <span>Fecha</span>
                <span>Producto</span>
                <span>Precio</span>
              </div>
              <div class="purchases-list">
                ${purchasesList}
              </div>
              <div class="purchases-total">
                <strong>Total Gastado:</strong> $${totalSpent.toFixed(2)}
              </div>
            </div>
            
            <div class="profile-section">
              <h3>Programa de Recompensas</h3>
              <p><strong>Puntos VaultRewards:</strong> ${currentUser.rewards || 0}</p>
              <div class="progress-bar">
                <div class="progress" style="width: ${(currentUser.rewards || 0) / 10}%"></div>
              </div>
              <p class="rewards-info">Necesitas 1000 puntos para el siguiente nivel</p>
            </div>
            
            <div class="profile-section">
              <h3>Configuración</h3>
              <div class="settings-grid">
                <label class="setting-item">
                  <input type="checkbox" ${currentUser.settings?.notifications ? 'checked' : ''}>
                  Notificaciones
                </label>
                <label class="setting-item">
                  <input type="checkbox" ${currentUser.settings?.newsletter ? 'checked' : ''}>
                  Newsletter
                </label>
                <label class="setting-item">
                  <input type="checkbox" ${currentUser.settings?.twoFactorAuth ? 'checked' : ''}>
                  Autenticación de dos factores
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const popup = document.querySelector('.profile-popup');
    const closeBtn = popup.querySelector('.close-profile');
    
    closeBtn.addEventListener('click', () => {
      popup.remove();
    });
    
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.remove();
      }
    });
  }
});