<?php

function sng_theme_rest_api_init() {
  register_rest_route('sng/v1', '/page-count', array(
    'methods' => 'POST',
    'callback' => function($req) {
      $params = $req->get_params();
      $id = $params['id'];
      if (get_option('no_count_post_view')) {
        return array(
          'count' => -1,
        );
      }
      $count_key = 'post_views_count';
      $num = get_post_meta($id, $count_key, true);
      if ($num == '') {
        $num = 0;
        delete_post_meta($id, $count_key);
        add_post_meta($id, $count_key, '0');
      } else {
        $num++;
        update_post_meta($id, $count_key, $num);
      }
      return array (
        'count' => $num
      );
    },
    'permission_callback' => '__return_true'
  ));
}

add_action('rest_api_init', 'sng_theme_rest_api_init');

