<?php
/**
* Template Name: トップページ用 1カラム（タイトルなど出力無し）
* Template Post Type: page
*/
get_header(); ?>
<?php if(is_home() || is_front_page()) : ?>
  <div class="bg-white">
    <?php get_template_part('parts/home/featured-header'); ?>
  </div>
<?php endif; ?>
<?php
  sng_category_query();
  get_template_part('parts/home/front-style');
?>
<div id="content" class="page-forfront">
  <div id="inner-content" class="wrap cf">
    <main id="main" class="m-all">
      <div class="entry-content">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <?php
            the_content();
          ?>
        <?php endwhile; ?>
        <?php else : ?>
          <?php get_template_part('content', 'not-found'); ?>
        <?php endif; ?>
      </div>
      <footer class="entry-footer">
        <?php insert_social_buttons(); ?>
      </footer>
    </main>
  </div>
</div>
<?php get_footer(); ?>
