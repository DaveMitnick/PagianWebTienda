// Mostrar/ocultar filtros en móvil
document.getElementById('mobileFiltersBtn').addEventListener('click', () => {
    const sidebar = document.querySelector('aside');
    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
});

// Datos de productos
const productsData = [
    { id: 1, title: "Smartphone Premium", description: "Smartphone de última generación con pantalla AMOLED de 6.7\", procesador Snapdragon 888 y cámara triple de 108MP.", price: 799, oldPrice: 999, rating: 4, category: "Electrónica", brand: "Samsung", badge: "20% OFF", image: "image/Celular.png" },
    { id: 2, title: "Auriculares Inalámbricos", description: "Auriculares con cancelación de ruido activa, batería de 30 horas y conectividad Bluetooth 5.0.", price: 199, rating: 5, category: "Electrónica", brand: "Sony", image: "image/Audifonos.png" },
    { id: 3, title: "Smartwatch Deportivo", description: "Monitoriza tu actividad física, frecuencia cardíaca y sueño con este smartwatch resistente al agua.", price: 149, rating: 3, category: "Electrónica", brand: "Apple", badge: "NUEVO", image: "image/smartwhach.png" },
    { id: 4, title: "Portátil Ultraligero", description: "Portátil de 14\" con procesador i7, 16GB RAM, SSD 512GB y peso inferior a 1kg.", price: 1299, rating: 4, category: "Electrónica", brand: "Apple", image: "image/SmartTV.png" },
    { id: 5, title: "Consola de Juegos", description: "La última consola con gráficos 4K HDR, almacenamiento de 1TB y dos mandos inalámbricos incluidos.", price: 499, oldPrice: 599, rating: 5, category: "Electrónica", brand: "Sony", badge: "OFERTA", image: "image/ControlVd.png" },
    { id: 6, title: "Televisor OLED 55\"", description: "Televisor con resolución 4K, tecnología OLED para negros perfectos y sonido Dolby Atmos integrado.", price: 1599, rating: 5, category: "Electrónica", brand: "LG", image: "image/SmartTV2.png" },
    { id: 7, title: "Cámara Réflex", description: "Cámara profesional con sensor APS-C, grabación de vídeo 4K y pantalla abatible táctil.", price: 899, rating: 4, category: "Electrónica", brand: "Sony", image: "image/Camara.png" },
    { id: 8, title: "Altavoz Inteligente", description: "Altavoz con asistente de voz, sonido de 360° y control para dispositivos del hogar inteligente.", price: 129, rating: 4, category: "Electrónica", brand: "Samsung", badge: "LIMITADO", image: "image/Audifonos.png" }
];

// Elementos del DOM
const searchInput = document.querySelector('.search-bar input');
const categoryCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]');
const brandCheckboxes = document.querySelectorAll('.filter-group:nth-child(5) input[type="checkbox"]');
const minPriceInput = document.querySelector('.price-values input[placeholder="Mínimo"]');
const maxPriceInput = document.querySelector('.price-values input[placeholder="Máximo"]');
const priceRange = document.querySelector('.price-range');
const sortSelect = document.querySelector('.sort-options');

// Guardar y cargar filtros del localStorage
function saveFilters() {
    const filters = {
        search: searchInput.value,
        categories: Array.from(categoryCheckboxes).map(cb => cb.checked),
        brands: Array.from(brandCheckboxes).map(cb => cb.checked),
        minPrice: minPriceInput.value,
        maxPrice: maxPriceInput.value,
        sort: sortSelect.value
    };
    localStorage.setItem('filters', JSON.stringify(filters));
}

function loadFilters() {
    const saved = JSON.parse(localStorage.getItem('filters'));
    if (!saved) return;
    searchInput.value = saved.search || '';
    saved.categories.forEach((checked, i) => categoryCheckboxes[i] && (categoryCheckboxes[i].checked = checked));
    saved.brands.forEach((checked, i) => brandCheckboxes[i] && (brandCheckboxes[i].checked = checked));
    minPriceInput.value = saved.minPrice || '0';
    maxPriceInput.value = saved.maxPrice || '1000';
    priceRange.value = saved.maxPrice || '1000';
    sortSelect.value = saved.sort || 'Ordenar por';
}

// Evento para filtrar y guardar filtros
function handleFilter() {
    filterProducts();
    saveFilters();
}

// Eventos
searchInput.addEventListener('input', handleFilter);
categoryCheckboxes.forEach(cb => cb.addEventListener('change', handleFilter));
brandCheckboxes.forEach(cb => cb.addEventListener('change', handleFilter));
priceRange.addEventListener('input', () => {
    maxPriceInput.value = priceRange.value;
    handleFilter();
});
minPriceInput.addEventListener('input', handleFilter);
maxPriceInput.addEventListener('input', () => {
    priceRange.value = maxPriceInput.value;
    handleFilter();
});
document.querySelector('.filters button').addEventListener('click', handleFilter);
sortSelect.addEventListener('change', handleFilter);

// Función principal de filtrado y ordenamiento
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.parentNode.textContent.trim());
    const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.parentNode.textContent.trim());
    const minPrice = Number(minPriceInput.value) || 0;
    const maxPrice = Number(maxPriceInput.value) || 10000;

    let filtered = productsData.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Ordenamiento
    const sortBy = sortSelect.value;
    if (sortBy === "Precio: menor a mayor") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "Precio: mayor a menor") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "Mejor valorados") filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "Novedades") filtered.sort((a, b) => b.id - a.id); // Simulamos "novedades" con id

    renderProducts(filtered);
}

// Renderizar productos
function renderProducts(products) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                <div>
                    <span class="product-price">$${product.price}</span>
                    ${product.oldPrice ? `<span class="product-discount">$${product.oldPrice}</span>` : ''}
                </div>
            </div>
            <div class="product-actions">
                <button class="add-to-cart">Añadir al carrito</button>
                <button class="wishlist">♥</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Iniciar
loadFilters();
filterProducts();
