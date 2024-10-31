<?php
if (! defined ('ABSPATH')) exit;
$swinging_hotspot_admin_f = strpos ($_SERVER['REQUEST_URI'], 'rdgm') !== false;
if ($rdgm_debug[0]) {
   error_log ('[rdgm_admin.php] $_SERVER[REQUEST_URI]; ' . $_SERVER['REQUEST_URI']);
   error_log ('[rdgm_admin.php] $rdgm_options: ' . print_r ($rdgm_options, true));
}
if ($swinging_hotspot_admin_f) {
   $plugin_label               = 'Swinging Hotspot';
   $plugin_url                 = 'swinginghotspot.com';
   $quiz_and_flashcard_deck    = 'hotspot diagram';
   $quiz_or_flashcard_deck     = 'hotspot diagram';
   $quizzes_or_flashcard_decks = 'hotspot diagrams';
}
function rdgm_admin () {
   global $rdgm_options_page;
   $rdgm_options_page = add_options_page ('Swinging Hotspot', 'Swinging Hotspot', 'manage_options',
                                          'rdgm-admin', 'rdgm_options');
}
function rdgm_admin_enqueue_scripts ($hook_suffix) {
   global $rdgm_options_page, $r_diagrams_version;
   if ($rdgm_options_page == $hook_suffix) {
      wp_enqueue_script ('rdgm_options_script', plugins_url ('rdgm_admin.js', __FILE__), array ('jquery'), true);
      wp_enqueue_script ('jquery-ui-autocomplete');
   }
}
add_action ('admin_enqueue_scripts', 'rdgm_admin_enqueue_scripts');
function rdgm_options () {
   global $plugin_label;
   if ( !current_user_can( 'manage_options' ) )  {
      wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
   }
   print '<div class="wrap">' . "\n";
   print    '<h2>' . $plugin_label . ' options</h2>' . "\n";
   print    '<form action="options.php" method="post">' . "\n";
                settings_fields ('rdgm_options_group');
                do_settings_sections ('rdgm-options-page');
   print       '<input name="Submit" type="submit" value="Save changes" />' . "\n";
   print    '</form>';
   print '</div>';
}
function rdgm_admin_init () {
   global $plugin_label, $quiz_and_flashcard_deck, $swinging_hotspot_admin_f;
   register_setting ( 'rdgm_options_group', 'rdgm_options', 'rdgm_options_validate' );
   add_settings_section ('rdgm-go_mobile-section', 'Mobile-device full-screen option/icon',
                         'rdgm_go_mobile_text', 'rdgm-options-page');
   add_settings_field ('rdgm-go_mobile-field', 'Show full-screen icon',
                       'rdgm_go_mobile_field_input', 'rdgm-options-page',
                       'rdgm-go_mobile-section');
   add_settings_section ('rdgm-icon_rdgm-section', $plugin_label . ' icon/link',
                         'icon_rdgm_text', 'rdgm-options-page');
   add_settings_field ('rdgm-icon_rdgm-field', 'Display ' . $plugin_label . ' icon/link',
                       'icon_rdgm_field_input', 'rdgm-options-page',
                       'rdgm-icon_rdgm-section');
   $title = 'Customize button labels, etc.';
   add_settings_section ('rdgm-translate_strings-section', $title,
                         'rdgm_translate_strings_text', 'rdgm-options-page');
   $title = 'Select phrase to translate<br /><br />Phrase to translate; translation (semicolon-separated pair each line)';
   add_settings_field ('rdgm-translate_strings-field', $title,
                       'rdgm_translate_strings_field_input', 'rdgm-options-page',
                       'rdgm-translate_strings-section');
   $title =   '<input name="Submit" type="submit" value="Save changes" />'
            . '<br /><br />'
            . 'Disable automatic shortcode error check and dataset question save on Publish/Update';
   add_settings_section ('rdgm-manual_syntax_check-section', $title,
                         'rdgm_manual_syntax_check_text', 'rdgm-options-page');
   add_settings_field ('rdgm-manual_syntax_check-field', 'Manual-only check/save',
                       'rdgm_manual_syntax_check_field_input', 'rdgm-options-page',
                       'rdgm-manual_syntax_check-section');
   add_settings_section ('rdgm-regular_page_error_check-section', 'Check shortcodes for errors on every page/post',
                         'rdgm_regular_page_error_check_text', 'rdgm-options-page');
   add_settings_field ('rdgm-regular_page_error_check-field', 'Do shortcodes error check every page load',
                       'rdgm_regular_page_error_check_field_input', 'rdgm-options-page',
                       'rdgm-regular_page_error_check-section');
   $title = '<input name="Submit" type="submit" value="Save changes" />'
            . '<br /><br />'
            . 'HTML element that contains plugin content (shortcodes, etc.)';
   add_settings_section ('rdgm-content-section', $title,
                         'rdgm_content_text', 'rdgm-options-page');
   add_settings_field ('rdgm-content-field', $plugin_label . '-content<br />HTML element(s)',
                       'rdgm_content_field_input', 'rdgm-options-page',
                       'rdgm-content-section');
}
function rdgm_options_validate ($rdgm_options) {
   global $rdgm_debug;
   $rdgm_options['go_mobile'] = $rdgm_options['go_mobile_select'];
   if ($rdgm_debug[0]) {
      error_log ('[rdgm_options_validate] $rdgm_options[\'go_mobile_select\']: ' . $rdgm_options['go_mobile_select']);
      error_log ('[rdgm_options_validate] $rdgm_options[\'go_mobile\']: '        . $rdgm_options['go_mobile']);
   }
   $new_icon_rdgm = trim ($rdgm_options['icon_rdgm']);
   if (   $new_icon_rdgm != 'Icon and link'
       && $new_icon_rdgm != 'Icon only'
       && $new_icon_rdgm != 'Not displayed') {
      $new_icon_rdgm = 'Icon and link';
   }
   $rdgm_options['icon_rdgm'] = $new_icon_rdgm;
   $rdgm_options['use_dict'] = $rdgm_options['use_dict_select'];
   $rdgm_options['use_terms'] = $rdgm_options['use_terms_select'];
   $rdgm_options['hint_timeout_sec'] = $rdgm_options['hint_timeout_sec_select'];
   $rdgm_options['hangman_hints'] = $rdgm_options['hangman_hints_select'];
   $translate_strings = '';
   if (isset ($rdgm_options['translate_strings'])) {
      $translate_strings = trim ($rdgm_options['translate_strings']);
      $translate_strings = sanitize_textarea_field ($translate_strings);
   }
   $new_translate_strings = array ();
   if ($translate_strings != '') {
      $lines = explode ("\n", $translate_strings);
      $n_lines = count ($lines);
      for ($i=0; $i<$n_lines; $i++) {
         $line = trim ($lines[$i]);
         if ($line == '') {
            continue;
         }
         $strings = explode (';', $line);
         if (count ($strings) != 2) {
            add_settings_error ('rdgm-translate_strings-section', 'rdgm-translate_strings-errmsg1',
                                'Custom labels line' . ($i + 1) . ': didn\'t get two strings separated by semi-colon.');
            $new_translate_strings[] = $line;
         } else {
            $old_string = trim ($strings[0]);
            $new_string = trim ($strings[1]);
            if (strlen ($old_string) == 0 || strlen ($new_string) == 0 ) {
               add_settings_error ('rdgm-translate_strings-section', 'rdgm-translate_strings-errmsg2',
                                   'Custom labels line' . ($i + 1) . ': null string before or after semicolon not allowed.');
               $new_translate_strings[] = $old_string . '; ' . $new_string;
            } else {
               $new_translate_strings[] = $old_string . '; ' . $new_string;
            }
         }
      }
   }
   $rdgm_options['translate_strings'] = implode ("\n", $new_translate_strings);
   if (isset ($rdgm_options['regular_page_error_check'])) {
      $rdgm_options['regular_page_error_check'] = 1;
   } else {
      $rdgm_options['regular_page_error_check'] = '';
   }
   if (isset ($rdgm_options['rdgm_syntax_check_manual_only'])) {
      $rdgm_options['rdgm_syntax_check_manual_only'] = 1;
   } else {
      $rdgm_options['rdgm_syntax_check_manual_only'] = '';
   }
   $new_content = trim ($rdgm_options['content']);
   if ($new_content == '') {
      $new_content = 'article';
      add_settings_error ('rdgm-content-section', 'rdgm-content-errmsg',
                          'All-blank content HTML element(s) not allowed.  Resetting to default...');
   }
   $rdgm_options['content'] = $new_content;
   return $rdgm_options;
}
function rdgm_go_mobile_text () {
   global $quiz_and_flashcard_deck, $quiz_or_flashcard_deck;
   print '<p>';
   print 'An icon at the top left of each ' . $quiz_and_flashcard_deck . ' allows users to ';
   print 'switch to full-screen view.&nbsp; ';
   print 'In addition, on small-screen devices users see a full-screen view of ';
   print 'a ' . $quiz_and_flashcard_deck . ' once they start that ' . $quiz_or_flashcard_deck . '.&nbsp; ';
   print 'You can specify whether the full-screen icon is always shown, shows ';
   print 'only on small screens, or the icon and full-screen view are disabled.';
   print '</p>';
}
function rdgm_go_mobile_field_input () {
   global $rdgm_options, $rdgm_debug;
   $go_mobile = 'true';
   if (isset ($rdgm_options['go_mobile'])) {
      $go_mobile = $rdgm_options['go_mobile'];
      if ($rdgm_debug[0]) {
         error_log ('[rdgm_go_mobile_field_input] $go_mobile: X' . $go_mobile . 'X');
      }
   }
   print '<table border="0">';
   print    '<tr>';
   print       '<td style="padding: 0; width: 120px;">';
   print          '<select id="rdgm_go_mobile_rdgm" name="rdgm_options[go_mobile_select]">' . "\n";
   $selected = $go_mobile == 'Enabled' || $go_mobile == 'Always' ? 'selected' : '';
   print             "<option $selected>";
   print                "Always";
   print             "</option>\n";
   $selected = $go_mobile == 'Small screens only' ? 'selected' : '';
   print             "<option $selected>";
   print                "Small screens only";
   print             "</option>\n";
   $selected = $go_mobile == 'Disabled' ? 'selected' : '';
   print             "<option $selected>";
   print                "Disabled";
   print             "</option>\n";
   print          "</select>\n";
   print       '</td>';
   print       '<td style="padding: 0; font-size: 13px;">';
   print          'When the switch-to-full-screen icon is shown, or full-screen view is disabled.';
   print       '</td>';
   print    '</tr>';
   print '</table>';
}
function icon_rdgm_text () {
   global $plugin_label, $quiz_or_flashcard_deck, $plugin_url;
   print '<p>';
   print 'The ' . $plugin_label . ' icon appears on the first or introductory card/page ';
   print 'of a ' . $quiz_or_flashcard_deck . '.  It provides a link to the ' . $plugin_label . ' ';
   print 'email, support@' . $plugin_url . '.';
   print '</p>';
}
function icon_rdgm_field_input () {
   global $rdgm_debug, $rdgm_options;
   if ($rdgm_debug[0]) {
      error_log ('[icon_rdgm_field_input] $rdgm_options: ' . print_r ($rdgm_options, true));
   }
   $icon_rdgm = '';
   if (isset ($rdgm_options['icon_rdgm'])) {
      $icon_rdgm = $rdgm_options['icon_rdgm'];
   }
   if ($icon_rdgm == '') {
      $icon_rdgm = 'Icon and link';
   }
   print '<select id="rdgm_rdgm_icon_rdgm" name="rdgm_options[icon_rdgm]">' . "\n";
   $select_options = array ('Icon and link', 'Icon only', 'Not displayed');
   $n_select_options = count ($select_options);
   for ($i_opt=0; $i_opt<$n_select_options; $i_opt++) {
      $value = $select_options[$i_opt];
      $selected = $icon_rdgm == $value ? 'selected' : '';
      print    '<option value = "' . $value . '" ' . $selected . ">\n";
      print       $value;
      print    "</option>\n";
   }
   print "</select>\n";
}
function rdgm_translate_strings_text () {
   global $plugin_label, $swinging_hotspot_admin_f;
   print '<p>';
   print 'You can change the labels that are currently displayed on buttons or ';
   print 'in headers (or just about anywhere else for that matter).';
   print 'Enter the current phrase you want to change, followed by a ';
   print 'semicolon, and then the replacement phrase. ';
   print 'Enter each such translation on a separate line. ';
   print '</p>';
   print '<p>';
   print 'Note: the &ldquo;phrase to translate&rdquo; must be entered in its entirety, ';
   print 'exactly as it currently appears.  Thus, &ldquo;Correct!&rdquo; must be entered ';
   print 'with the uppercase C and the exclamation point. ';
   print '</p>';
   print '<p>';
      print 'Example: to replace the feedback, ';
      print '&ldquo;You identified all of the items on the first try!&rdquo; ';
      print 'with &ldquo;Great, you got them all!&rdquo;, enter<br />';
      print '&emsp;&emsp; You identified all of the items on the first try!; Great, you got them all!';
   print '</p>';
}
function rdgm_translate_strings_field_input () {
   global $rdgm_options;
   $translate_strings = '';
   if (isset ($rdgm_options['translate_strings'])) {
      $translate_strings = sanitize_textarea_field ($rdgm_options['translate_strings']);
   }
   print '<style type="text/css">';
   print    '.rdgm_tstrings_suggestions {';
   print       'max-height:   200px;';
   print       'overflow-y:   scroll;';
   print    '}';
   print '</style>';
   print '<input id="t_strings_select" style="width: 40rem;" onfocus="jQuery (this).autocomplete (\'search\', \'\')" placeholder="Type three or more letters" />&nbsp; ';
   print '<label>';
   print    '<input type="checkbox" onclick="set_tstrings_to_show (this)" />';
   print 'Show all phrases';
   print '</label>';
   print '<br />';
   print '<br />';
   print '<textarea id="rdgm_translate_strings" ';
   print '          name="rdgm_options[translate_strings]" ';
   print '          wrap="off" ';
   print '          style="width: 40rem; height: 5rem;">';
   print esc_textarea ($translate_strings);
   print '</textarea>';
}
function rdgm_regular_page_error_check_text () {
   global $plugin_label, $quiz_and_flashcard_deck;
   print '<p>';
   print 'You can have ' . $plugin_label . ' perform error checks of ' . $quiz_and_flashcard_deck . ' shortcodes ';
   print 'on every page load, which may be useful if you have had to disable shortcode error checks ';
   print 'on Update/Publish in the WordPress editor, or if there is an error particular to a page&rsquo;s published content.&nbsp; ';
   print '</p>';
}
function rdgm_regular_page_error_check_field_input () {
   global $rdgm_options;
   if (isset ($rdgm_options['regular_page_error_check'])) {
      $regular_page_error_check = $rdgm_options['regular_page_error_check'];
   } else {
      $regular_page_error_check = 0;
   }
   $checked = $regular_page_error_check == 1 ? 'checked' : '';
   print '<input id="regular_page_error_check" name="rdgm_options[regular_page_error_check]" '
      .      'type="checkbox" ' . $checked . ' /> ';
   print 'Check this box to perform shortcode error checks on each page load' . "\n";
}
function rdgm_manual_syntax_check_text () {
   global $plugin_label;
   print '<p>';
   print 'Normally ' . $plugin_label . ' automatically checks for errors and saves dataset ';
   print 'questions when you click &ldquo;Publish&rdquo; or &ldquo;Update&rdquo; ';
   print 'in the WordPress editor.&nbsp; ';
   print 'Sometimes, however, this interferes with the Update/Publish function.&nbsp; ';
   print 'You can disable the automatic-check feature here.&nbsp; ';
   print 'A manual option to check shortcodes and save dataset questions will be ';
   print 'available in the ' . $plugin_label . ' editing menu pop-up.';
   print '</p>';
}
function rdgm_manual_syntax_check_field_input () {
   global $rdgm_options;
   if (isset ($rdgm_options['rdgm_syntax_check_manual_only'])) {
      $rdgm_syntax_check_manual_only = $rdgm_options['rdgm_syntax_check_manual_only'];
   } else {
      $rdgm_syntax_check_manual_only = 0;
   }
   $checked = $rdgm_syntax_check_manual_only == 1 ? 'checked' : '';
   print '<input id="rdgm_manual_syntax_check" name="rdgm_options[rdgm_syntax_check_manual_only]" '
      .      'type="checkbox" ' . $checked . ' /> ';
   print 'Check this box to disable the automatic shortcode error check / dataset save' . "\n";
}
function rdgm_content_text () {
   global $plugin_label, $quiz_and_flashcard_deck, $quizzes_or_flashcard_decks;
   print '<p>';
   print 'The ' . $plugin_label . ' "content" HTML element identifies the "container" for ';
   print $quiz_and_flashcard_deck . ' shortcodes, etc.  In WordPress, this is where ';
   print 'page and post content appears.  The default setting is the html tag ';
   print '"article".  There may be special circumstances (themes) that require ';
   print 'additional specifications ("div.entry-summary", say).  ';
   print 'This option lets you change or add to the default setting.';
   print '</p>';
   print '<p>';
   print 'Note: pages that include excerpts from several pages or posts ';
   print '(including the results of a search) include multiple such HTML ';
   print 'elements, which may contain incomplete ' . $quizzes_or_flashcard_decks . '. ';
   print 'The ' . $plugin_label . ' plugin handles this, but will be confused if it thinks ';
   print 'the excerpts are all part of the same page or post. ';
   print 'So don\'t define "body" to be the ' . $plugin_label . '-content HTML element!';
   print '</p>';
   print '<p>';
   print 'HTML elements are entered CSS-fashion, comma-separated, such as div.class, div#id. Examples:<br />';
   print '&emsp;&emsp; div#special-container &emsp; - div element with id="special-container"<br />';
   print '&emsp;&emsp; span.content-span &emsp; - span element with class="content-span"';
   print '</p>';
}
function rdgm_content_field_input () {
   global $rdgm_options;
   $content = '';
   if (isset ($rdgm_options['content'])) {
      $content = sanitize_text_field ($rdgm_options['content']);
   }
   if ($content == '') {
      $content = 'article';
   }
   print '<input id="rdgm_content" name="rdgm_options[content]" type="text" '
         . 'style="width: 30rem;" value="' . esc_textarea ($content) . '" />' . "\n";
}
function rdgm_start_session () {
   if (! session_id ()) {
      session_start ();
   }
}
function rdgm_end_session () {
   session_destroy ();
}
add_action ('admin_menu', 'rdgm_admin');
add_action ('admin_init', 'rdgm_admin_init');
