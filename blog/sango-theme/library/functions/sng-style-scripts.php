<?php
/**
 * このファイルでは各種CSSやJSファイルを読み込むための関数を記載しています。
 * 各種CSS/JS
 * Google Font
 * Font Awesome
 * Classic Editorのスタイル
 * Gutenberg用のスタイルはSANGO Gutenbergプラグインを導入することで読み込まれるようになります。
 */

// 基本的なスタイルの読み込み
add_action('wp_enqueue_scripts', 'sng_basic_scripts_and_styles', 1 );
if (!function_exists('sng_basic_scripts_and_styles')) {
  function sng_basic_scripts_and_styles() {
    global $wp;
    if (!is_admin() || defined('IFRAME_REQUEST')) {
      $theme_ver = wp_get_theme('sango-theme')->Version;
      $read_minified_css = get_option('read_minified_css');
      $style_css = $read_minified_css ? 'style.min.css' : 'style.css';
      $entry_option_css = $read_minified_css ? 'entry-option.min.css' : 'entry-option.css';
      // メイン
      wp_enqueue_style(
        'sng-stylesheet',
        get_template_directory_uri() . '/'.$style_css.'?ver' . $theme_ver,
        array(),
        '',
        'all'
      );
      // 投稿
      wp_enqueue_style(
        'sng-option',
        get_template_directory_uri() . '/'.$entry_option_css.'?ver' . $theme_ver,
        array('sng-stylesheet'),
        '',
        'all'
      );
      // jQuery
      wp_enqueue_script('jquery');
      // コメント用
      if (is_singular() and comments_open() and (get_option('thread_comments') == 1)) {
        wp_enqueue_script('comment-reply');
      }
      // GutenbergのデフォルトCSS読み込み解除オプション
      if (get_option('no_gutenberg_default_style')) {
        wp_deregister_style('wp-block-library');
        wp_dequeue_style('wp-block-library');
      }
    } // endif isAdmin
  } 
}// END sng_basic_scripts_and_styles

function sng_is_selected_font($name) {
  return (get_theme_mod('sng_font_family') == $name);
}

// Google Font
add_action('wp_enqueue_scripts', 'sng_load_google_font', 1 );
if (!function_exists('sng_load_google_font')) {
  function sng_load_google_font() {
    $no_google_font = get_option('no_google_font', false);
    if ($no_google_font) {
      return;
    }
    $font_text = "Quicksand:500,700";
    if(sng_is_selected_font("notosansjp")) {
      $font_text .= "|Noto+Sans+JP:400,700";
    } elseif(sng_is_selected_font("mplusrounded1c")) {
      $font_text .= "|M+PLUS+Rounded+1c:400,700";
    }
    wp_enqueue_style(
      'sng-googlefonts',
      'https://fonts.googleapis.com/css?family=' . $font_text . '&display=swap',
      array(),
      '',
      'all'
    );
  }
}

// FontAwesome
function sng_font_awesome_cdn_url() {
  if (get_option('use_fontawesome4')) return 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
  if (get_theme_mod('fontawesome_read_method') === 'limited') return get_template_directory_uri() . '/library/css/fa-sango.css';
  if (get_theme_mod('fontawesome_read_method') === 'local') return get_stylesheet_directory_uri() . '/library/css/fa-sango.css';
  $fontawesome_ver = get_option('fontawesome5_ver_num') ? preg_replace("/( |　)/", "", get_option('fontawesome5_ver_num') ) : '5.11.2';
  return 'https://use.fontawesome.com/releases/v'. $fontawesome_ver .'/css/all.css';
}

add_action('wp_enqueue_scripts', 'sng_font_awesome', 1 );
if (!function_exists('sng_font_awesome')) {
  function sng_font_awesome() {
    wp_enqueue_style(
      'sng-fontawesome',
      sng_font_awesome_cdn_url(),
      array()
    );
  }
}

add_action('wp_enqueue_scripts', 'sng_scroll_hint', 1 );
if (!function_exists('sng_scroll_hint')) {
  function sng_scroll_hint() {
    global $post;
    $enable_scroll_hint_load = false;
    if ($post && $post->ID) {
      $enable_scroll_hint = get_post_meta($post->ID, 'sng_enable_post_scrollhint_js', true);
      if ($enable_scroll_hint) {
        $enable_scroll_hint_load = true;
      }
    }
    if (!get_option('enable_scroll_hint_js') && !$enable_scroll_hint_load) {
      return;
    }
    wp_enqueue_script( 'scroll-hint', '//unpkg.com/scroll-hint@1.2.4/js/scroll-hint.min.js', "", "20210130", false );
    wp_enqueue_style( 'scroll-hint', '//unpkg.com/scroll-hint@1.2.4/css/scroll-hint.css', "", "20210130", false );
  }
}

add_action('wp_enqueue_scripts', 'sng_smartphoto', 1 );
if (!function_exists('sng_smartphoto')) {
  function sng_smartphoto() {
    global $post;
    $enable_smartphoto_load = false;
    if ($post && $post->ID) {
      $enable_smartphoto = get_post_meta($post->ID, 'sng_enable_post_smartphoto_js', true);
      if ($enable_smartphoto) {
        $enable_smartphoto_load = true;
      }
    }
    if (!get_option('enable_smartphoto_js') && !$enable_smartphoto_load) {
      return;
    }
    wp_enqueue_script( 'smartphoto', '//unpkg.com/smartphoto@1.6.2/js/smartphoto.min.js', "", "20210130", false );
    wp_enqueue_style( 'smartphoto', '//unpkg.com/smartphoto@1.6.2/css/smartphoto.min.css', "", "20210130", false );
  }
}

add_filter( 'script_loader_tag', 'sng_add_defer_to_script', 10, 3 );
function sng_add_defer_to_script( $tag, $handle, $src ) {
  if ( 'smartphoto' === $handle || 'scroll-hint' === $handle ) {
    $tag = '<script defer src="' . esc_url( $src ) . '"></script>';
  }
  return $tag;
}


/**
 * // FontAwesomeの非同期読み込み
 * add_action('wp_footer', 'sng_async_load_fontawesome');
 * function sng_async_load_fontawesome() {
 *   echo '<script> (function() { var css = document.createElement("link"); css.href = "' . sng_font_awesome_cdn_url() . '"; css.rel = "stylesheet"; css.type = "text/css"; document.getElementsByTagName("head")[0].appendChild(css); })(); </script>';
 * }
 */

// Classic Editor style
add_action( 'admin_init', 'sng_classic_editor_styles' );
if (!function_exists('sng_classic_editor_styles')) {
  function sng_classic_editor_styles() {
    add_editor_style(get_template_directory_uri() . '/library/css/editor-style.css');
    // Font Awesome4.7に対応
    add_editor_style('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  }
}