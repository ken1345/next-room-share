<?php
/**
 * CSSやJSを簡易的に圧縮する
 */
function sng_minify_css($css) {
  $css = preg_replace('/\s{2,}/s',' ',$css);
  $css = preg_replace('/\s*([:;{}])\s*/','$1',$css);
  $css = preg_replace('/;}/','}',$css);
  return $css;
}

function sng_minify_js($js) {
  // Thanks: https://gist.github.com/Rodrigo54/93169db48194d470188f
  return preg_replace(
    array(
      // Remove comments
      '#\s*("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')\s*|\s*\/\*(?!\!|@cc_on)(?>[\s\S]*?\*\/)\s*|\s*(?<![\:\=])\/\/.*(?=[\n\r]|$)|^\s*|\s*$#',
      // Remove white-spaces
      '#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/)|\/(?!\/)[^\n\r]*?\/(?=[\s.,;]|[gimuy]|$))|\s*([!%&*\(\)\-=+\[\]\{\}|;:,.<>?\/])\s*#s',
      // Remove the last semicolon
      '#;+\}#',
    ),
    array(
      '$1',
      '$1$2',
      '}'
    ),
  $js);
}