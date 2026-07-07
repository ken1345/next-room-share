<?php
$content_width = get_post_meta($post->ID, 'sng_content_width', true);
$padding_zero = get_post_meta($post->ID, 'sng_content_padding_zero', true);
?>
<style>
<?php if ($content_width) { ?>
:root {
  --wrap-default-width: <?php echo $content_width; ?>px;
}
.entry-content {
  max-width: <?php echo $content_width; ?>px;
  margin-right: auto;
  margin-left: auto;
}
@media screen and (max-width: <?php echo $content_width; ?>px) {
  .sgb-full-bg__content {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: 0;
    margin-left: 0;
  }
}
<?php } ?>
<?php if ($padding_zero) { ?>
#content.page-forfront {
  padding-top: 0;
  padding-bottom: 0;
}
body .entry-footer {
  margin-top: 0;
}
body .entry-content > *:first-child {
  margin-top: 0;
}
<?php } ?>
#container { background: #FFF; }
#main { width: 100%; }
.maximg { margin-bottom: 0; }
.entry-footer { margin-top: 2rem; }
.page-forfront .alignfull {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  max-width: 100vw !important;
}
@media only screen and (min-width: 1030px) and (max-width: 1239px) {
  .maximg { max-width: calc(92% - 58px); }
}
</style>