<?php
/*********************
 * SANGOのオリジナル機能
 *********************/
$wp_customize->add_panel('sango_original_addon',
  array(
    'priority' => 53,
    'title' => '💻 SANGOオリジナル機能',
  )
);
// タブ
$wp_customize->add_section('sng_tab', array(
  'title' => '記事一覧タブ切替（トップページ）',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('activate_tab', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('activate_tab', array(
  'settings' => 'activate_tab',
  'label' => 'トップページの記事一覧でタブ切り替えを有効にする',
  'description' => '<small>指定したカテゴリーの記事一覧をタブで表示できるようになります。<strong>タブの数が偶数個（2つか4つ）になるように</strong>設定してください。タイトルを入力したタブが有効になります。</small>',
  'section' => 'sng_tab',
  'type' => 'checkbox',
));
$wp_customize->add_setting('tab1name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('tab1name', array(
  'settings' => 'tab1name',
  'label' => 'タブ1（新着記事）のタイトル',
  'description' => '<small>ここに入力したテキストがタブのラベル（名前）として表示されます。1番目のタブには新着記事一覧が表示されます。</small>',
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab2name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('tab2name', array(
  'settings' => 'tab2name',
  'label' => 'タブ2のタイトル',
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab2cat_or_tag', array(
  'default' => 'cat_chosen',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('tab2cat_or_tag', array(
  'label' => '- タブ2の記事一覧の取得方法',
  'settings' => 'tab2cat_or_tag',
  'section' => 'sng_tab',
  'description' => '<small>特定のカテゴリーに属する記事一覧を表示するか、特定のタグを持つ記事一覧を表示するか選ぶことができます。</small>',
  'type' => 'radio',
  'choices' => array(
    'cat_chosen' => 'カテゴリーIDで指定',
    'tag_chosen' => 'タグIDで指定'
  ),
));
$wp_customize->add_setting('tab2id', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('tab2id', array(
  'settings' => 'tab2id',
  'label' => '- タブ2のID',
  'input_attrs' => array('placeholder' => 'カテゴリーIDかタグIDを半角数字で入力'),
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab2link', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('tab2link', array(
  'settings' => 'tab2link',
  'label' => '- タブ2の「もっと見る」のリンク先URL',
  'description' => '<small>空欄のままにすれば非表示になります。</small>',
  'section' => 'sng_tab',
  'type' => 'url',
));
$wp_customize->add_setting('tab3name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('tab3name', array(
  'settings' => 'tab3name',
  'label' => 'タブ3のタイトル',
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab3cat_or_tag', array(
  'default' => 'cat_chosen',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('tab3cat_or_tag', array(
  'label' => '- タブ3の記事一覧の取得方法',
  'settings' => 'tab3cat_or_tag',
  'section' => 'sng_tab',
  'type' => 'radio',
  'choices' => array(
    'cat_chosen' => 'カテゴリーIDで指定',
    'tag_chosen' => 'タグIDで指定'),
  )
);
$wp_customize->add_setting('tab3id', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('tab3id', array(
  'settings' => 'tab3id',
  'label' => '- タブ3のID',
  'input_attrs' => array('placeholder' => 'カテゴリーIDかタグIDを半角数字で入力'),
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab3link', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('tab3link', array(
  'settings' => 'tab3link',
  'label' => '- タブ3の「もっと見る」のリンク先URL',
  'section' => 'sng_tab',
  'type' => 'url',
));
$wp_customize->add_setting('tab4name', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('tab4name', array(
  'settings' => 'tab4name',
  'label' => 'タブ4のタイトル',
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab4cat_or_tag', array(
  'default' => 'cat_chosen',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('tab4cat_or_tag', array(
  'label' => '- タブ4の記事一覧の取得方法',
  'settings' => 'tab4cat_or_tag',
  'section' => 'sng_tab',
  'type' => 'radio',
  'choices' => array(
    'cat_chosen' => 'カテゴリーIDで指定',
    'tag_chosen' => 'タグIDで指定'),
  )
);
$wp_customize->add_setting('tab4id', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('tab4id', array(
  'settings' => 'tab4id',
  'label' => '- タブ4のID',
  'input_attrs' => array('placeholder' => 'カテゴリーIDかタグIDを半角数字で入力'),
  'section' => 'sng_tab',
  'type' => 'text',
));
$wp_customize->add_setting('tab4link', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('tab4link', array(
  'settings' => 'tab4link',
  'label' => '- タブ4の「もっと見る」のリンク先URL',
  'section' => 'sng_tab',
  'type' => 'url',
));
$wp_customize->add_setting('tab_background_color', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'tab_background_color', array(
  'label' => 'タブの背景色',
  'section' => 'sng_tab',
  'settings' => 'tab_background_color',
)));
$wp_customize->add_setting('tab_text_color', array(
  'default' => '#a7a7a7',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'tab_text_color', array(
  'label' => 'タブの文字色',
  'section' => 'sng_tab',
  'settings' => 'tab_text_color',
)));
$wp_customize->add_setting('tab_active_color1', array(
  'default' => '#bdb9ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'tab_active_color1', array(
  'label' => 'アクティブタブの背景色',
  'description' => '<small>現在選択中のタブの背景色です。2色を異なる色で設定すると、グラデーションになります。文字色は白です。</small>',
  'section' => 'sng_tab',
  'settings' => 'tab_active_color1',
)));
$wp_customize->add_setting('tab_active_color2', array(
  'default' => '#67b8ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'tab_active_color2', array(
  'section' => 'sng_tab',
  'settings' => 'tab_active_color2',
)));
$wp_customize->add_setting('tab_cat_num', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('tab_cat_num', array(
  'settings' => 'tab_cat_num',
  'label' => 'タブ2〜4の表示記事数',
  'description' => '<small>新着記事(タブ1)の表示数は「設定」⇒「表示設定」で指定された値が反映されます。</small>',
  'section' => 'sng_tab',
  'type' => 'number',
));
$wp_customize->add_setting('tab_posts_show_random', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('tab_posts_show_random', array(
  'settings' => 'tab_posts_show_random',
  'label' => '記事をランダムに表示する',
  'description' => '<small>チェックを入れるとタブ2〜4の記事が新着順ではなくランダムに表示されます。</small>',
  'section' => 'sng_tab',
  'type' => 'checkbox',
));

// モバイルフッター固定メニュー
$wp_customize->add_section('footer_fixed', array(
  'title' => 'モバイルフッター固定メニュー',
  'panel' => 'sango_original_addon',
  'description' => '<small>［外観］⇒［メニュー］で「モバイル用フッター固定メニュー」を作成・登録するとモバイル（スマホ・タブレット）で表示されるようになります。詳しい設定方法は<a href="https://saruwakakun.com/sango/mb_footer" target="_blank">カスタマイズガイド</a>で解説しています。<br>こちらでは、細かな設定を行うことができます。</small>',
));
$wp_customize->add_setting('footer_fixed_share', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('footer_fixed_share', array(
  'settings' => 'footer_fixed_share',
  'label' => 'シェアボタン機能を使用する',
  'description' => '<small>さらにシェアボタン用のメニューを追加する必要があります。詳しい設定はカスタマイズガイドをご覧ください。</small>',
  'section' => 'footer_fixed',
  'type' => 'checkbox',
));
$wp_customize->add_setting('footer_fixed_follow', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('footer_fixed_follow', array(
  'settings' => 'footer_fixed_follow',
  'label' => 'フォローボタン機能を使用する',
  'description' => '<small>さらにフォローボタン用のメニューを追加する必要があります。</small>',
  'section' => 'footer_fixed',
  'type' => 'checkbox',
));
$wp_customize->add_setting('footer_fixed_scroll_upward', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('footer_fixed_scroll_upward', array(
  'settings' => 'footer_fixed_scroll_upward',
  'label' => '上方向にスクロールした時だけメニューを表示する',
  'description' => '<small>モバイルフッター固定メニューを上方向にスクロールした時のみ表示します。</small>',
  'section' => 'footer_fixed',
  'type' => 'checkbox',
));
$wp_customize->add_setting('footer_fixed_bc', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_fixed_bc', array(
  'label' => 'メニューの背景色',
  'section' => 'footer_fixed',
  'settings' => 'footer_fixed_bc',
  'priority' => 21,
)));
$wp_customize->add_setting('footer_fixed_c', array(
  'default' => '#a2a7ab',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_fixed_c', array(
  'label' => 'メニューの文字/アイコン色',
  'section' => 'footer_fixed',
  'settings' => 'footer_fixed_c',
  'priority' => 21,
)));
$wp_customize->add_setting('footer_fixed_actc', array(
  'default' => '#6bb6ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_fixed_actc', array(
  'label' => 'アクティブカラー',
  'section' => 'footer_fixed',
  'settings' => 'footer_fixed_actc',
  'description' => '<small>メニューがタップされたときなどの文字/アイコン色です。メインカラーと合わせるのがおすすめです。</small>',
  'priority' => 21,
)));

// ヘッダーお知らせ欄
$wp_customize->add_section('header_info', array(
  'title' => 'ヘッダーお知らせ欄',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('header_info_text', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('header_info_text', array(
  'settings' => 'header_info_text',
  'description' => '<small>入力すると表示されるようになります。FontAwesomeのアイコンも使用できます。</small>',
  'label' => 'お知らせ文',
  'section' => 'header_info',
  'type' => 'text',
));
$wp_customize->add_setting('header_info_c1', array(
  'default' => '#738bff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_info_c1', array(
  'label' => '背景色1',
  'description' => '<small>背景のグラデーションの片側の色です。</small>',
  'section' => 'header_info',
  'settings' => 'header_info_c1',
)));
$wp_customize->add_setting('header_info_c2', array(
  'default' => '#85e3ec',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_info_c2', array(
  'label' => '背景色2',
  'description' => '<small>グラデーションのもう片側の色です。グラデーションにしない場合には、両方の色を合わせてください。</small>',
  'section' => 'header_info',
  'settings' => 'header_info_c2',
)));
$wp_customize->add_setting('header_info_c', array(
  'default' => '#FFF',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'header_info_c', array(
  'label' => '文字色',
  'section' => 'header_info',
  'settings' => 'header_info_c',
)));
$wp_customize->add_setting('header_info_url', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('header_info_url', array(
  'settings' => 'header_info_url',
  'label' => 'リンク先URL',
  'section' => 'header_info',
  'type' => 'url',
));
$wp_customize->add_setting('enable_header_info_animation', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_header_info_animation', array(
  'settings' => 'enable_header_info_animation',
  'label' => '読み込み時のアニメーションを有効にする',
  'section' => 'header_info',
  'type' => 'checkbox',
));


// フォローボックス（記事下）
$wp_customize->add_section('show_like_box', array(
  'title' => 'フォローボックス（記事下）',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('enable_like_box', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_like_box', array(
  'settings' => 'enable_like_box',
  'label' => 'フォローボックスを表示する',
  'description' => '<small>「この記事を気に入ったらいいね」というようなボックスです。</small>',
  'section' => 'show_like_box',
  'type' => 'checkbox',
));
$wp_customize->add_setting('like_box_title', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('like_box_title', array(
  'settings' => 'like_box_title',
  'label' => '画像上にのせるテキスト',
  'description' => '<small>「Follow Me!」など。空欄でも構いません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_twitter', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_twitter', array(
  'settings' => 'like_box_twitter',
  'label' => 'Twitterのユーザー名',
  'description' => '<small>@に続くユーザー名を入力してください（@は含めない）。名前が空欄の場合には表示されません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('follower_count', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('follower_count', array(
  'settings' => 'follower_count',
  'label' => 'Twitterのフォロワー数を表示',
  'section' => 'show_like_box',
  'type' => 'checkbox',
));
$wp_customize->add_setting('like_box_fb', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_fb', array(
  'settings' => 'like_box_fb',
  'label' => 'FacebookページのURL',
  'description' => '<small>Facebookの仕様上、個人アカウントページには対応していません。空欄の場合には表示されません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_feedly', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_feedly', array(
  'settings' => 'like_box_feedly',
  'label' => 'FeedlyのURL',
  'description' => '<small>空欄の場合には表示されません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_insta', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_insta', array(
  'settings' => 'like_box_insta',
  'label' => 'InstagramのURL',
  'description' => '<small>InstagramのプロフィールページのURLを入力します。空欄の場合には表示されません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_youtube', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_youtube', array(
  'settings' => 'like_box_youtube',
  'label' => 'YouTubeのURL',
  'description' => '<small>YouTubeのチャンネルなどのURLを入力します。空欄の場合には表示されません。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_line_friend_id', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('like_box_line_friend_id', array(
  'settings' => 'like_box_line_friend_id',
  'label' => 'LINE ID',
  'description' => '<small>LINE公式アカウントやLINE@アカウントのLINE IDを入力してください。</small>',
  'section' => 'show_like_box',
  'type' => 'text',
));
$wp_customize->add_setting('like_box_line_show_follower_count', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('like_box_line_show_follower_count', array(
  'settings' => 'like_box_line_show_follower_count',
  'label' => 'LINEボタン横にフォロワー数を表示する',
  'section' => 'show_like_box',
  'type' => 'checkbox',
));

// 関連記事（記事下）
$wp_customize->add_section('sng_related_posts', array(
  'title' => '関連記事（記事下）',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('no_related_posts', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_related_posts', array(
  'settings' => 'no_related_posts',
  'label' => '記事下に関連記事を表示しない',
  'section' => 'sng_related_posts',
  'type' => 'checkbox',
));
$wp_customize->add_setting('related_post_title', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'default' => '関連記事',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('related_post_title', array(
  'settings' => 'related_post_title',
  'label' => '関連記事のタイトル',
  'section' => 'sng_related_posts',
  'type' => 'text',
));
$wp_customize->add_setting('related_posts_type', array(
  'default' => 'type_a',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('related_posts_type', array(
  'label' => '関連記事のデザイン',
  'settings' => 'related_posts_type',
  'section' => 'sng_related_posts',
  'description' => '<small>それぞれの表示イメージは<a href="https://saruwakakun.com/sango/customizer#relatedfunc" target="_blank">こちら</a>から確認できます。</small>',
  'type' => 'radio',
  'choices' => array(
    'type_a' => 'タイプA',
    'type_b' => 'タイプB（カード）',
    'type_c' => 'タイプC（横長）'),
  )
);
$wp_customize->add_setting('related_no_slider', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('related_no_slider', array(
  'settings' => 'related_no_slider',
  'label' => 'モバイル表示で関連記事をスライダー表示にしない',
  'description' => '<small>スマホ/タブレット表示で関連記事を横スクロール表示にしない場合には、こちらにチェックを入れます。タイプCではチェックの有無に関わらず、スクロールなしになります。</small>',
  'section' => 'sng_related_posts',
  'type' => 'checkbox',
));
$wp_customize->add_setting('related_add_parent', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('related_add_parent', array(
  'settings' => 'related_add_parent',
  'label' => '親カテゴリーに属する記事も含める',
  'description' => '<small>デフォルトでは同カテゴリーの記事のみが出力されます。こちらにチェックを入れると「親カテゴリー」と「親カテゴリーに含まれる子カテゴリー」の記事も合わせてランダムで出力するようになります。</small>',
  'section' => 'sng_related_posts',
  'type' => 'checkbox',
));
$wp_customize->add_setting('num_related_posts', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('num_related_posts', array(
  'settings' => 'num_related_posts',
  'label' => '関連記事の表示数',
  'section' => 'sng_related_posts',
  'type' => 'number',
));
$wp_customize->add_setting('related_posts_order', array(
  'default' => 'rand',
  'sanitize_callback' => 'sng_slug_sanitize_radio',
));
$wp_customize->add_control('related_posts_order', array(
  'label' => '関連記事の取得順',
  'settings' => 'related_posts_order',
  'section' => 'sng_related_posts',
  'type' => 'radio',
  'choices' => array(
    'rand' => 'ランダム',
    'date' => '新着順'
  )
));
$wp_customize->add_setting('related_posts_days_ago', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'default' => 0,
  'sanitize_callback' => 'absint',
));
$wp_customize->add_control('related_posts_days_ago', array(
  'settings' => 'related_posts_days_ago',
  'label' => '○日前より後に公開された記事のみ表示',
  'description' => '<small>例えば「30」にすると、30日前以降に公開された記事のみ関連記事に含まれるようになります。「0」にすると、全期間の記事が取得されます。</small>',
  'section' => 'sng_related_posts',
  'type' => 'number',
));

// おすすめ記事（記事下）
$wp_customize->add_section('recommended_posts', array(
  'title' => 'おすすめ記事（記事下）',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('enable_recommend', array(
  'type' => 'option',
  'priority' => 1,
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_recommend', array(
  'settings' => 'enable_recommend',
  'label' => 'おすすめ記事を記事下に表示',
  'description' => '<small>記事下に指定した投稿IDの記事を表示します。アイキャッチ画像が登録されている記事のみ指定することができます。</small>',
  'section' => 'recommended_posts',
  'type' => 'checkbox',
));
$wp_customize->add_setting('recommend_title', array(
  'type' => 'option',
  'priority' => 2,
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('recommend_title', array(
  'settings' => 'recommend_title',
  'label' => '見出し',
  'description' => '<small>例：おすすめの記事</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('recid1', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('recid1', array(
  'settings' => 'recid1',
  'label' => 'おすすめ記事(1)のID',
  'description' => '<small>例:145</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('rectitle1', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('rectitle1', array(
  'settings' => 'rectitle1',
  'label' => 'ーおすすめ記事(1)のタイトル',
  'description' => '<small>※空欄の場合、もともとのタイトルを表示します。</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('recid2', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('recid2', array(
  'settings' => 'recid2',
  'label' => 'おすすめ記事(2)のID',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('rectitle2', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('rectitle2', array(
  'settings' => 'rectitle2',
  'label' => 'ーおすすめ記事(2)のタイトル',
  'description' => '<small>※空欄の場合、もともとのタイトルを表示します。</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('recid3', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('recid3', array(
  'settings' => 'recid3',
  'label' => 'おすすめ記事(3)のID',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('rectitle3', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('rectitle3', array(
  'settings' => 'rectitle3',
  'label' => 'ーおすすめ記事(3)のタイトル',
  'description' => '<small>※空欄の場合、もともとのタイトルを表示します。</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('recid4', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('recid4', array(
  'settings' => 'recid4',
  'label' => 'ーおすすめ記事(4)のID',
  'section' => 'recommended_posts',
  'type' => 'text',
));
$wp_customize->add_setting('rectitle4', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('rectitle4', array(
  'settings' => 'rectitle4',
  'label' => 'おすすめ記事(4)のタイトル',
  'description' => '<small>※空欄の場合、もともとのタイトルを表示します。</small>',
  'section' => 'recommended_posts',
  'type' => 'text',
));

// CTA（記事下）
$wp_customize->add_section('show_cta', array(
  'title' => 'CTA（記事下）',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('enable_cta', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('enable_cta', array(
  'settings' => 'enable_cta',
  'label' => 'CTAを記事下に表示する',
  'section' => 'show_cta',
  'type' => 'checkbox',
));
$wp_customize->add_setting('no_cta_cat', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('no_cta_cat', array(
  'settings' => 'no_cta_cat',
  'label' => 'CTAを表示しないカテゴリーのID（複数指定は半角カンマ,で区切る）',
  'input_attrs' => array('placeholder' => '半角数字を入力'),
  'section' => 'show_cta',
  'type' => 'text',
));
$wp_customize->add_setting('cta_image_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_file',
));
if (class_exists('WP_Customize_Image_Control')):
$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'cta_image_upload', array(
  'settings' => 'cta_image_upload',
  'label' => 'CTA用の画像をアップロード',
  'section' => 'show_cta',
)));
endif;
$wp_customize->add_setting('cta_image_media_upload', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
if (class_exists('WP_Customize_Media_Control')):
$wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'cta_image_media_upload', array(
  'settings' => 'cta_image_media_upload',
  'label' => 'CTA用の画像をアップロード（メディア）',
  'description' => 'メディアを利用してCTA用の画像を表示します。上記の設定でもCTA用の画像を設定できますが、メディアでは画像のサイズを表示できるためCLS対策としてこちらにCTA用の画像を設定することをお勧めします。',
  'section' => 'show_cta',
)));
endif;
$wp_customize->add_setting('cta_background_color', array(
  'default' => '#c8e4ff',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'cta_background_color', array(
  'label' => 'CTA全体の背景色',
  'section' => 'show_cta',
  'settings' => 'cta_background_color',
  'priority' => 20,
)));
$wp_customize->add_setting('cta_bigtxt_color', array(
  'default' => '#333',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'cta_bigtxt_color', array(
  'label' => '見出し色',
  'section' => 'show_cta',
  'settings' => 'cta_bigtxt_color',
  'priority' => 20,
)));
$wp_customize->add_setting('cta_smltxt_color', array(
  'default' => '#333',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'cta_smltxt_color', array(
  'label' => '説明文の色',
  'section' => 'show_cta',
  'settings' => 'cta_smltxt_color',
  'priority' => 20,
)));
$wp_customize->add_setting('cta_btn_color', array(
  'default' => '#ffb36b',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'cta_btn_color', array(
  'label' => 'ボタン色',
  'section' => 'show_cta',
  'settings' => 'cta_btn_color',
  'priority' => 21,
)));
$wp_customize->add_setting('cta_big_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('cta_big_txt', array(
  'settings' => 'cta_big_txt',
  'label' => '見出し文',
  'section' => 'show_cta',
  'type' => 'text',
));
$wp_customize->add_setting('cta_sml_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'wp_kses_post',
));
$wp_customize->add_control('cta_sml_txt', array(
  'settings' => 'cta_sml_txt',
  'label' => '説明文',
  'section' => 'show_cta',
  'type' => 'textarea',
));
$wp_customize->add_setting('cta_btn_txt', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_skip_sanitize',
));
$wp_customize->add_control('cta_btn_txt', array(
  'settings' => 'cta_btn_txt',
  'label' => 'ボタンテキスト',
  'section' => 'show_cta',
  'type' => 'text',
));
$wp_customize->add_setting('cta_btn_url', array(
  'type' => 'option',
  'sanitize_callback' => 'esc_url_raw',
));
$wp_customize->add_control('cta_btn_url', array(
  'settings' => 'cta_btn_url',
  'label' => 'ボタンURL',
  'section' => 'show_cta',
  'type' => 'url',
));

// トップへ戻るボタン
$wp_customize->add_section('to_top', array(
  'title' => 'トップへ戻るボタン',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('show_to_top', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('show_to_top', array(
  'settings' => 'show_to_top',
  'label' => '【モバイル表示】トップへ戻るボタンを表示する',
  'description' => '<small>記事ページ/固定ページにのみ表示されます。</small>',
  'section' => 'to_top',
  'type' => 'checkbox',
));
$wp_customize->add_setting('pc_show_to_top', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('pc_show_to_top', array(
  'settings' => 'pc_show_to_top',
  'label' => '【PC表示】トップへ戻るボタンを表示する',
  'description' => '<small>記事/固定ページにのみ表示されます。</small>',
  'section' => 'to_top',
  'type' => 'checkbox',
));
$wp_customize->add_setting('to_top_color', array(
  'default' => '#5ba9f7',
  'sanitize_callback' => 'sanitize_hex_color',
));
$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'to_top_color', array(
  'label' => 'ボタン色',
  'description' => '<small>ボタンは半透明になるため、濃い目の色を選びましょう。</small>',
  'section' => 'to_top',
  'settings' => 'to_top_color',
  'priority' => 21,
)));

// シェアボタン設定
$wp_customize->add_section('sng_share_setting', array(
  'title' => 'シェアボタンの設定',
  'panel' => 'sango_original_addon',
));
$wp_customize->add_setting('another_social', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('another_social', array(
  'settings' => 'another_social',
  'label' => 'シェアボタン一覧を別デザインにする',
  'section' => 'sng_share_setting',
  'type' => 'checkbox',
));
$wp_customize->add_setting('no_fab', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('no_fab', array(
  'settings' => 'no_fab',
  'label' => 'タイトル下の「SHARE」をオフにする',
  'section' => 'sng_share_setting',
  'type' => 'checkbox',
));
$wp_customize->add_setting('open_fab', array(
  'type' => 'option',
  'sanitize_callback' => 'sng_slug_sanitize_checkbox',
));
$wp_customize->add_control('open_fab', array(
  'settings' => 'open_fab',
  'label' => 'タイトル下にシェアボタンを並べて表示',
  'description' => '<small>タイトル下にシェアボタンを並べて表示したいときにチェックを入れてください</small>',
  'section' => 'sng_share_setting',
  'type' => 'checkbox',
));
$wp_customize->add_setting('include_tweet_via', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('include_tweet_via', array(
  'settings' => 'include_tweet_via',
  'label' => 'シェアボタンからのXに表示するアカウント名',
  'description' => '<small>@を含めずに入力。表示しない場合は空欄のままにしてください。</small>',
  'section' => 'sng_share_setting',
  'type' => 'text',
));
$wp_customize->add_setting('fb_app_id', array(
  'type' => 'option',
  'transport' => 'postMessage',
  'sanitize_callback' => 'wp_filter_nohtml_kses',
));
$wp_customize->add_control('fb_app_id', array(
  'settings' => 'fb_app_id',
  'label' => 'Facebookのapp id',
  'description' => '<small>「fb:app_id」を設定したい方は入力してください。</small>',
  'input_attrs' => array('placeholder' => '半角数字のみ'),
  'section' => 'sng_share_setting',
  'type' => 'text',
));