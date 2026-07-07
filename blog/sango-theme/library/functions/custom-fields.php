<?php
/**
 * 🖍ログインユーザーのみ
 * このファイルでは投稿ページやカテゴリー設定ページで用いられる
 * カスタムフィールド系の関数をまとめています。
 */

/*****************************
 * 投稿/固定ページのカスタムフィールド
 ******************************/
add_action('admin_menu', 'add_sngmeta_field');
add_action('save_post', 'save_sngmeta_field');

function add_sngmeta_field() {
  $sango_logo = '<svg class="sng-edit-logo" width="227" height="344" viewBox="0 0 227 344" fill="none" xmlns="http://www.w3.org/2000/svg" size="24"><path d="M147.145 158.393c-92.383 21.826-111.79 12.003-111.79 12.003s-22.124 19.741-10.4 38.598c11.726 18.857 32.882 16.265 37.705 16.637 4.825.37 56.397-12.852 56.397-12.852s35.709-26.308 61.246-37.288c25.537-10.979 14.093-22.939 14.093-22.939a56.542 56.542 0 00-8.455-.609c-10.634-.002-22.559 2.614-38.796 6.45z" fill="currentColor"></path><path d="M41.137 116.899C15.945 137.731-4.219 156.162.76 186.869c8.452 52.109 62.882 38.726 62.882 38.726-38.82.81-14.354-40.006 80.098-110.104C231.817 50.123 187.41 0 187.41 0 128.406 54.597 41.137 116.899 41.137 116.899zM107.086 225.304c-31.334 35.079-18.86 70.981-18.86 70.981l.088.048c9.797 32.834 43.522 47.157 43.522 47.157-54.126-77.964 97.956-120.143 94.703-164.278-1.872-23.947-34.458-26.967-34.458-26.967 19.599 10.73-40.828 23.612-84.995 73.059z" fill="currentColor"></path><path d="M107.086 225.304c-31.334 35.079-18.86 70.981-18.86 70.981l.088.048c9.797 32.834 43.522 47.157 43.522 47.157-100.023-58.503 51.335-144.158 70.899-158.588 18.062-13.321 8.794-24.473 7.868-25.508-9.276-6.085-18.522-7.149-18.522-7.149 19.599 10.73-40.828 23.612-84.995 73.059z" fill="currentColor"></path></svg>';
  // 作成
  // 投稿ページ
  add_meta_box('sng-meta-description', 'メタデスクリプション', 'sng_field_meta_description', 'post', 'normal');
  add_meta_box('sng-meta-description', 'メタデスクリプション', 'sng_field_meta_description', 'page', 'normal');
  add_meta_box('sng-title-tag', '【高度な設定】titleタグ', 'sng_field_title_tag', 'post', 'normal');
  add_meta_box('sng-title-tag', '【高度な設定】titleタグ', 'sng_field_title_tag', 'page', 'normal');
  add_meta_box('sng-canonical-url', 'Canonical URL', 'sng_field_canonical_url', 'post', 'normal');
  add_meta_box('sng-canonical-url', 'Canonical URL', 'sng_field_canonical_url', 'page', 'normal');
  add_meta_box('sng-side-setting', "${sango_logo} SANGO設定", 'sng_field_side', 'post', 'side');
  add_meta_box('sng-side-setting', "${sango_logo} SANGO設定", 'sng_field_side', 'page', 'side');
}

function sng_field_meta_description() {
  global $post;
  echo '<p class="howto">Google検索結果などに表示される記事の要約です（入力は必須ではありません）。100字以内に抑えるのが良いかと思います。</p><textarea name="sng_meta_description" cols="65" rows="4" onkeyup="document.getElementById(\'description_count\').value=this.value.length + \'字\'" style="max-width: 100%">' . get_post_meta($post->ID, 'sng_meta_description', true) . '</textarea><p><strong><input type="text" id="description_count" style="float: none;width: 40px;display: inline;border: none;box-shadow: none;"></strong></p>';
}

function sng_field_title_tag() {
  global $post;
  $result = '<p class="howto">記事タイトルとは別のtitleタグを出力したい場合に入力します。空欄にすると記事タイトルがtitleタグに出力されます。</p>';
  $result .= '<textarea name="sng_title" cols="65" rows="1" style="max-width: 100%">'. get_post_meta($post->ID, 'sng_title', true) . '</textarea>';
  echo $result;
}

function sng_field_canonical_url() {
  global $post;
  $result = '<p class="howto">カノニカルURLを指定します。基本的には空で構いません。</p>';
  $result .= '<textarea name="sng_canonical_url" cols="65" rows="1" style="max-width: 100%" placeholder="https://example.com/duplicate-page">'. get_post_meta($post->ID, 'sng_canonical_url', true) . '</textarea>';
  echo $result;
}

function sng_field_side() {
  sng_field_meta_robots();
  disable_ads();
  sng_field_disable_share();
  sng_field_one_column();
  sng_field_content_width();
  sng_field_js();
  sng_field_css();
  $css = <<< EOM
  .interface-complementary-area .sng-field-title,
  .sng-field-title {
    border-bottom: 2px solid #58a9ef;
    font-size: 13px;
    margin-top: 30px !important;
    font-weight: bold;
  }
  .sng-edit-logo {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  #sng-side-setting .hndle {
    justify-content: flex-start;
  }
  #sng-side-setting .hndle svg {
    margin-right: 5px;
    width: 16px;
    height: 16px;
  }
EOM;
  echo '<style>' . $css . '</style>';
}

function sng_field_meta_robots() {
  global $post;
  $exist_options = get_post_meta($post->ID, 'noindex_options', true);
  $noindex_options = $exist_options ? $exist_options : array();
  $data = array("noindex", "nofollow");
  echo '<p class="sng-field-title" style="margin-top: 20px;"><img draggable="false" role="img" class="emoji" alt="🛠" src="https://s.w.org/images/core/emoji/13.1.0/svg/1f6e0.svg"> SEO設定</p>';
  foreach ($data as $d) {
    $check = (in_array($d, $noindex_options)) ? "checked" : "";
    echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="noindex_options[]" value="' . $d . '" ' . $check . '>' . $d . '</label></div>';
  }
}

function sng_field_one_column() {
  global $post;
  if ($post->post_type !== "post") {
    return;
  }
  $meta_value = get_post_meta($post->ID, 'one_column_options', true);
  $data = "1カラムで表示";
  $check = ($meta_value) ? "checked" : "";
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="one_column_options" value="' . $data . '" ' . $check . '>' . $data . '</label></div>';
}

function disable_ads() {
  global $post;
  $meta_value = get_post_meta($post->ID, 'disable_ads', true);
  $data = "広告を非表示にする";
  $check = ($meta_value) ? "checked" : "";
  echo '<p class="sng-field-title"><img draggable="false" role="img" class="emoji" alt="🗞️" src="https://s.w.org/images/core/emoji/13.1.0/svg/1f5de.svg"> 広告設定</p>';
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="disable_ads" value="' . $data . '" ' . $check . '>' . $data . '</label></div>';
}

function sng_field_disable_share() {
  global $post;
  $meta_value = get_post_meta($post->ID, 'sng_disable_share', true);
  $data = "シェアボタンを非表示にする";
  $check = ($meta_value) ? "checked" : "";
  echo '<p class="sng-field-title"><img draggable="false" role="img" class="emoji" alt="🎨" src="https://s.w.org/images/core/emoji/13.1.0/svg/1f3a8.svg"> 装飾設定</p>';
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="sng_disable_share" value="' . $data . '" ' . $check . '>' . $data . '</label></div>';
}

function sng_field_content_width() {
  global $post;
  if ($post->post_type !== "page") {
    return;
  }
  $meta_value = get_post_meta($post->ID, 'sng_content_width', true);
  echo '<div style="margin-top: 10px;"><span style="font-weight: bold;">トップページ用 1カラム</span>のテンプレートにのみ有効な設定</div>';
  echo '<div style="margin-top: 10px;"><label>コンテンツ最大幅</label><input type="text" name="sng_content_width" value="' . $meta_value . '">px</div>';

  $meta_value = get_post_meta($post->ID, 'sng_content_padding_zero', true);
  $data = "コンテンツ上下の余白をなくす";
  $check = ($meta_value) ? "checked" : "";
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="sng_content_padding_zero" value="' . $data . '" ' . $check . '>コンテンツ上下の余白をなくす</label></div>';
}

function sng_field_js() {
  global $post;
  $meta_value = get_post_meta($post->ID, 'sng_enable_post_smartphoto_js', true);
  $check = ($meta_value) ? "checked" : "";
  echo '<p class="sng-field-title">JavaScript設定</p>';
  echo '<div>カスタマイザーで設定がONの場合はそれぞれチェック不要</div>';
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="sng_enable_post_smartphoto_js" value="true" ' . $check . '>写真を拡大するJavaScriptを利用</label></div>';

  $meta_value = get_post_meta($post->ID, 'sng_enable_post_scrollhint_js', true);
  $check = ($meta_value) ? "checked" : "";
  echo '<div style="margin-top: 10px;"><label><input type="checkbox" name="sng_enable_post_scrollhint_js" value="true" ' . $check . '>テーブルのスクロールを促すJavaScriptを利用</label></div>';

  $meta_value = get_post_meta($post->ID, 'sng_post_js', true);
  echo '<div style="margin-top: 10px;"><div>JavaScript（この記事にのみ反映されます）</div><textarea name="sng_post_js" rows="10" style="width: 100%;">'.$meta_value.'</textarea></div>';
}

function sng_field_css() {
  global $post;
  $meta_value = get_post_meta($post->ID, 'sng_post_css', true);
  echo '<p class="sng-field-title">CSS設定</p>';
  echo '<div style="margin-top: 10px;"><div>CSS（この記事にのみ反映されます）</div><textarea name="sng_post_css" rows="10" style="width: 100%;">'.$meta_value.'</textarea></div>';
}

function sng_update_custom_text_fields($post_id, $field_name) {
  if (!is_user_logged_in()) {
    return;
  }
  (isset($_POST[$field_name])) ? update_post_meta($post_id, $field_name, $_POST[$field_name]) : "";
}

function sng_update_custom_option_fields($post_id, $field_name) {
  if (!is_user_logged_in()) {
    return;
  }
  if (isset($_POST[$field_name])) {
    $value = $_POST[$field_name];
  } else {
    $value = '';
  }
  update_post_meta($post_id, $field_name, $value);
}

// 値を保存
function save_sngmeta_field($post_id)
{
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return $post_id;
  }

  // クイックポストの時は何もしない 
  if (isset($_POST['action']) && $_POST['action'] == 'inline-save') { 
    return $post_id;
  }

  // Ajaxなどの時は何もしない
  if (defined('DOING_AJAX') && DOING_AJAX) {
    return $post_id;
  }

  // $_POSTデータが何もない場合は何もしない
  if (count($_POST) == 0) {
    return $post_id;
  }

  sng_update_custom_text_fields($post_id, 'sng_meta_description');
  sng_update_custom_text_fields($post_id, 'sng_title');
  sng_update_custom_text_fields($post_id, 'sng_canonical_url');
  sng_update_custom_text_fields($post_id, 'sng_post_js');
  sng_update_custom_text_fields($post_id, 'sng_post_css');
  sng_update_custom_text_fields($post_id, 'sng_content_width');

  sng_update_custom_option_fields($post_id, 'noindex_options');
  sng_update_custom_option_fields($post_id, 'one_column_options');
  sng_update_custom_option_fields($post_id, 'disable_ads');
  sng_update_custom_option_fields($post_id, 'sng_disable_share');
  sng_update_custom_option_fields($post_id, 'sng_content_padding_zero');
  sng_update_custom_option_fields($post_id, 'sng_enable_post_smartphoto_js');
  sng_update_custom_option_fields($post_id, 'sng_enable_post_scrollhint_js');
}
