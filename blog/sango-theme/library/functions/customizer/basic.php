<?php
/*********************
 * サイトの基本設定
 *********************/
$wp_customize->add_panel('panel_basic_setting',
  array(
    'priority' => 1,
    'title' => '🛠 サイトの基本設定',
  )
);
// 基本情報とロゴの設定
$wp_customize->add_section('title_tagline', array(
  'title' => '基本情報とロゴの設定',
  'panel' => 'panel_basic_setting',
));
$wp_customize->add_setting('home_description', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('home_description', array(
  'settings' => 'home_description',
  'label' => 'サイトの詳しい説明（100字以内推奨）',
  'description' => 'トップページのメタデスクリプションとして検索エンジンに伝わります。',
  'section' => 'title_tagline',
  'type' => 'textarea',
));
$wp_customize->add_setting('logo_image_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
$wp_customize->add_setting('logo_image_media_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'logo_image_upload', array(
    'settings' => 'logo_image_upload',
    'label' => 'ロゴ画像を登録',
    'description' => 'WordPressではSVG画像の登録がセキュリティの理由から標準では許可されていません。SVG画像を登録したい場合「<a href="https://ja.wordpress.org/plugins/safe-svg/" target="_blank">Safe SVG</a>」等のプラグインを一時的に使用してアップロードすることをおすすめします。',
    'section' => 'title_tagline',
  )));
endif;
if (class_exists('WP_Customize_Media_Control')):
  $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'logo_image_media_upload', array(
    'settings' => 'logo_image_media_upload',
    'label' => 'ロゴ画像を登録（メディア）',
    'description' => '<small>メディアを利用してロゴ画像を表示します。上記の設定でもロゴ画像を設定できますが、メディアでは画像のサイズを表示できるためCLS対策としてこちらにロゴを設定することをお勧めします。</small>',
    'section' => 'title_tagline',
  )));
endif;
$wp_customize->add_setting('onlylogo_checkbox', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('onlylogo_checkbox', array(
  'settings' => 'onlylogo_checkbox',
  'label' => 'ロゴ画像だけを表示（文字を非表示に）',
  'section' => 'title_tagline',
  'type' => 'checkbox',
));
$wp_customize->add_setting('center_logo_checkbox', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('center_logo_checkbox', array(
  'settings' => 'center_logo_checkbox',
  'label' => '大画面表示時にもロゴを中央寄せ',
  'section' => 'title_tagline',
  'type' => 'checkbox',
));
$wp_customize->add_setting('header_height', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
  'default' => 62,
));
$wp_customize->add_control('header_height', array(
  'settings' => 'header_height',
  'label' => 'ヘッダーの高さ',
  'section' => 'title_tagline',
  'description' => 'ヘッダーの高さに比例してロゴ画像の大きさも変化します（ロゴを中央寄せしていない場合のみ有効）',
  'type' => 'text',
));

// デフォルトのサムネイル画像
$wp_customize->add_section('default_thumbnail', array(
  'title' => 'デフォルトのサムネイル画像',
  'panel' => 'panel_basic_setting',
  'transport' => 'postMessage',
));
$wp_customize->add_setting('thumb_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'thumb_upload', array(
    'settings' => 'thumb_upload',
    'label' => '記事にアイキャッチ画像が登録されていないとき等に使用される画像です。必ず幅600px以上、高さ310px以上の画像を選びましょう（これ以下のサイズにすると上手く表示されない場合があります）。',
    'description' => '正方形（150x150px）や、横長（520x300px）にトリミングされて使用されることがあります。',
    'section' => 'default_thumbnail',
  )));
endif;
$wp_customize->add_setting('show_default_thumb_on_widget_posts', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('show_default_thumb_on_widget_posts', array(
  'settings' => 'show_default_thumb_on_widget_posts',
  'label' => 'ウィジェットでデフォルトのサムネイル画像を使用する',
  'description' => '<small>チェックを入れると「最新の投稿」「人気記事」のウィジェットで、アイキャッチ画像が登録されていない記事に対してデフォルトのサムネイル画像が表示されるようになります。</small>',
  'section' => 'default_thumbnail',
  'type' => 'checkbox',
));
// Google Analytics
$wp_customize->add_section('ga_setting', array(
  'title' => 'Google Analyticsの設定',
  'panel' => 'panel_basic_setting',
));
$wp_customize->add_setting('ga_code', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('ga_code', array(
  'settings' => 'ga_code',
  'label' => 'Google Analytics',
  'description' => '<small>トラッキングID（G- もしくは UA- から始まるコード）を貼り付けてください。プラグインで設定済の場合は空欄のままにしましょう。</small>',
  'section' => 'ga_setting',
  'type' => 'text',
));
$wp_customize->add_setting('gtagjs', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('gtagjs', array(
  'settings' => 'gtagjs',
  'label' => 'アクセス解析にgtag.jsを使う',
  'section' => 'ga_setting',
  'type' => 'checkbox',
));

// 背景画像
$wp_customize->add_section('background_image', array(
  'title' => '背景画像',
  'panel' => 'panel_basic_setting',
  'description' => 'こちらはSANGO独自の機能ではなく、WordPressの標準機能です。背景に画像を利用したい場合にのみ利用してください。',
));
// トップページのOGP画像
$wp_customize->add_section('home_ogp_image', array(
  'title' => 'トップページのOGP画像',
  'panel' => 'panel_basic_setting',
  'transport' => 'postMessage',
));
$wp_customize->add_setting('set_home_ogp_image', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'set_home_ogp_image', array(
    'settings' => 'set_home_ogp_image',
    'label' => 'SNSでトップページやアーカイブページをシェアされた際にOGP画像として使用されます。選択されていない場合、デフォルトのサムネイル画像がOGP画像にあてられます。',
    'description' => '画像サイズは縦630px、横1200pxがおすすめです。',
    'section' => 'home_ogp_image',
  )));
endif;

// パブリッシャーを登録
$wp_customize->add_section('register_publisher', array(
  'title' => 'パブリッシャーを登録',
  'panel' => 'panel_basic_setting',
));
$wp_customize->add_setting('publisher_name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('publisher_name', array(
  'settings' => 'publisher_name',
  'label' => '発行組織名',
  'description' => '<small>パブリッシャー情報は構造化データで使用されます。個人の場合は、サイト名をそのまま発行組織名にしても良いでしょう。</small>',
  'section' => 'register_publisher',
  'type' => 'text',
));
$wp_customize->add_setting('publisher_img', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'publisher_img', array(
  'settings' => 'publisher_img',
  'label' => '発行組織を表す画像（ロゴなど）',
  'description' => '<small>サイトのロゴ画像と同じものを使っても構いません。</small>',
  'section' => 'register_publisher',
)));
endif;
$wp_customize->add_setting('rights_reserved', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('rights_reserved', array(
  'settings' => 'rights_reserved',
  'label' => '著作権者名',
  'description' => '<small>ページ最下部に「◯◯ All rights reserved」という形で表示されます。</small>',
  'section' => 'register_publisher',
  'type' => 'text',
));