<?php
/*********************
 * ヘッダーアイキャッチ
 *********************/
$wp_customize->add_panel('panel_featured_header',
  array(
    'priority' => 55,
    'title' => '🏞 ヘッダーアイキャッチ',
  )
);
// ヘッダーアイキャッチ
$wp_customize->add_section('header_image', array(
  'title' => 'ヘッダーアイキャッチ画像',
  'panel' => 'panel_featured_header',
  'transport' => 'postMessage',
));
$wp_customize->add_setting('header_image_checkbox', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('header_image_checkbox', array(
  'settings' => 'header_image_checkbox',
  'label' => 'ヘッダーアイキャッチ画像を表示',
  'description' => '<small>トップページにのみ表示される巨大なアイキャッチ画像です。</small>',
  'section' => 'header_image',
  'type' => 'checkbox',
));
$wp_customize->add_setting('original_image_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'original_image_upload', array(
    'settings' => 'original_image_upload',
    'label' => '画像をアップロード',
    'section' => 'header_image',
  )));
endif;
$wp_customize->add_setting('limit_header_width', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('limit_header_width', array(
  'settings' => 'limit_header_width',
  'label' => '画像の最大横幅に制限を設ける（推奨）',
  'section' => 'header_image',
  'type' => 'checkbox',
));
$wp_customize->add_setting('only_show_headerimg', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('only_show_headerimg', array(
  'settings' => 'only_show_headerimg',
  'label' => '文字やボタンを表示しない（画像のみ表示）',
  'description' => '<small>画像の縦横比が常に保たれるようになります。</small>',
  'section' => 'header_image',
  'type' => 'checkbox',
));
$wp_customize->add_setting('header_big_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('header_big_txt', array(
  'settings' => 'header_big_txt',
  'label' => '見出し',
  'section' => 'header_image',
  'description' => '<small>画像上に表示されます。</small>',
  'type' => 'text',
));
$wp_customize->add_setting('header_sml_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('header_sml_txt', array(
  'settings' => 'header_sml_txt',
  'label' => '説明文',
  'section' => 'header_image',
  'description' => '<small>画像上に表示される小さめのテキストです。</small>',
  'type' => 'textarea',
));
$wp_customize->add_setting('header_btn_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('header_btn_txt', array(
  'settings' => 'header_btn_txt',
  'label' => 'ボタンテキスト（挿入する場合）',
  'section' => 'header_image',
  'description' => '<small>ボタンを挿入する場合に入力します。</small>',
  'type' => 'text',
));
$wp_customize->add_setting('header_btn_url', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('header_btn_url', array(
  'settings' => 'header_btn_url',
  'label' => 'ボタンURL',
  'section' => 'header_image',
  'type' => 'url',
));
$wp_customize->add_setting('header_btn_color', array(
  'default' => '#ff90a1',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_btn_color', array(
  'label' => 'ボタン色',
  'section' => 'header_image',
  'settings' => 'header_btn_color',
  'priority' => 19,
)));
// 2分割ヘッダーアイキャッチ
$wp_customize->add_section('header_divide_image', array(
  'title' => '2分割ヘッダーアイキャッチ画像',
  'panel' => 'panel_featured_header',
  'transport' => 'postMessage',
));
$wp_customize->add_setting('header_divide_checkbox', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('header_divide_checkbox', array(
  'settings' => 'header_divide_checkbox',
  'label' => '2分割ヘッダーアイキャッチを表示',
  'description' => '<small>左側に画像、右側にテキストが表示されるヘッダーアイキャッチです（スマホだと縦に並びます）。トップページにのみ表示されます。</small>',
  'section' => 'header_divide_image',
  'type' => 'checkbox',
));
$wp_customize->add_setting('divheader_image_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'divheader_image_upload', array(
    'settings' => 'divheader_image_upload',
    'label' => '画像をアップロード',
    'section' => 'header_divide_image',
  )));
endif;
$wp_customize->add_setting('divheader_big_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('divheader_big_txt', array(
  'settings' => 'divheader_big_txt',
  'label' => '見出し',
  'section' => 'header_divide_image',
  'type' => 'text',
));
$wp_customize->add_setting('divheader_sml_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('divheader_sml_txt', array(
  'settings' => 'divheader_sml_txt',
  'label' => '説明文',
  'section' => 'header_divide_image',
  'type' => 'textarea',
));
$wp_customize->add_setting('divheader_btn_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('divheader_btn_txt', array(
  'settings' => 'divheader_btn_txt',
  'label' => 'ボタンテキスト（挿入する場合）',
  'section' => 'header_divide_image',
  'type' => 'text',
));
$wp_customize->add_setting('divheader_btn_url', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('divheader_btn_url', array(
  'settings' => 'divheader_btn_url',
  'label' => 'ボタンURL',
  'section' => 'header_divide_image',
  'type' => 'url',
));
$wp_customize->add_setting('divide_background_color', array(
  'default' => '#93d1f0',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'divide_background_color', array(
  'label' => 'テキスト部分の背景色',
  'section' => 'header_divide_image',
  'settings' => 'divide_background_color',
  'priority' => 20,
)));
$wp_customize->add_setting('divide_bigtxt_color', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'divide_bigtxt_color', array(
  'label' => '見出しカラー',
  'section' => 'header_divide_image',
  'settings' => 'divide_bigtxt_color',
  'priority' => 20,
)));
$wp_customize->add_setting('divide_smltxt_color', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'divide_smltxt_color', array(
  'label' => '説明文カラー',
  'section' => 'header_divide_image',
  'settings' => 'divide_smltxt_color',
  'priority' => 20,
)));
$wp_customize->add_setting('divide_btn_color', array(
  'default' => '#6BB6FF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'divide_btn_color', array(
  'label' => 'ボタン色',
  'section' => 'header_divide_image',
  'settings' => 'divide_btn_color',
  'priority' => 19,
)));