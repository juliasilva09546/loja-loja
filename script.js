// PRODUTOS DA LOJA
const products = {
  Feminino: [
    {
      name: 'Saia Preta',
      price: 59.99,
      image: 'assets/saia-preta.jpg'
    },
    {
      name: 'Calça social',
      price: 78.99,
      image: 'assets/calca-social-feminina.jpg'
    },
    {
      name: 'Casaco Tricô',
      price: 39.99,
      image: 'assets/casaco-trico.jpg'
    },
    {
      name: 'Calça Wide Leg',
      price: 89.99,
      image: 'assets/calca-wide-leg.jpg'
    }
  ],

  Masculino: [
    {
      name: 'Casaco Marrom',
      price: 59.99,
      image: 'assets/casaco-marrom.jpg'
    },
    {
      name: 'Calça social',
      price: 78.99,
      image: 'assets/calca-social-masculina.jpg'
    },
    {
      name: 'Camiseta polo',
      price: 49.99,
      image: 'assets/camiseta-polo.jpg'
    },
    {
      name: 'Camiseta em V',
      price: 49.99,
      image: 'assets/camiseta-v.jpg'
    }
  ],

  Fitness: [
    {
      name: 'Conjunto Liso',
      price: 69.90,
      image: 'assets/conjunto-liso.jpg'
    },
    {
      name: 'Conjunto traçado',
      price: 69.90,
      image: 'assets/conjunto-tracado.jpg'
    },
    {
      name: 'Top branco',
      price: 25.00,
      image: 'assets/top-branco.jpg'
    },
    {
      name: 'Camiseta em V',
      price: 49.99,
      image: 'assets/camiseta-v-fitness.jpg'
    }
  ]
};

// VARIÁVEIS DO SITE
let currentCategory = 'Feminino';
let cart = [];
let loggedIn = false;

// FORMATAR PREÇOS EM REAIS
const money = value =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

// MOSTRAR MENSAGENS NA TELA
function toast(message) {
  const el = document.querySelector('#toast');

  el.textContent = message;
  el.classList.add('show');

  setTimeout(() => {
    el.classList.remove('show');
  }, 2600);
}

// NAVEGAR ENTRE AS PÁGINAS
function showPage(id) {
  if (
    (id === 'profile' || id === 'cart') &&
    !loggedIn
  ) {
    toast('Entre ou crie uma conta para continuar.');
    id = 'auth';
  }

  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === id);
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  if (id === 'cart') {
    renderCart();
  }
}

// ESCOLHER CATEGORIA
function setCategory(category) {
  currentCategory = category;

  document.querySelector('#catalog-title').textContent =
    category;

  document.querySelectorAll('.category-switch button')
    .forEach(button => {
      button.classList.toggle(
        'selected',
        button.dataset.category === category
      );
    });

  renderProducts();
  showPage('catalog');
}

// MOSTRAR OS PRODUTOS
function renderProducts() {
  const grid = document.querySelector('#product-grid');

  grid.innerHTML = '';

  products[currentCategory].forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const photo = document.createElement('div');
    photo.className = 'product-photo';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    // MOSTRAR ESPAÇO RESERVADO SE NÃO EXISTIR FOTO
    img.onerror = () => {
      img.style.display = 'none';

      const placeholder = document.createElement('div');

      placeholder.className = 'image-placeholder';
      placeholder.style.display = 'grid';

      placeholder.innerHTML =
        'Adicione a foto<br><strong>' +
        product.image.split('/').pop() +
        '</strong>';

      photo.append(placeholder);
    };

    photo.append(img);

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = money(product.price);

    const button = document.createElement('button');
    button.className = 'add-btn';
    button.textContent = 'Adicionar ao carrinho';

    button.onclick = () => {
      addToCart(product);
    };

    card.append(photo, title, price, button);

    grid.append(card);
  });
}

// ADICIONAR PRODUTO AO CARRINHO
function addToCart(product) {
  cart.push({ ...product });

  document.querySelector('#cart-count').textContent =
    cart.length;

  toast(product.name + ' adicionado ao carrinho!');
}

// MOSTRAR OS PRODUTOS DO CARRINHO
function renderCart() {
  const wrap = document.querySelector('#cart-items');

  wrap.innerHTML = '';

  if (cart.length === 0) {
    wrap.innerHTML =
      '<p class="empty-cart">' +
      'Seu carrinho está vazio. Explore as coleções ' +
      'para adicionar produtos.' +
      '</p>';
  }

  cart.forEach((item, index) => {
    const row = document.createElement('article');
    row.className = 'cart-item';

    const thumb = document.createElement('div');
    thumb.className = 'cart-thumb';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    img.onerror = () => {
      img.style.display = 'none';
    };

    thumb.append(img);

    const details = document.createElement('div');

    const name = document.createElement('h3');
    name.textContent = item.name;

    const price = document.createElement('p');
    price.textContent = money(item.price);

    details.append(name, price);

    const remove = document.createElement('button');
    remove.className = 'remove-btn';
    remove.textContent = 'Remover';

    remove.onclick = () => {
      cart.splice(index, 1);

      document.querySelector('#cart-count').textContent =
        cart.length;

      renderCart();
    };

    row.append(thumb, details, remove);

    wrap.append(row);
  });

  // CALCULAR O VALOR TOTAL
  const total = cart.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  document.querySelector('#cart-total').textContent =
    money(total);
}

// ALTERNAR ENTRE LOGIN E CADASTRO
function setAuthMode(mode) {
  const login = mode === 'login';

  document.querySelector('#login-form')
    .classList.toggle('hidden', !login);

  document.querySelector('#register-form')
    .classList.toggle('hidden', login);

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle(
      'active',
      tab.dataset.auth === mode
    );
  });
}

// BOTÕES DE NAVEGAÇÃO
document.querySelectorAll('[data-page]')
  .forEach(button => {
    button.addEventListener('click', () => {
      showPage(button.dataset.page);
    });
  });

// BOTÕES DE LOGIN E CADASTRO
document.querySelectorAll('[data-auth]')
  .forEach(button => {
    button.addEventListener('click', () => {
      setAuthMode(button.dataset.auth);
    });
  });

// BOTÕES DAS CATEGORIAS
document.querySelectorAll('[data-category]')
  .forEach(button => {
    button.addEventListener('click', () => {
      setCategory(button.dataset.category);
    });
  });

// LOGIN DEMONSTRATIVO
document.querySelector('#login-form')
  .addEventListener('submit', event => {
    event.preventDefault();

    loggedIn = true;

    document.body.classList.add('logged-in');

    document.querySelector('#profile-name').value =
      document.querySelector('#login-email')
        .value.split('@')[0];

    document.querySelector('#profile-email').value =
      document.querySelector('#login-email').value;

    toast('Entrada demonstrativa realizada!');

    showPage('catalog');
  });

// CADASTRO DEMONSTRATIVO
document.querySelector('#register-form')
  .addEventListener('submit', event => {
    event.preventDefault();

    loggedIn = true;

    document.body.classList.add('logged-in');

    document.querySelector('#profile-name').value =
      document.querySelector('#reg-name').value;

    document.querySelector('#profile-email').value =
      document.querySelector('#reg-email').value;

    document.querySelector('#profile-phone').value =
      document.querySelector('#reg-phone').value;

    toast('Conta demonstrativa criada!');

    showPage('catalog');
  });

// BOTÃO DO GOOGLE
document.querySelector('#google-btn')
  .addEventListener('click', () => {
    toast(
      'Integração com Google não configurada neste protótipo.'
    );
  });

// SALVAR PERFIL DEMONSTRATIVO
document.querySelector('#profile-form')
  .addEventListener('submit', event => {
    event.preventDefault();

    toast('Dados do perfil salvos nesta demonstração.');
  });

// SAIR DA CONTA
document.querySelector('#logout-btn')
  .addEventListener('click', () => {
    loggedIn = false;

    document.body.classList.remove('logged-in');

    toast('Você saiu da conta.');

    showPage('home');
  });

// FINALIZAR PEDIDO
document.querySelector('#checkout-form')
  .addEventListener('submit', event => {
    event.preventDefault();

    if (cart.length === 0) {
      toast(
        'Adicione ao menos um produto antes de comprar.'
      );
      return;
    }

    showPage('confirmation');

    cart = [];

    document.querySelector('#cart-count').textContent = '0';

    renderCart();
  });

// INICIALIZAR O CATÁLOGO
renderProducts();