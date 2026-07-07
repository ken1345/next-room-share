<?php

add_action('admin_notices', 'sng_admin_notice' );

function sng_admin_notice() {
  $url = home_url($_SERVER['REQUEST_URI']);
  if (isset($_COOKIE["sng-dismiss-new-version"])) {
    return;
  }
  ?>
  <div>
    <div class="update-nag notice notice-warning inline js-sng-gutenberg-notice" style="position: relative; padding: 25px 20px 20px 20px;">
      <button tye="button" class="notice-dismiss js-sng-gutenberg-dismiss"></button>
      <strong>SANGO 3.0</strong>がリリースされました!<br/>
      現在のSANGOのバージョンは <strong><?php echo wp_get_theme('sango-theme')->Version; ?></strong>です！<br/>
      ブロックエディターに関する機能や収益化機能、高速化機能などがパワーアップしています！<br/>
      <a href="https://saruwakakun.com/sango/sango3" target="_blank" rel="noopener noreferrer">アップデート方法はこちら</a>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
    <script>
    jQuery(function() {
      jQuery(".js-sng-gutenberg-dismiss").click(function() {
        Cookies.set('sng-dismiss-new-version', 'true')
        jQuery(".js-sng-gutenberg-notice").remove()
      })
      dismiss();
    })
    </script>
  </div>
  <?php
}
