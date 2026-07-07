<?php
/** SANGOの様々な表現を実現するための関数です。
 * FontAwesome4⇔5の切り替え
 * 日付（time）の出力
 * bodyクラスをコントロール
 * サイドバーの表示・非表示を切り替え
 * アイキャッチ画像のURLを取得
 * 記事一覧のページネイション（トップ/アーカイブページ用）
 * 記事一覧カード上にカテゴリー名を出力
 * NEWマーク
 * 記事内に広告挿入
 * モバイル用フッター固定メニュー
 * 追尾サイドバー
 * トップへ戻るボタン
 * ホームタブのJS設定
 * Google Analyticsコードをヘッダーに挿入
 * embedコンテンツの最大幅を設定
 * エディタの整形設定
 * サイドバーのカテゴリーリンクに含まれるtitleタグを消去
 * 記事一覧カード（グリッド）の出力関係
 * body閉じタグ直前にタグ挿入
 */
/*******************************
 * FontAwesome
 *******************************/
if (!function_exists('fa_tag')) {
  function fa_tag($icon_name_for_4, $icon_name_for_5, $is_brand) {
    if (get_option('use_fontawesome4')) {
      echo '<i class="fa fa-'. $icon_name_for_4 .'" aria-hidden="true"></i>';
    } else {
      echo $is_brand ? '<i class="fab fa-'. $icon_name_for_5 .'" aria-hidden="true"></i>' : '<i class="fas fa-'. $icon_name_for_5 .'" aria-hidden="true"></i>';
    }
  }
}

if (!function_exists('get_fa_tag')) {
  function get_fa_tag($icon_name_for_4, $icon_name_for_5, $is_brand) {
    if (get_option('use_fontawesome4')) {
      return '<i class="fa fa-'. $icon_name_for_4 .'"></i>';
    } else {
      return $is_brand ? '<i class="fab fa-'. $icon_name_for_5 .'"></i>' : '<i class="fas fa-'. $icon_name_for_5 .'"></i>';
    }
  }
}

/*******************************
 * loading lazyを出力
 *******************************/
if (!function_exists('sng_lazy_attr')) {
  function sng_lazy_attr() {
    if(!get_option('use_loading_lazy')) return;
    echo 'loading="lazy"';
  }
}

/*******************************
 * 日付（time）の出力
 *******************************/
// 投稿日を表示する
if (!function_exists('sng_get_date')) {
  function sng_get_date($id=null, $class=null) {
    if(get_option('remove_pubdate')) return;
    $output = '<time class="pubdate '. $class .'" itemprop="datePublished" datetime="'. get_the_time('Y-m-d', $id). '">';
    $output .= get_the_time( get_option( 'date_format' ), $id );
    $output .= '</time>';
    return $output;
  }
}

// 更新日を表示する
if (!function_exists('sng_get_modified_date')) {
  function sng_get_modified_date($id=null, $class=null) {
    if(get_option('remove_pubdate')) return;
    // 更新されていない場合は何も表示しない
    if(get_the_modified_date('Ymd', $id) <= get_the_date('Ymd', $id)) return "";
    $output = '<time class="updated '. $class .'" itemprop="dateModified" datetime="'. get_the_modified_date('Y-m-d', $id). '">';
    $output .= get_the_modified_date( get_option( 'date_format' ), $id );
    $output .= '</time>';
    return $output;
  }
}

// get_option('show_only_mod_date')がfalse => 投稿日を表示
// get_option('show_only_mod_date')がtrue => 最新の日付を表示
if (!function_exists('sng_get_single_date')) {
  function sng_get_single_date($id=null, $class=null) {
    if(get_option('remove_pubdate')) return;
    if(get_option('show_only_mod_date') && get_the_modified_date('Ymd', $id) > get_the_date('Ymd', $id)) {
      return sng_get_modified_date($id, $class);
    } else {
      return sng_get_date($id, $class);
    }
  }
}


/*******************************
 * bodyに付与するクラスを追加
*******************************/
if (!function_exists('sng_original_body_class')) {
  function sng_original_body_class($classes) {
    // FontAwesome5を使用している場合"fa5"を付与
    $classes[] = get_option('use_fontawesome4') ? 'fa4' : 'fa5';
    return $classes;
  }
}
add_filter('body_class', 'sng_original_body_class');

/*******************************
 * サイドバーの表示・非表示を切り替え
*******************************/
if (!function_exists('sng_is_sidebar_shown')) {
  function sng_is_sidebar_shown() {
    if( !is_active_sidebar( 'sidebar1' ) ) return false;
    // カスタマイザーで「モバイルでは非表示」に設定してるとき => false
    if( is_singular() && wp_is_mobile() && get_option('no_sidebar_mobile') ) return false;
    // 記事ページで1カラム表示を選択してるとき => false
    if( is_single() ) {
      global $post;
      if( get_post_meta( $post->ID, 'one_column_options', true ) ) return false;
    }
    // それ以外
    return true;
  }
}

/*******************************
 * アイキャッチ画像関連
 *******************************/

// サムネイルサイズに応じて、デフォルトサムネイルのファイルURLを、トリミング後のURLに置き換える関数
// 例： .../example.png -> .../example-520x300.png
if (!function_exists('replace_custom_size_thumbnail_url')) {
  function replace_custom_size_thumbnail_url($url, $width, $height) {
    $exts = array('.jpg', '.jpeg', '.png', '.gif', '.bmp');
    $replace_exts = array();
    foreach ($exts as $ext) {
      $replace_exts[] = '-' . $width . 'x' . $height . $ext;
    }
    return str_replace($exts, $replace_exts, $url);
  }
}
if (!function_exists('replace_thumbnail_src')) {
  function replace_thumbnail_src($src, $size)
  {
    if ($size == "thumb-160") return replace_custom_size_thumbnail_url($src, "160", "160");
    if ($size == "thumb-520") return replace_custom_size_thumbnail_url($src, "520", "300");
  }
}

// サイズを指定して画像のURLを取得
if (!function_exists('featured_image_src')) {
  function featured_image_src($size, $id = null)
  {
    // 1) 記事にサムネイル画像あり
    if (has_post_thumbnail($id)) return get_the_post_thumbnail_url($id, $size);

    // 2) サムネイル画像なし&デフォルト画像登録済み
    $registered = esc_url(get_option('thumb_upload')); // カスタマイザーで登録されたデフォルト画像URL
    if ($registered) {
      if ($size == 'thumb-160') return replace_thumbnail_src($registered, 'thumb-160'); // サムネイルサイズ
      if ($size == 'thumb-520') return replace_thumbnail_src($registered, 'thumb-520'); // 中サイズ
      return $registered; // 通常のサイズ
    } 

    // 3) それ以外の場合はテーマのデフォルト画像を返す
    $template_image_path_base = get_template_directory_uri() . '/library/images/';
    if($size == 'thumb-160') return $template_image_path_base . 'default_thumb.jpg';
    if($size == 'thumb-520') return $template_image_path_base . 'default_small.jpg';
    return $template_image_path_base . 'default.jpg';
  }
} // END featured_image_src

//【廃止】アイキャッチ画像のURLを取得する関数
// get_the_post_thumbnail_url()を使えば不要。カスタマイズユーザーのために念のため残しておく
function imgurl($size_name, $id = null)
{
  $thum_id = get_post_thumbnail_id($id);
  $img_src = wp_get_attachment_image_src($thum_id, $size_name);
  return $img_src[0];
}

if (!function_exists('sng_get_image_size')) {
  function sng_get_image_size($url) {
    $image_path = str_replace(site_url(), ABSPATH, $url);
    $size = @getimagesize($image_path);
    if (!$size) {
      return ['', ''];
    }
    return $size;
  }
}

if (!function_exists('sng_echo_image_size')) {
  function sng_echo_image_size($url) {
    $size = sng_get_image_size($url);
    $width = $size[0];
    $height = $size[1];
    echo "width=\"$width\" height=\"$height\"";
  }
}

if (!function_exists('sng_echo_header_logo_size')) {
  function sng_echo_header_logo_size($url)
  {
    sng_echo_image_size($url);
  }
}

/*********************
 * 記事一覧のページネイション
 * ⇒ トップページやアーカイブページで使用
 *********************/
if (!function_exists('sng_page_navi')) {
  function sng_page_navi()
  {
    global $wp_query;
    $bignum = 999999999;
    if ($wp_query->max_num_pages <= 1) {
      return;
    }
    $paged = get_query_var('paged') ? intval(get_query_var('paged')) : 1;
    $pagenum_link = html_entity_decode(get_pagenum_link());
    $query_args = array();
    $url_parts = explode('?', $pagenum_link);
    if (isset($url_parts[1])) {
      wp_parse_str($url_parts[1], $query_args);
    }
    $pagenum_link = remove_query_arg(array_keys($query_args), $pagenum_link);
    $pagenum_link = trailingslashit($pagenum_link) . '%_%';
    $format = $GLOBALS['wp_rewrite']->using_index_permalinks() && !strpos($pagenum_link, 'index.php') ? 'index.php/' : '';
    $format .= $GLOBALS['wp_rewrite']->using_permalinks() ? user_trailingslashit('page/%#%', 'paged') : '?paged=%#%';
    ob_start();
    echo '<nav class="pagination dfont" role="navigation" aria-label="ページネーション">';
    echo paginate_links(array(
      'base' => $pagenum_link,
      'format' => $format,
      'total' => $GLOBALS['wp_query']->max_num_pages,
      'current' => $paged,
      'end_size' => 1,
      'mid_size' => 1,
      'prev_text' => '<i class="fa fa-chevron-left"></i>',
      'next_text' => '<i class="fa fa-chevron-right"></i>',
      'type' => 'list',
    ));
    echo '</nav>';
    $html = ob_get_clean();
    $html = str_replace("class=\"next page-numbers\"", "class=\"next page-numbers\" aria-label=\"次へ\"", $html);
    $html = str_replace("class=\"prev page-numbers\"", "class=\"prev page-numbers\" aria-label=\"前へ\"", $html);
    echo $html;
  }
} /* end page navi */

/*********************
 * リンク付きでカテゴリー名を出力 ⇒ トップページの記事一覧のサムネイル上に
 *********************/
if (!function_exists('output_catogry_link')) {
  function output_catogry_link()
  {
    $cat = get_the_category();
    if (!$cat) return false;

    $cat = $cat[0];
    $catId = $cat->cat_ID;
    $catName = esc_attr($cat->cat_name);
    $catLink = esc_url(get_category_link($catId));
    if ($catLink && $catName) {
      echo '<a class="dfont cat-name catid' . $catId . '" href="' . $catLink . '">' . $catName . '</a>';
    }
  }
}

/*********************
 * 記事一覧にNEWマークを出力
 *********************/
function newmark()
{
  $days = esc_attr(get_option('new_mark_date', '3'));
  $daysInt = ((int) $days - 1) * 86400;
  $today = time();
  $entry = get_the_time('U');
  $dayago = $today - $entry;
  if (($dayago < $daysInt) && $days) {
    echo '<div class="dfont newmark accent-bc">NEW</div>';
  }
}

/*********************
 * 「日/月/年」の記事一覧、という文字を生成
 *********************/
if (!function_exists('sng_date_title')) {
  function sng_date_title()
  {
    $title = get_query_var('year') . '年 ';
    if (is_day()) {
      $title .= get_query_var('monthnum') . '月 ';
      $title .= get_query_var('day') . '日';
    } elseif (is_month()) {
      $title .= get_query_var('monthnum') . '月 ';
    } else {
    }
    $title .= 'の記事一覧';
    return $title;
  }
}

/*********************
 * カテゴリーページで子カテゴリーのリンクを出力
 *********************/
if (!function_exists('output_categories_list')) {
  function output_categories_list()
  {
    $cat_id = get_query_var('cat');
    $children = wp_list_categories('show_option_none=&echo=0&show_count=0&use_desc_for_title=0&depth=1&title_li=&child_of=' . $cat_id);
    if (!empty($children)) { ?>
    <div class="cat_list"><ul>
      <?php echo $children; ?>
    </ul></div>
    <?php }
  }
}
/*********************
 * カテゴリーページの表示タイトルを変更
 *********************/
add_filter('get_the_archive_title', 'custom_archive_title');
if (!function_exists('custom_archive_title')) {
  function custom_archive_title($title)
  {
    if (is_category()) {
      $title = single_cat_title('', false); // カテゴリー
    } elseif (is_tag()) {
      $title = single_tag_title('', false); // タグ
    } elseif (is_date()) { // 日付
      $title = get_query_var('year') . '年';
      if (is_day()) {
        $title .= get_query_var('monthnum') . '月';
        $title .= get_query_var('day') . '日';
      } elseif (is_month()) {
        $title .= get_query_var('monthnum') . '月';
      }
    }
    return $title;
  }
}

/*********************
 * オリジナルカテゴリータイトルが指定されていれば表示
 *********************/
function output_archive_title()
{
  if (is_category()) {
    $term_info = get_term(get_query_var('cat'), "category");
    $term_meta = get_option($term_info->taxonomy . '_' . $term_info->term_id);
  }
  if (isset($term_meta['category_title'])) {
    return esc_attr($term_meta['category_title']);
  }
}

/*********************
 * 記事中の1番目のh2見出し下に広告を配置
 *********************/
if (!function_exists('ads_before_headline_num')) {
  function ads_before_headline_num() {
    return 0;
  }
}

function ads_before_headline($the_content) {
  global $post;
  if (!is_single()) return $the_content;
  if (!is_active_sidebar('ads_in_contents')) return $the_content;
  if (get_post_meta($post->ID, 'disable_ads', true)) return $the_content;

  if (!defined('H2REGEX')) define('H2REGEX', '/^<h2.*?>.*?<\/h2>$/im');
  if (!defined('REPLACE_NUM')) define('REPLACE_NUM', ads_before_headline_num());

  // ウィジェットを$adに格納
  ob_start();
  dynamic_sidebar('ads_in_contents');
  $ad = ob_get_contents();
  ob_end_clean();

  preg_match_all(H2REGEX, $the_content, $matches);
  if ( isset($matches[0]) && isset($matches[0][REPLACE_NUM])) {
    $the_content  = str_replace($matches[0][REPLACE_NUM], $ad.$matches[0][REPLACE_NUM], $the_content);
  }
  
  return $the_content;
}
add_filter('the_content', 'ads_before_headline');

/*********************
 * 記事中の1番目のh2見出し下に目次エリアを配置
 *********************/
function sng_toc_before_headline($the_content) {
  global $post;

  if (!is_active_sidebar('toc_in_contents')) return $the_content;

  // TODO カスタマイザーで場所変更できるように検討
  $replace_num = 0;
  ob_start();
  dynamic_sidebar('toc_in_contents');
  $toc_area = ob_get_contents();
  ob_end_clean();

  $h2 = '/<h2.*?>/i';
  if ( preg_match( $h2, $the_content, $h2s )) {
    $the_content  = preg_replace($h2, $toc_area.$h2s[$replace_num], $the_content, 1);
  }

  return $the_content;
}
add_filter('the_content', 'sng_toc_before_headline');

/*************************
 * フッターにアナリティクスのコードを挿入
 **************************/
// IDはカスタマイザーで設定
function add_GA_code()
{
  if (get_option('ga_code')) {
    if (get_option('gtagjs')):
?>
<!-- gtag.js -->
<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_html(get_option('ga_code')); ?>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '<?php echo esc_html(get_option('ga_code')); ?>');
</script>
<?php else: // gtagjsにチェックが入っていない時 ?>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	  ga('create', '<?php echo esc_html(get_option('ga_code')); ?>', 'auto');
	  ga('send', 'pageview');
	</script>
	<?php endif; // end if gtagjs
  } // end if ga_code
}
add_action('wp_head', 'add_GA_code');

/*******************************
 * モバイル用フッター固定メニュー
 *******************************/
if (!function_exists('footer_nav_menu')) {
  function footer_nav_menu()
  {
    if(!wp_is_mobile() || !has_nav_menu('mobile-fixed')) return;
    $scrollUpwardOption = get_option('footer_fixed_scroll_upward');
    ?>
    <nav class="fixed-menu<?php if ($scrollUpwardOption): ?> fixed-menu-scroll-upward<?php endif; ?>">
    <?php
    wp_nav_menu(array(
      'container' => false,
      'theme_location' => 'mobile-fixed',
      'depth' => 1,
    ));
    echo '</nav>';
    footer_nav_menu_follow(); // フォローボタン機能
    footer_nav_menu_share(); // シェアボタン機能
    footer_nav_menu_script(); // スクリプト
  }
}
/**
 * モバイル用フッター固定メニューのフォローボタン
 */
if (!function_exists('footer_nav_menu_follow')) {
  function footer_nav_menu_follow() {
    if (!get_option('footer_fixed_follow')) return;
    $tw = (get_option('like_box_twitter')) ? 'https://twitter.com/' . esc_attr(get_option('like_box_twitter')) : null;
    $fb = (get_option('like_box_fb')) ? esc_url(get_option('like_box_fb')) : null;
    $fdly = (get_option('like_box_feedly')) ? esc_url(get_option('like_box_feedly')) : null;
    $insta = (get_option('like_box_insta')) ? esc_url(get_option('like_box_insta')) : null;
    $youtube = (get_option('like_box_youtube')) ? esc_url(get_option('like_box_youtube')) : null;
?>
<div class="fixed-menu__follow dfont">
  <?php if ($insta): ?>
    <a href="<?php echo $insta; ?>" class="follow-insta" target="_blank" rel="nofollow noopener noreferrer"><?php fa_tag("instagram","instagram",true) ?><div>Instagram</div></a>
  <?php endif; ?>
  <?php if ($youtube): ?>
    <a href="<?php echo $youtube; ?>" class="follow-youtube" target="_blank" rel="nofollow noopener noreferrer"><?php fa_tag("youtube","youtube",true) ?><div>YouTube</div></a>
  <?php endif; ?>
  <?php if ($fb): ?>
    <a href="<?php echo $fb; ?>" class="follow-fb" target="_blank" rel="nofollow noopener noreferrer"><?php fa_tag("facebook","facebook",true) ?><div>Facebook</div></a>
  <?php endif; ?>
  <?php if ($tw): ?>
    <a href="<?php echo $tw; ?>" class="follow-tw" target="_blank" rel="nofollow noopener noreferrer"><?php fa_tag("twitter","twitter",true) ?><div>Twitter</div></a>
  <?php endif; ?>
  <?php if ($fdly): ?>
    <a href="<?php echo $fdly; ?>" class="follow-fdly" target="_blank" rel="nofollow noopener noreferrer"><?php fa_tag("rss","rss",false) ?><div>Feedly</div></a>
  <?php endif;?>
</div>
<?php
  }
}
/**
 * モバイル用フッター固定メニューのシェアボタン
 */
if (!function_exists('footer_nav_menu_share')) {
  function footer_nav_menu_share() {
    if (!get_option('footer_fixed_share')) return;
    if (sng_disable_share_button()) {
      _sng_hide_footer_fixed_share_html();
      return;
    }
  ?>
    <div class="fixed-menu__share sns-dif normal-sns">
      <?php insert_social_buttons();?>
    </div>
  <?php
  }
}

// モバイルフッター固定メニューのシェアボタンを強制的に非表示にする関数（シェアボタンの非表示設定がONのときに実行）
function _sng_hide_footer_fixed_share_html() {
?>
<script>
jQuery(document).ready(function(){
  var shareBtnItem = jQuery("a[href='#sng_share']").parent('.menu-item');
  if(shareBtnItem) {
    shareBtnItem.css({'display': 'none'});
  }
});</script>
<?php
}
/**
 * モバイル用フッター固定メニューのスクリプト
 */
if (!function_exists('footer_nav_menu_script')) {
  function footer_nav_menu_script() {
    $script = <<< EOM
    jQuery(document).ready(function() {
      jQuery(".archive a[href = '#sng_share']").closest('li').css('display','none');
      jQuery(".fixed-menu a[href = '#']").click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, 300);
      });
      jQuery("a[href = '#sng_share']").click(function(event) {
        event.preventDefault();
        jQuery(".fixed-menu__share , a[href = '#sng_share']").toggleClass("active");
        jQuery(".fixed-menu__follow, a[href = '#sng_follow']").removeClass("active");
      });
      jQuery("a[href = '#sng_follow']").click(function(event) {
        event.preventDefault();
        jQuery(".fixed-menu__follow, a[href = '#sng_follow']").toggleClass("active");
        jQuery(".fixed-menu__share, a[href = '#sng_share']").removeClass("active");
      });
      var fixedMenu = jQuery(".fixed-menu-scroll-upward");
      if (fixedMenu.length) {
        var oldScrollTop = jQuery(window).scrollTop();
        var scrollCount = 0;
        var scrollOffset = 15;
        jQuery(window).on("scroll", function() {
          var scrollTop = jQuery(this).scrollTop();
          if (oldScrollTop > scrollTop) {
            scrollCount++;
          } else {
            scrollCount--;
          }
          if (scrollCount > scrollOffset) {
            scrollCount = 0;
            fixedMenu.addClass("fixed-menu-scroll-upward-show");
          } else if (scrollCount < -scrollOffset) {
            scrollCount = 0;
            fixedMenu.removeClass("fixed-menu-scroll-upward-show");
            jQuery(".fixed-menu__share , a[href = '#sng_share']").removeClass("active");
            jQuery(".fixed-menu__follow, a[href = '#sng_follow']").removeClass("active");
          }
          oldScrollTop = scrollTop;
        });
      }
    });
EOM;
    echo '<script>' . sng_minify_js($script) . '</script>';
  }
}

/*******************************
 * 追尾サイドバー
 *******************************/

// 追尾サイドバーを表示するかどうか
if (!function_exists('is_active_fixed_sidebar')) {
  function is_active_fixed_sidebar() {
    global $post;
    return ( is_singular() // 投稿 or 固定ページ
             && !wp_is_mobile() // PC表示
             && is_active_sidebar('fixed_sidebar') // 固定サイドバーがアクティブ
             && !get_post_meta($post->ID, 'one_column_options', true) // 1カラムオプションでない
             && !is_page_template('page-1column.php') // 1カラムの固定ページでない
             && !is_page_template('page-forfront.php') // トップページ用固定ページでない
            );
  }
}

// 追尾サイドバー
// v2.0〜はIEのみ（他ブラウザではCSSにより実現）
if (!function_exists('fixed_sidebar_js')) {
  function fixed_sidebar_js()
  {
    if ( is_active_fixed_sidebar() ) {
      $script = <<< EOM
<script>
jQuery(function() {
  var isIE = /MSIE|Trident/.test(window.navigator.userAgent);
  if(!isIE) return;
  
  var fixed = jQuery('#fixed_sidebar');
  var beforeFix = jQuery('#notfix');
  var main = jQuery('#main');
  var beforeFixTop = beforeFix.offset().top;
  var fixTop = fixed.offset().top;
  var mainTop = main.offset().top;
  var w = jQuery(window);
  var adjust = function() {
    var fixHeight = fixed.outerHeight(true);
    var fixWidth = fixed.outerWidth(false);
    var beforeFixHeight = beforeFix.outerHeight(true);
    var mainHeight = main.outerHeight();
    var winHeight = w.height();
    var scrollTop = w.scrollTop();
    var fixIdleBottom =  winHeight + (scrollTop - mainHeight - mainTop);
    if(fixTop + fixHeight >= mainTop + mainHeight) return;
    if(scrollTop + fixHeight > mainTop + mainHeight) {
      fixed.removeClass('sidefixed');
      fixed.addClass('sideidled');
      fixed.css({'bottom':fixIdleBottom});
      return;
    }
    if(scrollTop >= fixTop - 25) {
      fixed.addClass('sidefixed');
      fixed.css({'width':fixWidth,'bottom':'auto'});
      return;
    }
    fixed.removeClass('sidefixed sideidled');
    fixTop = fixed.offset().top;
  };
  w.on('scroll', adjust);
});
</script>
EOM;
  echo sng_minify_js($script);
    }
  }
}
add_action('wp_footer', 'fixed_sidebar_js', 999);

/*******************************
 * トップへ戻るボタン
 *******************************/
if (!function_exists('is_active_go_top_btn')) {
  function is_active_go_top_btn() {
    if(!is_singular()) return false;
    return (wp_is_mobile() && get_option('show_to_top')) || (!wp_is_mobile() && get_option('pc_show_to_top'));
  }
}
 
// トップへ戻るボタンのHTML（footer.php）
if (!function_exists('go_top_btn')) {
  function go_top_btn()
  {
    if(!is_active_go_top_btn()) return;
    echo '<a href="#" class="totop" rel="nofollow" aria-label="トップに戻る"><i class="fa fa-chevron-up" aria-hidden="true"></i></a>';
  }
}
// トップへ戻るボタンのJS
if (!function_exists('go_top_btn_js')) {
  function go_top_btn_js()
  {
    if(!is_active_go_top_btn()) return;
    $script =<<< EOM
jQuery(document).ready(function() {
  jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop() > 700) {
      jQuery('.totop').fadeIn(300);
    } else {
      jQuery('.totop').fadeOut(300);
    }
  });
    jQuery('.totop').click(function(event) {
      event.preventDefault();
      jQuery('html, body').animate({scrollTop: 0}, 300);
    })
  });
EOM;
    echo '<script>'. sng_minify_js($script) . '</script>'; 
  }
}
add_action('wp_footer', 'go_top_btn_js', 999);

/*******************************
 * ホームタブがアクティブになったときにJSを追加
 *******************************/
if (!function_exists('home_tab_js')) {
  function home_tab_js()
  {
    global $post;
    if (is_home() && get_option('activate_tab')) {
      $script =<<< EOM
jQuery(function(){
  jQuery('.post-tab > div').click(function(){
    jQuery('.post-tab > div,.post-tab__content').removeClass('tab-active');
    var tabClass = jQuery(this).attr('class').split(" ")[0];
    jQuery(this).addClass('tab-active');
    jQuery('.post-tab__content').each(function(){
      if(jQuery(this).attr('class').indexOf(tabClass) != -1){
        jQuery(this).addClass('tab-active').fadeIn();
      } else {
        jQuery(this).hide();
      }
    });
  });
});
EOM;
      echo '<script>' . sng_minify_js($script) . '</script>';
    }
  }
}
add_action('wp_footer', 'home_tab_js', 999);

/*******************************
 * Scroll Hint用のJSを追加
 *******************************/
if (!function_exists('scroll_hint_js')) {
  function scroll_hint_js()
  {
    global $post;
    $enable_scroll_hint_load = false;
    if ($post && $post->ID) {
      $enable_scroll_hint = get_post_meta($post->ID, 'sng_enable_post_scrollhint_js', true);
      if ($enable_scroll_hint) {
        $enable_scroll_hint_load = true;
      }
    }
    if (!get_option('enable_scroll_hint_js') && !$enable_scroll_hint_load) {
      return;
    }
    $script =<<< EOM
jQuery(function(){
  if (document.querySelectorAll('.is-style-sango-table-scroll-hint').length === 0) {
    return;
  }
  new ScrollHint('.is-style-sango-table-scroll-hint', {
    i18n: {
      scrollable: 'スクロールできます'
    }
  })
});
EOM;
    echo '<script>' . sng_minify_js($script) . '</script>';
  }
}
add_action('wp_footer', 'scroll_hint_js', 999);

/*******************************
 * SmartPhoto用のJSを追加
 * 吹き出しブロックやヒーローブロックの中の画像には適用しない
 *******************************/
if (!function_exists('smartphoto_js')) {
  function smartphoto_js() {
    global $post;
    $enable_smartphoto_load = false;
    if ($post && $post->ID) {
      $enable_smartphoto = get_post_meta($post->ID, 'sng_enable_post_smartphoto_js', true);
      if ($enable_smartphoto) {
        $enable_smartphoto_load = true;
      }
    }
    if (!get_option('enable_smartphoto_js') && !$enable_smartphoto_load) {
      return;
    }
    $script = <<< EOM
jQuery(function(){
  jQuery('.entry-content img').each(function() {
    var img = jQuery(this);
    if (img.parents('a').length > 0) {
      return;
    }
    if (img.parents('.sgb-block-say-avatar').length > 0) {
      return;
    }
    if (img.parents('.js-sng-slider').length > 0) {
      return;
    }
    if (img.parents('.divheader__img').length > 0) {
      return;
    }
    if (img.parents('.faceicon').length > 0) {
      return;
    }
    if (img.parents('.textimg').length > 0){
      return;
    }
    var link = jQuery('<a>');
    link.addClass('js-smartphoto');
    link.attr('href', img.attr('data-src') || img.attr('src'));
    var figure = img.parents('figure');
    var figcaption = figure.find('figcaption');
    link.attr('data-caption', figcaption.text());
    img.wrap(link);
  });
  if (jQuery('.js-smartphoto').length > 0) {
    new SmartPhoto('.js-smartphoto');
  }
});
EOM;
    echo '<script>' . sng_minify_js($script) . '</script>';
  }
}
add_action('wp_footer', 'smartphoto_js', 999);

/*********************************
 * 投稿記事に対するカスタムJS
***********************************/
if (!function_exists('sng_post_js')) {
  function sng_post_js() {
    global $post;
    if (!isset($post->ID)) {
      return;
    }
    $script = get_post_meta($post->ID, 'sng_post_js', true);
    if (!$script) {
      return;
    }
    echo '<script>' . sng_minify_js($script) . '</script>';
  }
}
add_action('wp_footer', 'sng_post_js', 999);

/*********************************
 * 投稿記事に対するカスタムCSS
***********************************/
if (!function_exists('sng_post_css')) {
  function sng_post_css() {
    $post = get_post();
    if (is_category() && !is_paged()) {
      $cat_fields = sng_get_cat_fields();
      $category_page = isset($cat_fields['category_page']) ? $cat_fields['category_page'] : '';
      $post = get_post($category_page);
    }
    if (!isset($post->ID)) {
      return;
    }
    $style = get_post_meta($post->ID, 'sng_post_css', true);
    if (!$style) {
      return;
    }
    echo '<style>' . sng_minify_css($style) . '</style>';
  }
}
add_action('wp_head', 'sng_post_css', 999);

if (get_theme_mod('insert_tag_to_end')) {
  if (!function_exists('sng_insert_tag_to_end')) {
      function sng_insert_tag_to_end()
      {
          echo get_theme_mod('insert_tag_to_end');
      }
  }
  add_action('wp_footer', 'sng_insert_tag_to_end', 999);
}

/*********************************
 * embedコンテンツの最大幅の指定
 ***********************************/
function sango_content_width()
{
  $GLOBALS['content_width'] = apply_filters('sango_content_width', 880);
}
add_action('after_setup_theme', 'sango_content_width', 0);

/*********************
 * WordPress初期設定の絵文字を読み込む設定を停止
 *********************/
if (get_option('disable_emoji_js')) {
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_print_styles', 'print_emoji_styles');
}

/*********************
 * エディターの自動整形をオフに
 *********************/
if (get_option('never_wpautop')) {
  function override_mce_options($init_array)
  {
    global $allowedposttags;
    $init_array['valid_elements'] = '*[*]';
    $init_array['extended_valid_elements'] = '*[*]';
    $init_array['valid_children'] = '+a[' . implode('|', array_keys($allowedposttags)) . ']';
    $init_array['indent'] = true;
    $init_array['wpautop'] = false;
    $init_array['force_p_newlines'] = false;
    return $init_array;
  }
  add_filter('the_content', 'shortcode_unautop', 10);
  add_filter('tiny_mce_before_init', 'override_mce_options');
  remove_filter('the_content', 'wpautop');
  remove_filter('the_excerpt', 'wpautop');
}

/*********************
 * ショートコードをはさむpタグを削除
 *********************/
// ビジュアルエディタを使用している場合のため。必要に応じて削除してください。
function delete_p_shortcode($content = null)
{
  $array = array(
    '<p>[' => '[',
    ']</p>' => ']',
    ']<br />' => ']',
  );
  $content = strtr($content, $array);
  return $content;
}
add_filter('the_content', 'delete_p_shortcode');

/*********************
 * サイドバーのカテゴリーリンクに含まれるtitleタグを消去
 *********************/
function sng_widget_categories_args($cat_args)
{
  $cat_args['use_desc_for_title'] = 0;
  return $cat_args;
}
add_filter('widget_categories_args', 'sng_widget_categories_args');

/*********************
 * 記事一覧グリッド カード
 *********************/
if (!function_exists('sng_normal_card')) {
  function sng_normal_card()
  { 
    $url = featured_image_src('thumb-520');  
  ?>
  <article class="cardtype__article">
    <a class="cardtype__link" href="<?php the_permalink()?>">
      <p class="cardtype__img">
        <img src="<?php echo $url ?>" alt="<?php the_title();?>" <?php sng_lazy_attr(); ?> width="520" height="300" />
      </p>
      <div class="cardtype__article-info">
        <?php echo sng_get_single_date(null, "entry-time dfont") ?>
        <h2><?php the_title();?></h2>
      </div>
    </a>
  <?php
    // カテゴリーを出力
    if (!is_archive()) {
      output_catogry_link();
    }
    // newマーク
    newmark();
  ?>
  </article>
<?php
  }
} /* end sng_normal_card */

/*********************
 * 記事一覧グリッドのカード（横長タイプ）
 *********************/
if (!function_exists('sng_sidelong_card')) {
  function sng_sidelong_card()
  { ?>
  <article class="sidelong__article">
    <a class="sidelong__link" href="<?php the_permalink()?>">
      <p class="sidelong__img">
        <img src="<?php echo featured_image_src('thumb-160'); ?>" width="160" height="160" alt="<?php the_title();?>" <?php sng_lazy_attr(); ?>>
      </p>
      <div class="sidelong__article-info">
        <?php echo sng_get_single_date(null, "entry-time dfont") ?>
        <h2><?php the_title();?></h2>
      </div>
    </a>
    <?php newmark(); // newマーク ?>
  </article>
<?php
  }
} /* end sng_sidelong_card */


/*********************
 * 横長カードスタイルが選ばれているかの判定
 *********************/
function is_sidelong()
{
  if ((!wp_is_mobile() && get_option('sidelong_layout') && is_home()) /*PCトップ*/
    || (wp_is_mobile() && get_option('mb_sidelong_layout') && is_home()) /*モバイルトップ*/
    || (!wp_is_mobile() && get_option('archive_sidelong_layout') && (is_archive() || is_search())) /*PCアーカイブ*/
    || (wp_is_mobile() && get_option('mb_archive_sidelong_layout') && (is_archive() || is_search())) /*モバイルアーカイブ*/
  ) {
    return true;
  } else {
    return false;
  }
}
/*********************
 * feedにアイキャッチ画像を追加（feedly対応）
 *********************/
if (!function_exists('add_thumbnail_to_feed')) {
  function add_thumbnail_to_feed($content) {
    global $post;
    if(has_post_thumbnail($post->ID)) {
    $content = '<p><img src="' . featured_image_src('thumb-520', $post->ID) . '" class="webfeedsFeaturedVisual" width="520" height="300" /></p>' . $content;
    }
    return $content;
  }
}
add_filter('the_excerpt_rss', 'add_thumbnail_to_feed');
add_filter('the_content_feed', 'add_thumbnail_to_feed');
