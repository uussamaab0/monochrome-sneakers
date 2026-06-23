document.addEventListener('DOMContentLoaded', () => {
  // Size selection
  const sizeBtns = document.querySelectorAll('.size-btn');
  let selectedSize = null;

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });

  // Pre-order / Add to cart simulation
  const preOrderBtn = document.querySelector('.btn-primary');
  const buyBtn = document.getElementById('buy-btn');
  const cartCount = document.querySelector('.cart-count');
  let itemsInCart = 0;

  function addToCart() {
    if (!selectedSize) {
      alert('Please select a size first.');
      // Scroll to size selector
      document.querySelector('.selector-group').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    itemsInCart++;
    cartCount.textContent = itemsInCart;
    
    // Add simple animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartIcon.style.transform = 'scale(1)';
    }, 200);

    alert(`Successfully added VOID 01 (Size ${selectedSize}) to pre-order list!`);
  }

  if (preOrderBtn) {
    preOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to buy section
      document.getElementById('buy').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (buyBtn) {
    buyBtn.addEventListener('click', addToCart);
  }

  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Highlight active link on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
