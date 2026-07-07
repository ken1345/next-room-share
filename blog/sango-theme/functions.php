<?php
require_once 'library/functions/sng-utils.php';
require_once 'library/functions/head.php';
require_once 'library/functions/sng-functions.php';
require_once 'library/functions/sng-tab.php';
require_once 'library/functions/entry-functions.php';
require_once 'library/functions/widget-settings.php';
require_once 'library/functions/sng-style-scripts.php';
require_once 'library/functions/customizer-styles.php';
require_once 'library/functions/style-shortcode.php';
require_once 'library/functions/async-entry-footer.php';
require_once 'library/functions/breadcrumb.php';
require_once 'library/functions/share-buttons.php';
require_once 'library/functions/sng-minifier.php';
require_once 'library/functions/lazyload.php';
require_once 'library/functions/rest.php';
require_once 'library/functions/category.php';

if(is_user_logged_in()) {
  require_once 'library/functions/classic-editor-styles.php';
  require_once 'library/functions/custom-fields.php';
  require_once 'library/functions/customizer.php';
  require_once 'library/functions/category-fields.php';
}

/**
 * セットアップ
 */
function sng_after_setup() {
    // SETUP1) headの不要タグを除去
    add_action('init', 'sng_head_cleanup');

    // SETUP2) RSSからWPのバージョンを削除
    add_filter('the_generator', 'sng_rss_version');

    // SETUP3) 最近のコメントウィジェットに適用されるCSSを削除
    add_filter('wp_head', 'sng_remove_wp_widget_recent_comments_style', 1);
    add_action('wp_head', 'sng_remove_recent_comments_style', 1);

    // SETUP4) ギャラリースタイルに適用されるCSSを削除
    add_filter('gallery_style', 'sng_gallery_style');

    // SETUP5) 各種THEME SUPPORT
    sng_theme_support();

    // SETUP6) ウィジェットを登録
    add_action('widgets_init', 'sng_register_sidebars');

} // end sng_after_setup
add_action('after_setup_theme', 'sng_after_setup');

/*****************************
 * SETUP1) headの不要タグを除去
 ******************************/

function sng_head_cleanup()
{
    // カテゴリ等のフィードを削除
    // 以下一文をコメントアウトすれば表示されるように
    remove_action('wp_head', 'feed_links_extra', 3);

    // リモート投稿用のリンクの出力は一応残しておきます
    // remove_action( 'wp_head', 'rsd_link' );

    // Windows Live Writer用のリンクを削除（使わないですよね）
    remove_action('wp_head', 'wlwmanifest_link');

    // 前後の記事等へのrel linkを削除
    remove_action('wp_head', 'parent_post_rel_link', 10, 0);
    remove_action('wp_head', 'start_post_rel_link', 10, 0);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);

    // WPのバージョン表示も削除
    remove_action('wp_head', 'wp_generator');

    // CSSやJSファイルに付与されるWordPressのバージョンを消す
    // 下記の関数を指定
    add_filter('style_loader_src', 'sng_remove_wp_ver_css_js', 9999);
    add_filter('script_loader_src', 'sng_remove_wp_ver_css_js', 9999);

} /* end sng head cleanup */

function sng_remove_wp_ver_css_js($src)
{
    if (strpos($src, 'ver=') && !strpos($src, 'wp-includes')) {
        $src = remove_query_arg('ver', $src);
    }

    return $src;
}

/*****************************
 * SETUP2) RSSからWPのバージョンを削除
 ******************************/
function sng_rss_version()
{return '';}

/*****************************
 * SETUP3) 「最近のコメント」ウィジェットに適用されるCSSを削除
 ******************************/
function sng_remove_wp_widget_recent_comments_style()
{
    if (has_filter('wp_head', 'wp_widget_recent_comments_style')) {
        remove_filter('wp_head', 'wp_widget_recent_comments_style');
    }
}
function sng_remove_recent_comments_style()
{
    global $wp_widget_factory;
    if (isset($wp_widget_factory->widgets['WP_Widget_Recent_Comments'])) {
        remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
    }
}

/*****************************
 * SETUP4) ギャラリーに適用されるCSSを削除
 ******************************/
function sng_gallery_style($css)
{
    return preg_replace("!<style type='text/css'>(.*?)</style>!s", '', $css);
}

/*****************************
 * SETUP5) THEME SUPPORT
 ******************************/
function sng_theme_support()
{

    // サムネイル画像を使用可能に
    add_theme_support('post-thumbnails');
    add_image_size('thumb-940', 940); //関連記事等で利用
    add_image_size('thumb-520', 520, 300, true); //関連記事等で利用
    add_image_size('thumb-160', 160, 160, true); //サムネイルサイズ

    function sng_custom_image_sizes($sizes)
    {
        return array_merge($sizes, array(
            'thumb-520' => '520 x 300px',
            'thumb-160' => '160 x 160px',
        ));
    }
    add_filter('image_size_names_choose', 'sng_custom_image_sizes');

    // SVGをアップロードできるように
    function enable_svg($mimes)
    {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }
    add_filter('upload_mimes', 'enable_svg');

    // カスタム背景
    add_theme_support('custom-background',
        array(
            'default-image' => '',
            'default-color' => '',
            'wp-head-callback' => '_custom_background_cb',
            'admin-head-callback' => '',
            'admin-preview-callback' => '',
        )
    );

    // rssリンクをhead内に出力
    add_theme_support('automatic-feed-links');

    // メニューを登録
    register_nav_menus(
        array(
            'desktop-nav' => 'ヘッダーメニュー（PCでのみ表示）',
            'mobile-nav' => 'スライドメニュー（モバイルのみ）',
            'footer-links' => 'フッターメニュー（ページ最下部）',
            'mobile-fixed' => 'モバイル用フッター固定メニュー',
        )
    );

    // HTML5マークアップをサポート
    add_theme_support('html5', array(
        'comment-list',
        'search-form',
        'comment-form',
    ));

} /* end theme support */

/*********************************
 * STEP6. サイドバー/ウィジェットの登録
 ***********************************/
function sng_register_sidebars()
{
  // メインのサイドバー
  register_sidebar(array(
    'id' => 'sidebar1',
    'name' => 'サイドバー',
    'description' => 'メインのサイドバーです。スマホで見たときにはページ下に配置されます。',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="widgettitle dfont has-fa-before">',
    'after_title' => '</h4>',
  ));

  // 追尾サイドバー
  register_sidebar(array(
    'id' => 'fixed_sidebar',
    'name' => '追尾サイドバー（PCのみ）',
    'description' => 'この中に入れたウィジェットは記事ページのサイドバーで固定されます',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="widgettitle dfont has-fa-before">',
    'after_title' => '</h4>',
  ));

  // ナビドロワー（ハンバーガーメニュー）
  register_sidebar(array(
    'id' => 'nav_drawer',
    'name' => 'スマホ用ナビドロワー（ハンバーガーメニュー）',
    'description' => 'ハンバーガーメニューで表示されるナビドロワーです',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="widgettitle has-fa-before">',
    'after_title' => '</h4>',
  ));

  // フッターウィジェット左
  register_sidebar(array(
    'id' => 'footer_left',
    'name' => 'フッターウィジェット左',
    'description' => '画面が小さくなるとフッターウィジェットは縦に並びます。',
    'before_widget' => '<div class="ft_widget widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="ft_title">',
    'after_title' => '</h4>',
  ));

  // 目次用ウィジェット
  register_sidebar(array(
    'id' => 'toc_in_contents',
    'name' => '記事内目次用エリア',
    'description' => 'はじめのh2見出しの前に表示されます',
    'before_widget' => '<div class="toc">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title dfont">',
    'after_title' => '</p>',
  ));

  // フッターウィジェット中
  register_sidebar(array(
    'id' => 'footer_cent',
    'name' => 'フッターウィジェット中',
    'description' => '画面が小さくなるとフッターウィジェットは縦に並びます。',
    'before_widget' => '<div class="ft_widget widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="ft_title">',
    'after_title' => '</h4>',
  ));

  // フッターウィジェット右
  register_sidebar(array(
    'id' => 'footer_right',
    'name' => 'フッターウィジェット右',
    'description' => '画面が小さくなるとフッターウィジェットは縦に並びます。',
    'before_widget' => '<div class="ft_widget widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h4 class="ft_title">',
    'after_title' => '</h4>',
  ));


  register_sidebar(array(
    'id' => 'home_header',
    'name' => 'トップページヘッダー下',
    'description' => 'トップページのヘッダー下のスペースに表示されます(モバイル/PC共通)。',
    'before_widget' => '<div class="home_header">',
    'after_widget' => '</div>',
    'before_title' => '<p class="strong dfont center">',
    'after_title' => '</p>',
  ));

  // トップページ上
  register_sidebar(array(
    'id' => 'home_top',
    'name' => 'トップページ記事一覧上',
    'description' => 'トップページの記事一覧上のスペースに表示されます(モバイル/PC共通)。',
    'before_widget' => '<div class="home_top">',
    'after_widget' => '</div>',
    'before_title' => '<p class="strong dfont center">',
    'after_title' => '</p>',
  ));

  // トップページ下
  register_sidebar(array(
    'id' => 'home_bottom',
    'name' => 'トップページ記事一覧下',
    'description' => 'トップページの記事一覧下のスペースに表示されます(モバイル/PC共通)。',
    'before_widget' => '<div class="home_bottom">',
    'after_widget' => '</div>',
    'before_title' => '<p class="strong dfont center">',
    'after_title' => '</p>',
  ));

  // 記事タイトル下広告（モバイル）
  register_sidebar(array(
    'id' => 'ads_below_title_mb',
    'name' => '記事タイトル下広告（モバイル）',
    'description' => 'スマホ・タブレットで見たときに記事のタイトル下に表示されます。',
    'before_widget' => '<div class="sponsored">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title dfont">',
    'after_title' => '</p>',
  ));

  // 記事タイトル下広告（PC）
  register_sidebar(array(
    'id' => 'ads_below_title_pc',
    'name' => '記事タイトル下広告（PC）',
    'description' => 'PCで見たときに記事のタイトル下に表示されます。',
    'before_widget' => '<div class="sponsored">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title dfont">',
    'after_title' => '</p>',
  ));

  // カテゴリー記事上
  register_sidebar(array(
    'id' => 'category_top',
    'name' => 'カテゴリートップページ記事一覧上',
    'description' => 'カテゴリートップページの記事一覧上に表示されます。',
    'before_widget' => '<div>',
    'after_widget' => '</div>',
    'before_title' => '<p class="widgettitle dfont has-fa-before">',
    'after_title' => '</p>',
  ));

  // 記事中広告
  register_sidebar(array(
    'id' => 'ads_in_contents',
    'name' => '記事中広告',
    'description' => 'はじめのh2見出しの前に表示されます',
    'before_widget' => '<div class="sponsored">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title dfont">',
    'after_title' => '</p>',
  ));

  // アドセンス 記事下広告（モバイル）
  register_sidebar(array(
    'id' => 'ads_below_contents_mb',
    'name' => '記事コンテンツ後広告（モバイル）',
    'description' => 'スマホ・タブレットで見たときに記事の記事コンテンツの下（シェアボタン前）に表示されます。',
    'before_widget' => '<div class="sponsored dfont">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title">',
    'after_title' => '</p>',
  ));

  // アドセンス 記事下広告（PC）
  register_sidebar(array(
    'id' => 'ads_below_contents_pc',
    'name' => '記事コンテンツ後広告（PC）',
    'description' => 'PCで見たときに記事の記事コンテンツの下（シェアボタン前）に表示されます。',
    'before_widget' => '<div class="sponsored dfont">',
    'after_widget' => '</div>',
    'before_title' => '<p class="ads-title">',
    'after_title' => '</p>',
  ));

  // アドセンス関連記事型広告
  register_sidebar(array(
    'id' => 'ads_footer',
    'name' => 'アドセンス関連記事型広告',
    'description' => '記事下に表示されます。アドセンスの関連記事型広告向けです。コードを貼り付けてご利用ください。',
    'before_widget' => '<div id="related_ads" class="related_ads">',
    'after_widget' => '</div>',
    'before_title' => '<h3 class="h-undeline related_title">',
    'after_title' => '</h3>',
  ));

} // END sng_register_sidebars

add_action( 'admin_bar_menu', 'sng_admin_bar_menu', 99 );

function sng_admin_bar_menu( $wp_admin_bar ) {
  $sango_logo = '<svg style="width: 12px; height: auto; vertical-align: middle; margin-right: 5px;" class="sng-edit-logo" width="227" height="344" viewBox="0 0 227 344" fill="none" xmlns="http://www.w3.org/2000/svg" size="24"><path d="M147.145 158.393c-92.383 21.826-111.79 12.003-111.79 12.003s-22.124 19.741-10.4 38.598c11.726 18.857 32.882 16.265 37.705 16.637 4.825.37 56.397-12.852 56.397-12.852s35.709-26.308 61.246-37.288c25.537-10.979 14.093-22.939 14.093-22.939a56.542 56.542 0 00-8.455-.609c-10.634-.002-22.559 2.614-38.796 6.45z" fill="currentColor"></path><path d="M41.137 116.899C15.945 137.731-4.219 156.162.76 186.869c8.452 52.109 62.882 38.726 62.882 38.726-38.82.81-14.354-40.006 80.098-110.104C231.817 50.123 187.41 0 187.41 0 128.406 54.597 41.137 116.899 41.137 116.899zM107.086 225.304c-31.334 35.079-18.86 70.981-18.86 70.981l.088.048c9.797 32.834 43.522 47.157 43.522 47.157-54.126-77.964 97.956-120.143 94.703-164.278-1.872-23.947-34.458-26.967-34.458-26.967 19.599 10.73-40.828 23.612-84.995 73.059z" fill="currentColor"></path><path d="M107.086 225.304c-31.334 35.079-18.86 70.981-18.86 70.981l.088.048c9.797 32.834 43.522 47.157 43.522 47.157-100.023-58.503 51.335-144.158 70.899-158.588 18.062-13.321 8.794-24.473 7.868-25.508-9.276-6.085-18.522-7.149-18.522-7.149 19.599 10.73-40.828 23.612-84.995 73.059z" fill="currentColor"></path></svg>';
	$wp_admin_bar->add_menu( array(
		'id'     => 'sng_admin_bar_menu',
		'title'  => "$sango_logo SANGO",
		'href'   => '#',
	));

  $wp_admin_bar->add_menu( array(
    'parent' => 'sng_admin_bar_menu',
		'id'     => 'sng_admin_bar_menu_sango_manual',
		'title'  => 'SANGO カスタマイズマニュアル',
    'meta'   => array('target' => '_blank' ),
		'href'   => 'https://saruwakakun.com/sango/all-menu',
	));

  $wp_admin_bar->add_menu( array(
    'parent' => 'sng_admin_bar_menu',
		'id'     => 'sng_admin_bar_menu_sango_versions',
		'title'  => 'SANGO テーマ 更新情報',
    'meta'   => array('target' => '_blank' ),
		'href'   => 'https://saruwakakun.com/sango/update-info',
	));

  $wp_admin_bar->add_menu( array(
    'parent' => 'sng_admin_bar_menu',
		'id'     => 'sng_admin_bar_menu_sango_gutenberg_versions',
		'title'  => 'SANGO Gutenberg 更新情報',
    'meta'   => array('target' => '_blank' ),
		'href'   => 'https://saruwakakun.com/sango/sango-gutenberg%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%83%8E%E3%83%BC%E3%83%88',
	));

  $wp_admin_bar->add_menu( array(
    'parent' => 'sng_admin_bar_menu',
		'id'     => 'sng_admin_bar_menu_sango_land',
		'title'  => 'SANGO Land',
    'meta'   => array('target' => '_blank' ),
		'href'   => 'https://www.sangoland.app/',
	));
}

function sng_has_gutenberg_plugin()
{
  $plugins = get_plugins();
  $filtered = array_filter($plugins, function ($plugin) {
      if ($plugin["Name"] === "SANGO Gutenberg") {
          return true;
      }
      return false;
  });
  $exist = $filtered && count($filtered) > 0 ? true : false;
  if (!$exist) {
    return false;
  }
  $keys = array_keys($filtered);
  $file = isset($keys[0]) ? $keys[0] : '';
  return is_plugin_active($file);
}

/* ------------------------------ Do not touch here ------------------------------ */
if (is_user_logged_in()) {
  require_once 'library/functions/sng-new-version.php';
	require_once 'vendor/yahnis-elsts/plugin-update-checker/plugin-update-checker.php';
  require_once ABSPATH . 'wp-admin/includes/plugin.php';
  if (get_option('sng_update_method_include_major_version') && !sng_has_gutenberg_plugin()) {
    $update_file = 'https://storage.googleapis.com/sango-theme-fd439535gasls/wp-sango-theme-update-information-43fadgd.json';
    $myUpdateChecker = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
      $update_file,
      __FILE__,
      'sango-theme'
    );
  }
}