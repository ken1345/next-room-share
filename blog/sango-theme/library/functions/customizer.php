<?php
/******************************
 * 🖍ログインユーザーのみ
 * カスタマイザーの登録
 ********************************/
require_once 'customizer/sanitize.php';

add_action('customize_register', 'sng_customize_register');
function sng_customize_register($wp_customize) {
  require_once 'customizer/basic.php';
  require_once 'customizer/colors.php';
  require_once 'customizer/layout.php';
  require_once 'customizer/featured-header.php';
  require_once 'customizer/features.php';
  require_once 'customizer/performance.php';
  require_once 'customizer/ad.php';
  require_once 'customizer/detail.php';
}