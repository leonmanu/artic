$(window).on("load", function () {
    hideSpinner()
    
})

$(document).ready(function () {
    const secondaryNavbar = $(".secondary-navbar");
    const primaryNavbarHeight = $(".navbar").outerHeight(); // Altura del navbar principal

    $(window).on("scroll", function () {
        if ($(this).scrollTop() > primaryNavbarHeight) {
            $("body").addClass("scrolled");
        } else {
            $("body").removeClass("scrolled");
        }
    });
});

function showSpinner() {
    $('#loading-spinner').addClass('d-flex')
}

function hideSpinner() {
    $('#loading-spinner').addClass('d-none')
}