## Reference URL
   # Imagemagick Setup(Linux And Windows)
     https://www.serverlab.ca/tutorials/linux/administration-linux/how-to-install-imagemagick-for-php-on-ubuntu-18-04/
     https://www.58bits.com/blog/2018/04/23/installing-imagemagick-use-php-and-iis-windows-server-2012r2-and-windows-10

  # Image Responsive And Retina Ready Display Hacks
     https://internetingishard.com/html-and-css/responsive-images/#retina-screens
     https://medium.com/@woutervanderzee/responsive-images-with-srcset-and-sizes-fc434845e948
     https://www.html5rocks.com/en/tutorials/responsive/picture-element/

  # PHP Imagemagick
    https://www.php.net/manual/en/book.imagick.php
    https://www.gauntface.com/blog/2014/09/02/webp-support-with-imagemagick-and-php
    https://urmaul.com/blog/imagick-filters-comparison/

## How To Use
   # In HTML:-
     Replace
       <div class="img-content">
         <img class="img-responsive" src="xx">
       </div>
     With
       <div class="img-content">
         <picture>
           <source
             media="(min-width: xx)"                        /*------Responsive Media Query-------*/
             srcset="imageresize.php?img=xx&w=xx,
                     imageresize.php?img=xx&w=(xx*1.5) 1.5x, /*-----For High DPI Resolutions-----*/
                     imageresize.php?img=xx&w=(xx*2) 2x">   /*------For High DPI Resolutions-----*/
           <img
             src="imageresize.php?img=xx&w=xx"
             srcset="imageresize.php?img=xx&w=(xx*1.5) 1.5x, /*-----For High DPI Resolutions-----*/
                     imageresize.php?img=xx&w=(xx*2) 2x"    /*-----For High DPI Resolutions-----*/
             alt="intripper logo">
         </picture>
      </div>

    Note:- Remove bootstrap img-responsive class

    # In C.S.S
      Change image container width to auto.
      And make width 100 % of the image.

      Ex. .img-content{width:auto;}
          .img-content img{width:100%;display:block;}

   
