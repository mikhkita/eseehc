var lastresize;
$(document).ready(function(){	
    var pc = false, tablet = false, mobile = false;
    function mydevice () {
        pc = false; 
        tablet = false;
        mobile = false;
        if (myWidth>=1440) {
            pc = true;
        }
        else    if (myWidth>768) {
            tablet = true; 
        }
        else {
            mobile = true;
        }  
    }    
    function resize(){
       if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || 
        document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        
        mydevice(); 
        slideOutClosePc ();
        assortmentSlider();
        if ($('.slider-1').length) {
            resizeFirstSlide();
        }        
        blogSlider();
        mobileAssortmentMargin();        
    }
    $(window).resize(resize);
    resize();

    $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    $.fn.placeholder();
    
	// var myPlace = new google.maps.LatLng(55.754407, 37.625151);
 //    var myOptions = {
 //        zoom: 16,
 //        center: myPlace,
 //        mapTypeId: google.maps.MapTypeId.ROADMAP,
 //        disableDefaultUI: true,
 //        scrollwheel: false,
 //        zoomControl: true
 //    }
 //    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 

 //    var marker = new google.maps.Marker({
	//     position: myPlace,
	//     map: map,
	//     title: "Ярмарка вакансий и стажировок"
	// });

    //  var options = {
    //     $AutoPlay: true,                                
    //     $SlideDuration: 500,                            

    //     $BulletNavigatorOptions: {                      
    //         $Class: $JssorBulletNavigator$,             
    //         $ChanceToShow: 2,                           
    //         $AutoCenter: 1,                            
    //         $Steps: 1,                                  
    //         $Lanes: 1,                                  
    //         $SpacingX: 10,                              
    //         $SpacingY: 10,                              
    //         $Orientation: 1                             
    //     }
    // };

    // var jssor_slider1 = new $JssorSlider$("slider1_container", options);
         
           
    // console.log(pc,tablet,mobile);
    lastresize = myHeight;
    function resizeFirstSlide () {
        if (mobile == true) {
            if ( ((lastresize - myHeight) < (-81) ) || ((lastresize - myHeight) > 81)) {
                resizeFirstSlideMobile();
                lastresize = myHeight; 
            }         
        }
        else {
            resizeFirstSlideOther();             
        }
    }

    function resizeFirstSlideMobile () {
        var offsetslider = $('.slider-1').offset().top;
        var resultheight = myHeight - offsetslider;
        $('.slider-1').css({'height':''+resultheight+'px'});
        sliderItems = $('.slider-1-item').length;
        for (var i = sliderItems; i >= 0; i--) {
             $('.slider-1-item:nth-child('+i+')').css({'height':''+resultheight+'px'});
         }         
    }
    if ($('.slider-1').length) {
        resizeFirstSlideMobile();
    }

    function resizeFirstSlideOther () {
        $('.slider-1').css({'height':''+myHeight+'px'});
        sliderItems = $('.slider-1-item').length;
        for (var i = sliderItems; i >= 0; i--) {
        $('.slider-1-item:nth-child('+i+')').css({'height':''+myHeight+'px'});
         }         
    }
    

    $(".slider-1").on('init', function(slick){
        $(".slider-1").addClass("loaded");
        // console.log('init');
    });
    $('.slider-1').slick({
        dots: true,
        slidesToShow: 1,
        prevArrow: false,
        nextArrow: false,         
        infinite: true   
    });
    $(".slider-1").on('init', function(slick){
        $(".slider-1").addClass("loaded");
        // console.log('init');
    });

    function assortmentSlider () {
        if (mobile == true ) {
            $('.assortment-slider.slick-slider').slick('unslick'); 
            $('.assortment-slider').slick({
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                variableWidth: true,
                autoplay: true,
                autoplaySpeed: 3000,                
                prevArrow: '<div class="icon-arrow-left"></div>',
                nextArrow: '<div class="icon-arrow-right"></div>'                 
            });            
        }
        else {
            $('.assortment-slider.slick-slider').slick('unslick');
            $('.assortment-slider').slick({
                dots: true,
                //dotsClass: 'slick-dots assortment-slider anim fadeDown',
                slidesToShow: 2,
                speed: 1000,
                slidesToScroll: 2,
                infinite: true,
                variableWidth: true,
                autoplay: true,
                autoplaySpeed: 3000,                
                prevArrow: '<div class="icon-arrow-left"></div>',
                nextArrow: '<div class="icon-arrow-right"></div>'                       
            }); 
            //$('.assortment-slider.slick-slider .slick-dots').attr("data-anim","fadeDown");
            //$('.assortment-slider.slick-slider .slick-dots').attr("data-cont",".assortment-slider");
        }
      
    }
    function blogSlider () {
        if (mobile == true ) {
            $('.blog-slider-mobile').slick({
                dots: true,
                slidesToShow: 1,
                prevArrow: false,
                nextArrow: false,       
                infinite: true            
            });            
        }
        else {
            $('.blog-slider').slick({
                dots: true,
                slidesToShow: 1,
                prevArrow: false,
                nextArrow: false,       
                infinite: true            
            }); 
        }        
    }
    
    function slideOutClosePc () {
        if (mobile == false) {
            slideout.close();
            if ($(".toggle-button2").length>0) {
                slideout2.close();
            } 
        }
    }
    function mobileAssortmentMargin() {
        if (($(".b.b-3 .assortment").length) && (mobile == true)) {
        var offsetBlock = $(".b-3").offset().top,
            blockheight = $(".b-3").height(),
            offsetSlider = $(".b.b-3 .assortment-slider").offset().top + $(".b.b-3 .assortment-slider").height() + 25,
            calculatedMargin = offsetSlider - (offsetBlock + blockheight); 
            $(".b-3").css({'margin-bottom':''+calculatedMargin+'px'})
        }
        else {$(".b-3").css({'margin-bottom':'0px'})}
    }
    

    function moverHomePartnershipBlock(){
        if ((mobile == false) && ($('.slider-1').length)) {
            var scroll = ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop)+myHeight;
            var partnershipOuterContHeight = $(".partnership").height(),
                partnershipOuterContOffset = $(".partnership").offset().top,
                partnershipSelfHeight = $(".partnership-valigncard").height(),
                partnershipSelfOffset = $(".partnership-valigncard").offset().top,
                calculatedPositionMiddle = (partnershipOuterContHeight - partnershipSelfHeight)/2,
                calculatedPositionSet = scroll - partnershipOuterContOffset - partnershipSelfHeight,
                calculatedPositionCurrent = partnershipSelfOffset - partnershipOuterContOffset;
            if (!$(".partnership-valigncard").hasClass("ended")) {
                if (scroll>=(partnershipOuterContOffset+partnershipSelfHeight)) {
                    if (scroll>=(partnershipOuterContOffset+partnershipSelfHeight+calculatedPositionMiddle)) {
                        $(".partnership-valigncard").css({"top":''+calculatedPositionMiddle+'px'});
                        $(".partnership-valigncard").addClass("ended");
                    }
                    else {
                        if (calculatedPositionSet > Number(($(".partnership-valigncard").css("top").replace("px","")))) {
                            $(".partnership-valigncard").css({"top":''+calculatedPositionSet+'px'});
                        }
                    }
                }
            }
        }  
    }
    $(window).scroll(moverHomePartnershipBlock);
    moverHomePartnershipBlock(); 

    // $('.uslovia-checkbox').click(function(){
    //     if ($('.uslovia-checkbox').hasClass("checked")){
    //         $('.uslovia-checkbox').removeClass("checked");
    //         $('#uslovia-checkbox').checked("false");
    //     } else {
    //         $('.uslovia-checkbox').addClass("checked");
    //         $('#uslovia-checkbox').checked("true");
    //     }
    // });  
    if ($(".b-about-page__contact-form").length > 0) {
        autosize(document.querySelectorAll('textarea'));
    }
    video.play();
});




















