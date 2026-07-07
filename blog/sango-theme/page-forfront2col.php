<?php
/**
* Template Name: トップページ用 サイドバー有（タイトルなど出力無し）
* Template Post Type: page
*/
get_header(); 
?>
<?php if ( is_home() || is_front_page() ) : ?>
  <?php get_template_part('parts/home/featured-header'); ?>
<?php endif; ?>
  <?php get_template_part('parts/home/top-header'); ?>
  <div id="content"<?php column_class();?>>
    <div id="inner-content" class="wrap cf">
      <main id="main" class="m-all t-2of3 d-5of7 cf">
        <?php
        sng_category_query();
        if (have_posts()) :
          while (have_posts()) :
            the_post(); ?>
            <article id="entry" <?php post_class('cf'); ?>>
              <section class="entry-content cf" style="padding-top: 30px">
                <?php
                  the_content();
                  wp_link_pages( array(
                    'before'      => '<div class="post-page-links dfont">',
                    'after'       => '</div>',
                    'link_before' => '<span>',
                    'link_after'  => '</span>',
                  ) );
                ?>
                </section>
            </article>
          <?php endwhile; ?>
        <?php else : ?>
          <?php get_template_part('content', 'not-found'); ?>
        <?php endif; ?>
      </main>
      <?php get_sidebar(); ?>
    </div>
  </div>
<?php get_footer(); ?>
