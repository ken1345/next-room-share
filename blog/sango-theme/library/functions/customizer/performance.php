<?php
/*********************
 * パフォーマンス設定
 *********************/
$wp_customize->add_section('sng_performance', array(
  'title' => '🚀 高速化',
  'priority' => 59,
));

$wp_customize->add_setting('lazyload_entry_content', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('lazyload_entry_content', array(
  'settings' => 'lazyload_entry_content',
  'label' => '投稿/固定ページ内の画像を遅延読み込み',
  'description' => '<small>コンテンツ内の画像を遅延読み込みすることで、表示を高速化します。Googleが推奨する「Intersection Observer」という仕組みを使っているためSEO面でも効果的です。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));


$wp_customize->add_setting('use_async_entry_footer', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('use_async_entry_footer', array(
  'settings' => 'use_async_entry_footer',
  'label' => '投稿ページの記事下コンテンツを遅延読み込み',
  'description' => '<small>parts/single/entry-footer.phpを遅らせて読み込むことで高速化を実現します。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));

$wp_customize->add_setting('use_loading_lazy', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('use_loading_lazy', array(
  'settings' => 'use_loading_lazy',
  'label' => 'メインコンテンツ外の画像にloading="lazy"を指定する',
  'description' => '<small>Chrome75〜追加された画像を遅延読み込みするための機能です（新機能であるため挙動が安定していない可能性があります）。チェックをいれるとChromeでウィジェットや記事下内の画像が遅延読み込みされます。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));

$wp_customize->add_setting('no_gutenberg_default_style', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_gutenberg_default_style', array(
  'settings' => 'no_gutenberg_default_style',
  'label' => 'Gutenberg用のCSSを読み込まない',
  'description' => '<small>WordPress5.0〜デフォルトでGutenberg用のCSSファイルが読み込まれるようになりました。Gutenbergを一切使わない場合は、こちらにチェックを入れることで読み込みを解除できます。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));

$wp_customize->add_setting('read_minified_css', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('read_minified_css', array(
  'settings' => 'read_minified_css',
  'label' => '圧縮されたCSSを読み込む',
  'description' => '<small>圧縮されたSANGOテーマに関わるCSSを読み込みます。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));

$wp_customize->add_setting('no_count_post_view', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_count_post_view', array(
  'settings' => 'no_count_post_view',
  'label' => 'PVを計測しない',
  'description' => '<small>人気記事ウィジェットを使わない場合、PVの計測をオフにすることで高速化に繋がります。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));

$wp_customize->add_setting('no_google_font', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_google_font', array(
  'settings' => 'no_google_font',
  'label' => 'Googleフォントを読み込まない',
  'description' => '<small>Googleフォントを読み込まないことで、ページロードスピードが向上します。</small>',
  'section' => 'sng_performance',
  'type' => 'checkbox',
));