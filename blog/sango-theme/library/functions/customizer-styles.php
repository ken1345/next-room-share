<?php
/******************************
 * カスタマイザーで登録されたスタイルの設定を反映
 ********************************/

if (!function_exists('sng_customizer_css')) {
  function sng_customizer_css() {
    // 色
    $link_c = get_theme_mod('link_color', '#4f96f6');
    $main_c = get_theme_mod('main_color', '#6bb6ff');
    $pastel_c = get_theme_mod('pastel_color', '#c8e4ff');
    $accent_c = get_theme_mod('accent_color', '#ffb36b');
    $header_bc = get_theme_mod('header_bc', '#58a9ef');
    $header_c = get_theme_mod('header_c', '#FFF');
    $header_menu_c = get_theme_mod('header_menu_c', '#FFF');
    $wid_c = get_theme_mod('wid_title_c', '#6bb6ff');
    $wid_bc = get_theme_mod('wid_title_bc', '#c8e4ff');
    $footer_c = get_theme_mod('sng_footer_c', '#3c3c3c');
    $footer_bc = get_theme_mod('sng_footer_bc', '#e0e4eb');
    $body_bc = get_theme_mod('background_color');

    //トップへ戻るボタン
    $totop_bc = get_theme_mod('to_top_color', '#5ba9f7');

    //お知らせ欄
    $info_text = get_theme_mod('header_info_c', '#FFF');
    $info_bc1 = get_theme_mod('header_info_c1', '#738bff');
    $info_bc2 = get_theme_mod('header_info_c2', '#85e3ec');

    //モバイルフッター固定メニュー
    $footer_fixed_bc = get_theme_mod('footer_fixed_bc', '#FFF');
    $footer_fixed_c = get_theme_mod('footer_fixed_c', '#a2a7ab');
    $footer_fixed_actc = get_theme_mod('footer_fixed_actc', '#6bb6ff');

    //フォントサイズ
    $font_size_sp = get_option('mb_font_size') ? get_option('mb_font_size') : '100';
    $font_size_tb = get_option('tb_font_size') ? get_option('tb_font_size') : '107';
    $font_size_pc = get_option('pc_font_size') ? get_option('pc_font_size') : '107';

    //フォント種類
    $font_family = '"Helvetica", "Arial", "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", YuGothic, "Yu Gothic", "メイリオ", Meiryo, sans-serif;';
    if(sng_is_selected_font("notosansjp")) {
      $font_family = '"Noto Sans JP",'.$font_family;
    }
    if(sng_is_selected_font("mplusrounded1c")) {
      $font_family = '"M PLUS Rounded 1c",'.$font_family;
    }
    $d_font_family = '"Quicksand",'.$font_family;

    //タブ色
    $tab_bc = get_theme_mod('tab_background_color', '#FFF');
    $tab_c = get_theme_mod('tab_text_color', '#a7a7a7');
    $tab_active_bc1 = get_theme_mod('tab_active_color1', '#bdb9ff');
    $tab_active_bc2 = get_theme_mod('tab_active_color2', '#67b8ff');

    //ヘッダー
    $header_height = get_option('header_height');

    $css = <<< EOM
    a {
      color: {$link_c};
    }
    .main-c, 
    .has-sango-main-color {
      color: {$main_c};
    }
    .main-bc,
    .has-sango-main-background-color {
      background-color: {$main_c};
    }
    .main-bdr,
    #inner-content .main-bdr {
      border-color: {$main_c};
    }
    .pastel-c, .has-sango-pastel-color {
      color: {$pastel_c};
    }
    .pastel-bc,
    .has-sango-pastel-background-color,
    #inner-content .pastel-bc {
      background-color: {$pastel_c};
    }
    .accent-c, 
    .has-sango-accent-color {
      color: {$accent_c};
    }
    .accent-bc,
    .has-sango-accent-background-color {
      background-color: {$accent_c};
    }
    .header, 
    #footer-menu,
    .drawer__title {
      background-color: {$header_bc};
    }
    #logo a {
      color: {$header_c};
    }
    .desktop-nav li a , 
    .mobile-nav li a,
    #footer-menu a,
    #drawer__open,
    .header-search__open,
    .copyright,
    .drawer__title {
      color: {$header_menu_c};
    }
    .drawer__title .close span,
    .drawer__title .close span:before {
      background: {$header_menu_c};
    }
    .desktop-nav li:after {
      background: {$header_menu_c};
    }
    .mobile-nav .current-menu-item {
      border-bottom-color: {$header_menu_c};
    }
    .widgettitle,
    .sidebar .wp-block-group h2,
    .drawer .wp-block-group h2 {
      color: {$wid_c};
      background-color: {$wid_bc};
    }
    .footer,
    .footer-block {
      background-color: {$footer_bc};
    }
    .footer-block,
    .footer,
    .footer a,
    .footer .widget ul li a {
      color: {$footer_c};
    }
    #toc_container .toc_title,
    .entry-content .ez-toc-title-container,
    #footer_menu .raised,
    .pagination a,
    .pagination span,
    #reply-title:before,
    .entry-content blockquote:before,
    .main-c-before li:before,
    .main-c-b:before {
      color: {$main_c};
    }
    .searchform__submit,
    .footer-block .wp-block-search .wp-block-search__button,
    .sidebar .wp-block-search .wp-block-search__button,
    .footer .wp-block-search .wp-block-search__button,
    .drawer .wp-block-search .wp-block-search__button,
    #toc_container .toc_title:before,
    .ez-toc-title-container:before,
    .cat-name,
    .pre_tag > span,
    .pagination .current,
    .post-page-numbers.current,
    #submit,
    .withtag_list > span,
    .main-bc-before li:before {
      background-color: {$main_c};
    }
    #toc_container,
    #ez-toc-container,
    .entry-content h3,
    .li-mainbdr ul,
    .li-mainbdr ol {
      border-color: {$main_c};
    }
    .search-title i,
    .acc-bc-before li:before {
      background: {$accent_c};
    }
    .li-accentbdr ul,
    .li-accentbdr ol {
      border-color: {$accent_c}
    }
    .pagination a:hover,
    .li-pastelbc ul,
    .li-pastelbc ol {
      background: {$pastel_c};
    }
    body {
      font-size: {$font_size_sp}%;
    }
    @media only screen and (min-width: 481px) {
      body { font-size: {$font_size_tb}%; }
    }
    @media only screen and (min-width: 1030px) {
      body { font-size: {$font_size_pc}%; }
    }
    .totop {
      background: {$totop_bc};
    }
    .header-info a {
      color: {$info_text};
      background: linear-gradient(95deg, {$info_bc1}, {$info_bc2});
    }
    .fixed-menu ul {
      background: {$footer_fixed_bc};
    }
    .fixed-menu a {
      color: {$footer_fixed_c};
    }
    .fixed-menu .current-menu-item a,
    .fixed-menu ul li a.active {
      color: {$footer_fixed_actc};
    }
    .post-tab {
      background: {$tab_bc};
    }
    .post-tab > div {
      color: {$tab_c};
    }
    .post-tab > div.tab-active { 
      background: linear-gradient(45deg, {$tab_active_bc1}, {$tab_active_bc2});
    }
    body {
      font-family: {$font_family};
    }
    .dfont {
      font-family: {$d_font_family};
    }
EOM;

  // 背景色が白の場合は見やすさのための調整
  if(strpos($body_bc, 'ffffff') !== false ) {
    $css .= <<< EOM
    .post,
    .sidebar .widget {
      border: solid 1px rgba(0,0,0,.08);
    }
    .sidebar .widget .widget {
      border: none;
    }
    .sidebar .widget {
      border-radius: 4px;
      overflow: hidden;
    }
    .sidebar .widget_search {
      border: none;
    }
    .sidebar .widget_search input {
      border: solid 1px #ececec;
    }
    .sidelong__article {
      box-shadow: 0 1px 4px rgba(0,0,0,.18);
    }
    .archive-header {
      box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }
EOM;
  }

  if ($body_bc) {
    $css .= '.body_bc { background-color: '. $body_bc .';}';
  }

  if ($header_height && !get_option('center_logo_checkbox')) {
    $css .= <<< EOM
      @media only screen and (min-width: 769px) {
        #logo {
          height: {$header_height}px;
          line-height: {$header_height}px;
        }
        #logo img {
          height: {$header_height}px;
        }
        .desktop-nav li a {
          height: {$header_height}px;
          line-height: {$header_height}px;
        }
      }
EOM;
  }

  echo '<style>' . sng_minify_css($css) . '</style>';

  }
}
add_action('wp_head', 'sng_customizer_css', 101);