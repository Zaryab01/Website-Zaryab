document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('[data-cyber-scroll]');
    const scrollText = document.querySelector('[data-scroll-text]');
    const certificateSlider = document.querySelector('[data-certificate-slider]');

    if (scrollContainer && scrollText) {
        let direction = 1;
        const speed = 0.25;

        const animateScroll = () => {
            scrollText.scrollTop += speed * direction;

            const maxScroll = scrollText.scrollHeight - scrollText.clientHeight;

            if (scrollText.scrollTop <= 0) {
                direction = 1;
            } else if (scrollText.scrollTop >= maxScroll) {
                direction = -1;
            }

            scrollContainer.dataset.scrollAnimating = 'true';
            requestAnimationFrame(animateScroll);
        };

        animateScroll();
    }

    if (certificateSlider) {
        const track = certificateSlider.querySelector('[data-certificate-track]');
        const slides = Array.from(track.children);
        let index = 0;

        if (slides.length > 1) {
            setInterval(() => {
                index = (index + 1) % slides.length;
                track.style.transform = `translateX(-${index * 100}%)`;
            }, 2000);
        }
    }
});
