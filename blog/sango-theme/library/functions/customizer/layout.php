<?php
/*********************
 * デザイン・レイアウト設定
 *********************/
$wp_customize->add_panel('desing_layout_setting',
  array(
    'priority' => 52,
    'title' => '✨ デザイン・レイアウト',
  )
);
$wp_customize->add_section('card_layout', array(
  'title' => '記事一覧レイアウト',
  'panel' => 'desing_layout_setting',
));
$wp_customize->add_setting('sidelong_layout', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('sidelong_layout', array(
  'settings' => 'sidelong_layout',
  'label' => '【PC】トップページの記事一覧カードを横長にする',
  'section' => 'card_layout',
  'type' => 'checkbox',
));
//【モバイルトップページ】記事一覧のカードを横長にする
$wp_customize->add_setting('mb_sidelong_layout', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('mb_sidelong_layout', array(
  'settings' => 'mb_sidelong_layout',
  'label' => '【モバイル】トップページの記事一覧カードを横長にする',
  'section' => 'card_layout',
  'description' => '<small>モバイル＝スマホ/タブレットでの表示</small>',
  'type' => 'checkbox',
));
$wp_customize->add_setting('archive_sidelong_layout', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('archive_sidelong_layout', array(
  'settings' => 'archive_sidelong_layout',
  'label' => '【PC】カテゴリー/アーカイブページの記事一覧カードを横長にする',
  'section' => 'card_layout',
  'type' => 'checkbox',
));
$wp_customize->add_setting('mb_archive_sidelong_layout', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('mb_archive_sidelong_layout', array(
  'settings' => 'mb_archive_sidelong_layout',
  'label' => '【モバイル】カテゴリー/アーカイブページの記事一覧カードを横長にする',
  'section' => 'card_layout',
  'type' => 'checkbox',
));
$wp_customize->add_section('font_size_setting', array(
  'title' => 'フォントサイズ',
  'panel' => 'desing_layout_setting',
));
$wp_customize->add_setting('mb_font_size', array(
  'type' => 'option',
  'default' => '100',
  'transport' => 'postMessage',
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('mb_font_size', array(
  'settings' => 'mb_font_size',
  'label' => 'スマホでのフォントサイズ',
  'description' => '<small>幅481px以下のブラウザでのフォントサイズを指定します。デフォルトは「100」です。レイアウト崩れを防ぐため、一部の文字サイズは変わりません（記事一覧のカード内などは固定）。</small>',
  'section' => 'font_size_setting',
  'type' => 'number',
));
$wp_customize->add_setting('tb_font_size', array(
  'type' => 'option',
  'default' => '107',
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('tb_font_size', array(
  'settings' => 'tb_font_size',
  'label' => 'タブレットでのフォントサイズ',
  'description' => '<small>幅482〜1029pxでのフォントサイズを指定します。デフォルト値は「107」です。</small>',
  'section' => 'font_size_setting',
  'type' => 'number',
));
$wp_customize->add_setting('pc_font_size', array(
  'type' => 'option',
  'default' => '107',
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('pc_font_size', array(
  'settings' => 'pc_font_size',
  'label' => 'PCでのフォントサイズ',
  'description' => '<small>幅1030px〜のフォントサイズを指定します。デフォルト値は「107」です。</small>',
  'section' => 'font_size_setting',
  'type' => 'number',
));
$wp_customize->add_section('font_family_setting', array(
  'title' => 'フォント種類',
  'panel' => 'desing_layout_setting',
));
$wp_customize->add_setting('sng_font_family', array(
  'default' => '',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('sng_font_family', array(
  'label' => 'フォント種類',
  'settings' => 'sng_font_family',
  'section' => 'font_family_setting',
  'description' => '<small>デフォルト以外のフォントを選ぶと読み込み速度が低下するのでご注意ください。</small>',
  'type' => 'radio',
  'choices' => array(
    '' => 'デフォルト',
    'notosansjp' => 'Noto Sans JP',
    'mplusrounded1c' => 'M PLUS Rounded 1c'
  ),
));
