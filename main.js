class ProductGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.mainImage = document.getElementById('mainImage');
        this.thumbnailsContainer = document.getElementById('thumbnails');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.setupEventListeners();
        this.fetchImages();
    }

    async fetchImages() {
        try {
            const response = await fetch('https://picsum.photos/v2/list?page=1&limit=5');
            const data = await response.json();
            this.images = data.map(img => ({
                full: `https://picsum.photos/id/${img.id}/800/800`,
                thumb: `https://picsum.photos/id/${img.id}/200/200`
            }));
            this.initializeGallery();
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    initializeGallery() {
        this.updateMainImage();
        this.renderThumbnails();
    }

    updateMainImage() {
        if (this.images.length === 0) return;
        this.mainImage.src = this.images[this.currentIndex].full;
        this.updateThumbnailsState();
    }

    renderThumbnails() {
        this.thumbnailsContainer.innerHTML = this.images
            .map((img, index) => `
                <div class="thumbnail ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <img src="${img.thumb}" alt="Product thumbnail ${index + 1}">
                </div>
            `)
            .join('');

        this.thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.currentIndex = parseInt(thumb.dataset.index);
                this.updateMainImage();
            });
        });
    }

    updateThumbnailsState() {
        const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        let touchStartX = 0;
        let touchEndX = 0;

        this.mainImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.mainImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

      
        document.getElementById('decreaseQty').addEventListener('click', () => {
            const input = document.getElementById('quantity');
            if (input.value > 1) input.value = parseInt(input.value) - 1;
        });

        document.getElementById('increaseQty').addEventListener('click', () => {
            const input = document.getElementById('quantity');
            if (input.value < 10) input.value = parseInt(input.value) + 1;
        });

      
        document.querySelector('.add-to-cart-btn').addEventListener('click', this.handleAddToCart);
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigate(-1); 
            } else {
                this.navigate(1); 
            }
        }
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        this.updateMainImage();
    }

    handleAddToCart() {
        const quantity = document.getElementById('quantity').value;
        const color = document.getElementById('color').value;
        const message = document.getElementById('confirmationMessage');
        
        message.textContent = `Added ${quantity} item(s) in ${color} to cart!`;
        message.classList.add('show');
        
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
});