$(document).ready(function(){
    $('.my-carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        buttons: true,
        prevArrow: $('.slick-prev'),
        nextArrow: $('.slick-next')
    });

    // Function to add a new slide
    function addSlide() {
        const slide = $('<div>', { class: 'slide' });
        const halfSlide1 = $('<div>', { class: 'half-slide' });
        const halfSlide2 = $('<div>', { class: 'half-slide' });
        const img1 = $('<img>', { src: `https://picsum.photos/200/300?random=${Math.random()}` });
        const img2 = $('<img>', { src: `https://picsum.photos/200/300?random=${Math.random()}` });
        halfSlide1.append(img1);
        halfSlide2.append(img2);
        slide.append(halfSlide1);
        slide.append(halfSlide2);
        $('.my-carousel').slick('slickAdd', slide);
    }

    // Add a new slide every 3 seconds
    setInterval(addSlide, 3000);
});
