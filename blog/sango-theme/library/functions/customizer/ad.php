<?php
/*********************
 * 広告設定
 *********************/
$wp_customize->add_section('sango_panel_ad',
  array(
    'priority' => 61,
    'title' => '🗞️ 広告設定',
  )
);

$wp_customize->add_setting('google_ad_code', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('google_ad_code', array(
  'settings' => 'google_ad_code',
  'label' => 'Google AdSenseのscriptタグ',
  'description' => 'Google AdSenseで取得したコードのscriptタグはこちらに入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('enable_ad_infeed', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_ad_infeed', array(
  'settings' => 'enable_ad_infeed',
  'label' => 'インフィード広告を有効化する',
  'section' => 'sango_panel_ad',
  'type' => 'checkbox',
));

$wp_customize->add_setting('enable_ad_infeed_for_related', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_ad_infeed_for_related', array(
  'settings' => 'enable_ad_infeed_for_related',
  'label' => '関連記事にインフィード広告を表示する',
  'section' => 'sango_panel_ad',
  'type' => 'checkbox',
));

$wp_customize->add_setting('ad_infeed', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('ad_infeed', array(
  'settings' => 'ad_infeed',
  'label' => 'インフィード広告（カードタイプ用）',
  'description' => 'インフィード広告用のコードを入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('ad_infeed2', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('ad_infeed2', array(
  'settings' => 'ad_infeed2',
  'label' => 'インフィード広告（横長タイプ用）',
  'description' => 'インフィード広告用のコードを入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('ad_infeed3', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('ad_infeed3', array(
  'settings' => 'ad_infeed3',
  'label' => 'インフィード広告（横長大タイプ用）',
  'description' => 'インフィード広告用のコードを入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('ad_infeed4', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('ad_infeed4', array(
  'settings' => 'ad_infeed4',
  'label' => 'インフィード広告（関連記事一覧用）',
  'description' => 'インフィード広告用のコードを入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('ad_infeed5', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('ad_infeed5', array(
  'settings' => 'ad_infeed5',
  'label' => 'インフィード広告（記事スライダー用）',
  'description' => 'インフィード広告用のコードを入力してください。',
  'section' => 'sango_panel_ad',
  'type' => 'textarea',
));

$wp_customize->add_setting('ad_infeed_pos1', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control( 'ad_infeed_pos1', array (
  'settings' => 'ad_infeed_pos1',
  'label' => 'インフィード広告の表示位置1',
  'description' => '隣同士にインフィード広告を設置することはできません',
  'section' => 'sango_panel_ad',
  'type' => 'number',
  'input_attrs' => array(
    'min' => 1,
    'max' => 12,
    'step' => 1,
    'type' => 'number',
  ),
));

$wp_customize->add_setting('ad_infeed_pos2', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control( 'ad_infeed_pos2', array (
  'settings' => 'ad_infeed_pos2',
  'label' => 'インフィード広告の表示位置2',
  'section' => 'sango_panel_ad',
  'type' => 'number',
  'input_attrs' => array(
    'min' => 1,
    'max' => 12,
    'step' => 1,
    'type' => 'number',
  ),
));

$wp_customize->add_setting('ad_infeed_pos3', array(
  'type' => 'theme_mod',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control( 'ad_infeed_pos3', array (
  'settings' => 'ad_infeed_pos3',
  'label' => 'インフィード広告の表示位置3',
  'section' => 'sango_panel_ad',
  'type' => 'number',
  'input_attrs' => array(
    'min' => 1,
    'max' => 12,
    'step' => 1,
    'type' => 'number',
  ),
));
