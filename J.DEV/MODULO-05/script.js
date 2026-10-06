const products = [
    { id: 'bolo-chocolate', name: 'Bolo de chocolate & café', category: 'bolos', label: 'Mais querido', price: 78, rating: '4,9 (32)', image: 'photo-1578985545062-69928b1d9587', description: 'Massa úmida de cacau, café coado e uma cobertura cremosa de chocolate meio amargo. Para dividir à mesa — ou guardar só para você.', vegan: false },
    { id: 'bolo-limao', name: 'Bolo de limão siciliano', category: 'bolos', label: 'Da estação', price: 72, rating: '4,8 (21)', image: 'photo-1464349095431-e9a21285b5f3', description: 'Massa leve com raspas de limão siciliano e uma cobertura delicada, azedinha na medida certa.', vegan: false },
    { id: 'bolo-cenoura', name: 'Bolo de cenoura da casa', category: 'bolos', label: 'Clássico', price: 64, rating: '5,0 (18)', image: 'photo-1571115177098-24ec42ed204d', description: 'Aquele bolo de cenoura fofinho que abraça. Vai com uma generosa calda de chocolate e memória afetiva.', vegan: false },
    { id: 'bolo-vegano', name: 'Bolo de banana & canela', category: 'bolos', label: 'Vegano', price: 68, rating: '4,9 (14)', image: 'photo-1602351447937-745cb720612f', description: 'Bananas bem maduras, canela e uma massa macia sem nenhum ingrediente de origem animal.', vegan: true },
    { id: 'fatia-red-velvet', name: 'Fatia red velvet', category: 'fatias', label: 'Um mimo', price: 18, rating: '4,9 (27)', image: 'photo-1586788680434-30d324b2d46f', description: 'Uma fatia generosa de red velvet com camadas suaves de cream cheese e baunilha.', vegan: false },
    { id: 'mini-torta', name: 'Mini torta de frutas', category: 'fatias', label: 'Da estação', price: 22, rating: '4,8 (12)', image: 'photo-1488477181946-6428a0291777', description: 'Base amanteigada, creme de baunilha feito na casa e frutas frescas escolhidas na feira.', vegan: false },
    { id: 'cookie-chocolate', name: 'Cookie de chocolate & flor de sal', category: 'cookies', label: 'Mais querido', price: 12, rating: '5,0 (41)', image: 'photo-1499636136210-6f4ee915583e', description: 'Por fora crocante, por dentro macio e recheado de chocolate. A pitadinha de flor de sal faz toda a diferença.', vegan: false },
    { id: 'caixa-afeto', name: 'Caixinha um dia feliz', category: 'presentes', label: 'Para presentear', price: 48, rating: '5,0 (16)', image: 'photo-1486427944299-d1955d23e34d', description: 'Uma caixinha preparada com carinho, com cookies artesanais e pequenos doces para transformar qualquer dia.', vegan: false }
];

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const imageUrl = (image, width = 700) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=82`;

function applyTheme(theme, animate = false) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    const canAnimate = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.clearTimeout(applyTheme.transitionTimer);
    document.documentElement.classList.toggle('theme-transitioning', canAnimate);
    document.documentElement.dataset.theme = selectedTheme;
    if (canAnimate) {
        applyTheme.transitionTimer = window.setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 380);
    } else {
        document.documentElement.classList.remove('theme-transitioning');
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
        const nextTheme = selectedTheme === 'dark' ? 'light' : 'dark';
        const label = nextTheme === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro';
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', selectedTheme === 'dark' ? '#191816' : '#fbf9f6');
}

function setupThemeToggle() {
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('doce-de-tarde-theme') || 'light';
    } catch (error) {
        console.error('Não foi possível carregar a preferência de tema.', error);
    }
    applyTheme(savedTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme, true);
            try {
                localStorage.setItem('doce-de-tarde-theme', nextTheme);
            } catch (error) {
                console.error('Não foi possível salvar a preferência de tema.', error);
                showToast('A preferência de tema não pôde ser salva neste navegador.');
            }
        });
    });
    window.addEventListener('storage', event => {
        if (event.key === 'doce-de-tarde-theme') applyTheme(event.newValue, true);
    });
}

function setupHeroHeader() {
    const header = document.querySelector('.site-header--hero');
    if (!header) return;
    let scheduled = false;
    const updateHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        scheduled = false;
    };
    window.addEventListener('scroll', () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
}

function createProductCard(product, compact = false) {
    const article = document.createElement('article');
    article.className = compact ? 'product-card compact-card' : 'product-card';
    const link = document.createElement('a');
    link.className = 'product-image';
    link.href = `produto.html?id=${encodeURIComponent(product.id)}`;
    link.setAttribute('aria-label', `Ver ${product.name}`);
    const image = document.createElement('img');
    image.src = imageUrl(product.image, compact ? 500 : 700);
    image.alt = product.name;
    image.loading = 'lazy';
    link.append(image);

    const info = document.createElement('div');
    info.className = 'product-info';
    const name = document.createElement('a');
    name.className = 'product-name';
    name.href = link.href;
    name.textContent = product.name;
    const rating = document.createElement('span');
    rating.className = 'product-rating';
    rating.innerHTML = `<span aria-hidden="true">★</span> ${product.rating}`;
    const line = document.createElement('div');
    line.className = 'product-price-line';
    const price = document.createElement('strong');
    price.textContent = currency.format(product.price);
    const actions = document.createElement('div');
    actions.className = 'product-actions';
    const addButton = document.createElement('button');
    addButton.className = 'button button-outline button-small';
    addButton.type = 'button';
    addButton.dataset.addToCart = product.id;
    addButton.textContent = 'Adicionar';
    const details = document.createElement('a');
    details.className = 'button button-dark button-small';
    details.href = link.href;
    details.textContent = 'Comprar';
    line.append(price);
    actions.append(addButton, details);
    info.append(name, rating, line, actions);
    article.append(link, info);
    return article;
}

function renderProducts() {
    const grid = document.querySelector('#product-grid');
    if (!grid) return;
    const category = document.querySelector('input[name="category"]:checked')?.value || 'todos';
    const search = document.querySelector('#product-search')?.value.trim().toLocaleLowerCase('pt-BR') || '';
    const bestsellers = document.querySelector('#bestsellers')?.checked;
    const vegan = document.querySelector('#vegan')?.checked;
    const sort = document.querySelector('#product-sort')?.value;
    let visible = products.filter(product => {
        const matchesCategory = category === 'todos' || product.category === category;
        const matchesSearch = `${product.name} ${product.label}`.toLocaleLowerCase('pt-BR').includes(search);
        return matchesCategory && matchesSearch && (!bestsellers || product.label === 'Mais querido') && (!vegan || product.vegan);
    });
    if (sort === 'price-low') visible.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') visible.sort((a, b) => b.price - a.price);
    if (sort === 'name') visible.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    grid.replaceChildren(...visible.map(product => createProductCard(product)));
    const total = document.querySelector('#product-total');
    if (total) total.textContent = String(visible.length).padStart(2, '0');
    const emptyState = document.querySelector('#empty-state');
    if (emptyState) emptyState.hidden = visible.length !== 0;
}

function renderRecommendations(exceptId) {
    const track = document.querySelector('#recommendation-track');
    if (!track) return;
    const selected = products.filter(product => product.id !== exceptId).slice(0, 4);
    track.replaceChildren(...selected.map(product => createProductCard(product, true)));
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('doce-de-tarde-cart') || '{}');
        return cart && typeof cart === 'object' && !Array.isArray(cart) ? cart : {};
    } catch (error) {
        console.error('Não foi possível carregar a sacola salva.', error);
        return {};
    }
}

function updateCartCount() {
    const total = Object.values(getCart()).reduce((sum, quantity) => sum + (Number(quantity) || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(counter => {
        counter.textContent = String(total);
        counter.setAttribute('aria-label', `${total} itens na sacola`);
    });
    renderCart();
}

function renderCart() {
    const itemsContainer = document.querySelector('#cart-items');
    const summary = document.querySelector('#cart-summary');
    if (!itemsContainer || !summary) return;
    const cart = getCart();
    const entries = Object.entries(cart)
        .map(([id, quantity]) => ({ product: products.find(item => item.id === id), quantity: Number(quantity) }))
        .filter(entry => entry.product && Number.isFinite(entry.quantity) && entry.quantity > 0);
    itemsContainer.replaceChildren();
    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'cart-empty';
        empty.textContent = 'Sua sacola ainda está vazia. Tem um docinho esperando por você.';
        const browse = document.createElement('a');
        browse.className = 'button button-dark cart-checkout';
        browse.href = 'home.html#catalogo';
        browse.textContent = 'Descobrir o cardápio';
        itemsContainer.append(empty);
        summary.replaceChildren(browse);
        return;
    }
    let total = 0;
    for (const { product, quantity } of entries) {
        total += product.price * quantity;
        const row = document.createElement('div');
        row.className = 'cart-row';
        const image = document.createElement('img');
        image.className = 'cart-item-image';
        image.src = imageUrl(product.image, 180);
        image.alt = product.name;
        image.loading = 'lazy';
        const description = document.createElement('div');
        description.className = 'cart-item-info';
        const name = document.createElement('strong');
        name.textContent = product.name;
        const unitPrice = document.createElement('span');
        unitPrice.textContent = `${currency.format(product.price)} cada`;
        const quantityControls = document.createElement('div');
        quantityControls.className = 'cart-quantity';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.dataset.cartChange = '-1';
        decrease.dataset.productId = product.id;
        decrease.setAttribute('aria-label', `Diminuir quantidade de ${product.name}`);
        decrease.textContent = '−';
        const quantityLabel = document.createElement('span');
        quantityLabel.textContent = String(quantity);
        quantityLabel.setAttribute('aria-label', `Quantidade: ${quantity}`);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.dataset.cartChange = '1';
        increase.dataset.productId = product.id;
        increase.setAttribute('aria-label', `Aumentar quantidade de ${product.name}`);
        increase.textContent = '+';
        quantityControls.append(decrease, quantityLabel, increase);
        description.append(name, unitPrice, quantityControls);
        const price = document.createElement('strong');
        price.className = 'cart-item-price';
        price.textContent = currency.format(product.price * quantity);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'cart-remove';
        remove.dataset.cartRemove = product.id;
        remove.setAttribute('aria-label', `Remover ${product.name} da sacola`);
        remove.textContent = '×';
        row.append(image, description, price, remove);
        itemsContainer.append(row);
    }
    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Subtotal';
    const totalPrice = document.createElement('strong');
    totalPrice.textContent = currency.format(total);
    const checkout = document.createElement('a');
    checkout.className = 'button button-dark cart-checkout';
    checkout.textContent = 'Finalizar pedido ↗';
    checkout.href = `mailto:contato@docedetarde.com.br?subject=${encodeURIComponent('Meu pedido — Doce de Tarde')}&body=${encodeURIComponent(`${entries.map(({ product, quantity }) => `${quantity}x ${product.name} — ${currency.format(product.price * quantity)}`).join('\n')}\n\nSubtotal: ${currency.format(total)}\n\nMeu nome:\nData desejada para retirada/entrega:\nObservações:`)}`;
    const note = document.createElement('p');
    note.className = 'cart-note';
    note.textContent = 'A disponibilidade e a entrega serão confirmadas por e-mail.';
    summary.replaceChildren(totalLabel, totalPrice, checkout, note);
}

function setCartPopover(open, restoreFocus = false) {
    const popover = document.querySelector('#cart-popover');
    const toggle = document.querySelector('[data-open-cart]');
    if (!popover || !toggle) return;
    window.clearTimeout(setCartPopover.closeTimer);
    if (open) {
        popover.hidden = false;
        popover.classList.remove('is-closing');
    } else if (!popover.hidden) {
        popover.classList.add('is-closing');
        setCartPopover.closeTimer = window.setTimeout(() => {
            popover.hidden = true;
            popover.classList.remove('is-closing');
        }, 140);
    }
    toggle.setAttribute('aria-expanded', String(open));
    if (open) document.querySelector('[data-close-cart]')?.focus({ preventScroll: true });
    else if (restoreFocus) toggle.focus({ preventScroll: true });
}

function showToast(message) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function addToCart(productId, quantity = 1) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const cart = getCart();
    cart[productId] = (Number(cart[productId]) || 0) + quantity;
    try {
        localStorage.setItem('doce-de-tarde-cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Não foi possível salvar sua sacola.', error);
        showToast('Não foi possível salvar a sacola neste navegador.');
        return;
    }
    updateCartCount();
    showToast(`${product.name} adicionado à sua sacola ♡`);
}

function renderProductDetail() {
    const container = document.querySelector('#product-detail');
    if (!container) return;
    const product = products.find(item => item.id === new URLSearchParams(location.search).get('id'));
    if (!product) {
        const message = document.createElement('div');
        message.className = 'not-found';
        message.innerHTML = '<p class="eyebrow">Ops, esse doce não está no cardápio</p><h1>Não encontramos essa delícia.</h1><a class="button button-dark" href="home.html#catalogo">Voltar ao cardápio <span aria-hidden="true">↗</span></a>';
        container.replaceChildren(message);
        return;
    }
    document.title = `${product.name} — Doce de Tarde`;
    document.querySelector('#product-breadcrumb').textContent = product.name;
    const imageWrap = document.createElement('div');
    imageWrap.className = 'detail-image';
    const image = document.createElement('img');
    image.src = imageUrl(product.image, 1200);
    image.alt = product.name;
    image.fetchPriority = 'high';
    const previewHint = document.createElement('span');
    previewHint.className = 'preview-hint';
    previewHint.textContent = 'Mova a imagem para explorar';
    imageWrap.append(image, previewHint);

    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `<p class="eyebrow">Feito à mão, com carinho</p>`;
    const title = document.createElement('h1');
    title.textContent = product.name;
    const rating = document.createElement('p');
    rating.className = 'detail-rating';
    rating.innerHTML = `<span aria-hidden="true">★</span> ${product.rating} avaliações`;
    const price = document.createElement('p');
    price.className = 'detail-price';
    price.textContent = currency.format(product.price);
    const description = document.createElement('p');
    description.className = 'detail-description';
    description.textContent = product.description;
    const note = document.createElement('p');
    note.className = 'detail-note';
    note.innerHTML = '<span aria-hidden="true">✿</span> Preparado fresquinho após a sua encomenda.';
    const quantityLabel = document.createElement('label');
    quantityLabel.className = 'quantity-label';
    quantityLabel.htmlFor = 'quantity';
    quantityLabel.textContent = 'Quantidade';
    const quantity = document.createElement('input');
    quantity.id = 'quantity';
    quantity.type = 'number';
    quantity.min = '1';
    quantity.max = '20';
    quantity.value = '1';
    quantity.setAttribute('aria-label', 'Quantidade');
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'button button-dark detail-add';
    addButton.dataset.addToCart = product.id;
    addButton.textContent = 'Adicionar à sacola';
    const contactLink = document.createElement('a');
    contactLink.className = 'detail-contact';
    contactLink.href = 'contato.html';
    contactLink.textContent = 'Precisa de uma encomenda especial? Fale com a gente ↗';
    info.append(title, rating, price, description, note, quantityLabel, quantity, addButton, contactLink);
    container.replaceChildren(imageWrap, info);
    setupProductPreview(imageWrap);
    renderRecommendations(product.id);
}

function setupProductPreview(preview) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    preview.addEventListener('pointermove', event => {
        const bounds = preview.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const rotateY = (x - 0.5) * 10;
        const rotateX = (0.5 - y) * 8;
        preview.style.setProperty('--preview-rotate-x', `${rotateX}deg`);
        preview.style.setProperty('--preview-rotate-y', `${rotateY}deg`);
        preview.style.setProperty('--preview-light-x', `${x * 100}%`);
        preview.style.setProperty('--preview-light-y', `${y * 100}%`);
        preview.classList.add('is-interacting');
    });
    preview.addEventListener('pointerleave', () => {
        preview.style.setProperty('--preview-rotate-x', '0deg');
        preview.style.setProperty('--preview-rotate-y', '0deg');
        preview.classList.remove('is-interacting');
    });
}

function setupContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const subject = `Contato Doce de Tarde — ${data.get('assunto')}`;
        const body = `Nome: ${data.get('nome')}\nE-mail: ${data.get('email')}\nAssunto: ${data.get('assunto')}\n\nMensagem:\n${data.get('mensagem')}`;
        const feedback = document.querySelector('#form-feedback');
        if (feedback) feedback.textContent = 'Seu aplicativo de e-mail será aberto com a mensagem. Revise e envie por lá. Se não abrir, escreva para contato@docedetarde.com.br.';
        window.location.href = `mailto:contato@docedetarde.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

document.addEventListener('click', event => {
    const cartOpener = event.target.closest('[data-open-cart]');
    if (cartOpener) {
        event.preventDefault();
        const popover = document.querySelector('#cart-popover');
        setCartPopover(popover?.hidden ?? false);
        return;
    }
    const cartCloser = event.target.closest('[data-close-cart]');
    if (cartCloser) {
        setCartPopover(false, true);
        return;
    }
    if (!event.target.closest('#cart-popover') && !document.querySelector('#cart-popover')?.hidden) {
        setCartPopover(false);
    }
    const quantityButton = event.target.closest('[data-cart-change]');
    if (quantityButton) {
        const cart = getCart();
        const productId = quantityButton.dataset.productId;
        const quantity = (Number(cart[productId]) || 0) + Number(quantityButton.dataset.cartChange);
        if (quantity < 1) delete cart[productId];
        else cart[productId] = Math.min(20, quantity);
        try {
            localStorage.setItem('doce-de-tarde-cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Não foi possível atualizar sua sacola.', error);
            showToast('Não foi possível atualizar a sacola neste navegador.');
            return;
        }
        updateCartCount();
        return;
    }
    const removeButton = event.target.closest('[data-cart-remove]');
    if (removeButton) {
        const cart = getCart();
        delete cart[removeButton.dataset.cartRemove];
        try {
            localStorage.setItem('doce-de-tarde-cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Não foi possível atualizar sua sacola.', error);
            showToast('Não foi possível atualizar a sacola neste navegador.');
            return;
        }
        updateCartCount();
        showToast('Doce removido da sacola.');
        return;
    }
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
        const quantity = document.querySelector('#quantity');
        const amount = quantity ? Math.min(20, Math.max(1, Number.parseInt(quantity.value, 10) || 1)) : 1;
        addToCart(addButton.dataset.addToCart, amount);
        return;
    }
    const scrollButton = event.target.closest('[data-scroll]');
    if (scrollButton) {
        document.querySelector('#recommendation-track')?.scrollBy({ left: Number(scrollButton.dataset.scroll) * 300, behavior: 'smooth' });
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('#cart-popover')?.hidden) setCartPopover(false, true);
});
window.addEventListener('storage', event => {
    if (event.key === 'doce-de-tarde-cart') updateCartCount();
});

document.addEventListener('change', event => {
    if (event.target.matches('input[name="category"], #bestsellers, #vegan, #product-sort')) renderProducts();
});
document.querySelector('#product-search')?.addEventListener('input', renderProducts);

function setupNavigationIndicator() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const links = [...nav.querySelectorAll('a')];
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    nav.append(indicator);

    let activeLink = links.find(link => link.classList.contains('is-active')) || links[0];
    const moveTo = link => {
        if (!link) return;
        indicator.style.width = `${link.offsetWidth}px`;
        indicator.style.transform = `translateX(${link.offsetLeft}px)`;
        nav.classList.add('indicator-ready');
    };
    const setActive = link => {
        activeLink = link;
        links.forEach(item => item.classList.toggle('is-active', item === link));
        moveTo(link);
    };

    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveTo(link));
        link.addEventListener('focus', () => moveTo(link));
        link.addEventListener('click', () => {
            const destination = new URL(link.href, location.href);
            if (destination.pathname === location.pathname && destination.hash) setActive(link);
        });
    });
    nav.addEventListener('mouseleave', () => moveTo(activeLink));
    nav.addEventListener('focusout', event => {
        if (!nav.contains(event.relatedTarget)) moveTo(activeLink);
    });
    window.addEventListener('resize', () => moveTo(activeLink));
    if (document.querySelector('#catalogo')) {
        const homeLink = links.find(link => new URL(link.href, location.href).pathname === location.pathname && !new URL(link.href, location.href).hash);
        const catalogLink = links.find(link => new URL(link.href, location.href).hash === '#catalogo');
        const sectionObserver = new IntersectionObserver(entries => {
            const visibleSection = entries.find(entry => entry.isIntersecting);
            if (visibleSection) setActive(visibleSection.target.id === 'catalogo' ? catalogLink : homeLink);
        }, { rootMargin: '-18% 0px -72% 0px' });
        const hero = document.querySelector('.hero');
        if (hero) sectionObserver.observe(hero);
        sectionObserver.observe(document.querySelector('#catalogo'));
    }
    requestAnimationFrame(() => moveTo(activeLink));
}

setupNavigationIndicator();

document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download') || link.hasAttribute('data-open-cart')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (document.documentElement.classList.contains('page-leaving')) return;
    document.documentElement.classList.add('page-leaving');
    window.setTimeout(() => { location.href = destination.href; }, 110);
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('page-entering');
    window.setTimeout(() => document.documentElement.classList.remove('page-entering'), 220);
}

renderProducts();
renderRecommendations();
renderProductDetail();
updateCartCount();
setupContactForm();
setupThemeToggle();
setupHeroHeader();
