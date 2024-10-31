<?php
if (! defined ('ABSPATH')) exit;
function rdgm_get_attr ($shortcode, $attribute) {
   $match_f = preg_match ('/' . $attribute . '\s*=\s*"([^"]+)"/', $shortcode,
                          $shortcode_matches);
   if ($match_f) {
      $attr_value = trim ($shortcode_matches[1]);
   } else {
      $attr_value = '';
   }
   return $attr_value;
}
function rdgm_get_attr2 ($shortcode, $attribute) {
   $attr_value = '';
   $match_f = preg_match ('/' . $attribute . '\s*=\s*\S/', $shortcode,
                          $shortcode_matches);
   if ($match_f) {
      if (substr ($shortcode_matches[0], -1) == '"') {
         $attr_value = rdgm_get_attr ($shortcode, $attribute);
      } else {
         $match_f = preg_match ('/' . $attribute . '\s*=\s*([^\s\]]+)/', $shortcode,
                                $shortcode_matches2);
         $attr_value = $shortcode_matches2[1];
      }
   }
   return $attr_value;
}
