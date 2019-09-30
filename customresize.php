<?php
function resizeImage($filename, $newWidth)
{
  $info = getimagesize($filename);
  $mime = $info['mime'];

  switch ($mime) {
          case 'image/jpeg':
                  $image_create_func = 'imagecreatefromjpeg';
                  $image_save_func = 'imagejpeg';
                  $new_image_ext = 'jpg';
                  break;

          case 'image/png':
                  $image_create_func = 'imagecreatefrompng';
                  $image_save_func = 'imagepng';
                  $new_image_ext = 'png';
                  break;

          case 'image/gif':
                  $image_create_func = 'imagecreatefromgif';
                  $image_save_func = 'imagegif';
                  $new_image_ext = 'gif';
                  break;

          default:
                  throw new Exception('Unknown image type.');
  }

  list($width, $height) = getimagesize($filename);
  $newHeight = ($height / $width) * $newWidth;
  $img = $image_create_func($filename);
  $tmp = imagecreatetruecolor($newWidth, $newHeight);
  setTransparency($tmp,$img);
  imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
  header('Content-Type: image/png');
  imagepng($tmp);
}

function setTransparency($new_image,$image_source)
  {

          $transparencyIndex = imagecolortransparent($image_source);
          $transparencyColor = array('red' => 255, 'green' => 255, 'blue' => 255);

          if ($transparencyIndex >= 0) {
              $transparencyColor    = imagecolorsforindex($image_source, $transparencyIndex);
          }

          $transparencyIndex    = imagecolorallocate($new_image, $transparencyColor['red'], $transparencyColor['green'], $transparencyColor['blue']);
          imagefill($new_image, 0, 0, $transparencyIndex);
          imagecolortransparent($new_image, $transparencyIndex);

  }
resizeImage('assets/images/map-intripper.png',75);
?>
