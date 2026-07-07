<?php
/**
 * 投稿ページで画像の遅延読み込みを行う
 */

// Lazyloadが有効かどうか
if (!function_exists('is_sng_lazyload')) {
  function is_sng_lazyload() {
    return is_singular() && get_option("lazyload_entry_content");
  }
}
// Lazyloadのscriptを読み込み
add_action('wp_footer', 'sng_load_lazyload_scripts', 100);
if (!function_exists('sng_load_lazyload_scripts')) {
  function sng_load_lazyload_scripts() {
    if(!is_sng_lazyload()) return;
    $options = sng_lazyload_options();
    $html = <<< EOM
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.4.0/dist/lazyload.min.js"></script>
<script>
var lazyLoadInstance = new LazyLoad($options);
</script>
EOM;
    echo $html;
  }
}

if (!function_exists('sng_lazyload_options')) {
  function sng_lazyload_options() {
    return <<< EOM
{
  elements_selector: ".entry-content img",
  threshold: 400
}
EOM;
  }
}

// コンテンツの画像をフィルターする
add_filter('the_content', 'sng_lazyload_filter_content');
function sng_lazyload_filter_content($content) {
  if(!is_sng_lazyload()) return $content;
  return preg_replace_callback('/(<\s*img[^>]+)(src\s*=\s*"[^"]+")([^>]+>)/i', 'preg_lazyload', $content);
}
function preg_lazyload($matches) {
  $result = $matches[1] . 'data-src' . substr($matches[2], 3) . $matches[3];
  $result = preg_replace('/class\s*=\s*"/i', 'class="lazy ', $result);
  $result .= '<noscript>' . $matches[0] . '</noscript>';
  return $result;
}

// Lazyloadが有効なときはsrcsetを使用しない
add_filter('wp_calculate_image_srcset', function($attr){
  if(is_sng_lazyload()) return "__return_false";
  return $attr;
});
