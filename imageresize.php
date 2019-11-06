<?php

  $now = time();
  $generatedAt = gmdate('D, d M Y H:i:s T', $now);

  // the last modified date (midnight on the same day of generation, as
  // per your business-rule)
  $lastModified = gmdate('D, d M Y 00:00:00 T', $now);

  // date of expiry (24 hours after the last modified date, as per your
  // business-rule)
  $expiresAt = gmdate('D, d M Y H:i:s T', strtotime($lastModified) + 86400);

  $maxAge = strtotime($expiresAt) - strtotime($generatedAt);
  header('Last-modified: ' . $lastModified);
  header('Cache-control: max-age=' . $maxAge);
  
  if(!empty($_GET['img']) && !empty($_GET['w'])){
    $imagePath = $_GET['img'];
    $imageWidth = $_GET['w'];

    function imageProportionScaling($x,$y,$cx,$cy) {
        //Set the default NEW values to be the old, in case it doesn't even need scaling
        list($nx,$ny)=array($x,$y);

        //If image is generally smaller, don't even bother
        if ($x>=$cx || $y>=$cx) {

            //Work out ratios
            if ($x>0) $rx=$cx/$x;
            if ($y>0) $ry=$cy/$y;

            //Use the lowest ratio, to ensure we don't go over the wanted image size
            if ($rx>$ry) {
                $r=$ry;
            } else {
                $r=$rx;
            }

            //Calculate the new size based on the chosen ratio
            $nx=intval($x*$r);
            $ny=intval($y*$r);
        }

        //Return the results
        return array($nx,$ny);
    }

    function optimizeImage($imagePath,$imageWidth){
      $handleSSLImage = fopen($imagePath, 'rb');
      $imagick = new Imagick();
      $imagick->readImageFile($handleSSLImage);
      $imagick->setImageResolution(300,300);
      $imagick->resampleImage(300,300,\Imagick::FILTER_SINC, 1);
      list($newX,$newY) = imageProportionScaling($imagick->getImageWidth(),$imagick->getImageHeight(),$imageWidth,$imagick->getImageHeight());
      $imagick->scaleimage($newX,$newY);
      //if(strpos($_SERVER['HTTP_ACCEPT'], 'image/webp') >= 0){
      if( strpos( $_SERVER['HTTP_ACCEPT'], 'image/webp' ) !== false || strpos( $_SERVER['HTTP_USER_AGENT'], ' Chrome/' ) !== false ){
        if($imagick->getImageFormat() == 'PNG'){
          $imagick->setImageFormat('webp');
          $imagick->setImageAlphaChannel(imagick::ALPHACHANNEL_ACTIVATE);
          $imagick->setBackgroundColor(new ImagickPixel('transparent'));
          header("Content-Type: image/webp");
        }else{
          $imagick->setImageFormat('webp');
          $imagick->setImageCompressionQuality(50);
          header("Content-Type: image/webp");
        }
      }else{
        $imageType = $imagick->getImageFormat();
        header("Content-Type: image/{$imageType}");
      }
      echo $imagick->getImageBlob();
    }
    optimizeImage($imagePath,$imageWidth);
  }
?>
