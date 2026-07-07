<?php
/*********************
 * 詳細設定
 *********************/
$wp_customize->add_section('other_options', array(
  'title' => '⚙️ 詳細設定',
  'priority' => 60,
));
$wp_customize->add_setting('insert_tag_tohead', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('insert_tag_tohead', array(
  'settings' => 'insert_tag_tohead',
  'label' => 'headタグ内にコードを挿入',
  'description' => 'head内に挿入したいタグがある場合はこちらに入力します。全ページのhead内にそのまま挿入されることにご注意ください。',
  'section' => 'other_options',
  'type' => 'textarea',
));
$wp_customize->add_setting('insert_tag_to_end', array(
  'type' => 'theme_mod',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('insert_tag_to_end', array(
  'settings' => 'insert_tag_to_end',
  'label' => 'body閉じタグ直前にコードを挿入',
  'description' => 'body閉じタグ直前に挿入したいタグがある場合はこちらに入力します。全ページのbody閉じタグ直前にそのまま挿入されることにご注意ください。',
  'section' => 'other_options',
  'type' => 'textarea',
));
$wp_customize->add_setting('use_fontawesome4', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('use_fontawesome4', array(
  'settings' => 'use_fontawesome4',
  'label' => 'FontAwesome4.7を使用する',
  'description' => '<small>すでにFontAwesome4のアイコンを使用しており、コードを最新のものに書き換えることができない場合はチェックを入れてください。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('fontawesome_read_method', array(
  'default' => 'all',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('fontawesome_read_method', array(
  'label' => 'FontAwesomeの読み込み方法',
  'settings' => 'fontawesome_read_method',
  'section' => 'other_options',
  'description' => '<small>FontAwesomeの読み込み方法を指定します。子テーマのCSSをご利用される場合はSANGOテーマの/library/css/fa-sango.cssを複製して編集すると便利です。</small>',
  'type' => 'radio',
  'choices' => array(
    'all' => '全て',
    'limited' => 'SANGOで利用されている最低限のフォントを読み込む',
    'local' => '子テーマの/library/css/fa-sango.cssを読み込む。',
  ),
));
$wp_customize->add_setting('fontawesome5_ver_num', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('fontawesome5_ver_num', array(
  'settings' => 'fontawesome5_ver_num',
  'description' => '使用するFontAwesomeのバージョン番号<br><small>「6.1.1」のように、数字と「.」だけで指定します。空欄の場合バージョン5.11.2が使用されます。「FontAwesome4.7を使用する」にチェックが入っている場合は入力しても無視されます。</small>',
  'input_attrs' => array('placeholder' => '5.11.2'),
  'section' => 'other_options',
  'type' => 'text',
));
$wp_customize->add_setting('no_eyecatch', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_eyecatch', array(
  'settings' => 'no_eyecatch',
  'label' => '投稿のタイトル下にアイキャッチ画像を表示しない',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('no_eyecatch_on_page', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_eyecatch_on_page', array(
  'settings' => 'no_eyecatch_on_page',
  'label' => '固定ページのタイトル下にアイキャッチ画像を表示しない',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('no_sidebar_mobile', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_sidebar_mobile', array(
  'settings' => 'no_sidebar_mobile',
  'label' => 'スマホ/タブレットではサイドバーを非表示にする',
  'description' => '<small>投稿/固定ページでサイドバーが非表示になります。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('no_header_search', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_header_search', array(
  'settings' => 'no_header_search',
  'label' => 'モバイルのヘッダー検索ボタンを非表示にする',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('disable_emoji_js', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('disable_emoji_js', array(
  'settings' => 'disable_emoji_js',
  'label' => '絵文字用のJSを読み込まない',
  'description' => '<small>WordPressの初期設定では絵文字を使用するためのJavascriptが読み込まれます。サイト内で絵文字を使わない場合にはチェックを入れましょう。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('enable_scroll_hint_js', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_scroll_hint_js', array(
  'settings' => 'enable_scroll_hint_js',
  'label' => 'テーブルのスクロールを促すためのJSを読み込む',
  'description' => '<small>スクロールヒントというJavaScriptライブラリを読み込ます。パフォーマンスを改善したい場合はチェックを外してください。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('enable_smartphoto_js', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_smartphoto_js', array(
  'settings' => 'enable_smartphoto_js',
  'label' => '写真を拡大表示するためのJSを読み込む',
  'description' => '<small>SmartPhotoというJavaScriptライブラリを読み込ます。パフォーマンスを改善したい場合はチェックを外してください。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('disable_animation', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('disable_animation', array(
  'settings' => 'disable_animation',
  'label' => 'アイテムを表示する際のアニメーションを無効にする',
  'description' => '<small>出現時のアニメーションのみ無効にします。マウスオーバー時のアニメーションは対象外です。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('never_wpautop', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('never_wpautop', array(
  'settings' => 'never_wpautop',
  'label' => '【非推奨】自動整形をオフにする（Classic Editor）',
  'description' => '<small>WordPressデフォルトの自動整形を無効化します。WordPressの更新に伴い問題が生じる可能性があるため利用を推奨しません。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('remove_pubdate', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('remove_pubdate', array(
  'settings' => 'remove_pubdate',
  'label' => '日付を非表示にする',
  'description' => '<small>記事一覧上/投稿ページ上の日付を非表示にします。特に理由がない限りチェックをつける必要はありません。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('show_only_mod_date', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('show_only_mod_date', array(
  'settings' => 'show_only_mod_date',
  'label' => '更新された投稿では更新日のみを表示する',
  'section' => 'other_options',
  'type' => 'checkbox',
));
$wp_customize->add_setting('new_mark_date', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'default' => 3,
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('new_mark_date', array(
  'settings' => 'new_mark_date',
  'label' => '何日前の記事までNEWマークをつけるか',
  'description' => '<small>例えば「2」にすると、2日前以降に公開された記事に一覧ページでNEWがつきます。デフォルトは「3」。表示しない場合は0にします。</small>',
  'section' => 'other_options',
  'type' => 'number',
));
$wp_customize->add_setting('say_image_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'say_image_upload', array(
    'settings' => 'say_image_upload',
    'label' => '吹き出しショートコードのデフォルト設定',
    'description' => '<small>吹き出しのショートコードでimg="~"を指定しなかった場合に、こちらで登録した画像が使用されます。</small>',
    'section' => 'other_options',
  )));
endif;
$wp_customize->add_setting('say_name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('say_name', array(
  'settings' => 'say_name',
  'description' => 'デフォルトの吹き出しアイコン画像下の名前',
  'input_attrs' => array('placeholder' => '表示しない場合は空欄に'),
  'section' => 'other_options',
  'type' => 'text',
));

$wp_customize->add_setting('sng_hide_share', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('sng_hide_share', array(
  'settings' => 'sng_hide_share',
  'label' => '投稿ページのシェアボタンを常に非表示にする',
  'section' => 'other_options',
  'type' => 'checkbox',
));

$wp_customize->add_setting('sng_use_legacy_widget', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('sng_use_legacy_widget', array(
  'settings' => 'sng_use_legacy_widget',
  'label' => 'レガシーウィジェットを利用する',
  'section' => 'other_options',
  'type' => 'checkbox',
));

$wp_customize->add_setting('footer_use_block_css', array(
  'type' => 'theme_mod',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('footer_use_block_css', array(
  'settings' => 'footer_use_block_css',
  'label' => 'フッターのレガシーCSSを停止する',
  'description' => '<small>ブロックウィジェットを使ってフッターを作る場合はチェックを外していただくのがお勧めです。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));

$wp_customize->add_setting('sng_update_method_include_major_version', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('sng_update_method_include_major_version', array(
  'settings' => 'sng_update_method_include_major_version',
  'label' => 'SANGOテーマアップデート時にメジャーアップデートを含める',
  'description' => '<small>SANGOテーマのアップデート時に破壊的変更があるアップデートを含めます。2.0 → 3.0など。SANGO 3.0はPHPのバージョンが7.3以上でないと動作しないので注意が必要です。</small>',
  'section' => 'other_options',
  'type' => 'checkbox',
));
