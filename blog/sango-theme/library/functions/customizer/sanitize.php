<?php
/*********************
 * カスタマイザーのサニタイズ
 *********************/
function sng_slug_sanitize_checkbox($input) {
  return ($input == true);
}

function sng_slug_sanitize_file($file, $setting) {
  $mimes = array(
    'jpg|jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'png' => 'image/png',
    'svg' => 'image/svg+xml',
  );
  $file_ext = wp_check_filetype($file, $mimes);
  return ($file_ext['ext'] ? $file : $setting->default);
}

function sng_slug_sanitize_radio($input, $setting) {
  $input = sanitize_key($input);
  $choices = $setting->manager->get_control($setting->id)->choices;
  return (array_key_exists($input, $choices) ? $input : $setting->default);
}

function sng_skip_sanitize($input) {
  return $input;
}