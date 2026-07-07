<?php
/**
 * このファイルではシェアボタンを出力するための関数をまとめています
 */
// シェアボタンをオフにする
if (!function_exists('sng_disable_share_button')) {
  function sng_disable_share_button() {
    if (get_option('sng_hide_share')) {
      return true;
    }
    global $post;
    if(!$post) return false;
    return get_post_meta($post->ID, 'sng_disable_share', true);
  }
}


// シェア用のページタイトルを取得
if (!function_exists('sng_get_encoded_title_for_share')) {
  function sng_get_encoded_title_for_share() {
     // トップ以外はタイトルに「｜サイト名」を含める
     $title = sng_get_page_title();
     if(!is_front_page() && !is_home()) {
       $title .= '｜'.get_bloginfo('name');
     }
     return urlencode($title);
  }
}
// ツイートURLを取得する
if (!function_exists('sng_get_tweet_url')) {
  function sng_get_tweet_url($url, $title) {
    $via = (get_option('include_tweet_via')) ? '&via=' . get_option('include_tweet_via') : '';
    return 'https://twitter.com/share?url='.$url.'&text='.$title.$via;
  }
}
// FacebookシェアのURLを取得する
if (!function_exists('sng_get_fb_share_url')) {
  function sng_get_fb_share_url($url) {
    return 'https://www.facebook.com/share.php?u='.$url;
  }
}
// はてブのURLを取得する
if (!function_exists('sng_get_hatebu_url')) {
  function sng_get_hatebu_url($url, $title) {
    return 'http://b.hatena.ne.jp/add?mode=confirm&url='.$url.'&title='.$title;
  }
}
// LINEでシェアのURLを取得する
if (!function_exists('sng_get_line_share_url')) {
  function sng_get_line_share_url($url, $title) {
    return 'https://social-plugins.line.me/lineit/share?url='.$url.'&text='.$title;
  }
}
// PocketのURLを取得する
if (!function_exists('sng_get_pocket_url')) {
  function sng_get_pocket_url($url, $title) {
    return 'http://getpocket.com/edit?url='.$url.'&title='.$title;
  }
}

if (!function_exists('insert_social_buttons')) {
  function insert_social_buttons($type = null) {
    if(sng_disable_share_button()) return;
    /**
    * $type = fabだとfab用のシェアボタンを出力
    * $type = belowtitleだとタイトル下用のシェアボタンを出力
    * fabだとタイトルの出力無し
    * カスタマイザーで「シェアボタンのデザインを変える」にチェックをつけると、sns-difというクラス名を出力。CSSでデザイン指定
    * ホームでも使えるように
    */
    $encoded_url = urlencode(sng_get_current_url());
    $encoded_title = sng_get_encoded_title_for_share();
  
  ?>
  <div class="sns-btn<?php if (get_option('another_social') || $type == 'fab') { echo ' sns-dif'; } ?>">
    <?php if ($type == null) echo '<span class="sns-btn__title dfont">SHARE</span>'; ?>
      <ul>
        <!-- twitter -->
        <li class="tw sns-btn__item">
          <a href="<?php echo sng_get_tweet_url( $encoded_url, $encoded_title ); ?>" target="_blank" rel="nofollow noopener noreferrer" aria-label="Xでシェアする">
          <img alt="" src="<?php echo get_template_directory_uri() . '/library/images/x.svg'; ?>">
          <span class="share_txt">ポスト</span>
          </a>
          <?php
          if ( function_exists( 'scc_get_share_twitter' ) ) {
            echo '<span class="scc dfont">' . scc_get_share_twitter() . '</span>';
          }
          ?>
        </li>
        <!-- facebook -->
        <li class="fb sns-btn__item">
          <a href="<?php echo sng_get_fb_share_url($encoded_url); ?>" target="_blank" rel="nofollow noopener noreferrer" aria-label="Facebookでシェアする">
            <?php fa_tag("facebook","facebook",true) ?>
            <span class="share_txt">シェア</span>
          </a>
          <?php if (function_exists('scc_get_share_facebook')) {
              echo '<span class="scc dfont">' . scc_get_share_facebook() . '</span>';
            }
          ?>
        </li>
        <!-- はてなブックマーク -->
        <li class="hatebu sns-btn__item">
          <a href="<?php echo sng_get_hatebu_url($encoded_url, $encoded_title); ?>" target="_blank" rel="nofollow noopener noreferrer" aria-label="はてブでブックマークする">
            <i class="fa fa-hatebu" aria-hidden="true"></i>
            <span class="share_txt">はてブ</span>
          </a>
          <?php if (function_exists('scc_get_share_hatebu')) {
            echo '<span class="scc dfont">' . scc_get_share_hatebu() . '</span>';
          }
        ?>
        </li>
        <!-- LINE -->
        <li class="line sns-btn__item">
          <a href="<?php echo sng_get_line_share_url($encoded_url, $encoded_title);?>" target="_blank" rel="nofollow noopener noreferrer" aria-label="LINEでシェアする">
            <?php if(get_option('use_fontawesome4')) : ?>
              <img src="<?php echo get_template_directory_uri() . '/library/images/line.svg'; ?>">
            <?php else: ?>
              <i class="fab fa-line" aria-hidden="true"></i>
            <?php endif; ?>
            <span class="share_txt share_txt_line dfont">LINE</span>
          </a>
        </li>
        <!-- Pocket -->
        <li class="pkt sns-btn__item">
          <a href="<?php echo sng_get_pocket_url($encoded_url, $encoded_title); ?>" target="_blank" rel="nofollow noopener noreferrer" aria-label="Pocketに保存する">
            <?php fa_tag("get-pocket","get-pocket",true) ?>
            <span class="share_txt">Pocket</span>
          </a>
          <?php if (function_exists('scc_get_share_pocket')) {
            echo '<span class="scc dfont">' . scc_get_share_pocket() . '</span>';
          }
        ?>
        </li>
      </ul>
  </div>
  <?php // END シェアボタン
  }
}