<?php
/*********************
 * 色の設定項目を追加
*********************/
// デフォルトをオーバーライド
$wp_customize->add_section('colors', array(
  'title' => '🎨 色',
  'panel' => '',
  'priority' => 2
));

$wp_customize->add_setting('main_color', array(
  'default' => '#6bb6ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'main_color', array(
  'label' => 'メインカラー',
  'description' => '<small>テーマの大部分に使用される色です。背景が白でも目立つ色にしましょう。設定色の詳しい意味は<a href="https://saruwakakun.com/sango/custom-color" target="_blank">色変更の方法</a>で解説しています。</small>',
  'section' => 'colors',
  'settings' => 'main_color',
)));
$wp_customize->add_setting('pastel_color', array(
  'default' => '#c8e4ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'pastel_color', array(
  'label' => '薄めの下地色',
  'description' => '<small>一部の背景に使われます。メインカラーと合う薄めの色を選びましょう。</small>',
  'section' => 'colors',
  'settings' => 'pastel_color',
)));
$wp_customize->add_setting('accent_color', array(
  'default' => '#ffb36b',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'accent_color', array(
  'label' => 'アクセントカラー',
  'description' => '<small>テーマのごく一部に使われます。メインカラーと並べたときに目立つ色を選びましょう。</small>',
  'section' => 'colors',
  'settings' => 'accent_color',
)));
$wp_customize->add_setting('link_color', array(
  'default' => '#4f96f6',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'link_color', array(
  'label' => 'リンク色',
  'description' => '<small>記事内などのリンクに使用される色です。</small>',
  'section' => 'colors',
  'settings' => 'link_color',
)));
$wp_customize->add_setting('header_bc', array(
  'default' => '#58a9ef',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_bc', array(
  'label' => 'ヘッダー背景色',
  'description' => '<small>ヘッダーの塗りつぶし色です。この色はページ最下部のフッターにも使われます。</small>',
  'section' => 'colors',
  'settings' => 'header_bc',
)));
$wp_customize->add_setting('header_c', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_c', array(
  'label' => 'ヘッダータイトル色',
  'section' => 'colors',
  'settings' => 'header_c',
)));
$wp_customize->add_setting('header_menu_c', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_menu_c', array(
  'label' => 'ヘッダーメニュー文字色',
  'description' => '<small>この色はフッターメニューの文字にも使われます。</small>',
  'section' => 'colors',
  'settings' => 'header_menu_c',
)));
$wp_customize->add_setting('wid_title_c', array(
  'default' => '#6bb6ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'wid_title_c', array(
  'label' => 'ウィジェットのタイトル色',
  'description' => '<small>サイドバーなどのウィジェットのタイトル色に使われます。</small>',
  'section' => 'colors',
  'settings' => 'wid_title_c',
)));
$wp_customize->add_setting('wid_title_bc', array(
  'default' => '#c8e4ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'wid_title_bc', array(
  'label' => 'ウィジェットタイトルの背景色',
  'description' => '<small>サイドバーなどのウィジェットタイトルの背景色に使われます。</small>',
  'section' => 'colors',
  'settings' => 'wid_title_bc',
)));
$wp_customize->add_setting('sng_footer_bc', array(
  'default' => '#e0e4eb',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'sng_footer_bc', array(
  'label' => 'フッターウィジェットの背景色',
  'description' => '<small>フッターウィジェットを追加したときに使われる背景色です。</small>',
  'section' => 'colors',
  'settings' => 'sng_footer_bc',
)));
$wp_customize->add_setting('sng_footer_c', array(
  'default' => '#3c3c3c',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'sng_footer_c', array(
  'label' => 'フッターウィジェットの文字色',
  'section' => 'colors',
  'settings' => 'sng_footer_c',
)));