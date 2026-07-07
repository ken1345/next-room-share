<?php
/**
 * entry-footer.phpを遅延して読み込むことで、投稿ページの表示の高速化を行います
 */

// 非同期読み込みのための通信を発火
if (!function_exists('insert_async_entry_footer_js')) {
  function insert_async_entry_footer_js()
  {
    if(!is_single() || !get_option('use_async_entry_footer')) return;

    global $post;
    $post_id = $post->ID;
    $ajaxurl = admin_url('admin-ajax.php');
    
    $script = <<< EOM
    jQuery(function(){
      function fetchEntryFooter(){
        jQuery.ajax({
          url: '$ajaxurl',
          dataType: 'html',
          data: {
            'action' : 'fetch_entry_footer_content',
            'id' : $post->ID
          },
          success:function(data) {
            jQuery('#entry-footer-wrapper').html(data);
          }
        });
      }
      setTimeout(function(){
        fetchEntryFooter();
      }, 1500);
    });
EOM;
    echo '<script>'. sng_minify_js($script) .'</script>';
  }
}
add_action('wp_footer', 'insert_async_entry_footer_js', 999);


// 遅延表示するコンテンツ
if (!function_exists('fetch_entry_footer_content')) {
  function fetch_entry_footer_content() {
    if(!isset($_REQUEST['id'])) return;

    $query = new WP_Query(array(
      'p' => (int)$_REQUEST['id'],
      'post_type' => 'post'
    ));
    if ($query -> have_posts()) {
      $query->the_post();   
      echo get_template_part('parts/single/entry-footer');
    }
    wp_reset_postdata();
    wp_die();
  }
}
add_action( 'wp_ajax_fetch_entry_footer_content', 'fetch_entry_footer_content' );
add_action( 'wp_ajax_nopriv_fetch_entry_footer_content', 'fetch_entry_footer_content' );