// ===== Products Data =====
const products = [
  { id: 1, name: "Furadeira de Impacto 750W", brand: "bosch", category: "ferramentas", price: 349.9, originalPrice: 449.9, badge: "sale" },
  { id: 2, name: "Parafusadeira a Bateria 12V", brand: "dewalt", category: "ferramentas", price: 599.9, badge: "bestseller" },
  { id: 3, name: "Serra Circular 1400W", brand: "makita", category: "ferramentas", price: 789.9, originalPrice: 899.9, badge: "sale" },
  { id: 4, name: "Kit Chaves de Fenda 15 Pecas", brand: "tramontina", category: "ferramentas", price: 89.9, badge: "new" },
  { id: 5, name: "Disjuntor Bipolar 32A", brand: "stanley", category: "eletrico", price: 45.9 },
  { id: 6, name: "Fio Eletrico 2.5mm 100m", brand: "stanley", category: "eletrico", price: 189.9, originalPrice: 229.9, badge: "sale" },
  { id: 7, name: "Registro de Pressao 3/4", brand: "tramontina", category: "hidraulico", price: 67.9 },
  { id: 8, name: "Caixa D'Agua 1000L", brand: "tramontina", category: "hidraulico", price: 599.9, badge: "bestseller" },
  { id: 9, name: "Tinta Acrilica Premium 18L", brand: "tramontina", category: "tintas", price: 299.9, originalPrice: 399.9, badge: "sale" },
  { id: 10, name: "Verniz Maritimo 3.6L", brand: "stanley", category: "tintas", price: 159.9, badge: "new" },
  { id: 11, name: "Luminaria LED Painel 24W", brand: "stanley", category: "iluminacao", price: 79.9 },
  { id: 12, name: "Spot LED Embutir 7W", brand: "stanley", category: "iluminacao", price: 29.9, originalPrice: 39.9, badge: "sale" }
];

// Category names map
const categoryNames = {
  'ferramentas': 'Ferramentas',
  'eletrico': 'Material Eletrico',
  'hidraulico': 'Material Hidraulico',
  'tintas': 'Tintas',
  'iluminacao': 'Iluminacao'
};

// ===== State =====
let currentSlide = 0;
let carouselInterval;
let selectedProduct = null;
let currentImageIndex = 0;
let selectedColor = 'Padrao';
const favorites = new Set();
const cart = [];

// Cart state
let isCartOpen = false;
let isMobileSearchOpen = false;

// ===== DOM Elements =====
const header = document.getElementById('header');
const menuBtn = document.getElementById('menuBtn');
const menuIcon = document.getElementById('menuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
const carouselInner = document.getElementById('carouselInner');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const brandFilter = document.getElementById('brandFilter');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const clearFilters = document.getElementById('clearFilters');
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const floatingSocial = document.getElementById('floatingSocial');

// Cart Elements
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartClose = document.getElementById('cartClose');
const cartContent = document.getElementById('cartContent');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Mobile Sheet Elements
const mobileSheet = document.getElementById('mobileSheet');
const mobileSheetBackdrop = document.getElementById('mobileSheetBackdrop');
const mobileSheetClose = document.getElementById('mobileSheetClose');
const mobileSheetAddCart = document.getElementById('mobileSheetAddCart');

// Search Elements
const searchInput = document.getElementById('searchInput');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCarousel();
  initFilters();
  renderProducts();
  initModal();
  initCart();
  initMobileSheet();
  initSearch();
  initOfferButtons();
  initSlideButtons();
  initCountdownTimer();
});

// ===== Countdown Timer =====
function initCountdownTimer() {
  // Set the countdown end date (3 days from now)
  const now = new Date();
  const endDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
  
  // Store end date in localStorage so it persists
  let storedEndDate = localStorage.getItem('offerEndDate');
  let countdownEnd;
  
  if (storedEndDate) {
    countdownEnd = new Date(storedEndDate);
    // If the stored date has passed, reset it
    if (countdownEnd <= now) {
      countdownEnd = endDate;
      localStorage.setItem('offerEndDate', endDate.toISOString());
    }
  } else {
    countdownEnd = endDate;
    localStorage.setItem('offerEndDate', endDate.toISOString());
  }
  
  function updateTimer() {
    const now = new Date();
    const diff = countdownEnd - now;
    
    if (diff <= 0) {
      // Reset timer when it reaches 0
      countdownEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      localStorage.setItem('offerEndDate', countdownEnd.toISOString());
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const timerDays = document.getElementById('timerDays');
    const timerHours = document.getElementById('timerHours');
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    
    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
  }
  
  // Update immediately and then every second
  updateTimer();
  setInterval(updateTimer, 1000);
}


// ===== Header Scroll =====
function initHeader() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== Floating Social Visibility =====
function hideFloatingSocial() {
  if (floatingSocial) {
    floatingSocial.classList.add('hidden');
  }
}

function showFloatingSocial() {
  if (floatingSocial) {
    floatingSocial.classList.remove('hidden');
  }
}

// ===== Mobile Menu =====
function initMobileMenu() {
  menuBtn.addEventListener('click', toggleMobileMenu);
  mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function toggleMobileMenu() {
  // Close cart if open
  if (isCartOpen) {
    closeCart();
  }
  
  const isOpen = mobileMenu.classList.toggle('open');
  menuIcon.innerHTML = isOpen
    ? '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
    : '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>';
  
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    hideFloatingSocial();
  } else {
    document.body.style.overflow = '';
    showFloatingSocial();
  }
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  menuIcon.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>';
  document.body.style.overflow = '';
  showFloatingSocial();
}

// ===== Carousel =====
function initCarousel() {
  carouselPrev.addEventListener('click', prevSlide);
  carouselNext.addEventListener('click', nextSlide);
  carouselDots.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
  });
  startCarouselAutoplay();
}

function updateCarousel() {
  const slides = carouselInner.querySelectorAll('.carousel-slide');
  const dots = carouselDots.querySelectorAll('.carousel-dot');
  
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'prev');
    if (index === currentSlide) {
      slide.classList.add('active');
    } else if (index < currentSlide) {
      slide.classList.add('prev');
    }
  });
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % 3;
  updateCarousel();
  resetCarouselAutoplay();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + 3) % 3;
  updateCarousel();
  resetCarouselAutoplay();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetCarouselAutoplay();
}

function startCarouselAutoplay() {
  carouselInterval = setInterval(nextSlide, 4000);
}

function resetCarouselAutoplay() {
  clearInterval(carouselInterval);
  startCarouselAutoplay();
}

// ===== Slide Buttons (Ver Ofertas in carousel) =====
function initSlideButtons() {
  document.querySelectorAll('.slide-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      navigateToProductsWithFilter(category);
    });
  });
}

// ===== Offer Buttons =====
function initOfferButtons() {
  document.querySelectorAll('.offer-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = btn.dataset.category;
      navigateToProductsWithFilter(category);
    });
  });
  
  document.querySelectorAll('.offer-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      navigateToProductsWithFilter(category);
    });
  });
}

function navigateToProductsWithFilter(category) {
  // Set the category filter
  categoryFilter.value = category;
  // Set badge filter to only show sale items
  brandFilter.value = 'all';
  priceFilter.value = 'all';
  
  // Render products with filter
  renderProducts(true); // Pass true to filter only sale items
  
  // Scroll to products section
  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

// ===== Filters =====
function initFilters() {
  brandFilter.addEventListener('change', () => renderProducts());
  categoryFilter.addEventListener('change', () => renderProducts());
  priceFilter.addEventListener('change', () => renderProducts());
  clearFilters.addEventListener('click', () => {
    brandFilter.value = 'all';
    categoryFilter.value = 'all';
    priceFilter.value = 'all';
    renderProducts();
  });
}

function filterProducts(onlySale = false) {
  const brand = brandFilter.value;
  const category = categoryFilter.value;
  const price = priceFilter.value;
  
  return products.filter(product => {
    const matchBrand = brand === 'all' || product.brand === brand;
    const matchCategory = category === 'all' || product.category === category;
    let matchPrice = true;
    if (price === 'low') matchPrice = product.price < 100;
    else if (price === 'mid') matchPrice = product.price >= 100 && product.price <= 500;
    else if (price === 'high') matchPrice = product.price > 500;
    
    const matchSale = !onlySale || product.badge === 'sale';
    
    return matchBrand && matchCategory && matchPrice && matchSale;
  });
}

// ===== Search =====
function initSearch() {
  // Create search dropdown for desktop
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.style.position = 'relative';
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.id = 'searchDropdown';
    searchBar.appendChild(dropdown);
  }
  
  // Desktop search
  if (searchInput) {
    searchInput.addEventListener('input', handleDesktopSearch);
    searchInput.addEventListener('focus', handleDesktopSearch);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('searchDropdown');
      if (dropdown && !e.target.closest('.search-bar')) {
        dropdown.classList.remove('open');
      }
    });
  }
  
  // Mobile search button
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', openMobileSearch);
  }
  
  // Create mobile search modal
  createMobileSearchModal();
}

function handleDesktopSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const dropdown = document.getElementById('searchDropdown');
  
  if (!dropdown) return;
  
  if (query.length < 2) {
    dropdown.classList.remove('open');
    return;
  }
  
  const results = products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.brand.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
  
  if (results.length === 0) {
    dropdown.innerHTML = '<div class="search-no-results">Nenhum produto encontrado</div>';
  } else {
    dropdown.innerHTML = results.slice(0, 5).map(product => `
      <div class="search-result-item" data-id="${product.id}">
        <div class="search-result-image"></div>
        <div class="search-result-info">
          <p class="search-result-name">${product.name}</p>
          <p class="search-result-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
    `).join('');
    
    dropdown.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const productId = parseInt(item.dataset.id);
        openModal(productId);
        dropdown.classList.remove('open');
        searchInput.value = '';
      });
    });
  }
  
  dropdown.classList.add('open');
}

function createMobileSearchModal() {
  const modal = document.createElement('div');
  modal.className = 'mobile-search-modal';
  modal.id = 'mobileSearchModal';
  modal.innerHTML = `
    <div class="mobile-search-modal-header">
      <div class="mobile-search-modal-input">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input type="text" placeholder="Buscar produtos..." id="mobileSearchInput">
      </div>
      <button class="mobile-search-modal-close" id="mobileSearchClose">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
    <div class="mobile-search-modal-results" id="mobileSearchResults"></div>
  `;
  document.body.appendChild(modal);
  
  const closeBtn = document.getElementById('mobileSearchClose');
  closeBtn.addEventListener('click', closeMobileSearch);
  
  const input = document.getElementById('mobileSearchInput');
  input.addEventListener('input', handleMobileSearch);
}

function openMobileSearch() {
  const modal = document.getElementById('mobileSearchModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    hideFloatingSocial();
    setTimeout(() => {
      document.getElementById('mobileSearchInput').focus();
    }, 300);
  }
}

function closeMobileSearch() {
  const modal = document.getElementById('mobileSearchModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    showFloatingSocial();
    document.getElementById('mobileSearchInput').value = '';
    document.getElementById('mobileSearchResults').innerHTML = '';
  }
}

function handleMobileSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const resultsContainer = document.getElementById('mobileSearchResults');
  
  if (query.length < 2) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  const results = products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.brand.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-results">Nenhum produto encontrado</div>';
  } else {
    resultsContainer.innerHTML = results.map(product => `
      <div class="search-result-item" data-id="${product.id}">
        <div class="search-result-image"></div>
        <div class="search-result-info">
          <p class="search-result-name">${product.name}</p>
          <p class="search-result-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
    `).join('');
    
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const productId = parseInt(item.dataset.id);
        closeMobileSearch();
        openModal(productId);
      });
    });
  }
}

// ===== Render Products =====
function renderProducts(onlySale = false) {
  const filtered = filterProducts(onlySale);
  
  if (filtered.length === 0) {
    productsGrid.innerHTML = '<div class="products-empty">Nenhum produto encontrado com os filtros selecionados.</div>';
    return;
  }
  
  productsGrid.innerHTML = filtered.map(product => {
    const isFavorite = favorites.has(product.id);
    
    let badgeHTML = '';
    if (product.badge === 'sale') {
      badgeHTML = '<span class="product-badge sale">Oferta</span>';
    } else if (product.badge === 'new') {
      badgeHTML = '<span class="product-badge new">Novo</span>';
    } else if (product.badge === 'bestseller') {
      badgeHTML = '<span class="product-badge bestseller">Mais Vendido</span>';
    }
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <div class="product-image-placeholder"></div>
          ${badgeHTML}
          <button class="product-favorite ${isFavorite ? 'active' : ''}" data-id="${product.id}" aria-label="Favoritar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <p class="product-brand">${product.brand}</p>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">
            <span class="product-price-current">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
            ${product.originalPrice ? `<span class="product-price-original">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
          </div>
          <p class="product-installments">ou 12x de R$ ${(product.price / 12).toFixed(2).replace('.', ',')} sem juros</p>
          <div class="product-actions">
            <button class="product-view-btn" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.product-favorite')) {
        openModal(parseInt(card.dataset.id));
      }
    });
  });
  
  document.querySelectorAll('.product-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(parseInt(btn.dataset.id));
    });
  });
}

// ===== Favorites =====
function toggleFavorite(productId) {
  if (favorites.has(productId)) {
    favorites.delete(productId);
  } else {
    favorites.add(productId);
  }
  renderProducts();
}

// ===== Modal (Desktop) =====
function initModal() {
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  
  document.getElementById('modalPrevImage').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + 4) % 4;
    updateModalThumbnails();
  });
  
  document.getElementById('modalNextImage').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % 4;
    updateModalThumbnails();
  });
  
  document.querySelectorAll('.modal-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentImageIndex = parseInt(thumb.dataset.index);
      updateModalThumbnails();
    });
  });
  
  // Add to cart button
  document.querySelector('.modal-add-cart').addEventListener('click', () => {
    if (selectedProduct) {
      addToCart(selectedProduct.id);
      closeModal();
    }
  });
  
  // Color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      selectedColor = option.dataset.color;
      document.getElementById('selectedColor').textContent = `Cor selecionada: ${selectedColor}`;
      document.getElementById('featureColor').textContent = selectedColor;
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openModal(productId) {
  selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;
  
  currentImageIndex = 0;
  selectedColor = 'Padrao';
  
  // Always use mobile sheet style (Shopee-like) for all screens
  openMobileSheet(selectedProduct);
}

function openDesktopModal(product) {
  document.getElementById('modalBrand').textContent = product.brand.toUpperCase();
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  
  const originalPriceEl = document.getElementById('modalOriginalPrice');
  const discountEl = document.getElementById('modalDiscount');
  
  if (product.originalPrice) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    originalPriceEl.textContent = `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`;
    originalPriceEl.style.display = 'inline';
    discountEl.textContent = `${discount}% de desconto`;
    discountEl.style.display = 'inline-block';
  } else {
    originalPriceEl.style.display = 'none';
    discountEl.style.display = 'none';
  }
  
  document.getElementById('modalInstallments').textContent = `ou 12x de R$ ${(product.price / 12).toFixed(2).replace('.', ',')} sem juros`;
  document.getElementById('modalDescription').textContent = `Produto de alta qualidade da marca ${product.brand}. Ideal para profissionais e entusiastas que buscam o melhor em materiais de construcao. Garantia de 12 meses direto com o fabricante.`;
  
  // Update features
  document.getElementById('featureColor').textContent = 'Padrao';
  document.getElementById('featureBrand').textContent = product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
  document.getElementById('featureCategory').textContent = categoryNames[product.category] || product.category;
  
  // Reset color selection
  document.querySelectorAll('.color-option').forEach((o, i) => {
    o.classList.toggle('active', i === 0);
  });
  document.getElementById('selectedColor').textContent = 'Cor selecionada: Padrao';
  
  updateModalThumbnails();
  
  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  hideFloatingSocial();
}

function closeModal() {
  productModal.classList.remove('open');
  document.body.style.overflow = '';
  selectedProduct = null;
  showFloatingSocial();
}

function updateModalThumbnails() {
  document.querySelectorAll('.modal-thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
}

// ===== Mobile Bottom Sheet =====
function initMobileSheet() {
  if (mobileSheetBackdrop) {
    mobileSheetBackdrop.addEventListener('click', closeMobileSheet);
  }
  if (mobileSheetClose) {
    mobileSheetClose.addEventListener('click', closeMobileSheet);
  }
  if (mobileSheetAddCart) {
    mobileSheetAddCart.addEventListener('click', () => {
      if (selectedProduct) {
        addToCart(selectedProduct.id);
        closeMobileSheet();
      }
    });
  }
  
  // Mobile color selection
  document.querySelectorAll('.mobile-sheet-color-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.mobile-sheet-color-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      selectedColor = option.dataset.color;
      document.getElementById('mobileSheetSpecColor').textContent = selectedColor;
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSheet && mobileSheet.classList.contains('open')) {
      closeMobileSheet();
    }
  });
}

function openMobileSheet(product) {
  if (!mobileSheet) return;
  
  document.getElementById('mobileSheetBrand').textContent = product.brand.toUpperCase();
  document.getElementById('mobileSheetName').textContent = product.name;
  document.getElementById('mobileSheetPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  
  const originalPriceEl = document.getElementById('mobileSheetOriginalPrice');
  if (product.originalPrice) {
    originalPriceEl.textContent = `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`;
    originalPriceEl.style.display = 'inline';
  } else {
    originalPriceEl.style.display = 'none';
  }
  
  document.getElementById('mobileSheetDescription').textContent = `Produto de alta qualidade da marca ${product.brand}. Ideal para profissionais e entusiastas.`;
  
  // Update specs
  document.getElementById('mobileSheetSpecColor').textContent = 'Padrao';
  document.getElementById('mobileSheetSpecBrand').textContent = product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
  document.getElementById('mobileSheetSpecCategory').textContent = categoryNames[product.category] || product.category;
  
  // Update image placeholder
  document.getElementById('mobileSheetImage').textContent = '';
  
  // Reset color selection
  document.querySelectorAll('.mobile-sheet-color-option').forEach((o, i) => {
    o.classList.toggle('active', i === 0);
  });
  
  mobileSheet.classList.add('open');
  document.body.style.overflow = 'hidden';
  hideFloatingSocial();
}

function closeMobileSheet() {
  if (mobileSheet) {
    mobileSheet.classList.remove('open');
    document.body.style.overflow = '';
    selectedProduct = null;
    showFloatingSocial();
  }
}

// ===== Cart =====
function initCart() {
  cartBtn.addEventListener('click', toggleCart);
  cartBackdrop.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCartOpen) {
      closeCart();
    }
  });
  
  updateCartUI();
}

function toggleCart() {
  if (isCartOpen) {
    closeCart();
  } else {
    openCart();
  }
}

function openCart() {
  // Close mobile menu if open
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
  
  isCartOpen = true;
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  hideFloatingSocial();
}

function closeCart() {
  isCartOpen = false;
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
  showFloatingSocial();
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Check for existing item with same product ID AND color
  const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: quantity,
      color: selectedColor
    });
  }
  
  updateCartUI();
  openCart();
}

function removeFromCart(cartIndex) {
  if (cartIndex >= 0 && cartIndex < cart.length) {
    cart.splice(cartIndex, 1);
    updateCartUI();
  }
}

function updateCartQuantity(cartIndex, change) {
  if (cartIndex < 0 || cartIndex >= cart.length) return;
  
  const item = cart[cartIndex];
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(cartIndex);
  } else {
    updateCartUI();
  }
}

function calculateCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartUI() {
  const itemCount = getCartItemCount();
  const total = calculateCartTotal();
  
  // Update cart count badge
  cartCount.textContent = itemCount;
  cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
  
  // Show/hide empty state and footer
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'flex';
    cartFooter.style.display = 'block';
    
    // Update total
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Render cart items
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-image">
          <span class="cart-item-image-placeholder"></span>
        </div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-color">Cor: ${item.color || 'Padrao'}</p>
          <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
          <div class="cart-item-controls">
            <button class="cart-item-qty-btn" data-action="decrease" data-index="${index}">−</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="cart-item-qty-btn" data-action="increase" data-index="${index}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-index="${index}" aria-label="Remover item">×</button>
      </div>
    `).join('');
    
    // Add event listeners
    cartItems.querySelectorAll('.cart-item-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;
        updateCartQuantity(index, action === 'increase' ? 1 : -1);
      });
    });
    
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        removeFromCart(id);
      });
    });
  }
}
