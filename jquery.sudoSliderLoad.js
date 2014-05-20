;(function ($) {

  $(document).ready(function(){

    var speed = 800; // miliseconds.
    var ease = 'swing';

    runOnImagesLoaded($(".slider img"), true, function() {

      $(".slider-container").each(function(index) {

          var $this = $(this);

          $this.find(".slider-loading").fadeTo(400,0,function (){
            $(this).remove();
          });

          var slides = [];

          $this.find(".slider li").each(function (index, elem) {
            var _$this = $(this);
            slides.push(_$this);
            _$this.detach();
          });

          for (var i = 0; slides.length * 2 > i; i++) {
            $this.find(".slider ul").append(slides[i % slides.length].clone());
          }

          var sudoSlider = $this.find('.slider').sudoSlider({
            prevNext:false,
            continuous:true,
            autowidth:false,
            autoheight:false,
            ease:ease,
            speed:speed,
            beforeAnimation: function(t){
              var width = $(this).width();
              var parentWidth = $this.find(".slider").parent().width();
              var marginleft = (parentWidth - width) / 2;
              $this.find('.slider').stop().animate({marginLeft:marginleft},{duration:speed,easing:ease});
              $this.find('.slider-left, .slider-right').stop().animate({width:marginleft+0.5},{duration:speed,easing:ease});
            },
            initcallback: adjust
          });

          $(window).on("resize focus", adjust);

          function adjust() {
            var $slider = $this.find('.slider');
            var width = sudoSlider.getSlide(sudoSlider.getValue("currentSlide")).width();
            var parentWidth = $slider.parent().width();
            var marginleft = (parentWidth - width) / 2;
            $slider.stop().animate({marginLeft:marginleft},{duration:0});
            $this.find('.slider-left, .slider-right').stop().animate({width:marginleft+0.5},{duration:0});
          }

          $this.find('.slider-right, .slider').click(function(){
            sudoSlider.goToSlide('next');
          });

          $this.find('.slider-left').click(function(){
            sudoSlider.goToSlide('prev');
          });

      }); // .slider-container each

    }); // runOnImagesLoaded

  });

  // This function is a direct copy of a function inside SudoSlider.
  function runOnImagesLoaded (target, allSlides, callback) {
    var elems = target.add(target.find('img')).filter('img');
    var len = elems.length;
    if (!len) {
      callback();
      return this; // No need to do anything else.
    }
    function loadFunction(that) {
      $(that).unbind('load').unbind('error');
      if (that.naturalHeight && !that.clientHeight) { // Webkit/Chrome (not sure) fix.
        $(that).height(that.naturalHeight).width(that.naturalWidth);
      }
      if (allSlides) {
        len--;
        if (len == 0) {
          callback();
        }
      } else {
        callback();
      }
    }
    elems.each(function(){
      var that = this;
      $(that).load(function () {
        loadFunction(that);
      }).error(function () {
        loadFunction(that);
      });
      // Start ugly working IE fix.
      if (that.readyState == "complete") {
        $(that).trigger("load");
      }
      else if (that.readyState) {
        // Sometimes IE doesn't fire the readystatechange, even though the readystate has been changed to complete. AARRGHH!! I HATE IE, I HATE IT, I HATE IE!
        that.src = that.src; // Do not ask me why this works, ask the IE team!
      }
      // End ugly working IE fix.
      else if (that.complete) {
        $(that).trigger("load");
      }
      else if (that.complete === undefined) {
        var src = that.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f data uri bypasses webkit log warning (thx doug jones)
        that.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // This is about the smallest image you can make.
        that.src = src;
      }
    });
  }

})(jQuery);
