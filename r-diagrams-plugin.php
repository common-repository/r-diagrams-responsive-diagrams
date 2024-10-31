<?php
if (! defined ('ABSPATH')) exit;
$r_diagrams_version = '1.05';
$rdgm_options = get_option ('rdgm_options');
include "rdgm_admin.php";
ini_set ('pcre.backtrack_limit', '-1');
include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
$rdgm_textentry_suggestions_ver = 3.1;
$rdgm_no_minify_f = false;
$server_name = $_SERVER['SERVER_NAME'];
$server_name = str_replace ('www.', '', $server_name);
if (strpos ($server_name, '.r_diagrams.com') !== false) {
   $server_name = str_replace ('.r_diagrams', '', $server_name);
}
$query_string = $_SERVER['QUERY_STRING'];
$rdgm_minified_f = strpos ($query_string, 'rdgmmin=0') === false;
if ($rdgm_server_loc == 'http://192.168.1.120/admin' ) {
   $rdgm_minified_f = strpos ($query_string, 'rdgmmin=1') !== false;
}
if ($rdgm_debug[0]) {
   error_log ('[r-diagrams-plugin.php] $rdgm_secure_server_loc: ' . $rdgm_secure_server_loc);
   error_log ('[r-diagrams-plugin.php] $server_name: ' . $server_name);
   error_log ('[r-diagrams-plugin.php] $query_string: ' . $query_string);
}
if ($server_name == 'learn-biology.com') {
   $rdgm_server_loc = 'https://' . $server_name . '/admin';
   $rdgm_secure_server_loc = $rdgm_server_loc;
}
add_editor_style (rdgm_plugin_url ('rdgm_edit_area.css'));
add_editor_style (rdgm_plugin_url ('jquery-ui.min.lightness.css'));
function set_rdgm_params () {
   global $rdgm_debug, $rdgm_options, $rdgm_T, $r_diagrams_version, $rdgm_server_loc,
      $rdgm_secure_server_loc, $server_name, $localhost_qjax_bypass,
      $q_f, $s_f;
   $plugin_url        = rdgm_plugin_url ( '/');
   $mobile_enabled    = '';
   $icon_rdgm         = '';
   $content           = '';
   $use_dict          = '';
   $use_terms         = '';
   $hint_timeout_sec  = '';
   $hangman_hints     = '';
   $translate_strings = '';
   $rdgm_syntax_check_manual_only = '';
   $regular_page_error_check = '';
   if ($rdgm_options !== false) {
      $mobile_enabled    = $rdgm_options['go_mobile'];
      if (isset ($rdgm_options['icon_rdgm'])) {
         $icon_rdgm      = $rdgm_options['icon_rdgm'];
      }
      $content           = $rdgm_options['content'];
      $use_dict          = $rdgm_options['use_dict'];
      $use_terms         = $rdgm_options['use_terms'];
      $hint_timeout_sec  = $rdgm_options['hint_timeout_sec'];
      $hangman_hints     = $rdgm_options['hangman_hints'];
      $translate_strings = $rdgm_options['translate_strings'];
      if (isset ($rdgm_options['rdgm_syntax_check_manual_only'])) {
         $rdgm_syntax_check_manual_only = $rdgm_options['rdgm_syntax_check_manual_only'];
      }
      if (isset ($rdgm_options['regular_page_error_check'])) {
         $regular_page_error_check = $rdgm_options['regular_page_error_check'];
      }
   }
   if (! $content) {
      $content = 'article';
   }
   $rdgm_T = array ();
   if ($translate_strings) {
      $translate_strings = explode ("\n", $translate_strings);
      $n_translate_strings = count ($translate_strings);
      for ($i=0; $i<$n_translate_strings; $i++) {
         $strings = explode (';', $translate_strings[$i]);
         $old_string = $strings[0];
         $new_string = trim ($strings[1]);
         $rdgm_T[$old_string] = $new_string;
      }
   }
   $qjax_bypass = $server_name == 'learn-biology.com' || $server_name == 'r_diagrams.net' || $server_name == 'r_diagrams.com' || $localhost_qjax_bypass;
   $rdgm_params = array (
      'server_loc'                    => $rdgm_server_loc,
      'secure_server_loc'             => $rdgm_secure_server_loc,
      'url'                           => $plugin_url,
      'mobile_enabled'                => $mobile_enabled,
      'icon_rdgm'                     => $icon_rdgm,
      'content'                       => $content,
      'use_dict'                      => $use_dict,
      'use_terms'                     => $use_terms,
      'hint_timeout_sec'              => $hint_timeout_sec,
      'hangman_hints'                 => $hangman_hints,
      'swinging_hotspot_active_f'     => $s_f,
      'ajaxurl'                       => admin_url ('admin-ajax.php'),
      'includes_url'                  => includes_url (),
      'r_diagrams_version'             => $r_diagrams_version,
      'wp_server_address'             => $_SERVER['SERVER_ADDR'],
      'wp_site_url'                   => get_site_url (),
      'qjax_bypass'                   => $qjax_bypass,
      'rdgm_syntax_check_manual_only' => $rdgm_syntax_check_manual_only,
      'regular_page_error_check'      => $regular_page_error_check,
      'wppf'                          => 1
   );
   if ($rdgm_debug[0]) {
      error_log ('[set_rdgm_params] rdgm_params (): ' . print_r ($rdgm_params, true));
      error_log ('[set_rdgm_params] get_site_url (): ' . get_site_url ());
   }
   return $rdgm_params;
}
function add_rdgm_js_and_style ($hook) {
   global $rdgm_debug, $r_diagrams_version, $rdgm_options, $rdgm_params, $rdgm_T,
          $rdgm_minified_f, $rdgm_no_minify_f;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > add_rdgm_js_and_style] $hook: ' . $hook);
      error_log ("[r-diagrams-plugin.php > add_rdgm_js_and_style] rdgm_minified_f: $rdgm_minified_f, rdgm_no_minify_f: $rdgm_no_minify_f");
   }
   update_option ('image_default_link_type', '');
   wp_enqueue_script ('jquery-ui-core');
   wp_enqueue_script ('jquery-ui-accordion');
   wp_enqueue_script ('jquery-ui-autocomplete');
   wp_enqueue_script ('jquery-ui-button');
   wp_enqueue_script ('jquery-ui-dialog');
   wp_enqueue_script ('jquery-ui-draggable');
   wp_enqueue_script ('jquery-ui-droppable');
   wp_enqueue_script ('jquery-effects-fade');
   wp_enqueue_script ('jquery-ui-menu');
   wp_enqueue_script ('jquery-ui-position');
   wp_enqueue_script ('jquery-ui-progressbar');
   wp_enqueue_script ('jquery-ui-resizable');
   wp_enqueue_script ('jquery-ui-spinner');
   wp_enqueue_script ('jquery-ui-tabs');
   wp_enqueue_script ('jquery-ui-tooltip');
   wp_enqueue_script ('jquery-ui-widget');
   wp_enqueue_style ('wp-mediaelement');
   wp_enqueue_script ('wp-playlist');
   if ($rdgm_minified_f && ! $rdgm_no_minify_f) {
      $rdgm_utils   = rdgm_plugin_url ('rdgm_utils.min.js');
      $rdgm                 = rdgm_plugin_url ('rdgm.min.js');
      $r_diagrams            = rdgm_plugin_url ('r_diagrams.min.js');
   } else {
      $rdgm_utils   = rdgm_plugin_url ('rdgm_utils.js');
      $rdgm                 = rdgm_plugin_url ('rdgm.js');
   }
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > add_rdgm_js_and_style] $rdgm: ' . $rdgm);
   }
   $jquery_ui_touchpunch  = rdgm_plugin_url ('jquery.ui.touch-punch.min.js');
   $rdgm_featherlight     = rdgm_plugin_url ('featherlight.js');
   $autocomplete_combobox = rdgm_plugin_url ('autocomplete-combobox.js');
   $select2               = rdgm_plugin_url ('select2.full.min.js');
   $simple_color          = rdgm_plugin_url ('jquery.simple-color.min.js');
   wp_enqueue_script ('rdgm_utils_handle',    $rdgm_utils,    array (), $r_diagrams_version, true);
   wp_enqueue_script ('rdgm_handle',                  $rdgm,                  array (), $r_diagrams_version, true);
   wp_enqueue_script ('jquery_ui_touchpunch_handle',  $jquery_ui_touchpunch,  array (), $r_diagrams_version, true);
   wp_enqueue_script ('rdgm_featherlight_handle',     $rdgm_featherlight,     array (), $r_diagrams_version, true);
   wp_enqueue_script ('autocomplete_combobox_handle', $autocomplete_combobox, array (), $r_diagrams_version, true);
   wp_enqueue_script ('select2_handle',               $select2,               array (), $r_diagrams_version, true);
   wp_enqueue_script ('simple_color_handle',          $simple_color,          array (), $r_diagrams_version, true);
   $rdgm_params = set_rdgm_params ();
   $local_rdgm_params = $rdgm_params;
   $local_rdgm_params['T'] = $rdgm_T;
   wp_localize_script ('rdgm_handle',      'rdgm_params', $local_rdgm_params);
   wp_localize_script ('r_diagrams_handle', 'rdgm_params', $local_rdgm_params);
   $rdgm_css      = rdgm_plugin_url ('rdgm.css');
   wp_register_style ('rdgm_css_handle',         $rdgm_css,          array (), $r_diagrams_version);
   wp_enqueue_style ('rdgm_css_handle');
   $lightness_css      = rdgm_plugin_url ('jquery-ui.min.lightness.css');
   wp_register_style ('lightness_handle',        $lightness_css,     array (), $r_diagrams_version);
   wp_enqueue_style ('lightness_handle');
   $featherlight_css    = rdgm_plugin_url ('featherlight.min.css');
   wp_register_style ('featherlight_css_handle',  $featherlight_css, array (), $r_diagrams_version);
   wp_enqueue_style ('featherlight_css_handle');
   $select2_css        = rdgm_plugin_url ('select2.css');
   wp_register_style ('select2_css_handle',    $select2_css,       array (), $r_diagrams_version);
   wp_enqueue_style ('select2_css_handle');
}
function rdgm_add_edit_page_scripts ($hook) {
   global $rdgm_debug, $r_diagrams_version, $rdgm_options, $rdgm_params, $rdgm_T,
          $rdgm_no_minify_f;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_add_edit_page_scripts] $hook: ' . $hook);
   }
   if ($hook == 'post.php' || $hook == 'post-new.php') {
      $rdgm_no_minify_f = true;
      add_rdgm_js_and_style ($hook);
      $rdgm_no_minify_f = false;
      $pre_rdgm_edit          = rdgm_plugin_url ('pre_rdgm_edit.js');
      $rdgm_edit              = rdgm_plugin_url ('rdgm_edit.js');
      $rwizard               = rdgm_plugin_url ('rwizard.js');
      $autocomplete_combobox = rdgm_plugin_url ('autocomplete-combobox.js');
      $simple_color          = rdgm_plugin_url ('jquery.simple-color.min.js');
      $select2               = rdgm_plugin_url ('select2.full.min.js');
      wp_enqueue_script ('pre_rdgm_edit_handle',          $pre_rdgm_edit,          array (), $r_diagrams_version, true);
      wp_enqueue_script ('rdgm_edit_handle',              $rdgm_edit,              array (), $r_diagrams_version, true);
      wp_enqueue_script ('rwizard_handle',               $rwizard,               array (), $r_diagrams_version, true);
      wp_enqueue_script ('autocomplete_combobox_handle', $autocomplete_combobox, array (), $r_diagrams_version, true);
      wp_enqueue_script ('simple_color_handle',          $simple_color,          array (), $r_diagrams_version, true);
      wp_enqueue_script ('select2_handle',               $select2,               array (), $r_diagrams_version, true);
      $rdgm_edit_params = $rdgm_params;
      $rdgm_edit_params['T'] = $rdgm_T;
      wp_localize_script ('pre_rdgm_edit_handle', 'rdgm_edit_params', $rdgm_edit_params);
      $rdgm_edit_css       = rdgm_plugin_url ('rdgm_edit.css');
      $rwizard_css        = rdgm_plugin_url ('rwizard.css');
      $select2_css        = rdgm_plugin_url ('select2.css');
      wp_register_style ('rdgm_edit_css_handle',   $rdgm_edit_css,      array (), $r_diagrams_version);
      wp_register_style ('rwizard_css_handle',    $rwizard_css,       array (), $r_diagrams_version);
      wp_register_style ('select2_css_handle',    $select2_css,       array (), $r_diagrams_version);
      wp_enqueue_style ('rdgm_edit_css_handle');
      wp_enqueue_style ('rwizard_css_handle');
      wp_enqueue_style ('select2_css_handle');
   }
}
function rdgm_edit_button () {
   if (current_user_can ('edit_posts' ) || current_user_can ('edit_pages')) {
      add_filter ('mce_buttons_2', 'register_rdgm_edit_buttons');
      add_filter ('mce_external_plugins', 'add_rdgm_edit_buttons');
   }
}
function register_rdgm_edit_buttons ($buttons) {
   array_push ($buttons, 'button_q', 'button_swhs');
   return $buttons;
}
function add_rdgm_edit_buttons ($plugin_array) {
   global $r_diagrams_version, $rdgm_debug;
   $plugin_array['rdgm_edit_button_script'] = rdgm_plugin_url ('rdgm_tinymce.js?ver='. $r_diagrams_version) ;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > add_rdgm_edit_buttons] plugin_array: ' . print_r ($plugin_array, true));
   }
   return $plugin_array;
}
function rdgm_plugin_url ($path) {
   $plugin_url = plugins_url ($path, __FILE__);
   return $plugin_url;
}
function rdgm_get_dataset_questions () {
   global $rdgm_debug, $rdgm_secure_server_loc;
   $dataset             = sanitize_text_field (urldecode ($_POST['dataset']));
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] microtime (): ' . microtime ());
      error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] dataset: ' . $dataset);
   }
   $qname = sanitize_text_field ($_POST['qname']);
   if ($qname != 'rdgm_' && $qname != 'qcard_') {
      return;
   }
   $i_rdgm_qdeck = sanitize_text_field ($_POST['i_rdgm_qdeck']);
   if (! is_numeric ($i_rdgm_qdeck)) {
      return;
   }
   $qrecord_id = sanitize_text_field (urldecode ($_POST['qrecord_id']));
   $units = '';
   if (isset ($_POST['units'])) {
      if (gettype ($_POST['units']) == 'array') {
         $units = array_map ('sanitize_text_field', $_POST['units']);
      } else {
         $units = sanitize_text_field ($_POST['units']);
      }
   }
   $b64_units = base64_encode (json_encode ($units));
   $topics = '';
   if (isset ($_POST['topics'])) {
      if (gettype ($_POST['topics']) == 'array') {
         $topics = array_map ('sanitize_text_field', $_POST['topics']);
      } else {
         $topics = sanitize_text_field ($_POST['topics']);
      }
   }
   $b64_topics = base64_encode (json_encode ($topics));
   $n_questions_in_set  = sanitize_text_field ($_POST['n_questions_in_set']);
   if (! is_numeric ($i_rdgm_qdeck)) {
      return;
   }
   $questions_to_do = 'spaced_repetition';
   if (isset ($_POST['questions_to_do'])) {
      $questions_to_do  = sanitize_text_field (urldecode ($_POST['questions_to_do']));
   }
   $rdgm_session_id     = sanitize_text_field (urldecode ($_POST['rdgm_session_id']));
   $random_f = false;
   if (isset ($_POST['random_f'])) {
      $random_f         = sanitize_text_field ($_POST['random_f']) ? 1 : 0;
   }
   $page_url = '';
   if (isset ($_POST['page_url'])) {
      $page_url         = sanitize_text_field (urldecode ($_POST['page_url']));
   }
   $b64_use_dataset_question_ids = '';
   $maker_session_id = '';
   if (isset ($_POST['use_dataset_question_ids'])) {
      $use_dataset_question_ids = array_map ('sanitize_text_field', $_POST['use_dataset_question_ids']);
      $b64_use_dataset_question_ids = base64_encode (json_encode ($use_dataset_question_ids));
      $maker_session_id             = sanitize_text_field ($_POST['maker_session_id']);
   }
   $dataset_reset_questions_date = '';
   if (isset ($_POST['dataset_reset_questions_date'])) {
      $dataset_reset_questions_date = sanitize_text_field ($_POST['dataset_reset_questions_date']);
   }
   $body = array ('dataset'                      => $dataset,
                  'qname'                        => $qname,
                  'i_rdgm_qdeck'                 => $i_rdgm_qdeck,
                  'qrecord_id'                   => $qrecord_id,
                  'units'                        => $b64_units,
                  'topics'                       => $b64_topics,
                  'n_questions_in_set'           => $n_questions_in_set,
                  'questions_to_do'              => $questions_to_do,
                  'rdgm_session_id'              => $rdgm_session_id,
                  'random_f'                     => $random_f,
                  'page_url'                     => $page_url,
                  'use_dataset_question_ids'     => $b64_use_dataset_question_ids,
                  'maker_session_id'             => $maker_session_id,
                  'dataset_reset_questions_date' => $dataset_reset_questions_date);
   $url = $rdgm_secure_server_loc . '/get_dataset_questions_v3.php';
   $http_request = new WP_Http;
   if ($rdgm_debug[5]) {
      error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] $body: ' . print_r ($body, true));
   }
   $result = $http_request->request ($url, array ('method'  => 'POST',
                                                  'timeout' => 40,    // Seconds.
                                                  'body'    => $body));
   if ($rdgm_debug[5]) {
      error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] gettype (result): ' . gettype ($result));
      if (! is_wp_error ($result)) {
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] result: ' . print_r ($result, true));
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] microtime (): ' . microtime ());
      }
   }
   if (is_wp_error ($result)) {
      wp_die ();  // Required to terminate and return proper response.
      return;
   }
   $data_array = json_decode ($result['body']);
   if ($rdgm_debug[5]) {
      error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] data_array: ' . print_r ($data_array, true));
   }
   $ok_f = $data_array->ok_f;
   if ($ok_f == 1) {
      $questions_html = $data_array->questions_html;
      $questions_html = rdgm_filter_embeds ($questions_html);
      if ($rdgm_debug[5]) {
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] questions_html: ' . print_r ($questions_html, true));
      }
      $filtered_questions_html = apply_filters ('the_content', $questions_html);
      if ($rdgm_debug[5]) {
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] (after the_content) microtime (): ' . microtime ());
      }
      $qf_f = false;
      if (isset ($_POST['qf_f'])) {
         $qf_f = sanitize_text_field ($_POST['qf_f']) == 1;
      }
      if ($qf_f && $qname == 'rdgm_') {
         $filtered_questions_html = rdgm_feedback ($filtered_questions_html);
      }
      if ($rdgm_debug[5]) {
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] (after rdgm_feedback) microtime (): ' . microtime ());
         error_log ('[r-diagrams-plugin.php > rdgm_get_dataset_questions] filtered_questions_html: ' . print_r ($filtered_questions_html, true));
      }
      $data_array->questions_html = $filtered_questions_html;
   }
   wp_send_json ($data_array);
   wp_die ();  // Required to terminate and return proper response.
}
function rdgm_filter_embeds ($html) {
   global $rdgm_debug;
   $n_links = preg_match_all ('/^\s*(http:\/\/|https:\/\/)\S+\s*$/m', $html, $matches, PREG_SET_ORDER);
   if ($rdgm_debug[5]) {
      error_log ('[r-diagrams-plugin.php > rdgm_filter_embeds] $matches: ' . print_r ($matches, true));
   }
   for ($i=0; $i<$n_links; $i++) {
      $url = trim ($matches[$i][0]);
      $embed_html = wp_oembed_get ($url);
      $html = preg_replace ('/^\s*(http:\/\/|https:\/\/|\/\/)\S+\s*$/m', $embed_html, $html, 1);
   }
   $n_embeds = preg_match_all ('/\[embed[^\]]*\](.*?)\[\/embed\]/', $html, $matches, PREG_SET_ORDER);
   if ($rdgm_debug[5]) {
      error_log ('[r-diagrams-plugin.php > rdgm_filter_embeds] $matches: ' . print_r ($matches, true));
   }
   for ($i=0; $i<$n_embeds; $i++) {
      $embed = $matches[$i][0];
      $attr = array ();
      $width  = rdgm_get_attr ($embed, 'width');
      if ($width) {
         $attr['width'] = $width;
      }
      $height = rdgm_get_attr ($embed, 'height');
      if ($height) {
         $attr['height'] = $height;
      }
      $url = trim ($matches[$i][1]);
      $embed_html = wp_oembed_get ($url, $attr);
      $html = preg_replace ('/\[embed.*?\[\/embed\]/', $embed_html, $html, 1);
   }
   return $html;
}
function rdgm_process_embeds () {
   global $rdgm_debug;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_process_embeds] $_POST: ' . print_r ($_POST, true));
   }
   $urls = sanitize_text_field (urldecode ($_POST['urls']));
   $urls = json_decode ($urls, true);
   $args = array ();
   if (isset ($_POST['args'])) {
      $args = sanitize_text_field (urldecode ($args));
      $args = json_decode ($args, true);
   }
   if ($rdgm_debug[0]) {
      error_log ('                      $urls: ' . print_r ($urls, true));
      error_log ('                      $args: ' . print_r ($args, true));
   }
   $embed_htmls = array ();
   $n_urls = count ($urls);
   for ($i=0; $i<$n_urls; $i++) {
      $embed_htmls[] = wp_oembed_get ($urls[$i], $args[$i]);
   }
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_process_embeds] $embed_htmls: ' . print_r ($embed_htmls, true));
   }
   wp_send_json ($embed_htmls);
   wp_die ();  // Required to terminate and return proper response.
}
function rdgm_erase_update_msg () {
}
function rdgm_array_map_recursive ($callback, $array) {
   $func = function ($item) use (&$func, &$callback) {
      return is_array ($item) ? array_map ($func, $item) : call_user_func ($callback, $item);
   };
   return array_map ($func, $array);
}
function rdgm_qjax0 () {
   global $rdgm_debug;
   $rdgmdata = rdgm_array_map_recursive ('wp_kses_post', $_POST['rdgmdata']);
   if (! isset ($rdgmdata['dest'])) {
      error_log ('[r-diagrams-plugin.php > rdgm_qjax0] (no dest) $rdgmdata: ' . print_r ($rdgmdata, true));
      wp_die ();
   }
   for ($i_try=0; $i_try<4; $i_try++) {
	 if ($i_try > 0) {
            error_log ("[r-diagrams-plugin.php > rdgm_qjax0] i_try: $i_try");
            error_log ('[r-diagrams-plugin.php > rdgm_qjax0] $rdgmdata: ' . print_r ($rdgmdata, true));
         }
      $ok_f = rdgm_qjax ($rdgmdata);
      if ($ok_f) {
         break;
      }
      usleep (1833000);
      if ($rdgm_debug[0]) {
         error_log ('[r-diagrams-plugin.php > rdgm_qjax0] ok_f: $ok_f, i_try: ' . $i_try);
      }
   }
}
function rdgm_browse_dataset_questions () {
   global $rdgm_debug, $server_name, $qjax_bypass;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_browse_dataset_questions]');
   }
   include 'browse_dataset_questions.php';
   wp_die ();
}
function rdgm_qjax ($rdgmdata) {
   global $rdgm_debug, $rdgm_secure_server_loc;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_qjax] $rdgmdata: ' . print_r ($rdgmdata, true));
   }
   $dest = esc_url ($rdgmdata['dest']);
   $dest = substr ($dest, 7);
   $url = "$rdgm_secure_server_loc/$dest.php";
   $http_request = new WP_Http;
   $result = $http_request->request ($url, array ('method'  => 'POST',
                                                  'timeout' => 40,    // Seconds.
                                                  'body'    => $rdgmdata));
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_qjax] gettype (result): ' . gettype ($result));
      if (! is_wp_error ($result)) {
         error_log ('[r-diagrams-plugin.php > rdgm_qjax] result: ' . print_r ($result, true));
      }
   }
   if (is_wp_error ($result)) {
      error_log ('[r-diagrams-plugin.php > rdgm_qjax] $result->get_error_messages (): ' . print_r ($result->get_error_messages (), true));
      $script_name = $_SERVER['SCRIPT_FILENAME'];
      error_log ('[r-diagrams-plugin.php > rdgm_qjax] $script_name: ' . $script_name);
      error_log ('[r-diagrams-plugin.php > rdgm_qjax] $rdgmdata: ' . print_r ($rdgmdata, true));
      $ok_f = false;
   } else {
      wp_send_json ($result['body']);
      wp_die ();  // Required to terminate and return proper response.
      $ok_f = true;
   }
   return $ok_f;
}
add_action ('wp_enqueue_scripts', 'add_rdgm_js_and_style');
add_action ('admin_enqueue_scripts', 'rdgm_add_edit_page_scripts');
function rdgm_set_scripts_type_attribute ($tag, $handle, $src) {
   if ($handle === 'emoji_picker_handle') {
      $tag = '<script type="module" src="' . esc_url ($src) . '"></script>';
   }
   return $tag;
}
add_filter ('script_loader_tag', 'rdgm_set_scripts_type_attribute', 10, 3);
$q_p = str_replace ('x', 'w', 'qxiz-online-quizzes-and-flashcards/qxizcards-header.php');
$q_f = is_plugin_active ($q_p);
$s_f = is_plugin_active ('r-diagrams-responsive-diagrams/r-diagrams-header.php');
if ($rdgm_debug[0]) {
   error_log ("[r-diagrams-plugin.php] q_f: $q_f, s_f: $s_f");
}
if ($q_f && $s_f) {
   if ('rdgm' != 'rdgm') {
      if ($rdgm_debug[0]) {
         error_log ('[r-diagrams-plugin.php] add_action > button (q & s)');
      }
      add_action ('admin_init', 'rdgm_edit_button');
   }
} else {
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php] add_action > button (q or s)');
   }
   add_action ('admin_init', 'rdgm_edit_button');
}
add_action ('wp_ajax_process_embeds', 'rdgm_process_embeds');
add_action ('wp_ajax_nopriv_process_embeds', 'rdgm_process_embeds');
add_action ('wp_ajax_erase_update_msg', 'rdgm_erase_update_msg');
add_action ('wp_ajax_nopriv_erase_update_msg', 'rdgm_erase_update_msg');
add_action ('wp_ajax_qjax', 'rdgm_qjax0');
add_action ('wp_ajax_nopriv_qjax', 'rdgm_qjax0');
/*
function rdgm_change_mce_options ($mceInit) {
   $mceInit['paste_preprocess']
      = 'function (pl, o) {
            console.log ("[rdgm_change_mce_options] o.content: ", o.content);
            o.content = "[[" + o.content + "]]";
         }';
   return $mceInit;
}
add_filter ('tiny_mce_before_init', 'rdgm_change_mce_options');
*/
/**
 * Customize TinyMCE's configuration
 *
 * @param   array
 * @return  array
 */
function rdgm_configure_tinymce ($in) {
   $in['paste_preprocess']
      = "function (plugin, args) {
            var stripped = jQuery ('<div>' + args.content + '</div>');
            /*
            var whitelist = 'p,span,b,strong,i,em,h3,h4,h5,h6,ul,li,ol';
            var els = stripped.find ('*').not (whitelist);
            for (var i=els.length - 1; i>=0; i--) {
               var e = els[i];
               jQuery (e).replaceWith (e.innerHTML);
            }
            */
            stripped.find ('*').removeAttr('id').removeAttr ('class');
            args.content = stripped.html();
         }";
   $in['paste_retain_style_properties'] = 'all';
   return $in;
}
add_filter ('tiny_mce_before_init', 'rdgm_configure_tinymce');
function rdgm_process_shortcodes_initially ($content) {
   global $rdgm_debug, $rdgm_secure_server_loc, $server_name;
   $content = rdgm_process_simply_random ($content);
   if (   strpos ($content, '[rdgm')      !== false
                                                      ) {
      list ($content, $rdgmdemos)  = rdgm_cut_demos ($content, 'rdgm');
      $author_id = get_the_author_meta ('ID');
      $user_id   = get_current_user_id ();
      if (! ($user_id == $author_id || current_user_can ('editor') || current_user_can ('administrator'))) {
         $match_pat = "/\[qfeedback\][\s\S]*?\[\/qfeedback\]/";
         $content = preg_replace ($match_pat, '', $content);
      } else {
         $content = preg_replace ("/\[qfeedback\]|\[\/qfeedback\]/", '', $content);
      }
      $content = preg_replace ('/<span id="qbookmark[^<]+<\/span>/m', '', $content);
      if (   ! rdgm_check_shortcode_pairs_ok ($content, 'rdgm')
                                                                 ) {
         $q = 'q<span style="display: none;">x</span>';
         $content = '<div style="font: bold 14pt sans-serif; color: red; background: white; border: 1px solid red; padding: 5px;">'
                   .   "Note: mismatched [${q}wiz]...[/${q}wiz] or [${q}deck]...[/${q}deck] pairs on this page; quizzes and flashcard decks may not function correctly</h2>"
                   . '</div>'
                   . $content;
      }
      $content =   '<div class="rdgm_wrapper"  style="display: none;"></div>'
                 . '<div class="qdeck_wrapper" style="display: none;"></div>'
                 . $content;
      $content = rdgm_wrap_shortcode_pairs ($content, 'rdgm');
      $content = str_replace ('[qscores]', '<span class="qscores"><a href="' . $rdgm_secure_server_loc . '/student_login.php" target="_blank">Login/View scores</a></span>', $content);
      $content = rdgm_unwrap_and_paste_demos ($content, $rdgmdemos, 'rdgm');
      if ($rdgm_debug[1]) {
         error_log ("[r-diagrams-plugin.php > rdgm_process_shortcodes_initially] content:\n" . $content);
      }
   }
   return $content;
}
function rdgm_cut_demos ($content, $rdgm_qdeck) {
   $match_pat = "/\[${rdgm_qdeck}demo\]([\s\S]*?)\[\/${rdgm_qdeck}demo\]/";
   preg_match_all ($match_pat, $content, $matches, PREG_SET_ORDER);
   $replace_pat = "${rdgm_qdeck}_PLACEHOLDER";
   $content = preg_replace ($match_pat, $replace_pat, $content);
   return array ($content, $matches);
}
function rdgm_unwrap_and_paste_demos ($content, $demos, $rdgm_qdeck) {
   $n_demos = count ($demos);
   $match_pat = "/${rdgm_qdeck}_PLACEHOLDER/";
   for ($i=0; $i<$n_demos; $i++) {
      $demo = $demos[$i][1];
      $content = preg_replace ($match_pat, $demo, $content, 1);
   }
   return $content;
}
function rdgm_wrap_shortcode_pairs ($content, $rdgm_qdeck) {
   global $rdgm_debug;
   $n_opening_shortcodes = preg_match_all ("/(<(p|h|span)[^>]*>\s*)*\[${rdgm_qdeck}/", $content, $matches, PREG_OFFSET_CAPTURE);
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $matches:' . print_r ($matches, true));
   }
   $i_opening_poss = array ();
   for ($i=0; $i<$n_opening_shortcodes; $i++) {
      $i_opening_poss[] = $matches[0][$i][1];
   }
   $n_closing_shortcodes = preg_match_all ("/\[\/$rdgm_qdeck\](<\/(p|h|span)[^>]*>\s*)*/", $content, $matches, PREG_OFFSET_CAPTURE);
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $matches:' . print_r ($matches, true));
   }
   $i_closing_poss = array ();
   for ($i=0; $i<$n_closing_shortcodes; $i++) {
      $i_closing_poss[] = strlen ($matches[0][$i][0]) + $matches[0][$i][1];
   }
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $i_opening_poss:' . print_r ($i_opening_poss, true));
      error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $i_closing_poss:' . print_r ($i_closing_poss, true));
   }
   $new_content = array ();
   $i_prev_closing_pos = 0;
   $i_close = 0;
   for ($i=0; $i<$n_opening_shortcodes; $i++) {
      $len = $i_opening_poss[$i] - $i_prev_closing_pos;
      if ($len > 0) {
         $new_content_prev = substr ($content, $i_prev_closing_pos, $len);
         $new_content[]    = $new_content_prev;
         if ($rdgm_debug[0]) {
            error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $new_content_prev: ' . $new_content_prev);
         }
      }
      $len = 0;
      while (isset ($i_closing_poss[$i_close])) {
         $len = $i_closing_poss[$i_close] - $i_opening_poss[$i];
         if ($len > 0) {
            break;
         }
         $i_close++;
      }
      if ($len > 0) {
         $qcontent = substr ($content, $i_opening_poss[$i], $len);
         $modified_rdgm_qdeck = rdgm_check_fix_wrap_matched_divs ($qcontent, $rdgm_qdeck);
         $modified_rdgm_qdeck = rdgm_encode_image_tags ($modified_rdgm_qdeck);
         if ($rdgm_qdeck == 'rdgm') {
            $modified_rdgm_qdeck = rdgm_feedback ($modified_rdgm_qdeck);
         }
         $new_content[] = $modified_rdgm_qdeck;
         if ($rdgm_debug[0]) {
            error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $modified_rdgm_qdeck: ' . $modified_rdgm_qdeck);
         }
      }
      $i_prev_closing_pos = $i_closing_poss[$i_close];
   }
   $new_content_finish = substr ($content, $i_prev_closing_pos);
   $new_content[] = $new_content_finish;
   if ($rdgm_debug[0]) {
      error_log ('[r-diagrams-plugin.php > rdgm_wrap_shortcode_pairs] $new_content_finish: ' . $new_content_finish);
   }
   return implode ('', $new_content);
}
function rdgm_check_fix_wrap_matched_divs ($qcontent, $rdgm_qdeck) {
   global $rdgm_debug;
   $div_match_pat = "/<div[^>]*>|<\/div>/";
   $n_tags = preg_match_all ($div_match_pat, $qcontent, $div_matches, PREG_SET_ORDER);
   $matched_pair_b = array ();
   for ($i=0; $i<$n_tags; $i++) {
      array_push ($matched_pair_b, false);
      $tag = $div_matches[$i][0];
      if (substr ($tag, 0, 2) == '</') {
         for ($jj=$i-1; $jj>=0; $jj--) {
            if (substr ($div_matches[$jj][0], 0, 2) == '<d' && ! $matched_pair_b[$jj]) {
               $matched_pair_b[$jj] = true;
               $matched_pair_b[$i] = true;
               break;
            }
         }
      }
   }
   $pieces = preg_split ($div_match_pat, $qcontent);
   $new_qcontent = array ("<div class=\"${rdgm_qdeck}_wrapper rdgm_shortcodes_hidden\">\n");
   $fallback =   '<div class="' . $rdgm_qdeck . '_wrapper_fallback ' . $rdgm_qdeck . '_wrapper_fallback_visible">'
               .    '<button onclick="rdgm_.rdgm_init (); qcard_.qdeck_init ();">'
               .        'Click here to start ' . ($rdgm_qdeck == 'rdgm' ? 'quiz' : 'flashcard deck')
               .    '</button>'
               . '</div>';
   array_push ($new_qcontent, $fallback);
   array_push ($new_qcontent, $pieces[0]);
   for ($i=0; $i<$n_tags; $i++) {
      if ($matched_pair_b[$i]) {
         if ($rdgm_debug[2]) {
            error_log ('[r-diagrams-plugin.php > rdgm_check_fix_wrap_matched_divs] matched pair tag html: ' . rdgm_summary ($div_matches[$i][0], 100));
         }
         $tag = $div_matches[$i][0];
         array_push ($new_qcontent, $tag);
      }
      array_push ($new_qcontent, $pieces[$i+1]);
   }
   array_push ($new_qcontent, "\n</div>  <!-- ${rdgm_qdeck}_wrapper -->\n");
   for ($i=0; $i<$n_tags; $i++) {
      if (! $matched_pair_b[$i]) {
         if ($rdgm_debug[2]) {
            error_log ('[r-diagrams-plugin.php > rdgm_check_fix_wrap_matched_divs] unmatched pair tag html: ' . rdgm_summary ($div_matches[$i][0], 100));
         }
         $tag = $div_matches[$i][0];
         array_push ($new_qcontent, $tag);
      }
   }
   return implode ('', $new_qcontent);
}
function rdgm_encode_image_tags ($rdgm_qdeck_content) {
   $n_images = preg_match_all ('/(\[caption[^\]]*\])*<img/', $rdgm_qdeck_content, $matches, PREG_OFFSET_CAPTURE);
   for ($i=$n_images-1; $i>=0; $i--) {
      $match = $matches[0][$i][0];
      if (substr ($match, 0, 1) == '[') {
         continue;
      } else {
         $i_offset = $matches[0][$i][1];
         $remaining = substr ($rdgm_qdeck_content, $i_offset);
         $new_remaining = preg_replace ('/<img/', '<input name="rdgm_img"', $remaining, 1);
         $rdgm_qdeck_content = substr ($rdgm_qdeck_content, 0, $i_offset) . $new_remaining;
      }
   }
   return $rdgm_qdeck_content;
}
function rdgm_feedback ($rdgm_qdeck_content) {
   global $rdgm_debug;
   $modified_content = preg_replace ('/\[!+\].*?\[\/!+\]/s', '', $rdgm_qdeck_content);
   if ($rdgm_debug[8]) {
      error_log ('[r-diagrams-plugin.php > rdgm_feedback] $modified_content: ' . $modified_content);
   }
   $modified_content = preg_replace_callback ('/((<[^\/][^>]*>\s*)*?)(\[c\]|\[f\]|\[c\*\])([\s\S]*?)(?=((<[^\/][^>]*>\s*)*?(\[c|\[f\]|\[x|\[q|\[\/rdgm|<div class="rdgm_edit_question|\[code><\/code>q|$)))/', 'rdgm_feedback2', $modified_content);
   return $modified_content;
}
function rdgm_feedback2 ($matches) {
   global $rdgm_debug;
   $max_splits = 6;
   if ($rdgm_debug[8]) {
      error_log ('[r-diagrams-plugin.php > rdgm_feedback2] $matches: ' . print_r ($matches, true));
   }
   $opening_tags = $matches[1];
   $shortcode    = $matches[3];
   $feedback     = $matches[4];
   $return_closing_tags = '';
   $empty_p_f = preg_match ('/(<p>&nbsp;<\/p>\s*)+$/s', $feedback, $empty_p_matches, PREG_OFFSET_CAPTURE);
   if ($empty_p_f) {
      if ($rdgm_debug[8]) {
         error_log ('[r-diagrams-plugin.php > rdgm_feedback2] $empty_p_matches: ' . print_r ($empty_p_matches, true));
      }
      $empty_ps_pos = $empty_p_matches[0][1];
      $return_closing_tags = substr ($feedback, $empty_ps_pos);
      $feedback            = substr ($feedback, 0, $empty_ps_pos);
   }
   $closing_tags_f = preg_match ('/(<\/[^>]+>\s*)+$/s', $feedback, $closing_tags_matches, PREG_OFFSET_CAPTURE);
   if ($closing_tags_f !== false) {
      if (count ($closing_tags_matches)) {
         $closing_tags     = $closing_tags_matches[0][0];
         $closing_tags_pos = $closing_tags_matches[0][1];
         $n_closing_tagnames = preg_match_all ('/<\/([a-z]+[0-9]*)/', $closing_tags, $closing_tagname_matches, PREG_OFFSET_CAPTURE);
         $last_closing_tagname = $n_closing_tagnames - 1;
         if ($rdgm_debug[8]) {
            error_log ('[r-diagrams-plugin.php > rdgm-feedback2] closing_tags_matches: ' . print_r ($closing_tags_matches, true));
            error_log ('[r-diagrams-plugin.php > rdgm-feedback2] closing_tagname_matches: ' . print_r ($closing_tagname_matches, true));
         }
         $n_opening_tagnames = preg_match_all ('/<([a-z]+[0-9]*)/', $opening_tags, $opening_tagname_matches);
         $n = min ($n_opening_tagnames, $n_closing_tagnames);
         $closing_tagnames_pos = -1;
         for ($i=0; $i<$n; $i++) {
            $opening_tagname = $opening_tagname_matches[1][$i];
            $i_closing_tagname = $last_closing_tagname - $i;
            $closing_tagname  = $closing_tagname_matches[1][$i_closing_tagname][0];
            if ($rdgm_debug[8]) {
               error_log ("[r-diagrams-plugin.php > rdgm-feedback2] opening_tagname: $opening_tagname, closing_tagname: $closing_tagname");
            }
            if ($closing_tagname != $opening_tagname) {
               break;
            }
            $closing_tagnames_pos = $closing_tagname_matches[0][$i_closing_tagname][1];
         }
         if ($closing_tagnames_pos != -1) {
            if ($rdgm_debug[8]) {
               error_log ("[r-diagrams-plugin.php > rdgm-feedback2] closing_tags_pos, $closing_tags_pos, closing_tagnames_pos: $closing_tagnames_pos");
            }
            $pos = $closing_tags_pos + $closing_tagnames_pos;
            $return_closing_tags = substr ($feedback, $pos) . $return_closing_tags;
            $feedback            = substr ($feedback, 0, $pos);
         }
      }
   }
   $matches = preg_split ('/(<[^>]+>)/', $feedback, $max_splits, PREG_SPLIT_DELIM_CAPTURE);
   if ($rdgm_debug[8]) {
      error_log ('[r-diagrams-plugin.php > rdgm-feedback2] $matches (internal tags):' . print_r ($matches, true));
   }
   $n_matches = count ($matches);
   if ($n_matches) {
      $last_piece = $n_matches > $max_splits*2 - 2;
      if ($last_piece) {
         $n_matches -= 1;
      }
      $fparts = array ();
      $first_f = true;
      for ($i=1; $i<=$n_matches; $i+=2) {
         $fpart = $matches[$i - 1];
         if ($fpart != '') {
            $fpart = base64_encode ($fpart);
            if ($first_f) {
               $first_f = false;
               if ($shortcode == '[c*]') {
                  $shortcode = '[c]';
                  $len = strlen ($fpart);
                  $len2 = (int) $len / 2;
                  $fpart = substr ($fpart, 0, $len2) . ' ' . substr ($fpart, $len2);
               }
            }
            $fparts[] = $fpart;
         }
         if ($i < $n_matches) {
            $fparts[] = str_replace ('code', 'qcodeq', $matches[$i]);
         }
      }
      if ($first_f) {
         $fpart = base64_encode ('<span></span>');
         if ($shortcode == '[c*]') {
            $shortcode = '[c]';
            $len = strlen ($fpart);
            $len2 = (int) $len / 2;
            $fpart = substr ($fpart, 0, $len2) . ' ' . substr ($fpart, $len2);
         }
         $fparts[] = $fpart;
      }
      $feedback = implode ('', $fparts) . '[Qq]';
      if ($last_piece) {
         $feedback .= $matches[$n_matches];
      }
   } else {
      $feedback = base64_encode ($feedback) . '[Qq]';
   }
   $result = $opening_tags . $shortcode . $feedback . $return_closing_tags;
   if ($rdgm_debug[8]) {
      error_log ('[r-diagrams-plugin.php > rdgm_feedback2] $result: ' . $result);
   }
   return $result;
}
function rdgm_check_shortcode_pairs_ok ($content, $rdgm_qdeck) {
   global $rdgm_debug;
   $error_b = false;
   $n_rdgm_qdecks = preg_match_all ("/\[${rdgm_qdeck}[\s\]]|\[\/${rdgm_qdeck}\]/", $content, $matches, PREG_SET_ORDER);
   if ($rdgm_debug[2]) {
      error_log ("[r-diagrams-plugin.php > rdgm_check_shortcode_pairs_ok] n_${rdgm_qdeck}: $n_rdgm_qdecks");
      error_log ('[r-diagrams-plugin.php > rdgm_check_shortcode_pairs_ok] $matches: ' . print_r ($matches, true));
   }
   if ($n_rdgm_qdecks) {
      if ($n_rdgm_qdecks % 2 != 0) {
         $error_b = true;
      } else {
         for ($i=0; $i<$n_rdgm_qdecks; $i++) {
            $shortcode = $matches[$i][0];
            if ($i % 2 == 0) {
               if (substr ($shortcode, 0, -1) != "[$rdgm_qdeck") {
                  $error_b = true;
                  break;
               }
            } else {
               if ($shortcode != "[/$rdgm_qdeck]") {
                  $error_b = true;
                  break;
               }
            }
         }
      }
   }
   $ok_b = ! $error_b;
   if ($rdgm_debug[2]) {
      error_log ("[r-diagrams-plugin.php > rdgm_check_shortcode_pairs_ok] ok_b: $ok_b");
   }
   return $ok_b;
}
function rdgm_process_simply_random ($content) {
   global $rdgm_debug, $drawns, $rand_max;
   if (strpos ($content, '[simply-random') !== false) {
      if (rdgm_check_shortcode_pairs_ok ($content, 'simply-random')) {
         $rand_max = mt_getrandmax ();
         while (true) {
            $i_beg_pos = strpos ($content,'[simply-random]');
            if ($i_beg_pos === false) {
               $i_beg_pos = strpos ($content,'[simply-random ');
               if ($i_beg_pos === false) {
                  break;
               }
            }
            $i_end_pos = strpos ($content,'[/simply-random]', $i_beg_pos) + 16;
            if ($rdgm_debug[7]) {
               error_log ('[r-diagrams-plugin.php > rdgm_process_simply_random] $i_beg_pos: ' . $i_beg_pos);
               error_log ('[r-diagrams-plugin.php > rdgm_process_simply_random] $i_end_pos: ' . $i_end_pos);
            }
            if ($i_end_pos < $i_beg_pos) {
               error_log ('[r-diagrams-plugin.php > rdgm_process_simply_random] substr ($content, $i_beg_pos, 100): ' . substr ($content, $i_beg_pos, 100));
               break;
            }
            $i_len = $i_end_pos - $i_beg_pos;
            $subset = substr ($content, $i_beg_pos, $i_len);
            if ($rdgm_debug[7]) {
               error_log ('[r-diagrams-plugin.php > rdgm_process_simply_random] $subset: ' . $subset);
            }
            $matches = preg_split ('/\[simply-random-item([^\]]*)\]\n{0,1}/', $subset, 0, PREG_SPLIT_DELIM_CAPTURE);
            $n_pieces = count ($matches);
            if ($n_pieces == 1) {
               $content = substr ($content, 0, $i_beg_pos) . substr ($content, $i_beg_pos + $i_len);
               continue;
            }
            $shortcode = $matches[0];
            $draw_n = rdgm_get_attr2 ($shortcode, 'draw_n');
            if (! is_numeric ($draw_n)) {
               $draw_n = 1;
            }
            $with_replacement
                    = rdgm_get_attr2 ($shortcode, 'with_replacement') == 'true';
            $weights = array ();
            $sum_weights = 0.0;
            for ($i=1; $i<$n_pieces; $i+=2) {
               $attributes = $matches[$i];
               if ($attributes) {
                  $weight = rdgm_get_attr2 ($attributes, 'weight');
                  if (! is_numeric ($weight)) {
                     $weight = 0.0;
                  }
               } else {
                  $weight = 1.0;
               }
               $weights[] = $weight;
               $sum_weights += $weight;
            }
            $n_items = count ($weights);
            $items  = array ();
            $drawns = array_fill (0, $n_items, 0);
            for ($i_draw=0; $i_draw<$draw_n; $i_draw++) {
               $i_item = rdgm_simply_random_draw ($weights, $sum_weights,
                                                  $with_replacement);
               $ii_item = $i_item*2 + 2;
               $item = $matches[$ii_item];
               if ($i_item == $n_items - 1) {
                  $item = substr ($item, 0, -16);
               }
               if (substr ($item, -1) == "\n") {
                  $item = substr ($item, 0, -1);
               }
               $items[] = $item;
            }
            $content = substr ($content, 0, $i_beg_pos) . implode (' ', $items) . substr ($content, $i_beg_pos + $i_len);
         }
      }
   }
   return $content;
}
function rdgm_simply_random_draw ($weights, $sum_weights, $with_replacement) {
   global $rdgm_debug, $rand_max, $drawns;
   $n_items = count ($weights);
   if (! $with_replacement) {
      $n_drawn = array_sum ($drawns);
      if ($n_drawn == $n_items) {
         $drawns = array_fill (0, $n_items, 0);
      }
   }
   $i_item = mt_rand (0, $n_items-1);
   while (true) {
      $skip_f = false;
      if (! $with_replacement) {
         if ($drawns[$i_item]) {
            $skip_f = true;
         }
      }
      if (! $skip_f) {
         if ($sum_weights > 0.0) {
            $relative_weight = $weights[$i_item] / $sum_weights;
         } else {
            $relative_weight = 1.0 / $n_items;
         }
         $x = mt_rand () / $rand_max;
         if ($x < $relative_weight) {
            $drawns[$i_item] = 1;
            break;
         }
      }
      $i_item++;
      if ($i_item >= $n_items) {
         $i_item = 0;
      }
   }
   if ($rdgm_debug[7]) {
      error_log ('[r-diagrams-plugin.php > rdgm_simply_random_draw] $i_item: ' . $i_item);
   }
   return $i_item;
}
function rdgm_summary ($txt, $summary_len) {
   $txtlen = strlen ($txt);
   if ($txtlen > 2*$summary_len) {
      $errtxt = substr ($txt, 0, $summary_len)
                . ' ... ' . substr ($txt, -$summary_len);
   } else {
      $errtxt = $txt;
   }
   return $errtxt;
}
add_filter ('the_content', 'rdgm_process_shortcodes_initially', 19);
add_action ('admin_footer-post.php', 'rdgm_admin_footer_post_func');
add_action ('admin_footer-post-new.php', 'rdgm_admin_footer_post_func');
function rdgm_admin_footer_post_func () {
   global $rdgm_options, $rdgm_debug, $post_type;
   if ($rdgm_debug[0]) {
      error_log ("[r-diagrams-plugin.php > rdgm_admin_footer_post_func] post_type: $post_type");
   }
   if ($post_type == 'post' || $post_type == 'page') {
      $post_id = get_the_ID ();
      $style = <<<EOS
         <style type="text/css">
            #rdgm-publish-intercept {
               position:   absolute;
               width:      100%;
               height:     100%;
               top:        0;
               z-index:    2;
               background: none;
            }
            #rdgm-publish-intercept-gutenberg {
               position:   absolute;
               z-index:    2;
               background: none;
            }
         </style>
EOS;
      $script = <<<EOD
   var post_id;
   var gutenberg_f = true;
   var \$rdgm_publish_intercept;
   var delay_script = function () {
      rdgm_syntax_check = function (e) {
         if (rdgm_debug) {
            console.log ('[rdgm_admin_footer_post_func] create_rwizard_structure_json_b:',  create_rwizard_structure_json_b);
            console.log ('[rdgm_admin_footer_post_func] original_post_status:',  original_post_status);
         }
         if (! create_rwizard_structure_json_b) {
            return true;
         }
         if (! rdgm_syntax_check_manual_only) {
            if (gutenberg_f) {
               \$publish.addClass ('is-busy');
            } else {
               \$ ('div#publishing-action span.spinner').css ({visibility: 'visible'});
            }
            \$rdgm_publish_intercept.hide ();
         }
         var \$edit_area;
         var \$textarea;
         var \$iframe;
         var htm;
         if (gutenberg_f) {
            \$edit_area = \$ ('div.wp-block');
         } else {
            var \$iframe = \$ ('iframe#content_ifr, iframe#wpb_tinymce_content_ifr');
            if (\$iframe.is (':visible')) {
               \$edit_area = \$iframe.contents ().find ('body');
            } else {
               \$textarea = \$ ('textarea.wp-editor-area');
            }
         }
         if (\$edit_area) {
            \$edit_area.find ('div.rdgm_hotspot_label, div.rdgm_edit_canvas .rdgm_edit_target, div.hangman_label').each (function () {
               var \$this = \$ (this);
               var styles = \$this.attr ('style');
               if (/inset/.test (styles)) {
                  var m = styles.match (/inset:\s*([^;]+);/);
                  if (rdgm_debug) {
                     console.log ('[rdgm_admin_footer_post_func] styles.match:', m);
                  }
                  if (m) {
                     var fields = m[1].split (/\s/);
                     if (fields.length == 4) {
                        var top_units = fields[0];
                        var left_units = fields[3];
                        \$this.css ({inset: '', left: left_units, top: top_units});
                     }
                  }
               }
            });
         } else {
            htm = \$textarea.val ();
            htm = htm.replace (/inset:[^;]+;/g, cvt_inset);
            function cvt_inset (css) {
               var fields = css.split (/\s/);
               if (rdgm_debug) {
                  console.log ('[rdgm_admin_footer_post_func > cvt_inset] fields:', fields);
               }
               if (fields.length == 5) {
                  var left_units = fields[4];
                  var top_units  = fields[1];
                  return 'top: ' + top_units + '; left: ' + left_units;
               } else {
                  return css;
               }
            }
            \$textarea.val (htm);
         }
         if (gutenberg_f) {
            htm = wp.data.select ('core/editor').getEditedPostContent ();
         } else {
            if (\$iframe.is (':visible')) {
               var \$edit_area = \$iframe.contents ().find ('body');
               htm = \$edit_area.html ();
               if (rdgm_debug) {
                  console.log ('[rdgm_admin_footer_post_func] \$iframe:', \$iframe, ', \$edit_area:', \$edit_area);
               }
            } else {
               if (rdgm_debug) {
                  console.log ('[rdgm_admin_footer_post_func] \$ (\'textarea.wp-editor-area\'):', \$ ('textarea.wp-editor-area'));
               }
            }
         }
         if (rdgm_debug) {
            console.log ('[rdgm_admin_footer_post_func] htm.substr (0, 2000): ', htm.substr (0, 2000));
         }
         var quizzes_b = /\[\/{0,1}rdgm/.test (htm);
         var decks_b   = /\[\/{0,1}qdeck/.test (htm);
         if (quizzes_b || decks_b) {
            if (rdgm_debug) {
               console.log ('[rdgm_admin_footer_post_func] quizzes_b:', quizzes_b, ', decks_b:', decks_b);
               console.log ('[rdgm_admin_footer_post_func] typeof (rwizard):', typeof (rwizard));
               console.log ('[rdgm_admin_footer_post_func] typeof (rdgm_edit):', typeof (rdgm_edit));
            }
            var delay_process_html2 = function () {
               rwizard.set_rdgm_edit_plugin_url ();
               var errmsgs = [];
               var n_quizzes = 0;
               var n_decks = 0;
               if (quizzes_b) {
                  rdgm_.set_rdgmdata (-1, 'errmsgs', '[]');
                  rdgm_.process_html2 (htm, 0, false, true);
                  if (rdgm_debug) {
                     console.log ('[rdgm_admin_footer_post_func] rdgm_.quizzes_questions:', rdgm_.quizzes_questions);
                     console.log ('[rdgm_admin_footer_post_func] rwizard.errmsgs:', rwizard.errmsgs);
                  }
                  if (rwizard.errmsgs.length) {
                     errmsgs = rwizard.errmsgs;
                  }
               }
               if (decks_b) {
                  qcard_.set_deckdata (-1, 'errmsgs', '[]');
                  qcard_.process_html2 (htm, 0, false, true);
                  if (rdgm_debug) {
                     console.log ('[rdgm_admin_footer_post_func] qcard_.decks_cards:', rdgm_.decks_cards);
                     console.log ('[rdgm_admin_footer_post_func] rwizard.errmsgs:', rwizard.errmsgs);
                  }
                  if (rwizard.errmsgs.length) {
                     errmsgs = errmsgs.concat (rwizard.errmsgs);
                  }
               }
               if (errmsgs.length) {
                  var s = errmsgs.length > 1 ? 's' : '';
                  errmsgs = errmsgs.join ('\\n');
                  var ok_f = confirm (  'Error' + s + ' found:\\n\\n'
                                      + errmsgs + '\\n\\n'
                                      + 'Save/update anyway? (click Cancel to continue editing)');
                  if (! ok_f) {
                     create_rwizard_structure_json_b = true;
                     if (gutenberg_f) {
                        \$publish.removeClass ('is-busy');
                     } else {
                        \$ ('div#publishing-action span.spinner').css ({visibility: 'hidden'});
                     }
                     return false;
                  }
               } else if (rdgm_syntax_check_manual_only) {
                  alert ('No errors found');
               }
               /* ------------------------------
               var r = rdgm_add_structure_indicators (htm);
               if (r.errmsgs.length) {
                  var es = errmsgs.length > 1 ? 'es' : '';
                  var errmsg =  'Mismatch' + es + ' between number of div opening and closing tags:\\n'
                              + r.errmsgs.join ('\\n')
                              + '\\n\\nNote: use Text mode to see div tags';
                  var ok_f = confirm (errmsg + '\\n\\n'
                                      + 'Save/update anyway? (click Cancel to continue editing)');
                  if (! ok_f) {
                     create_rwizard_structure_json_b = true;
                     if (gutenberg_f) {
                        \$publish.removeClass ('is-busy');
                     } else {
                        \$ ('div#publishing-action span.spinner').css ({visibility: 'hidden'});
                     }
                     return false;
                  }
               }
               ---------------------------------- */
               const delay_save_dataset_json = function () {
                  if (rdgm_.quizzes_questions) {
                     n_quizzes = rdgm_.quizzes_questions.length;
                  }
                  var rdgmzes_data = [];
                  for (var i_rdgm=0; i_rdgm<n_quizzes; i_rdgm++) {
                     if (rdgm_.quizzes_questions[i_rdgm]) {
                        if (rdgm_debug) {
                           console.log ('[rdgm_admin_footer_post_func] rdgm_.quizzes_questions[i_rdgm].length:', rdgm_.quizzes_questions[i_rdgm].length);
                           console.log ('[rdgm_admin_footer_post_func] rdgm_.quizzes_questions[i_rdgm][0].dataset_b:', rdgm_.quizzes_questions[i_rdgm][0].dataset_b);
                        }
                        if (rdgm_.quizzes_questions[i_rdgm][0].dataset_b) {
                           rdgm_.quizzes_questions[i_rdgm].i_rdgm = i_rdgm;
                           rdgmzes_data.push (rdgm_.quizzes_questions[i_rdgm]);
                        }
                     }
                  }
                  if (qcard_.decks_cards) {
                     n_decks = qcard_.decks_cards.length;
                  }
                  var qdecks_data = [];
                  for (var i_deck=0; i_deck<n_decks; i_deck++) {
                     if (qcard_.decks_cards[i_deck]) {
                        if (rdgm_debug) {
                              console.log ('[rdgm_admin_footer_post_func] qcard_.decks_cards[' + i_deck + '][0].dataset_b:', qcard_.decks_cards[i_deck][0].dataset_b);
                        }
                        if (qcard_.decks_cards[i_deck][0].dataset_b) {
                           qcard_.decks_cards[i_deck].i_deck = i_deck;
                           qdecks_data.push (qcard_.decks_cards[i_deck]);
                        }
                     }
                  }
                  if (rdgmzes_data.length || qdecks_data.length) {
                     var maker_session_id = '';
                     if (rdgm_edit && rdgm_edit.maker_session_id) {
                        maker_session_id = rdgm_edit.maker_session_id;
                     }
                     var data = {action:           'rdgm_save_dataset_json',
                                 maker_session_id: maker_session_id,
                                 post_id:          post_id,
                                 rdgmzes_data:     rdgmzes_data,
                                 qdecks_data:      qdecks_data
                                };
                     if (rdgm_debug) {
                        console.log ('[rdgm_admin_footer_post_func > rdgm_save_dataset_json] rdgmzes_data.length:', rdgmzes_data.length);
                        console.log ('[rdgm_admin_footer_post_func > rdgm_save_dataset_json] qdecks_data.length:', qdecks_data.length);
                        console.log ('[rdgm_admin_footer_post_func > rdgm_save_dataset_json] data:', JSON.stringify (data, null, 4));
                     }
                     jQuery.ajax ({
                        type:       'POST',
                        url:        rdgm_ajaxurl,
                        data:       data,
                        dataType:   'json',
                        error:      function (xhr, desc) {
                                       if (rdgm_debug) {
                                          console.log ('[rdgm_admin_footer_post_func > rdgm_save_dataset_json] error desc:', desc);
                                       }
                                    },
                        success:    save_dataset_json_callback
                     });
                  } else {
                     save_dataset_json_callback (1);
                  }
               }
               var n_waits = 0;
               const check_blobs = function () {
                  const qqc = rdgm_utils;
                  var wait_f = false;
                  if (rdgm_.quizzes_questions) {
                     for (const rdgm of rdgm_.quizzes_questions) {
                        if (! rdgm) {
                           continue;
                        }
                        const n_questions = rdgm.length;
                        for (var i_question=0; i_question<n_questions; i_question++) {
                           const question = rdgm[i_question];
                           var style_layer_src = question.style_layer_src;
                           if (rdgm_debug) {
                              console.log ('[rdgm_admin_footer_post_func > check_blobs] style_layer_src:', style_layer_src);
                           }
                           if (! style_layer_src || style_layer_src.substr(0, 4) == 'wait') {
                              style_layer_src = qqc.blob_data && qqc.blob_data[style_layer_src];
                              if (! style_layer_src || style_layer_src.substr (0, 4) == 'wait') {
                                 wait_f = true;
                                 break;
                              } else {
                                 question.style_layer_src = style_layer_src;
                                 if (rdgm_debug) {
                                    console.log ('[rdgm_admin_footer_post_func > check_blobs] style_layer_src:', style_layer_src);
                                    console.log ('[rdgm_admin_footer_post_func > check_blobs] question:', question);
                                 }
                              }
                           }
                        }
                     }
                  }
                  if (wait_f && n_waits < 6) {
                     n_waits++;
                     setTimeout (check_blobs, 200);
                  } else {
                     if (rdgm_debug) {
                        console.log ('[rdgm_admin_footer_post_func > check_blobs] n_waits:', n_waits);
                     }
                     delay_save_dataset_json ();
                  }
               }
               check_blobs ();
               function save_dataset_json_callback (affected_rows) {
                  if (affected_rows < 1) {
                     alert ('Sorry, was not able to save dataset questions properly');
                  }
                  if (rdgm_debug) {
                     console.log ('[rdgm_admin_footer_post_func] calling rdgm_publish_post() (1)');
                  }
                  if (! rdgm_syntax_check_manual_only) {
                     rdgm_publish_post (\$publish, true);
                  }
               }
            }
            setTimeout (delay_process_html2, 250);
            return false;
         } else {
            if (rdgm_debug) {
               console.log ('[rdgm_admin_footer_post_func] calling rdgm_publish_post() (2)');
            }
            if (! rdgm_syntax_check_manual_only) {
               rdgm_publish_post (\$publish, false);
            }
            return true;
         }
      }
      post_id = jQuery ('#post_ID').val ();
      var \$publish = jQuery ('button.editor-post-publish-button, button.editor-post-publish-panel__toggle.is-button');
      if (\$publish.length == 0) {
         \$publish = jQuery ('#publish');
         gutenberg_f = false;
      }
      var create_rwizard_structure_json_b = true;
      jQuery (function (\$) {
         if (! rdgm_syntax_check_manual_only) {
            if (gutenberg_f) {
               var \$header_settings = jQuery ('div.edit-post-header__settings');
               var header_settings_width = parseInt (\$header_settings.width ());
               \$header_settings.css ({position: 'relative'});
               var gutenberg_publish_button_width  = \$publish.outerWidth ();
               var gutenberg_publish_button_height = \$publish.outerHeight ();
               var gutenberg_publish_button_position = \$publish.position ();
               var gutenberg_publish_button_top   = parseInt (gutenberg_publish_button_position.top);
               var gutenberg_publish_button_left  = parseInt (gutenberg_publish_button_position.left);
               var gutenberg_publish_button_right = header_settings_width - gutenberg_publish_button_left - gutenberg_publish_button_width;
               \$header_settings.append ('<div id="rdgm-publish-intercept-gutenberg"></div>');
               \$rdgm_publish_intercept = jQuery ('#rdgm-publish-intercept-gutenberg');
               \$rdgm_publish_intercept.css ({top: '' + gutenberg_publish_button_top + 'px', right: '' + gutenberg_publish_button_right + 'px', width: gutenberg_publish_button_width + 'px', height: gutenberg_publish_button_height + 'px'});
            } else {
               var \$publishing_action = jQuery ('#publishing-action');
               \$publishing_action.css ({position: 'relative'});
               \$publishing_action.append ('<div id="rdgm-publish-intercept"></div>');
               \$rdgm_publish_intercept = jQuery ('#rdgm-publish-intercept');
            }
            if (rdgm_debug) {
               console.log ('[rdgm_admin_footer_post_func] \$rdgm_publish_intercept:',  \$rdgm_publish_intercept);
            }
            \$rdgm_publish_intercept.on ('click.rdgm', function (e) {
               rdgm_syntax_check (e);
            });
         }
      });
   }
   if (rdgm_debug) {
      console.log ('[rdgm_admin_footer_post_func] calling setTimeout(delay_script, 5000)');
   }
   setTimeout (delay_script, 5000);
   function rdgm_publish_post (\$publish, quizzes_decks_f) {
      if (rdgm_debug) {
         console.log ('[rdgm_admin_footer_post_func > rdgm_publish_post] post_id:', post_id, ', quizzes_decks_f:', quizzes_decks_f, ', gutenberg_f:', gutenberg_f);
      }
      var ok_f = true;
      if (quizzes_decks_f && gutenberg_f) {
         if (rdgm_edit && rdgm_edit.dataset_b && ! rdgm_edit.maker_logged_in_b) {
            ok_f = ! confirm ('Note: you must log in to save dataset questions.\\nTo log in click "OK" and then click the "Q" icon.\\nClick "Cancel" to continue anyway');
         }
         if (ok_f) {
            var data = {action:  'rdgm_get_dataset_questions_feedback',
                        post_id: post_id};
            if (rdgm_debug) {
               console.log ('[rdgm_admin_footer_post_func > rdgm_publish_post] data:', data);
            }
            jQuery.ajax ({
               type:       'POST',
               url:        rdgm_ajaxurl,
               data:       data,
               dataType:   'json',
               error:      function (xhr, desc) {
                              if (rdgm_debug) {
                                 console.log ('[rdgm_admin_footer_post_func > rdgm_publish_post] error desc:', desc);
                              }
                           },
               success:    rdgm_dataset_questions_feedback_alert
            });
         }
      }
      if (ok_f) {
         \$publish.trigger ('click');
      }
      if (! rdgm_syntax_check_manual_only) {
         \$rdgm_publish_intercept.show ();
      }
   }
   function rdgm_dataset_questions_feedback_alert (data) {
      if (rdgm_debug) {
         console.log ('[rdgm_admin_footer_post_func > rdgm_dataset_questions_feedback_alert] data:', data);
      }
      if (data) {
         alert (data);
         if (typeof rdgm_edit_params.update_msg != 'undefined') {
            rdgm_edit_params.update_msg = '';
         }
      }
   }
   function rdgm_add_structure_indicators (htm) {
      var quiz_deck_htms = htm.split (/(\[\/rdgm\]|\[\/qdeck\])/);
      if (rdgm_debug) {
         console.log ('[rdgm_add_structure_indicators] quiz_deck_htms:', quiz_deck_htms);
      }
      var n_quizzes_decks = quiz_deck_htms.length;
      var rdgm_qdeck;
      var ii_rdgm = 0;
      var ii_deck = 0;
      var errmsgs = [];
      for (var i=0; i<n_quizzes_decks-1; i++) {
         if (quiz_deck_htms[i+1] == '[/rdgm]') {
            rdgm_qdeck = 'rdgm';
            ii_rdgm++;
         } else if (quiz_deck_htms[i+1] == '[/qdeck]') {
            rdgm_qdeck = 'qdeck';
            ii_deck++;
         }
         if (quiz_deck_htms[i] == '[/rdgm]' || quiz_deck_htms[i] == '[/qdeck]') {
            continue;
         }
         var r = rdgm_warn_clean_question_divs (quiz_deck_htms[i], rdgm_qdeck, ii_rdgm, ii_deck);
         if (r.errmsg) {
            errmsgs.push (r.errmsg);
         }
         quiz_deck_htms[i] = r.quiz_deck_htm;
      }
      if (rdgm_debug && errmsgs.length) {
         console.log ('[rdgm_add_structure_indicators] errmsgs:', errmsgs);
      }
      return {'htm':       quiz_deck_htms.join (''),
              'errmsgs':   errmsgs};
   }
   function rdgm_check_divs (htm) {
      var quiz_deck_htms = htm.split (/(\[\/rdgm\]|\[\/qdeck\])/);
      if (rdgm_debug) {
         console.log ('[rdgm_check_divs] quiz_deck_htms:', quiz_deck_htms);
      }
      var n_quizzes_decks = quiz_deck_htms.length;
      var rdgm_qdeck;
      var ii_rdgm = 0;
      var ii_deck = 0;
      var errmsgs = [];
      for (var i=0; i<n_quizzes_decks-1; i++) {
         if (quiz_deck_htms[i+1] == '[/rdgm]') {
            rdgm_qdeck = 'rdgm';
            ii_rdgm++;
         } else if (quiz_deck_htms[i+1] == '[/qdeck]') {
            rdgm_qdeck = 'qdeck';
            ii_deck++;
         }
         if (quiz_deck_htms[i] == '[/rdgm]' || quiz_deck_htms[i] == '[/qdeck]') {
            continue;
         }
         if (/\[(rdgm|qdeck)[^\]]*?\s+dataset\s*=/.test (quiz_deck_htms[i])) {
            quiz_deck_htms[i]
               = quiz_deck_htms[i]
                         .replace (/(\[q\s[^\]]*?)(json=.true.\s*)*([^\]]*\])/g,
                                   '\\\$1json="true" \\\$3');
            quiz_deck_htms[i] = quiz_deck_htms[i].replace (/\[q\]/g,
                                                           '[q json="true"]');
         }
         var r = rdgm_warn_clean_question_divs (quiz_deck_htms[i], rdgm_qdeck, ii_rdgm, ii_deck);
         if (r.errmsg) {
            errmsgs.push (r.errmsg);
         }
         quiz_deck_htms[i] = r.quiz_deck_htm;
      }
      if (rdgm_debug && errmsgs.length) {
         console.log ('[rdgm_check_divs] errmsgs:', errmsgs);
      }
      return {'htm':       quiz_deck_htms.join (''),
              'errmsgs':   errmsgs};
   }
   function rdgm_warn_clean_question_divs (quiz_deck_htm, rdgm_qdeck, ii_rdgm, ii_deck) {
      const qqc = rdgm_utils;
      if (rdgm_debug) {
         console.log ('[rdgm_warn_clean_question_divs] quiz_deck_htm:', quiz_deck_htm);
      }
      var i_question = 0;
      var errmsgs = [];
      var rdgm_edit_parts = quiz_deck_htm.split (/(<div class="rdgm_edit_question[^]*?<!-- close rdgm_edit_question -->)/);
      var question_htms = [];
      var n_rdgm_edit_parts = rdgm_edit_parts.length;
      for (var i=0; i<n_rdgm_edit_parts; i++) {
         if (rdgm_edit_parts[i].indexOf ('<div class="rdgm_edit_question') == -1) {
            question_htms = question_htms.concat (rdgm_edit_parts[i].split (/(?:\[q\]|\[q\s[^\]]+\])/));
         } else {
            question_htms = question_htms.concat (rdgm_edit_parts[i]);
         }
      }
      if (rdgm_debug) {
         console.log ('[rdgm_warn_clean_question_divs] JSON.stringify (question_htms):', JSON.stringify (question_htms));
      }
      var n_question_pieces = question_htms.length;
      var opening_tags = '';
      for (var i=0; i<n_question_pieces; i++) {
         var piece_htm = opening_tags + question_htms[i];
         opening_tags = qqc.find_opening_tags_at_end (piece_htm);
         if (/\S/.test (opening_tags)) {
            if (rdgm_debug) {
               console.log ('[rdgm_warn_clean_question_divs] opening_tags:', opening_tags);
            }
            var opening_tags_pat = opening_tags + '\$';
            re = new RegExp (opening_tags_pat);
            piece_htm = piece_htm.replace (re, '');
         }
         var opening_matches = piece_htm.match (/<div/g);
         var n_opening_divs = 0;
         if (opening_matches) {
            n_opening_divs = opening_matches.length;
            var self_closing_matches = piece_htm.match (/<div[^>]*?\/>/g);
            if (self_closing_matches) {
               n_opening_divs -= self_closing_matches.length;
            }
         }
         var closing_matches = piece_htm.match (/<\/div/g);
         var n_closing_divs = 0;
         if (closing_matches) {
            n_closing_divs = closing_matches.length;
         }
         if (rdgm_debug) {
            console.log ('[rdgm_warn_clean_question_divs] i:', i, ', piece_htm:', piece_htm);
            console.log ('[rdgm_warn_clean_question_divs] n_opening_divs:' + n_opening_divs + ', n_closing_divs:', n_closing_divs);
         }
         var errmsg;
         if (n_opening_divs != n_closing_divs) {
            if (rdgm_qdeck == 'rdgm') {
               var qtext = i == 0 ? 'before first question' : 'question ' + i;
               errmsg = 'Image ' + ii_rdgm + ', ' + qtext + ': ' + qqc.number_to_word (n_opening_divs) + ' opening ' + qqc.plural ('tag', 'tags', n_opening_divs) + ' (<div...>), ' + qqc.number_to_word (n_closing_divs) + ' closing ' + qqc.plural ('tag', 'tags', n_closing_divs) + ' (</div>)';
            } else {
               var ctext = i == 0 ? 'before first card' : 'card ' + i;
               errmsg = 'Deck ' + ii_deck + ', ' + ctext + ': ' + qqc.number_to_word (n_opening_divs) + ' opening ' + qqc.plural ('tag', 'tags', n_opening_divs) + ' (<div...>), ' + qqc.number_to_word (n_closing_divs) + ' closing ' + qqc.plural ('tag', 'tags', n_closing_divs) + ' (</div>)';
            }
            errmsgs.push (errmsg);
         }
      }
      if (rdgm_debug && errmsgs.length) {
         console.log ('[rdgm_warn_clean_question_divs] errmsgs:', errmsgs);
      }
      return {'quiz_deck_htm':  quiz_deck_htm,
              'errmsg':         errmsgs.join ('\\n')};
   }
EOD;
      print $style;
      $ajaxurl                       = admin_url ('admin-ajax.php');
      $rdgm_syntax_check_manual_only = '';
      if (isset ($rdgm_options['rdgm_syntax_check_manual_only'])) {
         $rdgm_syntax_check_manual_only = $rdgm_options['rdgm_syntax_check_manual_only'];
      }
      print "<script>\n";
      print    "var \$ = jQuery;\n";
      print    "var rdgm_syntax_check;\n";
      print    "var rdgm_debug   = '$rdgm_debug[0]';\n";
      print    "var rdgm_ajaxurl = '$ajaxurl';\n";
      print    "var rdgm_syntax_check_manual_only = '$rdgm_syntax_check_manual_only';\n";
      print    $script;
      print "</script>\n";
   }
}
include 'rdgm_get_attr.php';
