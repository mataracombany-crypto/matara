document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainScreen = document.getElementById('main-screen');
    const productsGrid = document.getElementById('products-grid');
    const productModal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const galleryImage = document.getElementById('gallery-image');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');

    let products = (typeof window.PRODUCTS !== 'undefined') ? window.PRODUCTS : [];
    let currentProduct = null;
    let currentImageIndex = 0;

    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            renderProducts();
        }, 1000);
    }, 8000);

    function renderProducts() {
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1; font-size: 1.2rem;">لا توجد منتجات بعد. أضف مجلداً داخل products/ ثم شغّل تحديث-المنتجات.bat</p>';
            return;
        }
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const img = document.createElement('img');
            img.src = 'products/' + product.folder + '/' + product.images[0];
            img.alt = product.name;
            img.className = 'product-card-image';

            const name = document.createElement('h3');
            name.className = 'product-card-name';
            name.textContent = product.name;

            card.appendChild(img);
            card.appendChild(name);
            card.addEventListener('click', () => openProduct(index));
            productsGrid.appendChild(card);
        });
    }

    function openProduct(index) {
        currentProduct = products[index];
        currentImageIndex = 0;
        modalTitle.textContent = currentProduct.name;
        galleryImage.src = 'products/' + currentProduct.folder + '/' + currentProduct.images[0];
        if (currentProduct.description && currentProduct.description.trim()) {
            modalDescription.textContent = currentProduct.description;
            modalDescription.style.display = '';
        } else {
            modalDescription.style.display = 'none';
        }
        productModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        loadProductDescription(currentProduct);
    }

    function closeProduct() {
        productModal.classList.add('hidden');
        document.body.style.overflow = '';
        currentProduct = null;
    }

    function showNextImage() {
        if (!currentProduct) return;
        currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
        galleryImage.src = 'products/' + currentProduct.folder + '/' + currentProduct.images[currentImageIndex];
    }

    function showPrevImage() {
        if (!currentProduct) return;
        currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
        galleryImage.src = 'products/' + currentProduct.folder + '/' + currentProduct.images[currentImageIndex];
    }

    async function loadProductDescription(product) {
        if (product.description && product.description.trim()) {
            modalDescription.textContent = product.description;
            modalDescription.style.display = '';
            return;
        }

        const descriptionFile = product.descriptionFile || 'Text Document جديد.txt';

        try {
            const response = await fetch('products/' + encodeURIComponent(product.folder) + '/' + encodeURIComponent(descriptionFile));
            if (!response.ok) {
                throw new Error('Description file not found');
            }

            const text = (await response.text()).trim();
            if (currentProduct !== product) return;

            if (text) {
                product.description = text;
                modalDescription.textContent = text;
                modalDescription.style.display = '';
            }
        } catch (error) {
            if (currentProduct !== product) return;
        }
    }

    modalClose.addEventListener('click', closeProduct);
    modalOverlay.addEventListener('click', closeProduct);
    galleryNext.addEventListener('click', showNextImage);
    galleryPrev.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (productModal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeProduct();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
});
