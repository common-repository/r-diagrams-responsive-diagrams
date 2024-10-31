rwizard = {};
var rwizard_f = function () {
var $ = jQuery;
var qw = this;
var qwname = 'rwizard';
var qqc;
var rdgm_ajaxurl = 'not ready';
this.questions_cards = [];
this.questions_cards_dataset_b = false;
this.errmsgs = '';
this.unit_names  = [];
this.topic_names = [];
this.no_remove_placeholder_f = false;
this.$rdgm_edit_canvas;
this.hangman_i_choice = 0;
this.qcard_n_parts    = 2;
var debug = [];
debug[0]  = false;     // General.
debug[1]  = false;     // Existing quiz/deck data.
debug[2]  = false;     // Questions list ("Go to...").
var rdgm_deck;
var rdgm_qdeck;
var start_modal_first_call_f = true;
var $dialog_rwizard;
var $dialog_rwizard_media_upload;
var rwizard_upload_media_file_callback_routine;
var add_media_user_html_f;
var allowed_media = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg'];
var rdgm_edit_plugin_url;
var inline_ed_plugins;
var inline_ed_external_plugins;
var inline_ed_toolbar1;
var inline_ed_toolbar2;
var inline_ed_toolbar3;
var wp_editing_page_f      = false;
var rwizard_add_media_frame;
var current_editor = '';
var shortcode_ed = '';
var prevent_editor_blur_event_b = false;
var disable_add_media_timeout;
var new_rdgm_deck_f = false;
var rwizard_page    = '';
var page_title      = '';
var delay_go_to_question_i_question = 0;
var i_current_answer_choice;
var OPTIONS_ACCORDION   = 0;
var INTRO_ACCORDION     = 2;
var QUESTIONS_ACCORDION = 3;
var options_accordion_f = false;
var header_placeholder =   '<span class="rwizard_placeholder">'
                         +    'Header <span class="rwizard_smaller">select text to format</span>'
                         + '</span>&hairsp;';
var intro_placeholder  =   '<span class="rwizard_placeholder">'
                         +    'Introduction'
                         +    '<br />'
                         +    '<span class="rwizard_smaller">'
                         +       '(enter text or &ldquo;Add Media&rdquo;; select text to format)'
                         +    '</span>'
                         +    '<br />'
                         + '</span>&ensp;';
var show_me_button_placeholder
                       =  '<span class="rdgm_show_me" style="color: #ffffff; background: none;">'
                         +    'Show me the answer'
                         + '</span>&hairsp;';
var hangman_question_feedback_placeholder
                       =   '<span class="rwizard_placeholder">'
                         +    'Feedback for hangman word(s)'
                         +    '<br />'
                         +    '<span class="rwizard_smaller">'
                         +       '(or leave blank for default)'
                         +    '</span>'
                         + '</span>&hairsp;';
var hangman_card_feedback_placeholder
                       =   '<span class="rwizard_placeholder">'
                         +    'Feedback for hangman word(s)'
                         + '</span>&hairsp;';
var exit_placeholder =     '<span class="rwizard_placeholder">'
                         +    'Exit text'
                         +    '<br />'
                         +    '<span class="rwizard_smaller">'
                         +       '(enter text or &ldquo;Add Media&rdquo;; select text to format)'
                         +    '</span>'
                         + '</span>&hairsp;';
var bstyles = ['dotted', 'dashed', 'solid'];
var bcolors = ['red', 'magenta', 'blue', 'aqua', 'black', 'silver'];
var n_bstyles = bstyles.length;
var n_bcolors = bcolors.length;
var i_rdgm          = 0;
var n_questions     = 0;
var i_question      = -1;
var header_text     = '';
var intro_text      = '';
var exit_text       = '';
var i_insert_before = -1;
var rdgm_deck_attributes = '';
var default_unit = '';
var browse_window;
var browse_records_shown             = 25;
var browse_search_words_array        = [''];
var browse_search_question_card_type = '';
var browse_search_unit_topic         = '';
var browse_scrollY                   = 0;
var rwizard_php_f                    = 0;
var waiting_for_hangman_click = false;
var hide_progress_b;
this.init_rwizard = function (wp_tinymce_ed) {
   if (debug[0]) {
      console.log ('[init_rwizard] wp_tinymce_ed:', wp_tinymce_ed);
   }
   qqc = rdgm_utils;
   if (wp_tinymce_ed) {
      inline_ed_plugins          = wp_tinymce_ed.settings.plugins;
      inline_ed_external_plugins = wp_tinymce_ed.settings.external_plugins;
      inline_ed_external_plugins.bubbleBar = rdgm_edit_plugin_url + 'tinymceBubbleBar.js';
      if (wp_tinymce_ed.settings.toolbar) {
         inline_ed_toolbar1         = wp_tinymce_ed.settings.toolbar1.replace ('button_q,', '');
         inline_ed_toolbar2         = wp_tinymce_ed.settings.toolbar2 + ' qw_rm_br';
         inline_ed_toolbar3         = wp_tinymce_ed.settings.toolbar3;
         var all = ',' + inline_ed_toolbar1 + ',' + inline_ed_toolbar2 + ',' + inline_ed_toolbar3 + ',';
         if (all.indexOf (',code,') == -1) {
            inline_ed_toolbar2 += ',code';
            inline_ed_external_plugins.code = rdgm_edit_plugin_url + 'code/plugin.min.js';
         }
      } else {
         qw.user_page_tinymce_options ();
      }
      wp_editing_page_f = true;
      rdgm_edit.wp_editing_page_f = true;
   } else {
      qw.user_page_tinymce_options ();
      rdgm_edit.wp_editing_page_f = false;
   }
   if (debug[0]) {
      console.log ('[init_rwizard] wp_tinymce_ed:', wp_tinymce_ed);
      console.log ('[init_rwizard] inline_ed_plugins:', inline_ed_plugins);
      console.log ('[init_rwizard] inline_ed_external_plugins:', inline_ed_external_plugins);
      console.log ('[init_rwizard] inline_ed_toolbar1:', inline_ed_toolbar1);
      console.log ('[init_rwizard] inline_ed_toolbar2:', inline_ed_toolbar2);
      console.log ('[init_rwizard] inline_ed_toolbar3:', inline_ed_toolbar3);
   }
   rwizard_html ();
   quiz_components_html ();
   new_question_type_menu_html ();
   $ ('.rwizard_floating_menu').each (function () {
      $ (this).draggable ({handle:     $ (this).find ('.rwizard_floating_menu_header')[0]
                          });
   });
   accordion_panel_init ();
};
this.set_rdgm_edit_plugin_url = function () {
   qqc = rdgm_utils;
   if (typeof (rdgm_edit_params) != 'undefined') {
      rdgm_edit_plugin_url = rdgm_edit_params.url;
      if (debug[0]) {
         console.log ('[set_rdgm_edit_plugin_url] rdgm_edit_params.url:', rdgm_edit_params.url);
      }
   } else {
      rdgm_edit_plugin_url = qqc.get_rdgm_param ('url', './');
      if (debug[0]) {
         console.log ('[set_rdgm_edit_plugin_url > qqc.get_rdgm_param] rdgm_edit_plugin_url:', rdgm_edit_plugin_url);
      }
   }
}
this.user_page_tinymce_options = function () {
   inline_ed_plugins          = 'charmap colorpicker lists textcolor';
   inline_ed_external_plugins = { bubbleBar: rdgm_edit_plugin_url + 'tinymceBubbleBar.js',
                                  code:      rdgm_edit_plugin_url + 'code/plugin.min.js',
                                  link:      rdgm_edit_plugin_url + 'link/plugin.min.js',
                                  table:     rdgm_edit_plugin_url + 'table/plugin.min.js'};
   inline_ed_toolbar1         = 'bold italic bullist numlist alignleft aligncenter alignright link table bubbleBarOptionsButton';
   inline_ed_toolbar2         = 'formatselect qw_rm_br fontselect fontsizeselect outdent indent';
   inline_ed_toolbar3         = 'forecolor backcolor subscript superscript removeformat code charmap';
}
function accordion_panel_init () {
   $ ('div.rwizard_accordion').accordion ({collapsible: true,
                                           active:      QUESTIONS_ACCORDION,
                                           activate:    accordion_panel_open,
                                           heightStyle: 'content'
                                          });
   $ ('#border_color').simpleColor ({boxWidth:  '50px',
                                     boxHeight: '17px',
                                     onSelect:  border_color_selected});
   $ ('div.simpleColorDisplay').attr ('title', 'Click to select color');
}
function accordion_panel_open (e, ui) {
   var new_id = ui.newHeader.attr ('id');
   if (debug[0]) {
      console.log ('[accordion_panel_open] ui.newHeader:', ui.newHeader);
      console.log ('[accordion_panel_open] ui.newPanel:', ui.newPanel);
      console.log ('[accordion_panel_open] new_id:', new_id);
   }
   if (typeof new_id == 'undefined') {
      i_question = -1;
   }
   if (new_id == 'quiz_questions') {
      if (n_questions == 1) {
         qw.go_to_question (0);
      }
   }
   if (new_id != 'quiz_options') {
      rdgm_edit.rdgm_exit_register_qqs ();
   }
   if (! (new_id == 'quiz_questions' || new_id == 'quiz_options' || new_id == 'quiz_header')) {
      qw.hide_editing_menus ();
   }
   if (new_id == 'quiz_introduction') {
      var checked_b = $ ('input[name="rdgm_intro_yes_no"]').first ().prop ('checked');
      if (debug[0]) {
         console.log ('[accordion_panel_open] checked_b:', checked_b);
      }
      if (checked_b) {
         qw.hide_editing_menus ();
         if (rdgm_deck == 'rdgm') {
            qw.go_to_question (-1, true);
         } else {
            qw.go_to_card (-1, true);
         }
      }
   } else if (new_id == 'quiz_exit_text') {
      qw.hide_editing_menus ();
      qw.highlight_accordion_question (-1);
      if (rdgm_deck == 'rdgm') {
         $ ('div.intro-rdgm' + i_rdgm).hide ();
         $ ('#rwizard_result div.rdgmq').hide ();
         $ ('#rwizard_result #progress-rdgm' + i_rdgm).hide ();
         $ ('#next_button-rdgm' + i_rdgm).hide ();
         if (! rdgm_.get_rdgmdata (i_rdgm, 'hide_forward_back_b')) {
            $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible'});
            $ ('span.question-number-rdgm' + i_rdgm).html ('--');
         }
         rdgm_.display_summary_and_exit (i_rdgm);
         qqc.select_placeholder ($ ('#rdgm_exit-rdgm' + i_rdgm));
      } else {
         if (! qcard_.get_deckdata (i_rdgm, 'hide_forward_back_b')) {
            $ ('.bbfe-qdeck' + i_rdgm).css ({visibility: 'visible'});
            $ ('span.card-number-qdeck' + i_rdgm).html ('--');
         }
         qcard_.done (i_rdgm);
         qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_rdgm));
      }
      i_question = n_questions;
   }
}
this.rdgm_header_yes_no = function (header_f) {
   var header_div_selector = '.header-rdgm' + i_rdgm;
   var $header_div = $ (header_div_selector);
   if (header_f) {
      var header_wo_tags = header_text.replace (/<[^>]+>/gm, '');
      if (header_wo_tags.search (/\S/) == -1 || header_wo_tags == 'NA') {
         $header_div.html (header_placeholder);
      }
      $header_div.show ();
      qw.init_tinymce (header_div_selector);
      qqc.select_placeholder ($header_div);
   } else {
      $header_div.hide ();
      $header_div.html (header_placeholder);
      qw.init_remove_placeholder (header_div_selector);
   }
};
this.deck_header_yes_no = function (header_f) {
   var header_div_selector = '#qcard_header-qdeck' + i_rdgm;
   var $header_div = $ (header_div_selector);
   if (header_f) {
      var header_wo_tags = header_text.replace (/<[^>]+>/gm, '');
      if (header_wo_tags.search (/\S/) == -1) {
         $header_div.html (header_placeholder);
      }
      $header_div.show ();
      qqc.select_placeholder ($header_div);
   } else {
      $header_div.hide ();
      header_text = '';
   }
}
this.recording_dataset_options = function (qq_dataset) {
   if (qq_dataset == 'dataset' && rwizard_php_f) {
      var quiz_deck = rdgm_deck == 'rdgm' ? 'quiz' : 'flashcard_deck';
      alert ('Please publish this ' + quiz_deck + ' before saving as a dataset');
      return;
   }
   const $modal_dialog_rwizard = $ ('div.modal_dialog_rwizard');
   $modal_dialog_rwizard.hide ();
   if (debug[0]) {
      console.log ('[recording_dataset_options] $modal_dialog_rwizard:', $modal_dialog_rwizard);
   }
   rdgm_edit.init_rdgm_edit_params ();
   rdgm_edit.$edit_area = $ ('#rwizard_result');
   rdgm_edit.create_rdgm_register_qqs_dialog_box ('#rwizard_result');
   $ ('div#rdgm_register_qqs_return_to_wizard').show ();
   rdgm_edit.rdgm_deck_attributes = rdgm_deck_attributes;
   rdgm_edit.rdgm_deck = rdgm_deck;
   rdgm_edit.rdgm_register_qqs (qq_dataset, true);
}
this.set_page_title = function (input_el) {
   if (debug[0]) {
      console.log ('[set_page_title] input_el:', input_el);
   }
   var title = input_el.value;
   if (title == '') {
      title = 'Swinging Hotspot';
   }
   update_user_page ('page_title', title, 'user');
   document.title = title;
   $ ('#page_title').html (title);
}
this.questions_cards_to_show = function (input_el, question_card) {
   var value;
   if (! /\S/.test (input_el.value)) {
      n_to_show = 'rm';
      var random;
      if (rdgm_deck == 'rdgm') {
         random = rdgm_.get_rdgmdata (i_rdgm, 'attr_random_b');
      } else {
         random = qcard_.get_deckdata (i_rdgm, 'attr_random_b');
      }
      $ ('input[name="rdgm_random"]').removeAttr ('disabled');
      $ ('tr.rdgm_random').css ({color: ''});
      if (random) {
         $ ('input.random_true')[0].checked = true;
         random = 'true';
      } else {
         $ ('input.random_false')[0].checked = true;
         random = 'rm';
      }
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'random', random);
   } else {
      n_to_show = parseInt (input_el.value);
      if (! qqc.isInteger (n_to_show)) {
         alert ('Please enter a number');
         input_el.focus ();
         return;
      }
      $ ('input.random_true')[0].checked = true;
      $ ('input[name="rdgm_random"]').attr ('disabled', true);
      $ ('tr.rdgm_random').css ({color: 'gray'});
   }
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, question_card + 's_to_show', n_to_show);
   var n_qs;
   if (n_to_show == 'rm') {
      n_qs = n_questions;
   } else {
      n_qs = Math.min (n_to_show, n_questions);
   }
   if (rdgm_deck == 'rdgm') {
      rdgm_.set_rdgmdata (i_rdgm, 'n_questions_for_done', n_qs);
      rdgm_.display_progress (i_rdgm);
   } else {
      qcard_.set_deckdata (i_rdgm, 'n_cards_for_done', n_qs);
      qcard_.set_deckdata (i_rdgm, 'n_to_go', n_qs);
      qcard_.display_progress (i_rdgm);
   }
   if (debug[0]) {
      console.log ('[questions_cards_to_show] rdgm_deck_attributes:', rdgm_deck_attributes);
   }
}
this.rdgm_random = function (true_false) {
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'random', true_false);
}
this.rdgm_repeat = function (true_false) {
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'repeat_incorrect', true_false);
}
this.card_back_options = function (value) {
   var $qcard_card_back = $ ('div.qcard_card-qdeck' + i_rdgm + ' div.qcard-back');
   if (value == 'none') {
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_back', 'none');
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_back_image', 'rm');
      set_rdgm_deck_styles ('background', 'none', $qcard_card_back);
      qcard_.set_deckdata (i_rdgm, 'default_card_back_background', 'none');
   } else if (value == 'ruled lines') {
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_back', 'rm');
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_back_image', 'rm');
      set_rdgm_deck_styles ('background', qcard_.ruled_lines, $qcard_card_back);
      qcard_.set_deckdata (i_rdgm, 'default_card_back_background', '');
   }
}
this.align_options = function (left_center_right_tiled) {
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'align', left_center_right_tiled);
   var $rdgm_deck;
   if (rdgm_deck == 'rdgm') {
      $rdgm_deck = $ ('#rdgm' + i_rdgm);
   } else {
      $rdgm_deck = $ ('#qcard_window-qdeck' + i_rdgm);
      var qcard_width = $rdgm_deck.find ('div.qcard-front').outerWidth ();
      $rdgm_deck.width (qcard_width);
   }
   if (left_center_right_tiled == 'left') {
      $rdgm_deck.css ({'margin':       ''});
   } else if (left_center_right_tiled == 'center') {
      $rdgm_deck.css ({'margin':       'auto'});
   } else if (left_center_right_tiled == 'right') {
      $rdgm_deck.css ({'margin':       '',
                       'margin-left':  'auto'});
   } else if (left_center_right_tiled == 'tiled') {
      $rdgm_deck.css ({'margin':       '',
                       'float':        'left'});
   }
}
this.bck_fwd_options = function (yes_no) {
   var true_false = yes_no ? 'false' : 'true';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'hide_forward_back', true_false);
   var $bbfe = $ ('.bbfe-' + rdgm_qdeck + i_rdgm);
   var visible_hidden = yes_no ? 'visible' : 'hidden';
   $bbfe.css ({visibility : visible_hidden});
   var question_card = rdgm_deck == 'rdgm' ? 'question' : 'card';
   var $question_card_number = $ ('.' + question_card + '-number-' + rdgm_qdeck + i_rdgm);
   $question_card_number.css ({visibility: visible_hidden});
}
this.progress_options = function (yes_no) {
   var true_false = yes_no ? 'false' : 'true';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'hide_progress', true_false);
   var $progress;
   if (rdgm_deck == 'rdgm') {
      $progress = $ ('div#progress-rdgm' + i_rdgm);
      rdgm_.set_rdgmdata (i_rdgm, 'hide_progress_b', ! yes_no);
   } else {
      $progress = $ ('div#qcard_progress-qdeck' + i_rdgm + ' span.progress_text');
      qcard_.set_deckdata (i_rdgm, 'hide_progress_b', ! yes_no);
   }
   if (yes_no) {
      $progress.show ();
      if (rdgm_edit.swhs_button_b) {
         const n_hotspots = $hotspot_image_stack.find ('div.rdgm_hotspot_label').length;
         rdgm_.display_diagram_progress (i_rdgm, 'Visited', n_hotspots);
      }
   } else {
      $progress.hide ();
   }
}
this.rdgm_deck_timer = function (limit_elapsed_none) {
   var $rdgm_timer;
   if (rdgm_deck == 'rdgm') {
      $rdgm_timer = $ ('span#rdgm'  + i_rdgm + '-timer');
   } else {
      $rdgm_timer = $ ('span#qdeck' + i_rdgm + '-timer');
   }
   if (limit_elapsed_none == 'elapsed') {
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'quiz_timer', 'true');
      if (rdgm_deck == 'rdgm') {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'question_time_limit', 'rm');
      } else {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_time_limit', 'rm');
      }
      $rdgm_timer.css ({display: 'inline-block'}).html ('0:00');
   } else if (limit_elapsed_none == 'limit') {
      var time_limit_sec = parseInt ($ ('input#question_card_time_limit_sec').val ());
      if (! time_limit_sec) {
         time_limit_sec = 30;
         $ ('input#question_card_time_limit_sec').val (30);
      }
      if (rdgm_deck == 'rdgm') {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'question_time_limit', time_limit_sec);
      } else {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_time_limit', time_limit_sec);
      }
      rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'quiz_timer', 'rm');
      $rdgm_timer.css ({display: 'inline-block'}).html (qqc.hhmmss_from_sec (time_limit_sec));
   } else {
      if (rdgm_deck == 'rdgm') {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'quiz_timer', 'rm');
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'question_time_limit', 'rm');
      } else {
         rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'card_time_limit', 'rm');
      }
      $rdgm_timer.hide ();
      $ ('input#question_card_time_limit_sec').val ('');
   }
}
this.question_card_time_limit_change = function () {
   $ ('input.rdgm_deck_timer_limit')[0].checked = true;
   qw.rdgm_deck_timer ('limit');
}
this.flip_options = function (yes_no) {
   var true_false = yes_no ? 'false' : 'true';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'hide_flip', true_false);
   var next_card_need_more_practice = yes_no ? 'Need more practice' : 'Next card';
   $ ('button.next_card-qdeck' + i_rdgm).html (qqc.T (next_card_need_more_practice));
   qcard_.set_deckdata (i_rdgm, 'hide_flip_b', ! yes_no);
   if (yes_no) {
      $ ('button.flip-qdeck' + i_rdgm).addClass ('rdgm_button').removeClass ('rwizard_gray').html ('Flip');
   } else {
      $ ('button.flip-qdeck' + i_rdgm).removeClass ('rdgm_button').addClass ('rwizard_gray').html ('Flip (click disabled)');
   }
}
this.gotit_options = function (yes_no) {
   var true_false = yes_no ? 'false' : 'true';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'hide_gotit', true_false);
   var next_card_need_more_practice = yes_no ? 'Need more practice' : 'Next card';
   $ ('button.next_card-qdeck' + i_rdgm).html (qqc.T (next_card_need_more_practice));
   qcard_.set_deckdata (i_rdgm, 'hide_gotit_b', ! yes_no);
   var none_inline_block = yes_no ? 'inline-block' : 'none';
   $ ('button.got_it-qdeck' + i_rdgm).css ({display: none_inline_block});
   var need_more_practice_next_card = yes_no ? 'Need more practice' : 'Next card';
   $ ('button.next_card-qdeck' + i_rdgm).html (need_more_practice_next_card);
}
this.shuffle_options = function (yes_no) {
   var true_false = yes_no ? 'false' : 'true';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'hide_shuffle', true_false);
   var next_card_need_more_practice = yes_no ? 'Need more practice' : 'Next card';
   $ ('button.next_card-qdeck' + i_rdgm).html (qqc.T (next_card_need_more_practice));
   qcard_.set_deckdata (i_rdgm, 'hide_shuffle_b', ! yes_no);
   var none_inline_block = yes_no ? 'inline-block' : 'none';
   $ ('button.shuffle-qdeck' + i_rdgm).css ({display: none_inline_block});
}
this.flipdir_options = function (left_right_up_down_random) {
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'flip_direction', left_right_up_down_random);
   var axis = '';
   if (left_right_up_down_random == 'left_right') {
      axis = 'y';
   } else if (left_right_up_down_random == 'up_down') {
      axis = 'x';
   }
   qcard_.set_deckdata (i_rdgm, 'flip_axis', axis);
}
this.bold_text_options = function (yes_no) {
   var true_false = yes_no ? 'true' : 'false';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'bold_text', true_false);
   const $qcard_content = $ ('div.qcard_card-qdeck' + i_rdgm + ' div.qcard_content');
   if (yes_no) {
      $qcard_content.removeClass ('qcard_content-normal');
   } else {
      $qcard_content.addClass ('qcard_content-normal');
   }
}
this.set_spacing = function (spacing) {
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'spacing', spacing);
}
this.set_expand_scroll = function (expand_scroll) {
   expand_scroll = expand_scroll == 'scroll';
   rdgm_deck_attributes = add_update_attributes (rdgm_deck_attributes, 'scroll', expand_scroll);
   if (rdgm_deck == 'rdgm') {
   } else {
      qcard_.set_deckdata (i_rdgm, 'scroll_b', expand_scroll);
      redraw_rdgm_deck (i_question);
      options_accordion_f = true;
      setTimeout ('options_accordion_f = false', 500);
   }
}
function border_color_selected (hex) {
   if (debug[0]) {
      console.log ('[border_color_selected] hex:', hex);
   }
   var value = '#' + hex;
   rdgm_deck_attributes = update_add_style (rdgm_deck_attributes,
                                            'border-color', value);
   set_rdgm_deck_styles ('border-color', value);
}
this.rdgm_deck_style = function (property, value) {
   if (property == 'width' || property == 'min-height') {
      var ipx = parseInt (value);
      if (isNaN (ipx)) {
         alert ('Please enter a number');
         return;
      }
      value = value + 'px';
   }
   rdgm_deck_attributes = update_add_style (rdgm_deck_attributes, property, value);
   set_rdgm_deck_styles (property, value);
   if (property == 'width') {
      set_rdgm_deck_styles ('min-width', value);
   }
}
function set_rdgm_deck_styles (property, value, $element) {
   if (! $element) {
      if (rdgm_deck == 'rdgm') {
         $element = $ ('#rdgm' + i_rdgm);
      } else {
         if (property == 'width' || property == 'min-height') {
            $element = $ ('div#qcard_window-qdeck' + i_rdgm + ' div.qcard-front-back');
            if (property == 'width') {
               qcard_.set_deckdata (i_rdgm, 'card_width_setting', value);
            } else {
               qcard_.set_deckdata (i_rdgm, 'card_height_setting', value);
            }
            qcard_.set_container_width_height (i_rdgm);
         } else {
            $element = $ ('div.qcard_card-qdeck' + i_rdgm + ' div.qcard-front-back');
         }
      }
   }
   var styles = $element.attr ('style');
   if (typeof (styles) == 'undefined') {
      styles = 'style="' + property + ': ' + value + ' !important;"';
   } else {
      styles = 'style="' + styles + '"';
      styles = update_add_style (styles, property, value);
   }
   var len = styles.length;
   $element.attr ('style', styles.substring (7, len-1));
}
function update_add_style (attributes, property, value) {
   var m = attributes.match (/style\s*=\s*"([^"]*)/);
   var new_property_and_value = ' ' + property + ': ' + value + ' !important;';
   if (m) {
      var styles = m[1];
      var re = new RegExp ('\\s*' + property + '\\s*:\\s*([^\\s;]+(\\s*!important)*)\\s*;*');
      var property_and_value_m = styles.match (re);
      if (property_and_value_m) {
         attributes = attributes.replace (re, new_property_and_value + ' ');
      } else {
         attributes = attributes.replace (styles, styles + new_property_and_value);
      }
   } else {
      attributes += ' style="' + new_property_and_value.substr (1) + '"';
   }
   if (debug[0]) {
      console.log ('[update_add_style] attributes:', attributes);
   }
   return attributes;
}
this.rdgm_intro_yes_no = function (intro_f) {
   var intro_div_selector = 'div.intro-rdgm' + i_rdgm;
   var $intro_div = $ (intro_div_selector);
   if (intro_f) {
      rdgm_.no_intro_b[i_rdgm] = false;
      qw.go_to_question (-1, true);
   } else {
      rdgm_.no_intro_b[i_rdgm] = true;
      intro_text = '';
      $intro_div.hide ();
      $intro_div.html (intro_placeholder);
      qw.init_remove_placeholder (intro_div_selector);
      $ ('#rwizard_result div.rdgmq').hide ();
      $ ('#rwizard_result #summary-rdgm' + i_rdgm).hide ();
      rdgm_.set_rdgmdata (i_rdgm, 'i_question', -1);
      rdgm_.next_question (i_rdgm, true, true);
   }
};
this.deck_intro_yes_no = function (intro_f) {
   if (intro_f) {
      qcard_.no_intro_b[i_rdgm] = false;
      if (intro_text == '') {
         intro_text =   intro_placeholder
                      + '[start] &emsp;';
      }
      qw.go_to_card (-1, true);
   } else {
      qcard_.no_intro_b[i_rdgm] = true;
      intro_text = '';
      qw.go_to_card (0);
   }
}
this.quiz_restart_yes_no = function (restart_button_f) {
   var exit_html;
   if (restart_button_f) {
      if (exit_text.indexOf ('[restart') == -1) {
         exit_html = exit_text + restart_quiz_button_html () + ' &nbsp; &nbsp;';
         exit_text = exit_text + '[restart]';
      }
   } else {
      exit_text = exit_text.replace (/\[restart[^\]]*\]/, '');
      exit_text = exit_text.replace (/<button[^]*?<\/button>/g, '');
      exit_html = exit_text;
   }
   $ ('#rdgm_exit-rdgm' + i_rdgm).html (exit_html);
};
this.deck_restart_yes_no = function (restart_button_f) {
   if (restart_button_f) {
      if (exit_text.indexOf ('[restart') == -1) {
         exit_text += '<br />[restart]';
         $ ('#qcard_front-input1-qdeck' + i_rdgm).html (restart_deck_button_html ());
      }
   } else {
      exit_text = exit_text.replace (/\[restart[^\]]*\]/, '');
      $ ('#qcard_front-input1-qdeck' + i_rdgm).html ('');
   }
};
function show_intro ($intro_div, no_intro_b) {
   var intro_wo_tags = intro_text.replace (/<[^>]+>/gm, '');
   if (intro_wo_tags.search (/\S/) == -1) {
      $intro_div.html (intro_placeholder);
      if (! $intro_div.attr ('contenteditable')) {
         qw.init_tinymce ('div.intro-rdgm' + i_rdgm);
      }
   }
   rdgm_.set_rdgmdata (i_rdgm, 'i_question', -1);
   i_question = -1;
   qw.highlight_accordion_question (-1);
   qw.hide_editing_menus ();
   $ ('#rwizard_result div.rdgmq').hide ();
   $ ('#rwizard_result #summary-rdgm' + i_rdgm).hide ();
   $ ('#next_button-rdgm' + i_rdgm).css ('text-align', 'center').show ();
   $ ('#next_button_text-rdgm' + i_rdgm).html ('Start');
   $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'hidden'});
   $ ('span.question-number-rdgm' + i_rdgm).html ('');
   $ ('#progress-rdgm' + i_rdgm).hide ();
   if (no_intro_b) {
      $intro_div.hide ();
   } else {
      $intro_div.show ();
      qqc.select_placeholder ($ ('div.intro-rdgm' + i_rdgm));
   }
}
this.init_tinymce = function (edit_div_selector, edit_shortcodes_f,
                              hangman_labeled_diagram_f, no_edit_area_css) {
   /*
   var external_plugins = rdgm_edit_plugin_url + 'tinymce_external_plugins/';
   var advlist = external_plugins + 'advlist/plugin.min.js';
   var table   = external_plugins + 'table/plugin.min.js';
   */
   if (debug[0]) {
      console.trace ('[init_tinymce] edit_div_selector:', edit_div_selector);
   }
   var content_css = '';
   if (! no_edit_area_css) {
      content_css = rdgm_edit_plugin_url + 'rdgm_edit_area.css';
   }
   tinymce.init ({
      selector:                  edit_div_selector,
      browser_spellcheck:        true,
      content_css:               content_css,
      convert_urls:              false,
      external_plugins:          inline_ed_external_plugins,
      image_advtab:              true,
      inline:                    true,
      fixed_toolbar_container:   '#bubbleBarWrapper',
      forced_root_block:         false,
      menubar:                   false,
      paste_data_images:         true,
      paste_preprocess:          function (plugin, args) {
                                    var $stripped = jQuery ('<div>' + args.content + '</div>');
                                    $stripped.find ('*').removeAttr('id').removeAttr ('class');
                                    args.content = $stripped.html();
                                 },
      paste_retain_style_properties:
                                 'all',
      plugins:                   [inline_ed_plugins],
      setup:                     function (editor) {
                                    if (debug[0]) {
                                       console.log ('[init_tinymce > setup] editor:', editor);
                                    }
                                    editor.addButton ('qw_rm_br', {
                                       image:   rdgm_edit_plugin_url + 'images/rm_br_icon.png',
                                       title:   'Remove line-breaks here (to undo, highlight text and click "Clear formating")',
                                       onclick: rm_br
                                    });
                                    function rm_br () {
                                       qqc_rm_br (editor);
                                    }
                                    editor.on ('focus', function (focus_obj) {
                                       if (debug[0]) {
                                          console.log ('[editor.on (focus)] focus_obj:', focus_obj);
                                       }
                                       clearTimeout (disable_add_media_timeout);
                                       current_editor = editor;
                                       editor.no_editing_field_blur_f = false;
                                       $ ('button.rwizard_add_media').removeAttr ('disabled');
                                       if (rdgm_deck == 'rdgm') {
                                          /* DEDRAG
                                          var $target = $ (focus_obj.target.targetElm);
                                          if ($target.tooltip ('instance')) {
                                             if (debug[0]) {
                                                console.log ('[editor onfocus] disable tooltip');
                                             }
                                             $target.tooltip ('disable');
                                          }
                                          */
                                          if ($ (focus_obj.target.targetElm).hasClass ('rdgm-choice')) {
                                             qw.answer_choice_focus (focus_obj.target.targetElm);
                                          }
                                       }
                                       var $edit_div  = $ (edit_div_selector);
                                       if ($edit_div.attr ('id') == 'user_html') {
                                          setTimeout (function () {
                                             var $bubblebar = $ ('div.mce-tinymce-inline');
                                             if ($bubblebar.length) {
                                                var bubblebar_top = $bubblebar.position ().top;
                                                var edit_div_bot  = $edit_div.position ().top + $edit_div.outerHeight ();
                                                if (bubblebar_top < edit_div_bot + 5) {
                                                   $bubblebar.css ({top: edit_div_bot - 35 + 'px'});
                                                }
                                             }
                                          }, 200);
                                       }
                                    });
                                    if (! edit_shortcodes_f) {
                                       editor.on ('click', function (click_obj) {
                                          if (debug[0]) {
                                             console.log ('[editor > click] click_obj:', click_obj);
                                          }
                                          var type = '';
                                          if (typeof qw.questions_cards[i_question] != 'undefined') {
                                             type = qw.questions_cards[i_question].type;
                                          }
                                          if (type == 'hotspot_diagram') {
                                             select_hotspot_via_label_click (click_obj, editor);
                                          }
                                          if (click_obj.target.tagName == 'IMG' && $ (click_obj.currentTarget).hasClass ('rdgm-inline')) {
                                             $ (click_obj.currentTarget).css ({position: ''});
                                             var delay_handle = function () {
                                                $ ('.rdgm-inline .mce-resizehandle')
                                                   .addClass ('rdgm_fixed')
                                                   .on ('mousedown', function () {
                                                                        var delay_clone_reposition = function () {
                                                                           $ ('.rdgm-inline .mce-clonedresizable, .rdgm-inline .mce-resize-helper').addClass ('rdgm_fixed');
                                                                        }
                                                                        setTimeout (delay_clone_reposition, 150);
                                                                     });
                                             }
                                             setTimeout (delay_handle, 150);
                                          }
                                       });
                                       editor.on ('mousedown', function (obj) {
                                          if (debug[0]) {
                                             console.log ('[editor > mousedown] obj:', obj);
                                          }
                                          editor.focus ();
                                       });
                                       editor.on ('ObjectResized', function (resize_obj) {
                                          if (debug[0]) {
                                             console.log ('[editor > ObjectResized] resize_obj:', resize_obj);
                                          }
                                          var delay_addclass = function () {
                                             var $resizehandle = $ ('.rdgm-inline .mce-resizehandle');
                                             if (debug[0]) {
                                                console.log ('[editor > ObjectResized] $resizehandle:', $resizehandle);
                                             }
                                             $resizehandle
                                                .addClass ('rdgm_fixed')
                                                .on ('mousedown', function () {
                                                                     var delay_clone_reposition = function () {
                                                                        $ ('.rdgm-inline .mce-clonedresizable, .rdgm-inline .mce-resize-helper').addClass ('rdgm_fixed');
                                                                     }
                                                                     setTimeout (delay_clone_reposition, 150);
                                                                  });
                                          }
                                          setTimeout (delay_addclass, 150);
                                       });
                                       editor.on ('blur', function (blur_obj) {
                                          if (debug[0]) {
                                             console.log ('[editor > blur] editor.no_editing_field_blur_f:', editor.no_editing_field_blur_f);
                                          }
                                          if (! editor.no_editing_field_blur_f) {
                                             var type = '';
                                             if (typeof qw.questions_cards[i_question] != 'undefined') {
                                                type = qw.questions_cards[i_question].type;
                                             }
                                             if (   i_question < 0
                                                 || i_question >= n_questions
                                                 || (   type != 'labeled_diagram'
                                                     && type != 'hotspot_diagram')) {
                                                var delay_disable = function () {
                                                   if (debug[0]) {
                                                      console.log ('[editor blur > delay_disable] current_editor:', current_editor);
                                                   }
                                                   if (prevent_editor_blur_event_b) {
                                                      prevent_editor_blur_event_b = false;
                                                   } else {
                                                      current_editor = '';
                                                      $ ('button.rwizard_add_media').attr ('disabled', true);
                                                   }
                                                }
                                                disable_add_media_timeout
                                                   = setTimeout (delay_disable, 250);
                                             }
                                             if (debug[0]) {
                                                console.log ('[editor.on (blur)] blur_obj:', blur_obj);
                                             }
                                             var targetElm;
                                                targetElm = blur_obj.target.targetElm;
                                             if (rdgm_deck == 'rdgm') {
                                                rdgm_editing_field_blur (targetElm);
                                             } else {
                                                deck_editing_field_blur (targetElm);
                                             }
                                          }
                                       });
                                       editor.on ('init', function (init_obj) {
                                          qw.init_remove_placeholder (init_obj.target.targetElm);
                                       });
                                    }
                                 },
      toolbar1:                  inline_ed_toolbar1,
      toolbar2:                  inline_ed_toolbar2,
      toolbar3:                  inline_ed_toolbar3,
   });
   if (hangman_labeled_diagram_f) {
      $ (edit_div_selector).on ('keyup', function () {
                                            var $rdgmq;
                                            if (rdgm_deck == 'rdgm') {
                                               $rdgmq = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
                                            }
                                            qw.position_hangman_fields_div ($rdgmq);
                                          });
   }
}
function qqc_rm_br (ed) {
   var selection = ed.selection;
   var node = selection.getNode ();
   var selection_content = selection.getContent ();
   var selection_content_less_br = '';
   if (selection_content.search (/<br[^>]*>/) != -1) {
      selection_content_less_br = selection_content.replace (/<br[^>]*>/g, '');
   }
   if (node) {
      var tagname = node.tagName.toLowerCase ();
      var $node = $ (node);
      var immediate_br_only_b;
      if (tagname == 'p' || tagname.search (/h[1-6]/) != -1) {
         $node.css ({display: 'inline-block'});
         immediate_br_only_b = true;
      } else {
         immediate_br_only_b = false;
      }
      var qnode_id = parseInt (new Date ().getTime ()/1000.0, 10);
      var bookmark;
      if ($node.hasClass ('rdgm_editable')) {
         bookmark = '<span data-qnode_id="' + qnode_id + '">&nbsp;</span>';
         if (selection_content_less_br) {
            selection_content = selection_content_less_br + bookmark;
         } else {
            selection_content += bookmark;
         }
         selection.setContent (selection_content);
         tagname = 'span';
      } else {
         $node.attr ('data-qnode_id', qnode_id);
         if (selection_content_less_br) {
            selection.setContent (selection_content_less_br);
         }
      }
      var $ed = $ ('#' + ed.id);
      var ed_htm = $ed.html ();
      if (debug[0]) {
         console.log ('[rm_br] ed_htm:', ed_htm);
      }
      var before_break_pat = immediate_br_only_b ? '\\s*' : '[^]*?';
      var re = new RegExp ('<' + tagname + '[^>]*?' + qnode_id + '[^>]*>[^<]*<\/' + tagname + '>' + before_break_pat + '<br[^>]*>\\s*');
      var m = ed_htm.match (re);
      if (m) {
         var node_and_br = m[0];
         var node_less_br = node_and_br.replace (/<br[^>]*>/, '');
         ed_htm = ed_htm.replace (node_and_br, node_less_br);
      }
      if (tagname == 'span') {
         ed_htm = ed_htm.replace (bookmark, '');
      } else {
         ed_htm = ed_htm.replace (/\sdata-qnode_id="[0-9]+"/, '');
      }
      if (debug[0]) {
         console.log ('[rm_br] ed_htm:', ed_htm);
      }
      $ed.html (ed_htm);
   }
}
this.init_remove_placeholder = function (edit_selector) {
   if (debug[0]) {
      console.log ('[init_remove_placeholder] edit_selector:', edit_selector);
      console.log ('[init_remove_placeholder] $ (edit_selector).html ():', $ (edit_selector).html ());
   }
   var htm = $ (edit_selector).html ();
   if (htm.indexOf ('rwizard_placeholder') != -1) {
      var $edit_elm = $ (edit_selector);
      var replace_w_space_b = $edit_elm[0].tagName.toLowerCase () == 'span';
      $edit_elm.on ('click input', function (e) {
                                qw.remove_placeholder (e, $edit_elm, replace_w_space_b);
                             });
   }
}
this.remove_placeholder = function (e, $edit_elm, replace_w_space_b) {
   if (debug[0]) {
      console.log ('[remove_placeholder] e:', e);
      console.log ('[remove_placeholder] $edit_elm:', $edit_elm);
      console.log ('[remove_placeholder] $edit_elm[0].innerHTML:', $edit_elm[0].innerHTML);
   }
   if (qw.no_remove_placeholder_f) {
      qw.no_remove_placeholder_f = false;
      return;
   }
   $edit_elm.off ('click input keydown');
   if ($edit_elm.text ().indexOf ('Show me the answer') != -1) {
      $edit_elm.find ('span.rwizard_placeholder').replaceWith ('Show me the answer');
   } else if (replace_w_space_b) {
      $edit_elm.find ('span.rwizard_placeholder').remove ();
   } else {
      $edit_elm.find ('span.rwizard_placeholder').remove ();
   }
   if (e != null) {
      if (e.type == 'click') {
         $edit_elm.focus ();
      } else {
         var delay_undo = function () {
            var $font = $edit_elm.find ('font');
            if (debug[0]) {
               console.log ('[delay_undo] $edit_elm.html ():', $edit_elm.html ());
               console.log ('[delay_undo] $font:', $font);
            }
            if ($font.length) {
               var color = $font.attr ('color');
               if (color == '#808080') {
                  var htm = $font.html ();
                  $font.replaceWith (htm);
               }
            }
            var $span = $edit_elm.find ('span').first ();
            if ($span.length) {
               var style = $span.attr ('style');
               if (style && style.search (/rgb.+?255.+?255.+?85/) != -1) {
                  var htm = $span.html ();
                  $span.replaceWith (htm);
               }
            }
            var id = $edit_elm.attr ('id');
            var ed = tinyMCE.get (id);
            var selection = ed.selection;
            selection.select (ed.getBody ());
            var node = selection.getNode ();
            if (debug[0]) {
               console.log ('[delay_undo] ed.getBody ():', ed.getBody ());
               console.log ('[delay_undo] selection.getContent ():', selection.getContent ());
               console.log ('[delay_undo] node:', node);
            }
            function getTextNodes (node, nodeType, result) {
               var children;
               if (node) {
                  children = node.childNodes;
               } else {
                  children = [];
               }
               var nodeType = nodeType ? nodeType : 3;
               var result = ! result ? [] : result;
               if (node && node.nodeType == nodeType) {
                  result.push (node);
               }
               for (var i=0; i<children.length; i++) {
                  result = getTextNodes (children[i], nodeType, result);
               }
               return result;
            };
            var textnodes = '';
            if (! $edit_elm.hasClass ('rdgm_edit_canvas')) {
               textnodes = getTextNodes (ed.getBody().lastChild);
               if (debug[0]) {
                  console.log ('[delay_undo] textnodes:', textnodes);
               }
            }
            if (textnodes.length) {
               var last_textnode = textnodes[textnodes.length-1];
               var last_textnode_content = last_textnode.textContent;
               if (debug[0]) {
                  console.log ('[delay_undo] last_textnode_content:', last_textnode_content);
               }
               var non_blank = last_textnode_content.replace (/\s*?$/, '');
               try {
                  ed.selection.setCursorLocation(last_textnode, non_blank.length );
               } catch (e) {
                  selection.setCursorLocation (node, 1);
               }
            } else {
               selection.setCursorLocation (node, 1);
            }
         };
         setTimeout (delay_undo, 200);
      }
   }
}
function rdgm_editing_field_blur (edit_el) {
   if (debug[0]) {
      console.log ('[rdgm_editing_field_blur] edit_el:', edit_el);
      console.log ('[rdgm_editing_field_blur] i_question:', i_question);
   }
   if (waiting_for_hangman_click) {
      waiting_for_hangman_click = false;
      $ ('#hangman_options_menu_feedback').hide ();
   }
   var $edit_obj = $ (edit_el);
   /* DEDRAG
   if ($edit_obj.tooltip ('instance')) {
      $edit_obj.tooltip ('enable');
   }
   if ($edit_obj.hasClass ('rdgm_edit_highlight_label')) {
      $edit_obj.parents ('div.rdgm_edit_label').draggable ('enable');
      $edit_obj.css ({cursor: 'move'});
   }
   */
   $ ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   $ ('div.wpview-clipboard').hide ();
   var new_html = trim ($edit_obj.html ());
   /*
   if (wp_editing_page_f) {
      new_html = process_embeds (edit_el, new_html);
   } else {
      rdgm_editing_field_blur2 (edit_el, new_html);
   }
   */
   rdgm_editing_field_blur2 (edit_el, new_html);
}
function rdgm_editing_field_blur2 (edit_el, new_html) {
   if (debug[0]) {
      console.log ('[rdgm_editing_field_blur2] edit_el:', edit_el);
      console.log ('[rdgm_editing_field_blur2] new_html:', new_html);
   }
   var $edit_obj = $ (edit_el);
   $edit_obj.find ('div.wpview-wrap').each (function () {
      var div_html = $ (this)[0].outerHTML;
      if (debug[0]) {
         console.log ('[rdgm_editing_field_blur2] div_html:', div_html);
      }
      var m = div_html.match (/\[(audio|video) src="[^\]]+\]/);
      if (m) {
         var embed_shortcode = m[0];
         new_html = new_html.replace (div_html, embed_shortcode);
      } else {
         console.log ('[rdgm_editing_field_blur2 > no shortcode] div_html:', div_html);
      }
   });
   if ($edit_obj.hasClass ('rdgm-header')) {
      header_text = new_html;
   } else if ($edit_obj.hasClass ('notification_tip_body_html')) {
   } else if ($edit_obj.hasClass ('follow_up_email_html')) {
      update_follow_up ('email_html', new_html);
   } else if ($edit_obj.hasClass ('user_html')) {
      update_user_page ('user_html', new_html, 'user');
   } else if ($edit_obj.hasClass ('instructor_feedback')) {
      update_user_page ('user_html', new_html, 'instructor');
   } else if ($edit_obj.hasClass ('rdgm-intro')) {
      intro_text = new_html;
   } else if ($edit_obj.hasClass ('rdgm-exit')) {
      exit_text = new_html.replace (/<button[^]*?<\/button>/, '[restart]');
   } else {
      const $rdgmq = $edit_obj.parents ('div.rdgmq');
      const rdgmq_id = $rdgmq.attr ('id');
      var ii_question;
      if (rdgmq_id) {
         var m = rdgmq_id.match (/-q[0-9]+/);
         ii_question = parseInt (m[0].substr (2));
         if (debug[0]) {
            console.log ('[rdgm_editing_field_blur2] ii_question:', ii_question);
         }
      } else {
         ii_question = i_question;
      }
      if ($edit_obj.hasClass ('hotspot_click_feedback')) {
         const $hotspot_label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
         if ($edit_obj.hasClass ('hotspot_click_feedback_correct')) {
            $hotspot_label.find ('span.hotspot_label_feedback_correct_content').html (new_html);
         } else {
            $hotspot_label.find ('span.hotspot_label_feedback_incorrect_content').html (new_html);
         }
      } else if ($edit_obj.hasClass ('rdgm_edit_canvas')) {
         /*
         $edit_obj.find ('div.rdgm_edit_target div.rdgm_edit_label').each (function () {
            var label_outer_html = $ (this)[0].outerHTML;
            new_html = new_html.replace (label_outer_html, '');
            if (debug[0]) {
               console.log ('[rdgm_editing_field_blur2] (remove placed label) new_html:', new_html);
            }
         });
         */
         var preface = '<div class="rdgm_edit_canvas rdgm_editable rdgm-question">[q]';
         qw.questions_cards[ii_question].question_text = preface + new_html + '</div>';
         update_question_accordion_label (new_html, ii_question);
      } else if ($edit_obj.hasClass ('rdgm-question')) {
         var question = qw.questions_cards[ii_question];
         var textentry_hangman = '';
         if ($edit_obj.hasClass ('rdgm-question-textentry')) {
            textentry_hangman = '[textentry';
         } else if ($edit_obj.hasClass ('rdgm-question-hangman')) {
            textentry_hangman = '[hangman';
         }
         if (textentry_hangman) {
            var question_text = question.question_text;
            var i_part = $edit_obj.data ('i_part');
            var r = find_matching_textentry_hangman (question_text, i_part, textentry_hangman);
            new_html = question_text.substr (0, r.prev_pos) + new_html
                                                + question_text.substr (r.ii_pos);
         }
         question.question_text = new_html;
         update_question_accordion_label (new_html, ii_question);
         if (question.type == 'multiple_choice') {
            if (new_html.indexOf ('rwizard_placeholder') == -1) {
               var $choice = $ ('span.choices-rdgm' + i_rdgm + '-q0 span.rdgm-choice.rdgm_editable');
               qqc.select_placeholder ($choice);
            }
         }
      } else if ($edit_obj.hasClass ('rdgm-choice')) {
         var i_choice = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].choices[i_choice] = new_html;
      } else if ($edit_obj.hasClass ('rdgm-feedback-span')) {
         var i_choice = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedbacks[i_choice] = new_html;
      } else if ($edit_obj.hasClass ('rdgm_edit_highlight_label')) {
         var i_label = label_from_parent_id ($edit_obj);
         var div_html = $edit_obj.parent ()[0].outerHTML;
         if (debug[0]) {
            console.log ('[rdgm_editing_field_blur2 > rdgm_edit_highlight_label] div_html:', div_html);
         }
         div_html = div_html.replace (/id="[^"]+" /, '');
         div_html = div_html.replace (' no_move', '');
         div_html = div_html.replace (/<span[^>]+>/, '$&[l]');
         qw.questions_cards[ii_question].labels[i_label] = div_html;
         var m = div_html.match (/qtarget_assoc([0-9]+)/);
         var assoc_id = m[1];
         var $placed_label = $ ('div.qtarget_assoc' + assoc_id + ' span.rdgm_edit_label_placed');
         if ($placed_label.length) {
            $placed_label.html ($edit_obj.html ());
         }
      } else if ($edit_obj.hasClass ('rdgm_edit-correct_feedback')) {
         var i_label = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedback_corrects[i_label] = new_html;
      } else if ($edit_obj.hasClass ('rdgm_edit-incorrect_feedback')) {
         var i_label = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedback_incorrects[i_label] = new_html;
      }
   }
   if (debug[0]) {
      if (ii_question >= 0 && ii_question < n_questions) {
         console.log ('[rdgm_editing_field_blur2] qw.questions_cards[ii_question]:', qw.questions_cards[ii_question]);
      }
   }
}
function deck_editing_field_blur (edit_el) {
   if (debug[0]) {
      console.log ('[deck_editing_field_blur] edit_el:', edit_el);
   }
   if (waiting_for_hangman_click) {
      waiting_for_hangman_click = false;
      $ ('#hangman_options_menu_feedback').hide ();
   }
   var $edit_obj = $ (edit_el);
   $ ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   $ ('div.wpview-clipboard').hide ();
   var new_html = trim ($edit_obj.html ());
   deck_editing_field_blur2 (edit_el, new_html);
}
function deck_editing_field_blur2 (edit_el, new_html) {
   var $edit_obj = $ (edit_el);
   if (debug[0]) {
      console.log ('[deck_editing_field_blur2] new_html:', new_html);
      console.log ('[deck_editing_field_blur2] $edit_obj:', $edit_obj);
   }
   $edit_obj.find ('div.wpview-wrap').each (function () {
      var div_html = $ (this)[0].outerHTML;
      if (debug[0]) {
         console.log ('[deck_editing_field_blur2] div_html:', div_html);
      }
      var m = div_html.match (/\[(audio|video) src="[^\]]+\]/);
      if (m) {
         var embed_shortcode = m[0];
         new_html = new_html.replace (div_html, embed_shortcode);
      } else {
         console.log ('[deck_editing_field_blur2 > no shortcode] div_html:', div_html);
      }
   });
   var ii_question = i_question;
   if (debug[0]) {
      console.log ('[deck_editing_field_blur2] ii_question:', ii_question);
   }
   if (typeof (ii_question) == 'undefined') {
      console.log ('[deck_editing_field_blur2] ii_question undefined; $edit_obj:', $edit_obj);
      return;
   }
   if ($edit_obj.hasClass ('qcard_header')) {
      header_text = new_html;
   } else if ($edit_obj.hasClass ('notification_tip_body_html')) {
   } else if ($edit_obj.hasClass ('follow_up_email_html')) {
      update_follow_up ('email_html', new_html);
   } else if ($edit_obj.hasClass ('user_html')) {
      update_user_page ('user_html', new_html, 'user');
   } else if ($edit_obj.hasClass ('instructor_feedback')) {
      var b64_class_name = $edit_obj.data ('class_name');
      var class_name = atob (b64_class_name);
      update_user_page ('user_html', new_html, 'instructor', class_name);
   } else if (ii_question == -1 || ii_question >= n_questions) {
      var part1 = $ ('#qcard_front-part1-qdeck' + i_rdgm).html ();
      var input = $ ('#qcard_front-input1-qdeck' + i_rdgm).html ();
      var part2 = $ ('#qcard_front-part2-qdeck' + i_rdgm).html ();
      if (ii_question == -1) {
         intro_text = part1 + '[start]' + part2;
         qcard_.set_deckdata (i_rdgm, 'intro_html', part1 + input + part2);
      } else {
         var restart = input.indexOf ('rdgm_restart') != -1  ? '[restart]' : '';
         exit_text = part1 + restart + part2;
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] exit_text:', exit_text);
         }
         qcard_.set_deckdata (i_rdgm, 'exit_html', part1 + input + part2);
      }
   } else {
      var front_b = $edit_obj.parents ('div.qcard-front').length != 0;
      if (front_b) {
         var card_front;
         if (new_html.indexOf ('hangman_img_wrapper') != -1) {
            card_front = new_html;
         } else {
            var question_text = qw.questions_cards[ii_question].question_text;
            var textentry_hangman = '';
            if (question_text.indexOf ('[textentry') != -1) {
               textentry_hangman = '[textentry';
            } else if (question_text.indexOf ('[hangman') != -1) {
               textentry_hangman = '[hangman';
            }
            if (textentry_hangman) {
               var i_part = $edit_obj.data ('i_part');
               var r = find_matching_textentry_hangman (question_text, i_part, textentry_hangman);
               new_html = question_text.substr (0, r.prev_pos) + new_html
                                                   + question_text.substr (r.ii_pos);
            }
            card_front =   $ ('#qcard_front-part1-qdeck' + i_rdgm).html ()
                         + $ ('#qcard_front-input1-qdeck' + i_rdgm).html ()
                         + $ ('#qcard_front-part2-qdeck' + i_rdgm).html ();
            if (textentry_hangman == '[hangman') {
               for (var i=2; i<=qcard_.n_textentry_hangman; i++) {
                  var i1 = i + 1;
                  card_front +=  $ ('#qcard_front-input' + i + '-qdeck' + i_rdgm).html ()
                               + $ ('#qcard_front-part' + i1 + '-qdeck' + i_rdgm).html ();
               }
            }
         }
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] card_front:', card_front);
         }
         qw.questions_cards[ii_question].question_text = new_html;
         qcard_.set_carddata (i_rdgm, ii_question, 'card_front', card_front);
         update_question_accordion_label (new_html, ii_question);
      } else {
         var i_choice = '';
         if ($edit_obj.hasClass ('qcard-part1')) {
            i_choice = $edit_obj.data ('choice');
            if (debug[0]) {
               console.log ('[deck_editing_field_blur2] i_choice:', i_choice);
            }
            if (typeof (i_choice) == 'undefined') {
               i_choice = '';
            }
         }
         if (i_choice === '') {
            qw.questions_cards[ii_question].answer_text = new_html;
            var card_back =   $ ('#qcard_back-echo-qdeck'  + i_rdgm).html()
                            + $ ('#qcard_back-part1-qdeck' + i_rdgm).html();
            qcard_.set_carddata (i_rdgm, ii_question, 'card_back', card_back);
            if (debug[0]) {
               console.log ('[deck_editing_field_blur2] card_back:', card_back);
            }
         } else {
            qw.questions_cards[ii_question].feedbacks[i_choice] = new_html;
            qcard_.set_carddata (i_rdgm, ii_question, 'feedback_htmls', new_html, i_choice);
         }
      }
   }
   if (debug[0]) {
      if (ii_question >= 0 && ii_question < n_questions) {
         console.log ('[deck_editing_field_blur2] qw.questions_cards[ii_question]:', qw.questions_cards[ii_question]);
      }
   }
}
function find_matching_textentry_hangman (question_text, i_part, textentry_hangman) {
   var ii_pos = 0;
   var prev_pos;
   var textentry_hangman_length = 0;
   for (var ii_part=1; ii_part<=i_part; ii_part++) {
      prev_pos = ii_pos + textentry_hangman_length;
      ii_pos = question_text.indexOf (textentry_hangman, prev_pos);
      if (ii_pos == -1) {
         ii_pos = question_text.length;
      }
      if (ii_part < i_part) {
         var m = question_text.substr (ii_pos).match (/\[(textentry|hangman)[^\]]*\]/);
         if (m) {
            textentry_hangman = m[0];
            textentry_hangman_length = textentry_hangman.length;
         }
      }
   }
   return {prev_pos: prev_pos,
           ii_pos:   ii_pos};
}
this.answer_choice_focus = function (choice_el) {
   if (debug[0]) {
      console.log ('[answer_choice_focus] choice_el:', choice_el);
      console.log ('[answer_choice_focus] i_question:', i_question, ', i_current_answer_choice:', i_current_answer_choice);
   }
   $ ('#multiple_choice_options_menu_feedback').hide ();
   var delay_answer_choice_focus = function () {
      if (choice_el) {
         var $choice_el = $ (choice_el);
         i_current_answer_choice = $choice_el.data ('i_choice');
         if (debug[0]) {
            console.log ('[answer_choice_focus] i_current_answer_choice:', i_current_answer_choice);
         }
      }
      var $choices = $ ('span.choices-rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_editable');
      var selector = 'span.choice-rdgm' + i_rdgm + '-q' + i_question + '-a' + i_current_answer_choice + ' .rdgm_editable';
      var $choice = $ (selector);
      $choices.removeClass ('highlight_selected_choice_label');
      $choice.addClass ('highlight_selected_choice_label');
      if (qw.questions_cards[i_question]) {
         if (qw.questions_cards[i_question].question_text.indexOf ('rwizard_placeholder') == -1) {
            qqc.select_placeholder ($choice);
         }
         var correct_choice = qw.questions_cards[i_question].correct_choice;
         if (correct_choice != -1) {
            var $choice  = $ ('span.choice-rdgm' + i_rdgm + '-q' + i_question + '-a' + correct_choice + ' .rdgm_editable');
            var $choices = $ ('span.choices-rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_editable');
            $choices.css ({'border': '1px dotted red'});
            $choice.css ({'border': '2px dotted green'});
         }
         var correct = correct_choice == i_current_answer_choice;
         $ ('#rwizard_correct_choice input').prop ('checked', correct);
         if (qw.questions_cards[i_question].n_choices > 1) {
            $ ('#delete_answer_choice').show ();
         } else {
            $ ('#delete_answer_choice').hide ();
         }
      }
   }
   setTimeout (delay_answer_choice_focus, 200);
}
function process_embeds (edit_el, html) {
   if (debug[0]) {
      console.log ('[process_embeds] edit_el:', edit_el);
      console.log ('                 html:', html);
   }
   var tmp_html = html.replace (/(<br[^>]*>|<\/*p[^>]*>)/g, '\n');
   /* (Stop Vim from considering the rest of this a multi-line comment.) */
   var urls = tmp_html.match (/^\s*(http:\/\/|https:\/\/)\S+\s*$/gm);
   if (urls) {
      var n_urls = urls.length;
      for (var i=0; i<n_urls; i++) {
         urls[i] = trim (urls[i]);
      }
      if (debug[0]) {
         console.log ('[process_embeds] urls:', urls);
      }
      var process_embeds_callback = function (embed_codes) {
         for (var i=0; i<n_urls; i++) {
            html = html.replace (url[i], embed_codes[i]);
         }
         if (debug[0]) {
            console.log ('[process_embeds_callback] html:', html);
         }
         if (rdgm_deck == 'rdgm') {
            rdgm_editing_field_blur2 (edit_el, html)
         } else {
            deck_editing_field_blur2 (edit_el, html)
         }
      }
      var ajaxurl = rdgm_edit_params.ajaxurl;
      var data = {action:     'process_embeds',
                  urls:        urls
                 };
      $.ajax ({
         type:       'POST',
         url:        ajaxurl,
         data:       data,
         success:    process_embeds_callback
      });
   } else {
      if (rdgm_deck == 'rdgm') {
         rdgm_editing_field_blur2 (edit_el, html);
      } else {
         deck_editing_field_blur2 (edit_el, html);
      }
   }
}
function label_from_parent_id ($edit_obj) {
   var id = $edit_obj.parent ().attr ('id');
   var i_label = id.match (/[0-9]+$/)[0];
   return i_label;
}
function update_question_accordion_label (new_html, ii_question) {
   if (debug[0]) {
      console.log ('[update_question_accordion_label] new_html:', new_html);
   }
   var clean_html = placeholder_trim (new_html, ii_question);
   if (clean_html) {
      var clean_html_no_whitespace = clean_html.replace (/&nbsp;|\s/gm, '');
      if (clean_html_no_whitespace) {
         var label =   '&emsp; '
                     + (ii_question + 1) + '&ensp;'
                     + clean_html
                     + '&emsp;(' + question_type (ii_question) + ')';
         var $qdiv = $ ('#rwizard_questions div.q' + ii_question + ' div.rwizard_menu_question_label');
         $qdiv.html (label);
         if (debug[0]) {
            console.log ('[update_question_accordion_label] $qdiv:', $qdiv);
            console.log ('[update_question_accordion_label] label:', label);
         }
      }
   }
}
function rwizard_html () {
   var m = [];
   m.push ('<div id="quiz_components_menu" class="component_options">');
   m.push ('</div>');
   m.push ('<div id="new_question_type_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="multiple_choice_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="show_me_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (      '<div class="rwizard_floating_menu_title">');
   m.push (         'Show me the answer');
   m.push (      '</div>');
   m.push (      '<button class="rdgm_image_button rwizard_icon_menu_exit" onclick="jQuery (\'#show_me_options_menu\').hide ()">');
   m.push (         '<img src="' + rdgm_edit_plugin_url + 'images/icon_exit_red.png" />');
   m.push (      '</button>');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (      'Click &ldquo;Show me the answer&rdquo; button to enter/edit feedback.');
   m.push (      '<br />');
   m.push (      '(You may also change the button text.)');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="hotspot_diagram_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="hotspot_editing_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="label_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="free_form_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="hangman_options_menu" class="rwizard_floating_menu">');
   m.push (   '<div class="rwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="deck_components_menu" class="component_options">');
   m.push ('</div>');
   var $rwizard = $ ('#rwizard');
   if (debug[0]) {
      console.log ('[rwizard_html] $rwizard:', $rwizard);
   }
   $rwizard.html (m.join ('\n'));
}
function quiz_components_html () {
   var m = [];
   m.push ('<div class="rwizard_accordion">');
   m.push (   '<p id="quiz_options" class="rwizard_title">');
   var progress_recording_checked;
   var Quiz_Deck;
   var Quiz_Card;
   var question_card;
   var Question_Card;
   if (rdgm_deck == 'rdgm') {
      if (rdgm_edit.rdgm_button_b) {
         m.push ('Quiz options');
      } else {
         m.push ('Display options');
      }
      progress_recording_checked = rdgm_.qrecord_b;
      Quiz_Deck = 'Quiz';
      if (rdgm_edit.rdgm_button_b) {
         Quiz_Card = 'Quiz';
      } else {
         Quiz_Card = 'Hotspot image';
      }
      question_card = 'question';
      Question_Card = 'Question';
   } else {
      m.push (   'Flashcard deck options');
      progress_recording_checked = qcard_.qrecord_b;
      Quiz_Deck = 'Deck';
      Quiz_Card = 'Card';
      question_card = 'card';
      Question_Card = 'Card';
   }
   progress_recording_checked = progress_recording_checked ? 'checked' : '';
   m.push (   '</p>');
   m.push (   '<div style="overflow: visible;">');
   if (rdgm_edit.rdgm_button_b) {
      if (typeof (document_rdgm_username) == 'undefined'
                             || document_rdgm_username.substr (4, 6) != '-maker') {
         m.push ('<div class="rwizard_menu_item" style="padding-left: 2px;" onmousedown="rwizard.recording_dataset_options (\'qq\')">');
         m.push (   'Enable progress recording&nbsp; ');
         m.push (   '<input id="enable_progress_recording_checkbox" type="checkbox" ' + progress_recording_checked + ' onclick="return false" />');
         m.push ('</div>');
      }
      m.push ('<div class="rwizard_menu_item" style="padding-left: 2px;" onmousedown="rwizard.recording_dataset_options (\'dataset\')">');
      m.push (   'Save ' + question_card + 's as dataset&nbsp; ');
      m.push (   '<input id="save_as_dataset_checkbox" type="checkbox" onclick="return false" />');
      m.push ('</div>');
      m.push (   '<table class="quiz_deck_options">');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            Question_Card + 's to show');
      m.push (            '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon_smaller rwizard_help" title="A randomly-chosen subset of ' + question_card + 's can be shown as the number to do in this ' + Quiz_Deck.toLowerCase () + ', or, in the case of datasets, this will be the default number of &ldquo;' + question_card + 's to practice&rdquo;" />');
      m.push (         '</td>');
      m.push (         '<td colspan="3">');
      m.push (            '<input type="text" id="questions_cards_to_show" class="questions_cards_to_show" onchange="rwizard.questions_cards_to_show (this, \'' + question_card + '\')" placeholder="all" />');
      m.push (            '(Enter number or leave as &ldquo;all&rdquo;)');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr class="rdgm_random">');
      m.push (         '<td>');
      m.push (            Question_Card + ' order');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_random" class="rwizard_shift_icon random_false" onclick="rwizard.rdgm_random (\'false\')" checked /> In order as entered &ensp;');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_random" class="rwizard_shift_icon random_true"  onclick="rwizard.rdgm_random (\'true\')"          /> In random order');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      if (rdgm_deck == 'rdgm') {
         m.push (   '<tr>');
         m.push (      '<td class="rwizard_top">');
         m.push (         'Repeat incorrect');
         m.push (      '</td>');
         m.push (      '<td class="rwizard_top">');
         m.push (         '<label>');
         m.push (            '<input type="radio" name="rdgm_repeat" class="rwizard_shift_icon repeat_incorrect_true"  onclick="rwizard.rdgm_repeat (\'true\')"  checked /> Repeat questions answered<br />&emsp;&emsp;incorrectly (&ldquo;learn mode&rdquo;)');
         m.push (         '</label>');
         m.push (      '</td>');
         m.push (      '<td class="rwizard_top">');
         m.push (         '<label>');
         m.push (            '<input type="radio" name="rdgm_repeat" class="rwizard_shift_icon repeat_incorrect_false" onclick="rwizard.rdgm_repeat (\'false\')"         /> Only one try (&ldquo;test mode&rdquo;)');
         m.push (         '</label>');
         m.push (      '</td>');
         m.push (   '</tr>');
      }
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Back-forward');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_bck_fwd" class="rwizard_shift_icon bck_fwd_options_yes" onclick="rwizard.bck_fwd_options (1)" checked /> Show buttons');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_bck_fwd" class="rwizard_shift_icon bck_fwd_options_no"  onclick="rwizard.bck_fwd_options (0)" /> Hide');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
   } else {
      m.push (   '<table class="quiz_deck_options">');
   }
   const questions_cards = rdgm_deck == 'rdgm' ? 'questions' : 'cards';
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               'Progress');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   if (rdgm_edit.rdgm_button_b) {
      m.push (               '<input type="radio" name="rdgm_progress" class="rwizard_shift_icon progress_options_yes" onclick="rwizard.progress_options (1)" checked /> Show ' + questions_cards + ' to do, etc.');
   } else {
      m.push (               '<input type="radio" name="rdgm_progress" class="rwizard_shift_icon progress_options_yes" onclick="rwizard.progress_options (1)" checked /> Show &rdquo;2 of 5 items&ldquo;');
   }
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_progress" class="rwizard_shift_icon progress_options_no"  onclick="rwizard.progress_options (0)" /> Hide');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               'Timer');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_deck_timer" class="rwizard_shift_icon rdgm_deck_timer_limit"   onclick="rwizard.rdgm_deck_timer (\'limit\')" checked />');
   if (rdgm_edit.rdgm_button_b) {
      m.push (               'Limit per ' + question_card);
   } else {
      m.push (               'Limit');
   }
   m.push (               '</label>');
   m.push (               '<input type="text" id="question_card_time_limit_sec" onchange="rwizard.question_card_time_limit_change ()" />sec');
   m.push (            '</td>');
   var none_no_limit = 'No limit';
   if (rdgm_deck == 'rdgm') {
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_deck_timer" class="rwizard_shift_icon rdgm_deck_timer_elapsed" onclick="rwizard.rdgm_deck_timer (\'elapsed\')" />');
      if (rdgm_edit.rdgm_button_b) {
         m.push (            'Quiz elapsed time');
      } else {
         m.push (            'Elapsed time');
      }
      m.push (            '</label>');
      m.push (         '</td>');
      none_no_limit = 'None';
   }
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_deck_timer" class="rwizard_shift_icon rdgm_deck_timer_none"    onclick="rwizard.rdgm_deck_timer (\'none\')" /> ' + none_no_limit);
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   if (rdgm_deck == 'deck') {
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Flip/Check answer');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_flip" class="rwizard_shift_icon flip_options_yes" onclick="rwizard.flip_options (1)" checked /> Show button');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_flip" class="rwizard_shift_icon flip_options_no"  onclick="rwizard.flip_options (0)" /> Hide (click card to flip)');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Got-it button');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_gotit" class="rwizard_shift_icon gotit_options_yes" onclick="rwizard.gotit_options (1)" checked /> Yes');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_gotit" class="rwizard_shift_icon gotit_options_no"  onclick="rwizard.gotit_options (0)" /> No (&ldquo;endless&rdquo; deck)');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Shuffle button');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_shuffle" class="rwizard_shift_icon shuffle_options_yes" onclick="rwizard.shuffle_options (1)" checked /> Yes');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_shuffle" class="rwizard_shift_icon shuffle_options_no"  onclick="rwizard.shuffle_options (0)" /> No');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Flip direction');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_flipdir" class="rwizard_shift_icon flipdir_options_left_right" onclick="rwizard.flipdir_options (\'left_right\')" /> Left-right');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_flipdir" class="rwizard_shift_icon flipdir_options_up_down"    onclick="rwizard.flipdir_options (\'up_down\')" /> Up-down');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_flipdir" class="rwizard_shift_icon flipdir_options_random"     onclick="rwizard.flipdir_options (\'random\')" checked /> Random');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Card text default');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_bold_text" class="rwizard_shift_icon bold_text_options_yes" onclick="rwizard.bold_text_options (1)" checked /> Bold');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_bold_text" class="rwizard_shift_icon bold_text_options_no"  onclick="rwizard.bold_text_options (0)" /> Normal');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Card background');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<select id="card_background" class="rdgm_deck_options_box options_select" onchange="rwizard.card_back_options (this.value)">');
      m.push (               '<option selected>');
      m.push (                  'ruled lines');
      m.push (               '</option>');
      m.push (               '<option>');
      m.push (                  'none');
      m.push (               '</option>');
      m.push (            '</select>');
      m.push (         '</td>');
      m.push (      '</tr>');
   }
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (                'Alignment');
   m.push (            '</td>');
   m.push (            '<td colspan="3">');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_align" class="rwizard_shift_icon align_options_left"   onclick="rwizard.align_options (\'left\')" checked /> Left &emsp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_align" class="rwizard_shift_icon align_options_center" onclick="rwizard.align_options (\'center\')"       /> Center &emsp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_align" class="rwizard_shift_icon align_options_right"  onclick="rwizard.align_options (\'right\')"        /> Right &emsp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="rdgm_align" class="rwizard_shift_icon align_options_tiled"  onclick="rwizard.align_options (\'tiled\')"        /> Tiled (&ldquo;float left&rdquo;)');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               Quiz_Card + ' size');
   m.push (            '</td>');
   m.push (            '<td colspan="3">');
   m.push (               'Width');
   m.push (               '<input type="text" class="width_px" onchange="rwizard.rdgm_deck_style (\'width\', this.value)" value="500" />px');
   m.push (               '&ensp;');
   m.push (               'Height');
   m.push (               '<input type="text" class="height_px" onchange="rwizard.rdgm_deck_style (\'min-height\', this.value)" value="300" />px');
   m.push (               '&ensp;');
   m.push (               'Spacing');
   m.push (               '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon_smaller rwizard_help" title="Margin on right and bottom" />');
   m.push (               '<input type="text" class="spacing_px" style="width: 2em;" onchange="rwizard.set_spacing (this.value)" value="0" />px');
   if (rdgm_deck == 'deck') {
      m.push (            ' &emsp;');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_expand_scroll" class="rwizard_shift_icon rdgm_expand" onclick="rwizard.set_expand_scroll (\'expand\')" checked /> Expand');
      m.push (            '</label>');
      m.push (            '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon_smaller rwizard_help" title="The card height will expand to fit contents" />');
      m.push (            ' &ensp;');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="rdgm_expand_scroll" class="rwizard_shift_icon rdgm_scroll" onclick="rwizard.set_expand_scroll (\'scroll\')"         /> Scroll');
      m.push (            '</label>');
      m.push (            '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon_smaller rwizard_help" title="Scrollbars will appear when the content exceeds the card size" />');
   }
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               'Border');
   m.push (            '</td>');
   m.push (            '<td colspan="3">');
   m.push (               'Width');
   m.push (               '<select id="border_width" class="options_select" onchange="rwizard.rdgm_deck_style (\'border-width\', this.value)">');
   m.push (                  '<option>');
   m.push (                     '0');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '1px');
   m.push (                  '</option>');
   m.push (                  '<option selected>');
   m.push (                     '2px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '3px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '4px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '5px');
   m.push (                  '</option>');
   m.push (               '</select>');
   m.push (               '&emsp;');
   m.push (               'Style');
   m.push (               '<select id="border_style" class="options_select" onchange="rwizard.rdgm_deck_style (\'border-style\', this.value)">');
   m.push (                  '<option>');
   m.push (                     'none');
   m.push (                  '</option>');
   m.push (                  '<option selected>');
   m.push (                     'solid');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'dotted');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'dashed');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'double');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'groove');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'ridge');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'inset');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'outset');
   m.push (                  '</option>');
   m.push (               '</select>');
   m.push (               '&emsp;');
   m.push (               'Color');
   m.push (               '<input id="border_color" type="text" value="black" />');
   m.push (            '</td>');
   m.push (         '</tr>');
   if (! new_rdgm_deck_f && ! wp_editing_page_f) {
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Page title');
      m.push (         '</td>');
      m.push (         '<td colspan="3">');
      m.push (            '<input type="text" class="page_title"  onchange="rwizard.set_page_title (this)" value="' + page_title + '" />');
      m.push (            '&nbsp;');
      m.push (            '<button class="rdgm_button rwizard_smaller" style="padding: 1px;">');
      m.push (               'Ok');
      m.push (            '</button>');
      m.push (         '</td>');
      m.push (      '</tr>');
   }
   m.push (      '</table>');
   m.push (   '</div>');
   /*
   m.push (      'Card back');
   m.push (      'height');
   m.push (      'width');
   m.push (      'Default unit');
   m.push (      'Default topic');
   m.push (      'terms');
   */
   m.push (   '<p id="quiz_header" class="rwizard_title">');
   m.push (      'Header');
   m.push (   '</p>');
   m.push (   '<div>');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="rdgm_header_yes_no" class="quiz_header_yes" onclick="rwizard.' + rdgm_deck + '_header_yes_no (1)" />');
   m.push (      '   Show/edit');
   m.push (      '</label>');
   m.push (      '&emsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="rdgm_header_yes_no" class="quiz_header_no" onclick="rwizard.' + rdgm_deck + '_header_yes_no (0)" checked />');
   m.push (      'No header');
   m.push (      '</label>');
   m.push (   '</div>');
   if (rdgm_edit.rdgm_button_b) {
      m.push ('<p id="quiz_introduction" class="rwizard_title">');
      m.push (   'Introduction');
      m.push ('</p>');
      m.push ('<div>');
      m.push (   '<label>');
      m.push (      '<input type="radio" name="rdgm_intro_yes_no" class="quiz_intro_yes" onclick="rwizard.' + rdgm_deck + '_intro_yes_no (1)" />');
      m.push (      'Show/edit');
      m.push (   '</label>');
      m.push (   '&emsp;');
      m.push (   '<label>');
      m.push (      '<input type="radio" name="rdgm_intro_yes_no" class="quiz_intro_no" onclick="rwizard.' + rdgm_deck + '_intro_yes_no (0)" checked />');
      m.push (      'No introduction');
      m.push (   '</label>');
      m.push ('</div>');
      m.push ('<p id="quiz_questions" class="rwizard_title">');
      if (rdgm_deck == 'rdgm') {
         m.push ('Questions');
      } else {
         m.push ('Flashcards');
      }
      m.push ('</p>');
      m.push ('<div id="rwizard_questions">');
      m.push ('</div>');
      m.push ('<p id="quiz_exit_text" class="rwizard_title">');
      if (rdgm_deck == 'rdgm') {
         m.push ('Exit text (at end of quiz)');
      } else {
         m.push ('Exit text (at end of flashcard deck)');
      }
      m.push ('</p>');
      m.push ('<div>');
      m.push (   '<label>');
      if (rdgm_deck == 'rdgm') {
         m.push (   '<input type="radio" name="rdgm_restart_yes_no" class="quiz_restart_yes" onclick="rwizard.quiz_restart_yes_no (1)" />');
         m.push (   'Show &ldquo;Take the quiz again&rdquo; button');
      } else {
         m.push (   '<input type="radio" name="rdgm_restart_yes_no" class="quiz_restart_yes" onclick="rwizard.deck_restart_yes_no (1)" />');
         m.push (   'Show &ldquo;Review this flashcard stack again&rdquo; button');
      }
      m.push (   '</label>');
      m.push (   '&emsp;');
      m.push (   '<label>');
      if (rdgm_deck == 'rdgm') {
         m.push (   '<input type="radio" name="rdgm_restart_yes_no" class="quiz_restart_no" onclick="rwizard.quiz_restart_yes_no (0)" checked />');
      } else {
         m.push (   '<input type="radio" name="rdgm_restart_yes_no" class="quiz_restart_no" onclick="rwizard.deck_restart_yes_no (0)" checked />');
      }
      m.push (      'No button');
      m.push (   '</label>');
      m.push ('</div>');
   }
   m.push ('</div>');
   m.push ('<div id="quiz_components_menu_overlay" onclick="rwizard.show_main_menu_disabled_msg ()" >');
   m.push (   '<div id="show_main_menu_disabled_msg">');
   m.push (      'Menu disabled; please do Cancel/discard or Done/save for hotspot editing');
   m.push (   '</div>');
   m.push ('</div>');
   $ ('#quiz_components_menu').html (m.join ('\n'));
}
this.show_main_menu_disabled_msg = function () {
   $ ('#show_main_menu_disabled_msg').show ().fadeOut (7000, 'easeInCubic');
}
this.start_modal = function (wp_tinymce_ed, rdgm_deck_html, page,
                             local_rwizard_php_f, local_page_title) {
   if (debug[0]) {
      console.log ('[start_modal] wp_tinymce_ed:', wp_tinymce_ed);
      var rdgm_deck_htmlx = rdgm_deck_html;
      if (rdgm_deck_htmlx.length > 250) {
         rdgm_deck_htmlx = rdgm_deck_htmlx.substr (0, 250) + ' ...';
      }
      console.log ('[start_modal] rdgm_deck_htmlx:', rdgm_deck_htmlx);
      console.log ('[start_modal] page:', page);
   }
   rwizard_php_f = local_rwizard_php_f ? 1 : 0;
   if (local_page_title) {
      page_title = local_page_title;
   }
   new_rdgm_deck_f = rdgm_deck_html == 'rdgm' || rdgm_deck_html == 'deck';
   if ('rdgm' == 'rdgm') {
      rdgm_edit.swhs_button_b = true;
      rdgm_deck  = 'rdgm';
      rdgm_qdeck = 'rdgm';
   } else {
      const first_five = rdgm_deck_html.substr (0, 5);
      const first_four = first_five.substr (0, 4);
      rdgm_deck  = first_four == 'rdgm' || first_five == '[rdgm' ? 'rdgm' : 'deck';
      rdgm_qdeck = rdgm_deck ==  'rdgm' ? 'rdgm' : 'qdeck';
   }
   if (! start_modal_first_call_f) {
      quiz_components_html ();
      accordion_panel_init ();
      new_question_type_menu_html ();
      $dialog_rwizard.dialog ('open');
   } else {
      start_modal_first_call_f = false;
      qw.set_rdgm_edit_plugin_url ();
      d = [];
      d.push ('<div id="dialog_rwizard" title="Wizard">');
      d.push (   '<div id="rwizard_wrapper">');
      d.push (      '<div id="rwizard">');
      d.push (      '</div>');
      d.push (      '<br />');
      d.push (      '<button class="rwizard_add_media" onmousedown="rwizard.rwizard_add_media (event, \'insert\')" disabled>');
      d.push (         'Add Media');
      d.push (      '</button>');
      d.push (      '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" style="width: 14px; height: 14px;" title="When you replace the sample image, any associated hotspots will be deleted; however, when you later replace your own image, hotspots will be kept.  This allows you to &ldquo;touch up&rdquo; the image users see, although your edited image (with hotspots) will not update." />');
      d.push (      '<span id="rwizard_dataset_question_not_editable">');
      d.push (         'Note: this question is from a dataset; it cannot be edited here');
      d.push (      '</span>');
      d.push (      '<span id="rwizard_dataset_card_not_editable">');
      d.push (         'Note: this card is from a dataset; it cannot be edited here');
      d.push (      '</span>');
      d.push (      '<div id="rwizard_result">');
      d.push (      '</div>');
      d.push (   '</div>');
      d.push (   '<div id="rwizard_shortcodes">');
      d.push (   '</div>');
      d.push ('</div>');
      $ ('body').append (d.join ('\n'));
      qw.init_rwizard (wp_tinymce_ed);
      if (! wp_editing_page_f) {
         if ($ ('#dialog_rwizard_media_upload').length == 0) {
            qw.add_dialog_rwizard_media_upload ();
         }
      }
      var save_label = wp_editing_page_f ? 'Save and exit' : 'Publish/update';
      var buttons = {};
      buttons['Discard changes']  = discard_edit;
      buttons[save_label] = rwizard_save_and_exit;
      $dialog_rwizard = $ ('#dialog_rwizard').dialog ({
         autoOpen:      true,
         closeOnEscape: false,
         draggable:     false,
         resizable:     true,
         width:         Math.round (window.innerWidth*1.00 - 20),
         height:        Math.round (window.innerHeight*1.00 - 50),
         modal:         true,
         buttons:       buttons
      });
      var delay_hide_close = function () {
         $ ('span.ui-dialog-title:contains("Wizard")').parents ('div.ui-dialog').addClass ('modal_dialog_rwizard');
         if (! wp_editing_page_f) {
            var links = '<a href="javascript: rwizard.view_edit_shortcodes ()" class="rwizard_view_edit_shortcodes">'
                      +    'View/edit shortcodes'
                      + '</a>'
                      + '<a href="javascript: rwizard.exit_view_edit_shortcodes ()" class="rwizard_exit_view_edit_shortcodes">'
                      +    'Return to Wizard editing'
                      + '</a>';
            $ ('div.modal_dialog_rwizard div.ui-dialog-titlebar').append (links);
            $ ('a.rwizard_view_edit_shortcodes').show ();
         }
      }
      setTimeout (delay_hide_close, 100);
      if ($ ('#bubbleBarWrapper').length == 0) {
         $ ('body').append ('<div id="bubbleBarWrapper"></div>');
      }
      rwizard_page = page;
   }
   qw.rwizard_start (rdgm_deck_html);
}
this.view_edit_shortcodes = function () {
   var text;
   if (rdgm_deck == 'rdgm') {
      update_hotspot_diagrams_question_text ();
      text = rdgm_shortcodes_text (true);
   } else {
      text = deck_shortcodes_text (true);
   }
   text = text.replace (/(<br>|<br \/>)*<span class="rwizard_smaller">[^]*?<\/span>/gm, '');
   var m = text.match (/<span class="rwizard_placeholder">([^])*?<\/span>/gm);
   if (m) {
      n_m = m.length;
      for (var i=0; i<n_m; i++) {
         text = text.replace (/<span class="rwizard_placeholder">([^]*?)<\/span>/m, '\$1');
      }
   }
   $ ('div#rwizard_wrapper').hide ();
   if (! shortcode_ed) {
      qw.init_tinymce ('#rwizard_shortcodes', true);
      shortcode_ed = current_editor;
   }
   $ ('#rwizard_shortcodes').html (text).show ();
   $ ('a.rwizard_view_edit_shortcodes').hide ();
   $ ('a.rwizard_exit_view_edit_shortcodes').show ();
}
this.exit_view_edit_shortcodes = function () {
   var new_text = $ ('#rwizard_shortcodes').html ();
   new_text = new_text.replace (/data-mce-style="[^"]*"/g, '');
   if (rdgm_deck == 'rdgm') {
      rdgm_.set_rdgmdata (-1, 'errmsgs', '[]');
      rdgm_.process_rdgm_pair (new_text, i_rdgm, true, true);
      for (var i_question=0; i_question<n_questions; i_question++) {
         var question = qw.questions_cards[i_question];
         if (question.type == 'multiple_choice') {
            if (question.n_choices == 1 ) {
               qw.errmsgs.push ('Multiple-choice question has only one answer-choice (question ' + (i_question + 1) + ')');
            }
         }
      }
   } else {
      qcard_.set_deckdata (-1, 'errmsgs', '[]');
      qcard_.process_qdeck_pair (new_text, i_rdgm, true, true);
   }
   if (qw.errmsgs.length) {
      var s = qw.errmsgs.length > 1 ? 's' : '';
      var errmsgs = qw.errmsgs.join ('\n');
      errmsgs = errmsgs.replace (/(rdgm|qdeck):\s*[0-9]+[,\s]*/g, '');
      var ok_f = confirm (  'Error' + s + ' found:\n\n'
                          + errmsgs + '\n\n'
                          + 'Continue? (hit cancel to stay in shortcodes editor)');
      qw.errmsgs = '';
      if (! ok_f) {
         return false;
      }
   }
   $ ('#rwizard_shortcodes').html ('').hide ();
   redraw_rdgm_deck (undefined);
   $ ('div#rwizard_wrapper').show ();
   $ ('a.rwizard_view_edit_shortcodes').show ();
   $ ('a.rwizard_exit_view_edit_shortcodes').hide ();
}
this.add_dialog_rwizard_media_upload = function (callback_routine) {
   var d = [];
   d.push ('<div id="dialog_rwizard_media_upload" title="Add image">');
   d.push (   'Currently, limited to images (' + allowed_media.join (', ') + ')');
   d.push (   '<br />');
   d.push (   '<br />');
   d.push (   '<input id="rwizard_media_url" type="text" placeholder="Enter image URL" onchange="rwizard.check_media_file_type (this.value)" onfocus="jQuery (\'#upload_media_file_feedback\').hide ()" style="width: 30em; border: 1px solid gray;" />');
   d.push (   '<button onmousedown="rwizard.insert_media_from_url ()">');
   d.push (      'Go');
   d.push (   '</button>');
   d.push (   '<br />');
   d.push (   '<p class="rwizard_center">');
   d.push (      '<b>&mdash;&mdash;&mdash;&mdash;&mdash; OR &mdash;&mdash;&mdash;&mdash;&mdash;</b>');
   d.push (   '</p>');
   d.push (   '<form id="media_file_upload_form" enctype="multipart/form-data">');
   d.push (   '<form name="media_file_upload_form" enctype="multipart/form-data">');
   d.push (      '<input name="media_file" type="file" onchange="rwizard.check_media_file_type (this.value)" style="width: 35em; border: 1px solid gray;" />');
   d.push (      '<br />');
   d.push (      '<br />');
   d.push (      '<input id="upload_media_file_button" type="button" onmousedown="rwizard.rwizard_upload_media_file (rwizard.rwizard_insert_media_file_callback)" value="Upload" />');
   d.push (      '<input name="page" type="hidden" value="rwizard_page" />');
   d.push (   '</form>');
   d.push (   '<br />');
   d.push (   '<div id="upload_media_file_feedback" style="display: none; font-weight: bold; color: red;">');
   d.push (   '</div>');
   d.push ('</div>');
   $ ('body').append (d.join ('\n'));
   $dialog_rwizard_media_upload = $ ('#dialog_rwizard_media_upload').dialog ({
      autoOpen:      false,
      closeOnEscape: false,
      draggable:     true,
      resizable:     false,
      width:         600,
      height:        350,
      modal:         true,
      buttons:       {Cancel:    close_media_upload}
   });
}
this.rwizard_add_media = function (event, insert_f, local_add_media_user_html_f) {
   if (debug[0]) {
      console.log ('[rwizard_add_media] disable_add_media_timeout:', disable_add_media_timeout);
   }
   prevent_editor_blur_event_b = true;
   clearTimeout (disable_add_media_timeout);
   add_media_user_html_f = local_add_media_user_html_f;
   if (! add_media_user_html_f) {
      $dialog_rwizard.parent ().hide ();
      $ ('div.ui-widget-overlay.ui-front').hide ();
   }
   if (current_editor) {
      var $edit_elm = $ (current_editor.targetElm);
      var tagName = $edit_elm.prop ('tagName');
      var replace_w_space_b = tagName.toLowerCase () == 'span';
      qw.remove_placeholder (null, $edit_elm, replace_w_space_b);
   } else {
      var $rdgmq;
      if (rdgm_deck == 'rdgm') {
         $rdgmq = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
      } else {
         $rdgmq = $dialog_rwizard.find (qcard_.get_card_front (i_rdgm));
      }
      var $rdgm_editable = $rdgmq.find ('div.rdgm_editable');
      if ($rdgm_editable.length) {
         var id = $rdgm_editable[0].id;
         current_editor = tinyMCE.get (id);
      }
   }
   if (wp_editing_page_f) {
      if ( rwizard_add_media_frame ) {
         rwizard_add_media_frame.open();
         return;
      }
      rwizard_add_media_frame = wp.media.frames.rwizard_add_media_frame = wp.media ({
         frame:      'post',
         title:      $ (this).data ('uploader_title'),
         button:     {
                        text: $ (this).data ('uploader_button_text'),
                     },
         multiple:   false  // Set to true to allow multiple files to be selected
      });
      rwizard_add_media_frame.on ('insert', function() {
         var attachment = rwizard_add_media_frame.state ().get ('selection').first ().toJSON ();
         if (debug[0]) {
            console.log ('[rwizard_add_media] > insert] attachment:', attachment)
            console.log ('                              current_editor:', current_editor);
            console.log ('                              attachment.url:', attachment.url);
         }
         get_embed_code (current_editor, attachment);
         $dialog_rwizard.parent ().show ();
         $ ('div.ui-widget-overlay.ui-front').show ();
      });
      rwizard_add_media_frame.on ('close', function() {
         $dialog_rwizard.parent ().show ();
         $ ('div.ui-widget-overlay.ui-front').show ();
      });
      rwizard_add_media_frame.open ();
      var delay_reset_media_menu = function () {
         $( 'div.media-menu').html ('');
      }
      setTimeout (delay_reset_media_menu, 200);
   } else {
      rwizard_upload_media_file_callback_routine = rwizard_insert_media_file_callback;
      $dialog_rwizard_media_upload.dialog ('open');
      if (typeof (maker_id) == 'undefined' || ! maker_id) {
         $ ('#upload_media_file_feedback').html ('Please log in in order to save uploaded images (&ldquo;Cancel&rdquo; this box, then &ldquo;Publish/update&rdquo;, then &ldquo;Edit&rdquo;).  Copy-and-paste may work as a shortcut (depending on your browser).').show ();
         $ ('#upload_media_file_button').attr ('disabled', true);
      } else {
         $ ('#upload_media_file_feedback').hide ();
         $ ('#upload_media_file_button').removeAttr ('disabled');
      }
   }
}
this.check_media_file_type = function (filename) {
   if (debug[0]) {
      console.log ('[check_media_file_type] filename:', filename);
   }
   var file_ext = 'xyzzy';
   var m = filename.match (/\.([^.]*)$/);
   if (m) {
      file_ext = m[1].toLowerCase ();
   }
   var ok_f = allowed_media.indexOf (file_ext) != -1;
   if (ok_f) {
      $ ('#upload_media_file_feedback').hide ();
      $ ('#upload_media_file_button').removeAttr ('disabled');
   } else {
      $ ('#upload_media_file_feedback').html ('File is not one of allowed types (' + allowed_media.join (', ') + ')').show ();
      $ ('#upload_media_file_button').attr ('disabled', true);
   }
   return ok_f;
}
this.rwizard_upload_media_file = function () {
   var url = '/admin/receive_media_file.php';
   var f = document.forms.media_file_upload_form;
   var formData = new FormData (f);
   $.ajax({
      type:          'POST',
      url:           url,
      data:          formData,
      dataType:      'json',
      error:         function (xhr, desc, exceptionobj) {
                        console.log ('[media_file_upload] error desc:', desc);
                     },
      success:       rwizard_upload_media_file_callback_routine,
      cache:         false,
      contentType:   false,
      processData:   false,
      /*
      xhr:           function () {
                        var myXhr = $.ajaxSettings.xhr ();
                        if(myXhr.upload) {
                           myXhr.upload.addEventListener ('div#progress', progressHandlingFunction, false);
                        }
                        return myXhr;
                     },
       */
   });
}
function rwizard_insert_media_file_callback (data) {
   if (debug[0]) {
      console.log ('[rwizard_insert_media_file_callback] data:', data);
   }
   if (data.errmsg) {
      $ ('#upload_media_file_feedback').html (data.errmsg).show ();
   } else {
      var media_html = '<img src="' + data.image_url + '" />';
      dialog_insert_image_or_code (media_html);
   }
}
this.insert_media_from_url = function () {
   var media_url = $ ('input#rwizard_media_url').val ();
   if (qw.check_media_file_type (media_url)) {
      var media_html = '<img src="' + media_url + '" />';
      url_exists (media_url, media_html, dialog_insert_image_or_code, url_exists_error);
   }
}
function url_exists (url, html, success, fail) {
  var img = new Image ();
  img.onload = function () {
     success (html);
  };
  img.onerror = function () {
     fail ();
  };
  img.src = url;
}
function url_exists_error () {
   $ ('#upload_media_file_feedback').html ('Could not find image -- please check the URL').show ();
   $ ('#upload_media_file_button').attr ('disabled', true);
}
function dialog_insert_image_or_code (media_html) {
   if (debug[0]) {
      console.log ('[dialog_insert_image_or_code] media_html:', media_html);
   }
   var ok_f = insert_image_or_code (current_editor, media_html);
   if (ok_f) {
      close_media_upload ();
   } else {
      $ ('#upload_media_file_feedback').html ('Sorry, it didn&rsquo;t work. Please Cancel and try again').show ();
      $ ('#upload_media_file_button').attr ('disabled', true);
   }
}
function rwizard_card_back_media_file_callback (data) {
   if (debug[0]) {
      console.log ('[rwizard_card_back_media_file_callback] data:', data);
   }
   if (data.errmsg) {
      $ ('#upload_media_file_feedback').html (data.errmsg).show ();
   } else {
      var image_html = '<img src="' + data.image_url + '" />';
      dialog_insert_image_or_code (image_html);
   }
}
function close_media_upload () {
   $dialog_rwizard_media_upload.dialog ('close');
   if (! add_media_user_html_f) {
      $dialog_rwizard.parent ().show ();
      $ ('div.ui-widget-overlay.ui-front').show ();
   }
}
function get_embed_code (editor, attachment) {
   var get_embed_code_callback = function (embed_codes) {
      if (debug[0]) {
         console.log ('[get_embed_code_callback] embed_codes:', embed_codes);
      }
      var embed_code = embed_codes[0];
      if (! embed_code) {
         if (attachment.mime.substr (0, 5) == 'image') {
            embed_code = '&nbsp;<br /><img src="' + attachment.url + '" />&nbsp;<br />';
         } else if (attachment.mime.substr (0, 5) == 'audio') {
            embed_code = '&nbsp;<br /><video controls data-audio_video="audio" height="30" width="280" src="' + attachment.url + '"></video>&nbsp;<br />';
         } else if (attachment.mime.substr (0, 5) == 'video') {
            embed_code = '&nbsp;<br /><video controls data-audio_video="video" height="' + attachment.height + '" width="' + attachment.width + '" src="' + attachment.url + '" width="' + attachment.width + '" height="' + attachment.height + '"></video>&nbsp;<br />';
         } else {
            embed_code = attachment.url;
         }
      }
      insert_image_or_code (editor, embed_code);
   }
   get_embed_code_callback ([false]);
   /*
   var ajaxurl = rdgm_edit_params.ajaxurl;
   var urls = [attachment.url];
   var data = {action:     'process_embeds',
               urls:        encodeURIComponent (JSON.stringify (urls))
              };
   $.ajax ({
      type:       'POST',
      url:        ajaxurl,
      data:       data,
      success:    get_embed_code_callback
   });
   */
}
function insert_image_or_code (editor, image_code) {
   if (debug[0]) {
      console.log ('[insert_image_or_code]: editor:', editor);
      console.log ('[insert_image_or_code]: image_code:', image_code);
   }
   var ok_f = true;
   if (   i_question < 0
       || i_question >= n_questions
       || (   qw.questions_cards[i_question].type != 'hotspot_diagram'
           && qw.questions_cards[i_question].type != 'labeled_diagram'
           && qw.questions_cards[i_question].type != 'hangman_labeled_diagram')) {
      var selected_content = editor.selection.getContent ();
      editor.selection.setContent (selected_content + image_code);
      if (rdgm_deck == 'deck') {
         qcard_.set_container_width_height (i_rdgm);
      }
      var content = editor.getContent ();
      if (content.indexOf (image_code.substr (0, 10)) == -1) {
         if (debug[0]) {
            console.log ('[insert_image_or_code]: didn\'t work; content:', content);
         }
         ok_f = false;
      } else {
         var $audio = $ (editor.targetElm).find ('audio');
         if ($audio.length) {
            if (debug[0]) {
               console.log ('[insert_image_or_code]: $audio:', $audio);
            }
         }
      }
   } else if (qw.questions_cards[i_question].type == 'hotspot_diagram') {
      var m = image_code.match (/src="([^"]*)/);
      if (m) {
         const src = m[1];
         var $rdgmq;
         if (rdgm_deck == 'rdgm') {
            $rdgmq = $dialog_rwizard.find ('#rdgm' + i_rdgm + '-q' + i_question);
         } else {
            $rdgmq = $dialog_rwizard.find (qcard_.get_card_front (i_rdgm));
         }
         const $orig_img = $rdgmq.find ('img.rdgm_layer0');
         if ($orig_img.length) {
            const orig_img_el = $orig_img[0];
            const is_sample_image = orig_img_el.src.indexOf ('sample_hotspot_image') != -1 || orig_img_el.src.indexOf ('sample_r_diagrams_image') != -1;
            orig_img_el.src = src;
            qw.questions_cards[i_question].hotspot_image_src = src;
            if (is_sample_image) {
               orig_img_el.onload = function () {
                  orig_img_el.style.width  = 'fit-content';
                  orig_img_el.style.height = 'fit-content';
                  const width  = $orig_img.width ();
                  const height = $orig_img.height ();
                  const $hotspot_image_stack = $rdgmq.find ('div.hotspot_image_stack');
                  $hotspot_image_stack.css ({width: width + 'px', height: height + 'px'});
                  const $canvas = $rdgmq.find ('canvas.layer0_edited');
                  $canvas.attr ('width', width).attr ('height', height);
                  orig_img_el.style.width  = '';
                  orig_img_el.style.height = '';
                  qw.questions_cards[i_question].canvas_el = '';
                  qw.init_hotspot_image_canvas ();
                  const ctx       = qw.questions_cards[i_question].ctx;
                  const canvas_el = qw.questions_cards[i_question].canvas_el;
                  check_image_alphas (ctx, canvas_el.width, canvas_el.height);
               }
               $hotspot_image_stack.find ('div.rdgm_hotspot_label').remove ();
               const $canvas = $rdgmq.find ('canvas.layer0_edited');
               make_hotspot_image_stack_resizable ($hotspot_image_stack, $canvas);
            }
         } else {
            console.log ('[insert_image_or_code] error: img.rdgm_layer0');
         }
      } else {
         console.log ('[insert_image_or_code] image_code:', image_code);
      }
   } else {
      var $img_wrapper;
      if (rdgm_deck == 'rdgm') {
         $img_wrapper = $ ('#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm_edit_image');
      } else {
         $img_wrapper = $dialog_rwizard.find (qcard_.get_card_front (i_rdgm)).find ('div.rdgm_edit_image');
      }
      var $image = $img_wrapper.find ('img');
      if ($image.length) {
         $image.replaceWith (image_code);
      } else {
         $img_wrapper.append (image_code);
      }
      /*
      var delay_reset_wrapper_width_height = function () {
         var $image   = $img_wrapper.find ('img');
         var img_width  = $image.width ();
         var img_height = $image.height ();
         if (debug[0]) {
            console.log ('[insert_image_or_code] $image:', $image, ', img_width:', img_width, ', img_height:', img_height);
         }
         $img_wrapper.css ({width: img_width + 'px', height: img_height + 'px'});
      };
      setTimeout (delay_reset_wrapper_width_height, 200);
      */
      if (rdgm_deck == 'rdgm') {
         editor = tinyMCE.get ('rdgm_edit_canvas-rdgm' + i_rdgm + '-q' + i_question);
      } else {
         editor = tinyMCE.get ('qcard_front-part1-qdeck' + i_rdgm);
      }
   }
   if (editor) {
      current_editor = editor;
      if (current_editor.targetElm) {
         if (rdgm_deck == 'rdgm') {
            var delay_blur = function () {
               current_editor.no_editing_field_blur_f = true;
               rdgm_editing_field_blur (current_editor.targetElm);
            }
            setTimeout (delay_blur, 150);
         } else {
            current_editor.no_editing_field_blur_f = true;
            deck_editing_field_blur (current_editor.targetElm);
         }
      }
      editor.focus ();
   }
   return ok_f;
}
this.rwizard_start = function (rdgm_deck_html) {
   if (debug[0]) {
      console.log ('[rwizard_start] rdgm_deck_html:', rdgm_deck_html);
   }
   rdgm_edit.rwizard_b = true;
   rdgm_.rwizard_b    = true;
   if (rdgm_deck_html == 'rdgm') {
      $ ('#quiz_components_menu').show ();
      qw.create_new_quiz ();
      new_rdgm_deck_f = true;
      rdgm_.rdgm_init ();
      if (rdgm_edit.swhs_button_b) {
         qw.rdgm_deck_style ('border-width', '0');
         var select_el = $ ('#border_width')[0];
         set_selectedIndex (select_el, '0');
      }
   } else if (rdgm_deck_html == 'deck') {
      $ ('#quiz_components_menu').show ();
      qw.create_new_deck ();
      new_rdgm_deck_f = true;
      qcard_.qdeck_init (true, true);
      qcard_.qdeck_init2 (1, true);
      qcard_.process_card_attributes (i_rdgm, []);
   } else {
      new_rdgm_deck_f = false;
      rdgm_deck_html = rdgm_deck_html.replace (/<span id="qbookmark[^<]+<\/span>/g, '');
      var new_rdgm_deck_html;
      if (rdgm_deck == 'rdgm') {
         rdgm_.rdgm_init (true, true);
         default_unit = '';
         new_rdgm_deck_html
                 = rdgm_.process_rdgm_pair (rdgm_deck_html, i_rdgm, true, true);
         if (debug[1]) {
            console.log ('[rwizard_start] qw.questions_cards:', qw.questions_cards);
         }
         $ ('#rwizard_result').html (new_rdgm_deck_html);
         if (header_text != '') {
            $ ('input[name="rdgm_header_yes_no"].quiz_header_yes').prop ('checked', true);
         }
         if (! rdgm_.no_intro_b[i_rdgm]) {
            $ ('input[name="rdgm_intro_yes_no"].quiz_intro_yes').prop ('checked', true);
         }
         if (exit_text.search (/\[restart/) != -1) {
            $ ('input[name="rdgm_restart_yes_no"].quiz_restart_yes').prop ('checked', true);
         }
         $ ('#quiz_components_menu').show ();
         qw.questions_list_html ();
         if (n_questions) {
            qw.highlight_accordion_question (0);
         }
         var intro_div_selector = 'div.intro-rdgm' + i_rdgm;
         if (rdgm_.no_intro_b[i_rdgm] || n_questions == 1) {
            $ (intro_div_selector).hide ();
            rdgm_.set_rdgmdata (i_rdgm, 'i_question', -1);
            if (debug[0]) {
               console.log ('[rwizard_start] calling rdgm_.next_question ()');
            }
            rdgm_.next_question (i_rdgm, false, true);
         } else {
            var use_dataset_questions_htm = rdgm_.get_rdgmdata (i_rdgm, 'use_dataset_questions_htm');
            if (use_dataset_questions_htm) {
               rdgm_.set_rdgmdata (i_rdgm, 'i_question', -1);
               rdgm_.next_question (i_rdgm);
               var delay_go_to_question = function () {
                  if (debug[0]) {
                     console.log ('[rwizard_start > delay_go_to_question]');
                  }
                  qw.go_to_question (-1, true);
               }
               setTimeout (delay_go_to_question, 2500);
            }
            qw.init_tinymce (intro_div_selector);
            $ ('div.rwizard_accordion').accordion ('option', 'active', INTRO_ACCORDION);
         }
         $ ('div.rdgm-parts').each (function () {
            adjust_edit_part ($ (this));
         });
         for (var ii_question=0; ii_question<n_questions; ii_question++) {
            var question = qw.questions_cards[ii_question];
            if (question.type == 'labeled_diagram') {
               var $content = $ ('#rdgm' + i_rdgm + '-q' + ii_question);
               rdgm_.init_rdgm_edit2 ($content, i_rdgm, ii_question);
            } else if (question.type == 'hangman_labeled_diagram') {
               delete_hangman_labeled_diagram_fields_div (question, true);
               if (ii_question == 0) {
                  var $rdgmq = $ ('div#rdgm' + i_rdgm + '-q' + ii_question);
                  $rdgmq.find ('div.hangman_label').addClass ('ui-draggable ui-draggable-handle ui-resizable');
                  qw.set_hangman_label_width ($rdgmq);
                  qw.position_hangman_fields_div ($rdgmq);
                  var delay_reinit = function () {
                     rdgm_edit.reinit_dragging ($rdgmq, true);
                  }
                  setTimeout (delay_reinit, 100);
               }
            }
         }
      } else {
         default_unit = '';
         qcard_.qdeck_init (true, true);
         new_rdgm_deck_html
               = qcard_.process_qdeck_pair (rdgm_deck_html, i_rdgm, true, true);
         if (debug[1]) {
            console.log ('[rwizard_start] qw.questions_cards:', qw.questions_cards);
         }
         $ ('#rwizard_result').html (new_rdgm_deck_html);
         if (header_text != '') {
            $ ('input[name="rdgm_header_yes_no"].quiz_header_yes').prop ('checked', true);
         }
         if (! qcard_.no_intro_b[i_rdgm]) {
            $ ('input[name="rdgm_intro_yes_no"].quiz_intro_yes').prop ('checked', true);
         }
         if (exit_text.search (/\[restart/) != -1) {
            $ ('input[name="rdgm_restart_yes_no"].quiz_restart_yes').prop ('checked', true);
         }
         $ ('#quiz_components_menu').show ();
         qcard_.qdeck_init2 (1);
         if (! qcard_.no_intro_b[i_rdgm] && n_questions > 1) {
            $ ('div.rwizard_accordion').accordion ('option', 'active', INTRO_ACCORDION);
         }
         $ ('div.rdgm-parts').each (function () {
            adjust_edit_part ($ (this));
         });
         qw.cards_list_html ();
         if (n_questions) {
            qw.highlight_accordion_question (0);
         }
         for (var ii_question=0; ii_question<n_questions; ii_question++) {
            var question = qw.questions_cards[ii_question];
            if (question.type == 'hangman_labeled_diagram') {
               delete_hangman_labeled_diagram_fields_div (question, true);
            }
         }
      }
   }
   browse_records_shown             = 25;
   browse_search_words_array        = [''];
   browse_search_question_card_type = '';
   browse_search_unit_topic         = '';
   browse_scrollY                   = 0;
   if (rdgm_edit.rdgm_button_b) {
      var qrecord_id;
      if (rdgm_deck == 'rdgm') {
         qrecord_id = rdgm_.get_rdgmdata (0, 'qrecord_id');
      } else {
         qrecord_id = qcard_.get_deckdata (0, 'qrecord_id');
      }
      if (qrecord_id) {
         $ ('#enable_progress_recording_checkbox')[0].checked = true;
      }
      if (rdgm_deck == 'rdgm') {
         qw.dataset_b = rdgm_.dataset_b
      } else {
         qw.dataset_b = qcard_.dataset_b
      }
      if (qw.dataset_b) {
         $ ('#save_as_dataset_checkbox')[0].checked = true;
      }
      var questions_cards_to_show;
      if (rdgm_deck == 'rdgm') {
         questions_cards_to_show = rdgm_.get_rdgmdata (i_rdgm, 'questions_to_show');
      } else {
         questions_cards_to_show = qcard_.get_deckdata (i_rdgm, 'cards_to_show');
      }
      if (questions_cards_to_show) {
         $ ('input#questions_cards_to_show').val (questions_cards_to_show);
      }
      var random_b;
      if (questions_cards_to_show) {
         random_b = true;
      } else {
         if (rdgm_deck == 'rdgm') {
            random_b = rdgm_.get_rdgmdata (i_rdgm, 'random_b');
         } else {
            random_b = qcard_.get_deckdata (i_rdgm, 'random_b');
         }
      }
      if (random_b) {
         $ ('input.random_true')[0].checked = true;
      }
      if (questions_cards_to_show) {
         $ ('input[name="rdgm_random"]').attr ('disabled', true);
         $ ('tr.rdgm_random').css ({color: 'gray'});
      }
      var repeat_incorrect_b;
      if (rdgm_deck == 'rdgm') {
         repeat_incorrect_b = rdgm_.get_rdgmdata (i_rdgm, 'repeat_incorrect_b');
         if (! repeat_incorrect_b) {
            $ ('input.repeat_incorrect_false')[0].checked = true;
         }
      }
      var hide_forward_back_b;
      if (rdgm_deck == 'rdgm') {
         hide_forward_back_b = rdgm_.get_rdgmdata (i_rdgm, 'hide_forward_back_b');
      } else {
         hide_forward_back_b = qcard_.get_deckdata (i_rdgm, 'hide_forward_back_b');
      }
      if (hide_forward_back_b) {
         $ ('input.bck_fwd_options_no')[0].checked = true;
      } else {
         $ ('input.bck_fwd_options_yes')[0].checked = true;
      }
   }
   hide_progress_b;
   if (rdgm_deck == 'rdgm') {
      hide_progress_b = rdgm_.get_rdgmdata (i_rdgm, 'hide_progress_b');
   } else {
      hide_progress_b = qcard_.get_deckdata (i_rdgm, 'hide_progress_b');
   }
   if (hide_progress_b) {
      $ ('input.progress_options_no')[0].checked = true;
   } else {
      $ ('input.progress_options_yes')[0].checked = true;
   }
   var rdgm_qdeck_timer = '';
   if (rdgm_deck == 'rdgm') {
      rdgm_qdeck_timer = parseInt (rdgm_.get_rdgmdata (i_rdgm, 'question_time_limit'));
   } else {
      rdgm_qdeck_timer = parseInt (qcard_.get_deckdata (i_rdgm, 'card_time_limit'));
   }
   if (! rdgm_qdeck_timer) {
      if (rdgm_deck == 'rdgm') {
         rdgm_qdeck_timer = rdgm_.get_rdgmdata (i_rdgm, 'rdgm_timer');
      }
   }
   if (rdgm_qdeck_timer === true) {
      $ ('input.rdgm_deck_timer_elapsed')[0].checked = true;
   } else if (rdgm_qdeck_timer && qqc.isInteger (rdgm_qdeck_timer)) {
      $ ('input.rdgm_deck_timer_limit')[0].checked = true;
      $ ('input#question_card_time_limit_sec').val (rdgm_qdeck_timer);
   } else {
      $ ('input.rdgm_deck_timer_none')[0].checked = true;
   }
   if (rdgm_deck == 'deck') {
      var hide_flip_b = qcard_.get_deckdata (i_rdgm, 'hide_flip_b');
      if (hide_flip_b) {
         $ ('input.flip_options_no')[0].checked = true;
      } else {
         $ ('input.flip_options_yes')[0].checked = true;
      }
      var hide_gotit_b = qcard_.get_deckdata (i_rdgm, 'hide_gotit_b');
      if (hide_gotit_b) {
         $ ('input.gotit_options_no')[0].checked = true;
      } else {
         $ ('input.gotit_options_yes')[0].checked = true;
      }
      var hide_shuffle_b = qcard_.get_deckdata (i_rdgm, 'hide_shuffle_b');
      if (hide_shuffle_b) {
         $ ('input.shuffle_options_no')[0].checked = true;
      } else {
         $ ('input.shuffle_options_yes')[0].checked = true;
      }
      var axis = qcard_.get_deckdata (i_rdgm, 'flip_axis');
      if (axis == 'y') {
         $ ('input.flipdir_options_left_right')[0].checked = true;
      } else if (axis == 'x') {
         $ ('input.flipdir_options_up_down')[0].checked = true;
      }
      var font_weight_normal = qcard_.get_deckdata (i_rdgm, 'font_weight_normal');
      if (font_weight_normal) {
         $ ('input.bold_text_options_no')[0].checked = true;
      } else {
         $ ('input.bold_text_options_yes')[0].checked = true;
      }
   }
   var align;
   var $rdgm_deck;
   var $qcard_card_back;
   if (rdgm_deck == 'rdgm') {
      align = rdgm_.get_rdgmdata (i_rdgm, 'align');
      $rdgm_deck = $ ('#rdgm' + i_rdgm);
   } else {
      align = qcard_.get_deckdata (i_rdgm, 'align');
      $qcard_card_back = $ ('div.qcard_card-qdeck' + i_rdgm + ' div.qcard-back');
      $rdgm_deck = $qcard_card_back;
   }
   if (align == 'center') {
      $ ('input.align_options_center')[0].checked = true;
   } else if (align == 'right') {
      $ ('input.align_options_right')[0].checked = true;
   } else if (align == 'tiled') {
      $ ('input.align_options_tiled')[0].checked = true;
   }
   if (rdgm_deck == 'deck') {
      var style = $qcard_card_back.attr ('style');
      if (style) {
         var m = style.match (/background\s*:\s*([^; ]+)/);
         if (m) {
            var value = m[1];
            if (value.indexOf ('none') != -1) {
               set_selectedIndex ($ ('#card_background')[0], 'none');
            }
         }
      }
   }
   var spacing;
   if (rdgm_deck == 'rdgm') {
      spacing = rdgm_.get_rdgmdata (i_rdgm, 'spacing');
   } else {
      spacing = qcard_.get_deckdata (i_rdgm, 'spacing');
   }
   $ ('input.spacing_px').val (spacing);
   var scroll_b;
   if (rdgm_deck == 'rdgm') {
   } else {
      scroll_b = qcard_.get_deckdata (i_rdgm, 'scroll_b');
   }
   if (scroll_b) {
      $ ('input.rdgm_scroll')[0].checked = true;
   }
   var style = $rdgm_deck.attr ('style');
   if (style) {
      if (rdgm_deck == 'rdgm') {
         var m = style.match (/width\s*:\s*([^; A-Za-z]+)/);
         if (m) {
            $ ('input.width_px').val (m[1]);
         }
         var re = new RegExp ('min-height\\s*:\\s*([^; A-Za-z]+)');
         var m = style.match (re);
         if (m) {
            $ ('input.height_px').val (m[1]);
         }
      } else {
         var card_width  = qcard_.get_deckdata (i_rdgm, 'card_width_setting');
         var card_height = qcard_.get_deckdata (i_rdgm, 'card_height_setting');
         if (card_width) {
            $ ('input.width_px').val (card_width.substr (0, card_width.length - 2));
         } else {
            $ ('input.width_px').val (500);
         }
         if (card_height) {
            $ ('input.height_px').val (card_height.substr (0, card_height.length - 2));
         } else {
            $ ('input.height_px').val (300);
         }
      }
      var m = style.match (/border-width\s*:\s*([^; ]+)/);
      if (m) {
         var value = m[1];
         var select_el = $ ('#border_width')[0];
         set_selectedIndex (select_el, value);
      }
      var m = style.match (/border-style\s*:\s*([^; ]+)/);
      if (m) {
         var value = m[1];
         var select_el = $ ('#border_style')[0];
         set_selectedIndex (select_el, value);
      }
      var m = style.match (/border-color\s*:\s*([^;]+)/);
      if (m) {
         var value = m[1];
         $ ('div.simpleColorDisplay').css ('background-color', value);
      }
   }
}
function delete_hangman_labeled_diagram_fields_div (question, save_f) {
   var question_text = question.question_text;
   var pos = question_text.search (/<div[^>]+hangman_labeled_diagram_fields/);
   if (pos != -1) {
      var hangman_fields_div = qqc.find_matching_block (question_text.substr (pos));
      question.question_text = question_text.replace (hangman_fields_div, '');
      if (save_f) {
         var m = hangman_fields_div.match (/>([^]*)<\/div>$/);
         if (m) {
            question.hangman_fields = m[1];
         }
      }
   }
}
function adjust_edit_part ($part) {
   var part_html = $part.html ();
   part_html = part_html.replace (/\cJ/, '');
   var m = part_html.match ('<p>');
   if (m) {
      if (m.length == 1) {
         if (part_html.search (/^\s*<p>/) != -1) {
            part_html = part_html.replace (/<p>|<\/p>/g, '');
            $part.html (part_html);
         }
      }
   } else {
      if (part_html.indexOf ('</p>')) {
         part_html = part_html.replace (/<\/p>/g, '');
         $part.html (part_html);
      }
   }
};
this.create_new_quiz = function () {
   rdgm_deck_inits ();
   rdgm_.set_rdgmdata (-1, 'rdgmdata', '[]');
   var htm = [];
   htm.push ('[rdgm]');
   htm.push ('[x]' + exit_placeholder);
   htm.push ('[/rdgm]');
   htm = htm.join ('\n');
   htm = rdgm_.process_rdgm_pair (htm, i_rdgm, true);
   $ ('#rwizard_result').html (htm);
   qw.questions_list_html ();
   $ ('div.intro-rdgm' + i_rdgm).hide ();
   $ ('#next_button-rdgm' + i_rdgm).hide ();
   if (rdgm_edit.rdgm_button_b) {
      const position_el = $ ('#rwizard_questions')[0];
      qw.show_new_question_type_menu (position_el);
   } else {
      qw.new_hotspot_diagram_question ();
   }
}
this.create_new_deck = function () {
   rdgm_deck_inits ();
   qcard_.set_deckdata (-1, 'deckdata', '[]');
   var htm = [];
   htm.push ('[qdeck]');
   htm.push ('[x]' + exit_placeholder);
   htm.push ('[/qdeck]');
   htm = htm.join ('\n');
   qcard_.rwizard_b = true;
   htm = qcard_.process_qdeck_pair (htm, i_rdgm, true);
   $ ('#rwizard_result').html (htm);
   qw.cards_list_html ();
   $ ('#qcard_front-part1-qdeck' + i_rdgm + ', #qcard_front-part2-qdeck' + i_rdgm).hide ();
   var position_el = $ ('#rwizard_questions')[0];
   qw.show_new_question_type_menu (position_el);
}
function rdgm_deck_inits () {
   header_text = '';
   intro_text = '';
   n_questions = 0;
   qw.questions_cards = [];
   qw.unit_names      = [];
   qw.topic_names     = [];
   rdgm_deck_attributes = '';
}
this.new_multiple_choice_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = new_multiple_choice_question_data (1);
   qw.questions_cards[i_question] = question;
   create_and_show_new_question (question.type);
}
this.new_show_me_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type           = 'show_me';
   question.n_choices      = 1;
   question.correct_choice = 0;
   question.choices_inline = false;
   question.question_text = question_placeholder (i_question+1);
   question.choices   = ['[show_me_placeholder]'];
   question.feedbacks = [  '<span class="rwizard_placeholder">'
                         +    'Feedback for button click'
                         + '</span>&hairsp;'];
   qw.questions_cards[i_question] = question;
   create_and_show_new_question (question.type);
}
this.new_hotspot_diagram_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type = 'hotspot_diagram';
   var q = [];
   q.push (   '<span class="rwizard_placeholder">'
            +    'Enter (optional) text'
            +    '<br />'
            +    '<span class="rwizard_smaller">'
            +       '(select text to format, or leave as is for no text)'
            +    '</span>'
            + '</span>&hairsp;');
   q.push (   '</p>');
   const sample_img = rdgm_edit.rdgm_button_b ? 'sample_hotspot_image.png' : 'sample_r_diagrams_image.svg';
   const height     = rdgm_edit.rdgm_button_b ? '292' : '400';
   q.push (   '<div class="hotspot_image_stack" style="width: 400px; height: ' + height + 'px;">');
   q.push (       '<canvas class="layer0_edited" width="400" height="' + height + '"></canvas>');
   q.push (       '<img class="rdgm_layer0 hotspot_image_layer" src="' + rdgm_edit_plugin_url + 'images/' + sample_img + '" />');
   q.push (       '<img class="layer0_edited hotspot_image_layer" />');
   q.push (   '</div>');
   question.question_text = q.join ('');
   question.correct_hotspot = -1;
   question.choices = [answer_choice_placeholder (1)];
   question.feedbacks = [answer_choice_feedback_placeholder (1)];
   qw.questions_cards[i_question] = question;
   spotmap_width  = 100;
   spotmap_height = 100;
   sparsemap      = false;
   create_and_show_new_question (question.type, true);
}
this.new_labeled_diagram_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type           = 'labeled_diagram';
   question.n_labels       = 1;
   question.labels_inline  = false;
   var q = [];
   var assoc_id = parseInt (new Date ().getTime ()/1000.0, 10);
   q.push ('<div class="rdgm_edit_canvas rdgm_editable rdgm-question">');
   q.push (   '[q]'
            + '<span class="rwizard_placeholder">'
            +    'Enter text'
            +    '<br />'
            +    '<span class="rwizard_smaller">'
            +       '(select text to format)'
            +    '</span>'
            + '</span>&hairsp;');
   q.push (   '<br />');
   q.push (   '<div id="rdgm_edit_img_wrapper-' + assoc_id + '" class="rdgm_edit_image alignnone size-full wp-image-50" style="position: relative; width: 180px; height: 221px; margin: 0px;">');
   q.push (      '<div class="rdgm_edit_target-' + assoc_id + ' rdgm_edit_target rdgm_edit_border_class_dotted rdgm_edit_border_class_red rdgm_edit_border_class_width ui-draggable ui-draggable-handle ui-resizable" style="left: 156px; top: 11px; width: 120px; right: auto; height: 28px; bottom: auto; position: relative;">');
   q.push (      '</div>');
   q.push (      '<img class=" size-full wp-image-50" style="max-width: none; padding: 0px; border: 0px none;" width="180" height="221" src="' + rdgm_edit_plugin_url + 'images/sample_image.png" />');
   q.push (   '</div>');
   q.push (   '<p>');
   q.push (      '&emsp; &emsp;');
   q.push (   '</p>');
   q.push (   '<div style="clear: both;"></div>');
   q.push ('</div>');
   question.question_text = q.join ('');
   var l = [];
   l.push ('<div class="rdgm_edit_label qtarget_assoc' + assoc_id + '">');
   l.push (   '<span class="rdgm_edit_highlight_label rdgm_editable rdgm_edit_border_class_red rdgm_edit_border_class_dotted rdgm_edit_border_class_width">');
   l.push (      '[l]' + label_placeholder ());
   l.push (   '</span>');
   l.push ('</div>');
   question.labels = [l.join ('\n')];
   question.feedback_corrects = [label_correct_feedback_placeholder (1)];
   question.feedback_incorrects = [label_incorrect_feedback_placeholder (1)];
   qw.questions_cards[i_question] = question;
   create_and_show_new_question (question.type, true);
   var delay_feedback = function () {
      $ ('div.rdgm_edit_main_menu_feedback').html ('You can position and resize the target "drop zone" how you want in relation to the image.').show ().fadeOut (10000, 'easeInCubic');
   }
   setTimeout (delay_feedback, 500);
}
this.new_hangman_labeled_diagram_question_card = function () {
   if (debug[0]) {
      console.log ('[new_hangman_labeled_diagram_question_card]');
   }
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type      = 'hangman_labeled_diagram';
   question.n_choices = 1;
   var assoc_id = parseInt (new Date ().getTime ()/1000.0, 10);
   var q = [];
   if (rdgm_deck == 'rdgm') {
      q.push ('<div id="rdgm_edit_canvas-rdgm' + i_rdgm + '-q' + i_question + '" class="rdgm_edit_canvas rdgm_editable rdgm-question hangman_labeled_diagram" style="padding: 0">');
   }
   q.push (   '[q]'
            + '<span class="rwizard_placeholder">'
            +    'Enter text'
            + '</span>&hairsp;');
   q.push (   '<br />');
   q.push (   '<div id="hangman_img_wrapper-' + assoc_id + '" class="rdgm_edit_image hangman_image alignnone size-full wp-image-50" style="display: inline-block; position: relative; margin: 0px;">');
   q.push (      '<img class=" size-full wp-image-50" style="max-width: none; padding: 0px; border: 0px none;" width="180" height="221" src="' + rdgm_edit_plugin_url + 'images/sample_image.png" />');
   q.push (   '</div>');
   q.push (   '<div style="clear: both;"></div>');
   if (rdgm_deck == 'rdgm') {
      q.push ('</div>');
   }
   question.question_text = q.join ('');
   var left  = rdgm_deck == 'rdgm' ? '150' : '210';
   var width = rdgm_deck == 'rdgm' ? '140' : '160';
   var h = [];
   h.push ('<div class="hangman_label ui-draggable ui-draggable-handle ui-resizable" style="left: ' + left + 'px; top: 100px; width: ' + width + 'px; height: 28px; position: absolute; text-align: left; z-index: 3;">');
   h.push (   '[hangman]');
   h.push ('</div>');
   question.hangman_fields = h.join ('');
   question.choices    = ['placeholder'];
   qw.hangman_i_choice = 0;
   if (rdgm_deck == 'rdgm') {
      question.feedbacks = [hangman_question_feedback_placeholder];
   } else {
      question.answer_text = hangman_card_feedback_placeholder;
   }
   qw.questions_cards[i_question] = question;
   if (rdgm_deck == 'rdgm') {
      create_and_show_new_question (question.type, true);
   } else {
      create_and_show_new_card (question.type);
   }
   if (rdgm_deck == 'rdgm') {
      var $rdgmq_id = $ ('div#rdgm' + i_rdgm + '-q' + i_question);
      qw.position_hangman_fields_div ($rdgmq_id);
      rdgm_edit.reinit_dragging ($rdgmq_id, true);
   }
   var delay_feedback = function () {
      $ ('div.rdgm_edit_main_menu_feedback').html ('You can position and resize the hangman entry box how you want in relation to the image.').show ().fadeOut (10000, 'easeInCubic');
   }
   setTimeout (delay_feedback, 500);
}
this.position_hangman_fields_div = function ($rdgmq) {
   var $img_wrapper;
   var img_wrapper_position;
   if (rdgm_deck != 'rdgm') {
      $rdgmq = $dialog_rwizard.find (qcard_.get_card_front (i_rdgm));
      if (debug[0]) {
         var ck_position = $rdgmq.find ('#qcard_front-part1-qdeck' + i_rdgm).position ();
         console.log ('[position_hangman_fields_div] ck_position:', ck_position);
      }
   }
   if ($rdgmq.length == 0) {
      return;
   }
   $img_wrapper = $rdgmq.find ('div.rdgm_edit_image');
   if ($img_wrapper.length == 0) {
      if (debug[0]) {
         console.log ('[position_hangman_fields_div] $rdgmq:', $rdgmq);
      }
      alert ('A formatting element has been inadvertently deleted.  Please use ctrl-Z or cmd-Z to undo the deletion.');
   } else {
      img_wrapper_position = $img_wrapper.position ();
      if (debug[0]) {
         console.log ('[position_hangman_fields_div] img_wrapper_position:', img_wrapper_position);
      }
      var left = Math.round (img_wrapper_position.left) + 'px';
      var top  = Math.round (img_wrapper_position.top ) + 'px';
      var $hangman_fields = $rdgmq.find ('div.hangman_labeled_diagram_fields');
      $hangman_fields.css ({left: left, top: top});
   }
}
this.new_free_form_input_question_card = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type = 'textentry';
   if (rdgm_deck == 'rdgm') {
      question.n_choices = 3;
   } else {
      question.n_choices = 2;
   }
   question.question_text = question_placeholder (i_question+1, '[textentry]');
   question.choices   = ['Enter word'];
   question.correct_choice_fs = [1];
   question.feedbacks = [free_form_feedback_placeholder ('correct')];
   if (rdgm_deck == 'rdgm') {
      question.choices.push ('Enter word');
      question.correct_choice_fs.push (0);
      question.feedbacks.push (free_form_feedback_placeholder ('incorrect'));
   }
   question.choices.push ('*');
   question.correct_choice_fs.push (0);
   question.feedbacks.push (free_form_feedback_placeholder ('default'));
   qw.questions_cards[i_question] = question;
   if (rdgm_deck == 'rdgm') {
      create_and_show_new_question (question.type);
   } else {
      create_and_show_new_card (question.type);
   }
}
this.new_hangman_question_card = function () {
   if (debug[0]) {
      console.log ('[new_hangman_question_card]');
   }
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type = 'hangman';
   question.n_choices = 1;
   question.question_text = question_placeholder (i_question+1, '[hangman]');
   question.choices    = ['placeholder'];
   qw.hangman_i_choice = 0;
   if (rdgm_deck == 'rdgm') {
      question.feedbacks = [hangman_question_feedback_placeholder];
   } else {
      question.answer_text = hangman_card_feedback_placeholder;
   }
   qw.questions_cards[i_question] = question;
   if (rdgm_deck == 'rdgm') {
      create_and_show_new_question (question.type);
   } else {
      create_and_show_new_card (question.type);
   }
}
this.new_dataset_question_card = function (data) {
   if (debug[0]) {
      console.log ('[new_dataset_question_card] data:', data);
   }
   browse_records_shown             = data.skip_records;
   browse_search_words_array        = data.browse_search_words_array;
   browse_search_question_card_type = data.browse_search_question_card_type;
   browse_search_unit_topic         = data.browse_search_unit_topic;
   browse_scrollY                   = data.browse_scrollY;
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {};
   question.type = data.question_card_type;
   /*
   var use_dataset_question_card = rdgm_deck == 'rdgm' ? 'use_dataset_question' : 'use_dataset_card';
   var htm = data.html;
   htm = htm.replace ('dataset_id', use_dataset_question_card);
   question.from_dataset_b = true;
   question.question_attributes = use_dataset_question_card + '="' + data.dataset_question_id + '"';
   */
   var htm = data.html;
   question.full_html     = htm;
   question.question_text = htm;
   qw.questions_cards[i_question] = question;
   if (rdgm_deck == 'rdgm') {
      create_and_show_new_question (question.type, true);
   } else {
      create_and_show_new_card (question.type, true);
   }
   setTimeout (function () {
                  alert ('Question/card added');
               }, 250);
}
this.cancel_browse_alert = function (question_card) {
   browse_window.close ();
   var delay_alert = function () {
      alert ('Canceled "Select an existing ' + question_card + ' from database list"');
   }
   setTimeout (delay_alert, 200);
}
this.new_one_letter_answer_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type = 'one_letter_answer';
   question.n_choices = 3;
   question.question_text = question_placeholder (i_question+1, '[textentry single_char="true"]');
   question.choices   = ['Enter word'];
   question.correct_choice_fs = [1];
   question.feedbacks = [  '<span class="rwizard_placeholder">'
                         +    'Feedback for correct-answer letter(s) '
                         +    '<br />'
                         +    '<span class="rwizard_smaller">'
                         +       '(or leave blank for default)'
                         +    '</span>'
                         + '</span>&hairsp;'];
   question.choices.push ('Enter word');
   question.correct_choice_fs.push (0);
   question.feedbacks.push ('<span class="rwizard_placeholder">'
                         +     'Feedback for incorrect-answer letter(s) '
                         +     '<span class="rwizard_smaller">'
                         +        '(or leave blank for default)'
                         +     '</span>'
                         +  '</span>&hairsp;');
   question.choices.push ('*');
   question.correct_choice_fs.push (0);
   question.feedbacks.push ('<span class="rwizard_placeholder">'
                         +     'Feedback for any other letter '
                         +     '<span class="rwizard_smaller">'
                         +        '(or leave blank for default)'
                         +     '</span>'
                         +  '</span>&hairsp;');
   qw.questions_cards[i_question] = question;
   create_and_show_new_question (question.type);
}
this.new_information_only_question = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {}
   question.type = 'information_only';
   question.question_text =  '<span class="rwizard_placeholder">'
                           +    'Information'
                           +    '<br />'
                           +    '<span class="rwizard_smaller">'
                           +       '(enter text or &ldquo;Add Media&rdquo;; select text to format)'
                           +    '</span>'
                           + '</span>';
   qw.questions_cards[i_question] = question;
   create_and_show_new_question (question.type);
}
this.new_simple_card = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {};
   question.type = 'simple_card';
   question.n_choices = 0;   // May be non-zero in case of [textentry].
   question.question_text = question_placeholder (i_question+1);
   question.answer_text = answer_placeholder (i_question+1);
   qw.questions_cards[i_question] = question;
   create_and_show_new_card (question.type);
}
this.new_free_form_optional_input_card = function () {
   $ ('#new_question_type_menu').hide ();
   i_question = n_questions;
   var question = {};
   question.type = 'optional_textentry';
   question.n_choices = 0;   // May be non-zero in case of [textentry].
   question.question_text = question_placeholder (i_question+1, '[textentry]');
   question.answer_text = answer_placeholder (i_question+1);
   qw.questions_cards[i_question] = question;
   create_and_show_new_card (question.type);
}
this.browse_dataset_questions = function () {
   /* OLD:
   if (rdgm_deck_attributes.search (/\sdataset=/) != -1) {
      var quiz_flashcard_deck;
      var question_card;
      if (rdgm_deck == 'rdgm') {
         quiz_flashcard_deck = 'quiz';
         question_card       = 'question';
      } else {
         quiz_flashcard_deck = 'flashcard deck';
         question_card       = 'card';
      }
      alert ('This ' + quiz_flashcard_deck + ' is saved as a dataset.  A ' + question_card + ' from another dataset cannot be included in a dataset');
      return;
   }
   */
   if (! rdgm_edit.permalink) {
      rdgm_edit.permalink = rdgm_edit.get_permalink ();
   }
   var maker_email = '';
   if (typeof (rdgm_edit.email) != 'undefined') {
      maker_email = rdgm_edit.email;
   }
   var f = document.forms.open_browse_dataset_questions;
   if (! f) {
      if (rdgm_ajaxurl == 'not ready') {
         rdgm_ajaxurl = qqc.get_rdgm_param ('ajaxurl', '');
      }
      var fhtm =  '<form name="open_browse_dataset_questions" '
                +       'action="' + rdgm_ajaxurl + '" '
                +       'target="browse_window" method="POST" style="display: none;">'
                +    '<input name="action"                           type="hidden" value="browse_dataset_questions" />'
                +    '<input name="plugin_loc"                       type="hidden" />'
                +    '<input name="maker_email"                      type="hidden" />'
                +    '<input name="rdgm_deck"                        type="hidden" />'
                +    '<input name="rwizard_page"                     type="hidden" />'
                +    '<input name="rwizard_php_f"                    type="hidden" />'
                +    '<input name="browse_records_shown"             type="hidden" />'
                +    '<input name="browse_search_words_array[]"      type="hidden" />'
                +    '<input name="browse_search_question_card_type" type="hidden" />'
                +    '<input name="browse_search_unit_topic"         type="hidden" />'
                +    '<input name="browse_scrollY"                   type="hidden" />'
                + '</form>';
      $ ('body').append (fhtm);
      f = document.forms.open_browse_dataset_questions;
   }
   f.plugin_loc.value                        = rdgm_edit_plugin_url;
   f.maker_email.value                       = maker_email;
   f.rdgm_deck.value                         = rdgm_deck;
   f.rwizard_page.value                      = rdgm_edit.permalink;
   f.rwizard_php_f.value                     = rwizard_php_f;
   f.browse_records_shown.value              = browse_records_shown;
   f.browse_search_question_card_type.value  = browse_search_question_card_type;
   f.browse_search_unit_topic.value          = browse_search_unit_topic;
   f.browse_scrollY.value                    = browse_scrollY;
   const n_search_words = browse_search_words_array.length;
   for (var i=0; i<n_search_words; i++) {
      f['browse_search_words_array[]'].value = browse_search_words_array[i];
   }
   browse_window = window.open ('', 'browse_window');
   f.submit ();
}
this.reset_show_me_button_text = function (ii_question) {
   if (qw.questions_cards[ii_question]
                         && qw.questions_cards[ii_question].type == 'show_me') {
      if (debug[0]) {
         console.log ('[reset_show_me_button_text] ii_question:', ii_question);
      }
      var text = qw.questions_cards[ii_question].choices[0];
      if (text.indexOf ('[show_me_placeholder]') != -1) {
         text = show_me_button_placeholder;
      }
      $ ('div#rdgm' + i_rdgm + '-q' + ii_question + ' button.show_the_answer').html (text)
   }
}
function rdgm_shortcodes_text (display_b) {
   if (debug[0]) {
      console.log ('[rdgm_shortcodes_text] n_questions:', n_questions);
   }
   var rdgm_text = [];
   var rdgm_shortcode = '[rdgm';
   if (rdgm_deck_attributes) {
      rdgm_shortcode += ' ' + rdgm_deck_attributes;
   }
   rdgm_shortcode += ']';
   rdgm_text.push (rdgm_shortcode);
   if (header_text) {
      var header_html = place_shortcode ('[h]', header_text);
      header_html = add_paragraph_tags (header_html);
      rdgm_text.push (header_html);
   }
   if (intro_text) {
      if (intro_text.indexOf ('<span class="rwizard_placeholder">') == -1) {
         var intro_html = audio_video_elements_to_shortcode (intro_text);
         intro_html = place_shortcode ('[i]', intro_html);
         intro_html = add_paragraph_tags (intro_html);
         rdgm_text.push (intro_html);
      }
   }
   for (i_question=0; i_question<n_questions; i_question++) {
      rdgm_text.push (question_shortcodes_text (qw.questions_cards[i_question],
                                                true, display_b));
   }
   if (exit_text) {
      var exit_html = audio_video_elements_to_shortcode (exit_text);
      exit_html = add_paragraph_tags ('[x]' + exit_html);
      rdgm_text.push (exit_html);
   }
   rdgm_text.push ('[/rdgm]');
   if (debug[1]) {
      console.log ('[rdgm_shortcodes_text] rdgm_text:', rdgm_text.join ('\n'));
   }
   return (rdgm_text.join (''));
}
function question_shortcodes_text (question, default_f, display_b) {
   if (debug[0]) {
      console.log ('[question_shortcodes_text] question:', question);
   }
   if (question.from_dataset_b) {
      if (display_b) {
         var question_shortcode = '[q ' + question.question_attributes + ']';
         if (question.type == 'multiple_choice') {
            question_shortcode = question_shortcode.replace (/\s*?multiple_choice="true"/, '');
         }
         if (debug[0]) {
            console.log ('[question_shortcodes_text] question_shortcode:', question_shortcode);
         }
         return add_paragraph_tags (question_shortcode);
      } else {
         if (question.full_html) {
            if (debug[0]) {
               console.log ('[question_shortcodes_text] question.full_html:', question.full_html);
            }
            return question.full_html;
         }
      }
   }
   htm = [];
   var attributes = question.question_attributes;
   if (! attributes) {
      attributes = '';
   }
   if (typeof (question.unit) != 'undefined' && question.unit !== '') {
      attributes = attributes.replace (/\s*unit\s*=\s*"[^"]*"|$/, ' unit="' + question.unit + '"');
   }
   if (typeof (question.topic) != 'undefined' && question.topic !== '') {
      attributes = attributes.replace (/\s*topics*\s*=\s*"[^"]*"|$/, ' topic="' + question.topic + '"');
   }
   if (attributes && attributes[0] != ' ') {
      attributes = ' ' + attributes;
   }
   if (question.type == 'multiple_choice' || question.type == 'show_me') {
      if (question.type == 'multiple_choice') {
         if (attributes.indexOf ('multiple_choice') == -1) {
            attributes += ' multiple_choice="true"';
         }
      }
      var qtext = place_shortcode ('[q' + attributes + ']', question.question_text);
      qtext = add_paragraph_tags (qtext);
      htm.push (qtext);
      var choices = [];
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         var star = i_choice == question.correct_choice ? '*' : '';
         var c = '[c' + star + ']';
         var choice = question.choices[i_choice];
         if (debug[0]) {
            console.log ('[question_shortcodes_text] choice:', choice);
         }
         if (question.choices_inline) {
            choice = choice.replace (/<[ph][^>]*>|<\/[ph][1-6]{0,1}>|<br[^>]*>/g, ' ');
            choice = c + ' ' + choice + ' ';
         } else {
            choice = place_shortcode (c, choice);
            choice = add_paragraph_tags (choice);
         }
         choices.push (choice);
         if (! question.choices_inline) {
            var feedback = place_shortcode ('[f]', question.feedbacks[i_choice],
                                            default_f && question.type != 'show_me');
            feedback = add_paragraph_tags (feedback);
            choices.push (feedback);
         }
      }
      if (question.choices_inline) {
         for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
            var choice = place_shortcode ('[f]', question.feedbacks[i_choice],
                                           default_f) + '\n';
            choice = add_paragraph_tags (choice);
            choices.push (choice);
         }
      }
      htm.push (choices.join (''));
   } else if (question.type == 'hotspot_diagram') {
      const i_pos = question.question_text.indexOf ('<div class="hotspot_image_stack');
      var qtext;
      if (i_pos != -1) {
         qtext = question.question_text.substr (0, i_pos);
         qtext = place_shortcode ('<p>[q' + attributes + ']', qtext);
         qtext += question.question_text.substr (i_pos);
      } else {
         qtext = place_shortcode ('<p>[q' + attributes + ']', question.question_text);
      }
      htm.push (qtext);
   } else if (question.type == 'labeled_diagram') {
      htm.push ('<div class="rdgm_edit_question">');
      htm.push (    question.question_text.replace (/\[q[^\]]*/, '[q' + attributes));
      for (var i_label=0; i_label <question.n_labels; i_label++) {
         var label = question.labels[i_label];
         if (label.indexOf ('[l]') == -1) {
            label = label.replace (/(<span[^>]*?rdgm_edit_highlight_label[^>]*>)/, '\$1[l]');
         }
         htm.push (label);
         var feedback = place_shortcode ('[f*]', question.feedback_corrects[i_label], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
         feedback = place_shortcode ('[fx]', question.feedback_incorrects[i_label], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
      htm.push (   '<div class="rdgm_edit_question_bottom_border_title" title="End of labeled-diagram question">');
      htm.push (   '</div>');
      htm.push ('</div>');
   } else if (question.type == 'hangman_labeled_diagram') {
      htm.push ('<div class="rdgm_edit_question">');
      qw.update_diagram_html (true);
      var hangman_fields = question.hangman_fields;
      hangman_fields =  '<div class="hangman_labeled_diagram_fields">'
                      +    hangman_fields
                      + '</div>';
      var qhtm = hangman_add_fields_to_img_wrapper (question.question_text, hangman_fields);
      htm.push (qhtm.replace (/\[q[^\]]*/, '[q' + attributes));
      var n_choices = question.n_choices;
      for (var i_choice=0; i_choice<n_choices; i_choice++) {
         var choice = place_shortcode ('[c]', question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
      htm.push (   '<div class="rdgm_edit_question_bottom_border_title" title="End of hangman-labeled-diagram question">');
      htm.push (   '</div>');
      htm.push ('</div>');
   } else if (question.type == 'textentry' || question.type == 'one_letter_answer') {
      var qhtml;
      if (question.type == 'one_letter_answer') {
         qhtml = question.question_text.replace (/<input[^>]*>/, '[textentry single_char="true"]');
      } else {
         var textentry_attributes = '';
         if (! question.textentry_attributes) {
            question.textentry_attributes = '';
         }
         var true_rm = question.textentry_plural_b ? 'true' : 'rm';
         question.textentry_attributes = add_update_attributes (question.textentry_attributes, 'plural', true_rm);
         if (question.textentry_attributes) {
            textentry_attributes = ' ' + question.textentry_attributes;
         }
         qhtml = question.question_text.replace (/\[textentry[^\]]*/, '[textentry' + textentry_attributes);
      }
      var qtext = place_shortcode ('[q' + attributes + ']', qhtml);
      qtext = add_paragraph_tags (qtext);
      htm.push (qtext);
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         var choice = question.choices[i_choice];
         var star = question.correct_choice_fs[i_choice] ? '*' : '';
         if (choice == 'Enter word' && ! star) {
            continue;
         }
         var c = '[c' + star + ']';
         choice = place_shortcode (c, choice);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice],
                                         default_f);
         if (feedback === '' && choice == '*') {
            feedback = place_shortcode ('[f]', 'No, that\'s not correct.');
         }
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
   } else if (question.type == 'hangman') {
      var qtext = place_shortcode ('[q' + attributes + ']', question.question_text);
      qtext = add_paragraph_tags (qtext)
      htm.push (qtext);
      var n_choices = question.n_choices;
      for (var i_choice=0; i_choice<n_choices; i_choice++) {
         var choice = place_shortcode ('[c]', question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
   } else if (question.type == 'information_only') {
      var info_text = place_shortcode ('[q]', question.question_text);
      info_text = add_paragraph_tags (info_text);
      htm.push (info_text);
   }
   htm = htm.join ('\n');
   htm = audio_video_elements_to_shortcode (htm);
   htm = htm.replace (/<[ph][1-6]* class="rdgm-inline">([^]*?)<\/[ph][1-6]*>/g, '\$1');
   htm = htm.replace (/<span class="rdgm-avoid-br" style="display: none;">x<\/span>/g, '&nbsp;');
   htm = htm.replace (/<p[^>]*><\/p>\n*/g, '');
   htm = htm.replace (/<p[^>]*>&nbsp;<br><\/p>/g, '<br /><br />');
   if (debug[0]) {
      console.log ('[question_shortcodes_text] htm:', htm);
   }
   return htm;
}
function hangman_add_fields_to_img_wrapper (qhtm, hangman_fields) {
   var i_wrapper_pos = qhtm.search (/<div[^>]+hangman_img_wrapper/);
   if (i_wrapper_pos != -1) {
      var hangman_img_wrapper = qqc.find_matching_block (qhtm.substr (i_wrapper_pos));
      var wrapper_len = hangman_img_wrapper.length;
      var i_fields_pos = hangman_img_wrapper.search (/<div[^>]+hangman_labeled_diagram_fields/);
      var qhtm_hangman_fields_start;
      var old_hangman_fields_length;
      if (i_fields_pos != -1) {
         var i_end_fields = wrapper_len - 6;
         hangman_img_wrapper = hangman_img_wrapper.substr (0, i_fields_pos)
                                    + hangman_img_wrapper.substr (i_end_fields);
         qhtm_hangman_fields_start = i_wrapper_pos + i_fields_pos;
         old_hangman_fields_length = wrapper_len - i_fields_pos - 6;
      } else {
         qhtm_hangman_fields_start = i_wrapper_pos + wrapper_len - 6;
         old_hangman_fields_length = 0;
      }
      qhtm = qhtm.substr (0, qhtm_hangman_fields_start)
             + hangman_fields
             + qhtm.substr (qhtm_hangman_fields_start + old_hangman_fields_length);
   }
   return qhtm;
}
function audio_video_elements_to_shortcode (htm) {
   if (debug[0]) {
      console.log ('[audio_video_elements_to_shortcode] htm:', htm);
   }
   htm = htm.replace (/\sdata-mce-src="[^"]+"/g, '');
   htm = htm.replace (/<video\s(.*?)controls(="[^"]*")*\s(src="[^"]+").*?data-audio_video="([^"]+)"([^>]*)>([^]*?)<\/video>/g, '\$6[\$4 \$1 \$3 \$5]');
   htm = htm.replace (/<iframe.*?src="([^"?]*).*?data-embed="true"[^>]*><\/iframe>/g, '[embed]\$1[/embed]');
   return htm;
}
function deck_shortcodes_text (display_b) {
   if (debug[0]) {
      console.log ('[deck_shortcodes_text] n_questions:', n_questions);
   }
   var deck_text = [];
   var deck_shortcode = '[qdeck';
   if (rdgm_deck_attributes) {
      deck_shortcode += ' ' + rdgm_deck_attributes;
   }
   deck_shortcode += ']';
   deck_text.push (deck_shortcode);
   if (header_text) {
      var header_html = place_shortcode ('[h]', header_text);
      header_html = add_paragraph_tags (header_html);
      deck_text.push (header_html);
   }
   if (intro_text) {
      if (intro_text.indexOf ('<span class="rwizard_placeholder">') == -1) {
         var intro_html = audio_video_elements_to_shortcode (intro_text);
         intro_html = place_shortcode ('[i]', intro_html);
         intro_html = add_paragraph_tags (intro_html);
         deck_text.push (intro_html);
      }
   }
   for (var i_question=0; i_question<n_questions; i_question++) {
      deck_text.push (card_shortcodes_text (qw.questions_cards[i_question],
                                            display_b));
   }
   if (exit_text) {
      var exit_html = audio_video_elements_to_shortcode (exit_text);
      exit_html = place_shortcode ('[x]', exit_html);
      exit_html = add_paragraph_tags (exit_html);
      deck_text.push (exit_html);
   }
   deck_text.push ('[/qdeck]');
   if (debug[0]) {
      console.log ('[deck_shortcodes_text] deck_text:', deck_text.join ('\n'));
   }
   return (deck_text.join (''));
}
function card_shortcodes_text (question, display_b) {
   if (debug[0]) {
      console.log ('[card_shortcodes_text] question:', question);
   }
   if (question.from_dataset_b) {
      if (display_b) {
         var question_shortcode = '[q ' + question.question_attributes + ']';
         return add_paragraph_tags (question_shortcode);
      } else {
         if (question.full_html) {
            return question.full_html;
         }
      }
   }
   htm = [];
   var question_attributes = question.question_attributes;
   if (! question_attributes) {
      question_attributes = '';
   }
   if (typeof (question.unit) != 'undefined' && question.unit !== '') {
      question_attributes = question_attributes.replace (/\s*unit\s*=\s*"[^"]*"|$/, ' unit="' + question.unit + '"');
   }
   if (typeof (question.topic) != 'undefined' && question.topic !== '') {
      question_attributes = question_attributes.replace (/\s*topics*\s*=\s*"[^"]*"|$/, ' topic="' + question.topic + '"');
   }
   if (question_attributes && question_attributes[0] != ' ') {
      question_attributes = ' ' + question_attributes;
   }
   var qhtml;
   if (question.question_text.indexOf ('textentry') != -1) {
      var textentry_attributes = '';
      if (! question.textentry_attributes) {
         question.textentry_attributes = '';
      }
      var true_rm = question.textentry_plural_b ? 'true' : 'rm';
      question.textentry_attributes = add_update_attributes (question.textentry_attributes, 'plural', true_rm);
      if (question.textentry_attributes) {
         textentry_attributes = ' ' + question.textentry_attributes;
      }
      qhtml = question.question_text.replace (/\[textentry[^\]]*/, '[textentry' + textentry_attributes);
      if (question_attributes && question_attributes[0] != ' ') {
         question_attributes = ' ' + question_attributes;
      }
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);
      var i_delete_choices = [];
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         if (i_choice > 0) {
            if (question.choices[i_choice] == 'Enter word') {
               i_delete_choices.push (i_choice);
               continue;
            }
            if (question.choices[i_choice] == '*'
                  && question.feedbacks[i_choice].indexOf ('<span class="rwizard_placeholder">') != -1) {
               i_delete_choices.push (i_choice);
               continue;
            }
         }
         var star = question.correct_choice_fs[i_choice] ? '*' : '';
         var c = '[c' + star + ']';
         var choice = place_shortcode (c, question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice]);
         if (feedback === '' && choice == '*') {
            feedback = place_shortcode ('[f]', 'No, that\'s not correct.');
         }
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
      var n_delete_choices = i_delete_choices.length;
      for (ii=0; ii<n_delete_choices; ii++) {
         i_delete_choice = i_delete_choices[ii];
         question.choices.splice (i_delete_choice, 1);
         question.correct_choice_fs.splice (i_delete_choice, 1);
         question.feedbacks.splice (i_delete_choice, 1);
         question.n_choices--;
      }
   } else if (question.type == 'hangman_labeled_diagram') {
      htm = [];
      qcard_.save_remove_hangman_fields (i_rdgm, $dialog_rwizard.find (qcard_.get_card_front (i_rdgm)));
      var hangman_fields = question.hangman_fields;
      while (true) {
         var i_pos = hangman_fields.search (/<div[^>]+hangman_label[ "][^>]*>\s*</);
         if (i_pos == -1) {
            break;
         }
         var hangman_label_div = qqc.find_matching_block (hangman_fields.substr (i_pos));
         var new_hangman_label_div = hangman_label_div.replace (/>[^]*<\/div>$/, '>[hangman]</div>');
         new_hangman_label_div = new_hangman_label_div.replace (/ui-draggable-handle\s*|ui-draggable\s*|ui-resizable\s*/g, '');
         hangman_fields = hangman_fields.replace (hangman_label_div, new_hangman_label_div);
      }
      hangman_fields =  '<div class="hangman_labeled_diagram_fields" data-qcard="' + i_question + '">'
                      +    hangman_fields
                      + '</div>';
      var qhtm = hangman_add_fields_to_img_wrapper (question.question_text, hangman_fields);
      if (qhtm.indexOf ('[q') == -1) {
         htm.push ('[q]');
      }
      htm.push (qhtm.replace (/\[q[^\]]*/, '[q' + question_attributes));
      var n_choices = question.n_choices;
      for (var i_choice=0; i_choice<n_choices; i_choice++) {
         var choice = place_shortcode ('[c]', question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
      }
   } else if (question.question_text.indexOf ('[hangman') != -1) {
      var hangman_attributes = '';
      qhtml = question.question_text.replace (/<span class="qdeck_hangman[^]*?<\/span>/, '[hangman' + hangman_attributes + ']');
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);
      var n_choices = question.n_choices;
      for (var i_choice=0; i_choice<n_choices; i_choice++) {
         var choice = place_shortcode ('[c]', question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);
      }
   } else {
      qhtml = question.question_text;
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);
   }
   var card_back = '';
   if (! question.n_choices || question.type == 'hangman'
                                || question.type == 'hangman_labeled_diagram') {
      if (typeof (question.answer_text) != 'undefined') {
         if (! display_b || question.answer_text.indexOf ('<span class="rwizard_placeholder">') == -1) {
            card_back = place_shortcode ('[a]', question.answer_text);
            card_back = add_paragraph_tags (card_back);
         }
      }
   }
   htm.push (card_back);
   htm = htm.join (' ');
   htm = htm.replace (/\s*backface-visibility: hidden;\s*/g, '');
   htm = htm.replace (/ style="\s*"| data-mce-style="\s*"/g, '');
   htm = audio_video_elements_to_shortcode (htm);
   htm = htm.replace (/<[ph][1-6]* class="rdgm-inline">([^]*?)<\/[ph][1-6]*>/g, '\$1');
   htm = htm.replace (/<span class="rdgm-avoid-br" style="display: none;">x<\/span>/g, '&nbsp;');
   htm = htm.replace (/<p[^>]*><\/p>\n*/g, '');
   htm = htm.replace (/<p[^>]*>&nbsp;<br><\/p>/g, '<br /><br />');
   if (debug[0]) {
      console.log ('[card_shortcodes_text] htm:', htm);
   }
   return htm;
}
function add_paragraph_tags (htm) {
   var pat = '<p|<h[1-6]';
   var re = new RegExp (pat);
   if (htm.search (re) == -1) {
      htm = htm.replace (/<\/p>|<\/h[1-6]>/g, '');
      htm = '<p>' + htm + '</p>';
   } else {
      htm = htm.replace (/<(p|h[1-6])[^>]*>(\s|&nbsp;)*$/, '');
   }
   return htm;
}
function place_shortcode (shortcode, htm, default_f) {
   if (default_f) {
      if (htm.indexOf ('<span class="rwizard_placeholder"') != -1) {
         if (shortcode == '[f*]') {
            htm = rdgm_.canned_feedback (true);
         } else if (shortcode == '[fx]') {
            htm = rdgm_.canned_feedback (false);
         } else {
            return '';
         }
      }
   }
   var m = htm.match (/\s*((<[^\/][^>]*>\s*)*)([^]*)/);
   var i_pos = m[1].search (/<span class="rwizard_placeholder"|<img/);
   if (i_pos != -1) {
      m[3] = m[1].substr (i_pos) + m[3];
      m[1] = m[1].substr (0, i_pos);
   }
   return m[1] + shortcode + ' ' + m[3];
}
function new_multiple_choice_question_data (n_choices) {
   var question = {};
   question.type           = 'multiple_choice';
   question.n_choices      = n_choices;
   question.correct_choice = -1;
   question.choices_inline = false;
   question.question_text = question_placeholder (i_question+1);
   question.choices   = [];
   question.feedbacks = [];
   for (var i_choice=0; i_choice<n_choices; i_choice++) {
      new_answer_choice_data (question, i_choice);
   }
   return question;
}
function new_answer_choice_data (question, i_choice, only_if_placeholder_b) {
   var do_choice_b = true;
   var do_feedback_b = true;
   if (only_if_placeholder_b && question.choices.length) {
      if (question.choices[i_choice].indexOf ('"rwizard_placeholder"') == -1) {
         do_choice_b = false;
      }
      if (question.feedbacks[i_choice].indexOf ('"rwizard_placeholder"') == -1) {
         do_feedback_b = false;
      }
   }
   if (do_choice_b) {
      question.choices[i_choice] = answer_choice_placeholder (i_choice+1);
   }
   if (do_feedback_b) {
      question.feedbacks[i_choice] = answer_choice_feedback_placeholder (i_choice+1);
   }
}
function update_labeled_diagram_question_text_from_html () {
   var $canvas = $ ('div#dialog_rwizard div.rdgm_edit_canvas-rdgm' + i_rdgm + '-q' + i_question);
   if (debug[0]) {
      console.log ('[update_labeled_diagram_question_text_from_html] $canvas:', $canvas);
   }
   if ($canvas.length) {
      var question_html = $canvas.html ();
      if (debug[0]) {
         console.log ('[update_labeled_diagram_question_text_from_html] question_html:', question_html);
      }
      var preface = '<div class="rdgm_edit_canvas rdgm_editable rdgm-question">[q]';
      qw.questions_cards[i_question].question_text = preface + question_html + '</div>';
   }
}
function create_new_label_target_and_feedback (question, selected_label_assoc_id, target_must_be_text_f, i_label, before_f) {
   if (debug[0]) {
      console.log ('[create_new_label_target_and_feedback] selected_label_assoc_id:', selected_label_assoc_id, ', target_must_be_text_f:', target_must_be_text_f);
   }
   var new_assoc_id = parseInt (new Date ().getTime ()/1000.0, 10);
   var bcolor;
   var bstyle;
   var ok_f = false;
   for (i_color=0; i_color<n_bcolors; i_color++) {
      bcolor = bcolors[i_color];
      for (i_style=0; i_style<n_bstyles; i_style++) {
         bstyle = bstyles[i_style];
         var selector = '#rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_edit_border_class_' + bstyle + '.rdgm_edit_border_class_' + bcolor;
         if ($ (selector).length == 0) {
            ok_f = true;
            break;
         }
      }
      if (ok_f) {
         break;
      }
   }
   question.labels[i_label] = create_label_html (label_placeholder (), new_assoc_id, bcolor, bstyle);
   if (target_must_be_text_f) {
      rdgm_edit.label_border_class = 'rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_width';
   } else {
      var position = $ ('.rdgm_edit_target-' + selected_label_assoc_id).position ();
      var x = Math.random ();
      var offset = x < 0.5 ? -10 : 10;
      var new_left = Math.round (position.left) + offset;
      x = Math.random ();
      offset = x < 0.5 ? -18 : 18;
      var new_top  = Math.round (position.top + offset);
      var t = [];
      t.push ('<div class="rdgm_edit_target-' + new_assoc_id + ' rdgm_edit_target rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_width ui-draggable ui-draggable-handle ui-resizable" style="left: ' + new_left + 'px; top: ' + new_top + 'px; width: 120px; right: auto; height: 28px; bottom: auto; position: relative;">');
      t.push (   '<div class="ui-resizable-handle ui-resizable-e" style="z-index: 105;">');
      t.push (   '</div>');
      t.push (   '<div class="ui-resizable-handle ui-resizable-s" style="z-index: 105;">');
      t.push (   '</div>');
      t.push (   '<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 105;">');
      t.push (   '</div>');
      t.push ('</div>');
      target_html = t.join ('\n');
      var s = '<div class="rdgm_edit_target';
      question.question_text = question.question_text.replace (s, target_html + s);
   }
   question.feedback_corrects[i_label]
                               = label_correct_feedback_placeholder (i_label+1);
   question.feedback_incorrects[i_label]
                               = label_incorrect_feedback_placeholder (i_label+1);
   return new_assoc_id;
}
function create_label_html (label_text, assoc_id, bcolor, bstyle) {
   var l = [];
   l.push ('<div class="rdgm_edit_label qtarget_assoc' + assoc_id + '">');
   l.push (   '<span class="rdgm_edit_highlight_label rdgm_editable rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_width">');
   l.push (      '[l]' + label_text);
   l.push (   '</span>');
   l.push ('</div>');
   return l.join ('\n');
}
function question_placeholder (i_question, textentry_hangman) {
   var question_card = rdgm_deck == 'rdgm' ? 'question' : 'card front';
   var htm =   '<span class="rwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_question, true) + ' ' + question_card + ' '
             +    '<br />'
             +    '<span class="rwizard_smaller">'
             +       '(enter text or &ldquo;Add Media&rdquo;; select text to format)'
             +    '</span>'
             + '</span>';
   if (textentry_hangman == '[textentry single_char="true"]') {
      htm +=   '<br />'
             + '<br />'
             + textentry_hangman
             + '<br />'
             + ' &emsp; &emsp; ';
   } else if (textentry_hangman) {
      htm +=   ' &emsp; '
             + textentry_hangman + ' &emsp; ';
   }
   return htm;
}
function answer_placeholder (i_question, textentry_hangman) {
   var htm =   '<span class="rwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_question, true) + ' card back' + ' '
             +    '<br />'
             +    '<span class="rwizard_smaller">'
             +       '(enter text or &ldquo;Add Media&rdquo;; select text to format)'
             +    '</span>'
             + '</span> &emsp;';
   if (textentry_hangman == '[textentry single_char="true"]') {
      htm +=   '<br />'
             + '<br />'
             + textentry_hangman
             + '<br />'
             + ' &emsp; &emsp; ';
   } else if (textentry_hangman == '[hangman]') {
      htm +=   ' &emsp; &emsp; [hangman] &emsp; ';
   }
   return htm;
}
function answer_choice_placeholder (i_choice) {
   var htm =   '<span class="rwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_choice, true) + ' answer choice'
             + '</span>&hairsp;';
   return htm;
}
function answer_choice_feedback_placeholder (i_choice) {
   var htm =   '<span class="rwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_choice) + ' answer choice'
             +    '<br />'
             +    '<span class="rwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';
   return htm;
}
function hotspot_click_feedback_placeholder (correct_incorrect) {
   var placeholder = '<span class="rwizard_placeholder">';
   if (correct_incorrect == 'correct') {
      placeholder +=    'Feedback for correct hotspot click ';
   } else {
      placeholder +=    'Feedback for any other click ';
   }
   placeholder    +=    '<span class="rwizard_smaller">'
                   +       '(or leave blank for default)'
                   +    '</span>'
                   + '</span>&hairsp;';
   return placeholder;
}
function free_form_feedback_placeholder (correct_incorrect_default) {
   var placeholder = '<span class="rwizard_placeholder">';
   if (rdgm_deck == 'rdgm') {
      if (correct_incorrect_default == 'correct') {
         placeholder +=    'Feedback for correct-answer word(s)';
      } else if (correct_incorrect_default == 'incorrect') {
         placeholder +=    'Feedback for incorrect-answer word(s)';
      } else {
         placeholder +=    'Feedback for any other word selection';
      }
   } else {
      if (correct_incorrect_default != 'default') {
         placeholder +=    'Card back for this user answer word';
      } else {
         placeholder +=    'Card back for any answer word that is not in the &ldquo;Answer words&rdquo; list';
      }
   }
   placeholder    +=       '<br />'
                   +       '<span class="rwizard_smaller">'
                   +          '(or leave blank for default)'
                   +       '</span>'
                   + '</span>&hairsp;';
   return placeholder;
}
function label_placeholder () {
   var htm =   '<span class="rwizard_placeholder">'
             +    'Label'
             + '</span>&hairsp;';
   return htm;
}
function label_correct_feedback_placeholder (i_label) {
   var htm =   '<span class="rwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_label) + ' label correct placement'
             +    '<br />'
             +    '<span class="rwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';
   return htm;
}
function label_incorrect_feedback_placeholder (i_label) {
   var htm =   '<span class="rwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_label) + ' label incorrect placement'
             +    '<br />'
             +    '<span class="rwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';
   return htm;
}
function restart_quiz_button_html () {
   var button =   '<button class="rdgm_button rdgm_restart" onclick="rdgm_.restart_quiz (' + i_rdgm + ')">'
                +    'Take the quiz again'
                + '</button>';
   return button;
}
function restart_deck_button_html () {
   var button =   '<button class="rdgm_button" onclick="qcard.start_deck (' + i_rdgm + ')">'
                +    'Review this flashcard stack again'
                + '</button>';
   return button;
}
function create_and_show_new_question (question_type, set_rwizard_f) {
   if (debug[0]) {
      console.log ('[create_and_show_new_question] i_question:', i_question, ', qw.questions_cards[i_question]:', qw.questions_cards[i_question]);
   }
   qw.questions_cards[i_question].unit  = '';
   qw.questions_cards[i_question].topic = '';
   qw.hide_editing_menus ();
   var question = qw.questions_cards[i_question];
   var question_html;
   var from_dataset_b = question.from_dataset_b;
   if (question.full_html) {
      question_html = question.full_html;
   } else {
      question_html = question_shortcodes_text (question, false);
   }
   if (i_insert_before != -1) {
      n_questions++;
      reorder_questions_cards ('', '', i_insert_before);
      return false;
   }
   rdgm_.set_rdgmdata (i_rdgm, 'n_questions', n_questions + 1);
   rdgm_.set_rdgmdata (i_rdgm, 'n_questions_for_done', n_questions + 1);
   var i_current_last_question = n_questions - 1;
   if (debug[0]) {
      console.log ('[create_and_show_new_question] i_current_last_question:', i_current_last_question);
   }
   var processed_htm = rdgm_.process_questions (question_html, '', i_rdgm,
                                                i_question, set_rwizard_f);
   var current_last_question_selector = '#rdgm' + i_rdgm + '-q' + i_current_last_question;
   $ (current_last_question_selector).after (processed_htm);
   n_questions++;
   qw.questions_list_html ();
   $ ('#rwizard_result div.intro-rdgm' + i_rdgm).hide ();
   $ ('#rwizard_result div.rdgmq').hide ();
   $ ('#rwizard_result #summary-rdgm' + i_rdgm).hide ();
   rdgm_.set_rdgmdata (i_rdgm, 'i_question', i_question - 1);
   rdgm_.next_question (i_rdgm);
   if (n_questions == 2) {
      if (! hide_progress_b) {
         rdgm_.display_progress (i_rdgm);
      }
   }
   $ ('#next_button-rdgm' + i_rdgm).css ('text-align', 'left');
   if (question_type != 'information_only') {
      $ ('#next_button_text-rdgm' + i_rdgm).html (qqc.T ('Next question'));
   }
   if (question_type != 'labeled_diagram') {
      $ ('#rdgm_edit_main_menu').hide ();
   }
   if (question_type == 'textentry' || question_type == 'hangman' || question_type == 'one_letter_answer') {
      $ ('#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm-question').each (function () {
         adjust_edit_part ($ (this));
      });
   }
   if (question_type != 'multiple_choice') {
      $ ('#multiple_choice_options_menu').hide ();
   }
   if (question_type != 'textentry' && question_type != 'one_letter_answer') {
      $ ('#free_form_options_menu').hide ();
   }
   if (question_type != 'hangman') {
      $ ('#hangman_options_menu').hide ();
   }
   if (question_type != 'show_me') {
      $ ('#show_me_options_menu').hide ();
   }
   if (question_type != 'hotspot_diagram') {
      $ ('#hotspot_diagram_options_menu').hide ();
   }
   if (question_type == 'multiple_choice') {
      if (! from_dataset_b) {
         qw.show_multiple_choice_options_menu ();
         i_current_answer_choice = 0;
         qw.answer_choice_focus ();
      }
   } else if (question_type == 'hotspot_diagram') {
   } else if (question_type == 'labeled_diagram') {
      rdgm_edit.rwizard_b = true;
      if (debug[0]) {
         console.log ('[create_and_show_new_question] rdgm_edit.rwizard_b:', rdgm_edit.rwizard_b);
      }
      var rdgmq = 'rdgm' + i_rdgm + '-q' + i_question;
      var $content = $ ('#' + rdgmq);
      rdgm_.init_rdgm_edit2 ($content, i_rdgm, i_question);
      if (! from_dataset_b) {
         var ed = tinyMCE.get ('rdgm_edit_canvas-' + rdgmq);
         rdgm_edit.question_attributes = qw.questions_cards[i_question].question_attributes;
         rdgm_edit.show_main_menu (ed, true, false, true);
         rdgm_edit.$edit_area = $content;
         qw.$rdgm_edit_canvas = $ ('#rdgm_edit_canvas-rdgm' + i_rdgm + '-q' + i_question);
      }
   } else if (question_type == 'textentry' || question_type == 'one_letter_answer') {
      var $content = $ ('#rdgm' + i_rdgm + '-q' + i_question);
      rdgm_.init_textentry_autocomplete ($content);
      rdgm_.set_rdgmdata (-1, 'textentry_i_rdgm', i_rdgm);
      if (! from_dataset_b) {
         qw.show_free_form_options_menu ();
      }
   } else if (question_type == 'hangman' || question_type == 'hangman_labeled_diagram') {
      if (! from_dataset_b) {
         qw.show_hangman_options_menu ();
         reinit_hangman_onkeyup ();
         if (question_type == 'hangman_labeled_diagram') {
            var $rdgmq = $ ('#rdgm' + i_rdgm + '-q' + i_question);
            qw.set_hangman_label_width ($rdgmq);
         }
      }
   }
}
function create_and_show_new_card (question_type, set_rwizard_f) {
   qw.questions_cards[i_question].unit  = '';
   qw.questions_cards[i_question].topic = '';
   var question = qw.questions_cards[i_question];
   var from_dataset_b = question.from_dataset_b;
   var card_html;
   if (question.full_html) {
      card_html = question.full_html;
   } else {
      card_html = card_shortcodes_text (question);
   }
   if (i_insert_before != -1) {
      n_questions++;
      reorder_questions_cards ('', '', i_insert_before);
      return false;
   }
   qcard_.set_deckdata (i_rdgm, 'n_cards', n_questions + 1);
   var i_current_last_question = n_questions - 1;
   if (debug[0]) {
      console.log ('[create_and_show_new_card] i_current_last_question:', i_current_last_question);
   }
   qcard_.process_cards (card_html, i_rdgm, i_question, set_rwizard_f);
   qcard_.start_deck2 (i_rdgm, i_question);
   n_questions++;
   qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_rdgm));
   qw.cards_list_html ();
   if (n_questions) {
      qw.highlight_accordion_question (i_question);
   }
   if (n_questions == 2) {
      if (! hide_progress_b) {
         qcard_.display_progress (i_rdgm);
      }
   }
   if (question_type != 'textentry' && question_type != 'one_letter_answer') {
      $ ('#free_form_options_menu').hide ();
   }
   if (question_type != 'show_me') {
      $ ('#show_me_options_menu').hide ();
   }
   if (question_type != 'hangman' && question_type != 'hangman_labeled_diagram') {
      $ ('#hangman_options_menu').hide ();
   }
   if (question_type == 'textentry' || question_type == 'one_letter_answer') {
      qcard_.init_textentry_autocomplete (i_rdgm, i_question);
      qcard_.set_deckdata (-1, 'textentry_i_deck', i_rdgm);
      if (! from_dataset_b) {
         qw.show_free_form_options_menu ();
      }
   } else if (question_type == 'hangman'
                                    || question_type == 'hangman_labeled_diagram') {
      if (! from_dataset_b) {
         qw.show_hangman_options_menu ();
         reinit_hangman_onkeyup ();
         if (question_type == 'hangman_labeled_diagram') {
            var $card_front = $dialog_rwizard.find (qcard_.get_card_front (i_rdgm));
            rdgm_edit.reinit_dragging ($card_front, true);
            qw.set_hangman_label_width ($card_front);
         }
      }
   }
   if (question_type == 'textentry' || question_type == 'hangman' || question_type == 'one_letter_answer') {
      $ (    '#qcard_front-part1-qdeck' + i_rdgm
         + ', #qcard_front-part2-qdeck' + i_rdgm
         + ', #qcard_back-part1-qdeck' + i_rdgm
         + ', #qcard_back-part2-qdeck' + i_rdgm).each (function () {
                                                          adjust_edit_part ($ (this));
                                                       }
      );
   }
}
this.set_hangman_label_width = function ($rdgmq) {
   $rdgmq.find ('.hangman_label').each (function () {
      var $hangman_label = $ (this);
      var display_width = $hangman_label.find ('span.hangman_current_entry').outerWidth ();
      $hangman_label.width (display_width + 30);
   });
}
this.disable_browser_context_menu = function ($objs) {
   if (debug[0]) {
      console.log ('[disable_browser_context_menu] $objs:', $objs);
   }
   $objs.contextmenu (function (e) {
                         return false;
                     });
   $objs.mousedown (function (e) {
                       if (e.which == 1) {
                          var $this = $ (this);
                          if (debug[0]) {
                             console.log ('[disable_browser_context_menu > left-click] $this:', $this);
                          }
                          /* DEDRAG
                          if ($this.tooltip ('instance')) {
                             $this.tooltip ('disable');
                          }
                          if ($this.hasClass ('rdgm_edit_highlight_label')) {
                             $this.parents ('div.rdgm_edit_label').draggable ('enable');
                          } else {
                             $this.parent ().draggable ('enable');
                          }
                          */
                       } else if (e.which == 3) {
                          var $this = $ (this);
                          if (debug[0]) {
                             console.log ('[disable_browser_context_menu > right-click] $ (this):', $ (this));
                          }
                          /* DEDRAG
                          if ($this.hasClass ('rdgm_edit_highlight_label')) {
                             $this.parents ('div.rdgm_edit_label').draggable ('disable');
                          } else {
                             $this.parent ().draggable ('disable');
                          }
                          */
                          $this.css ({cursor: 'default'});
                       }
                    });
   $objs.mouseup (function (e) {
                     if (debug[0]) {
                        console.log ('[disable_browser_context_menu > mouseup] e.which:', e.which);
                     }
                     if (e.which == 1) {
                        var $this = $ (this);
                        if ($this.tooltip ('instance')) {
                           $this.tooltip ('enable');
                        }
                        var $label_div = $this.parent ();
                        if ($label_div.draggable ('instance')) {
                           $label_div.draggable ('disable');
                        }
                     }
                  });
}
this.questions_list_html = function () {
   var m = [];
   var sortable = '';
   if (n_questions) {
      m.push ('Go to...');
      m.push ('<div id="rwizard_questions_sortable">');
   }
   if (n_questions > 1) {
      sortable = ' sortable';
   }
   for (var ii_question=0; ii_question<n_questions; ii_question++) {
      var l = [];
      l.push ('&emsp; ');
      l.push ('' + (ii_question + 1) + '&ensp;');
      var question_text = qw.questions_cards[ii_question].question_text;
      question_text = placeholder_trim (question_text, ii_question);
      if (question_text) {
         l.push (clean_and_trim (question_text, ii_question));
      } else {
         if (n_questions == 1) {
            l.push ('First question');
         } else {
            l.push ('Question ' + qqc.number_to_word (ii_question + 1));
         }
      }
      l.push (  '&emsp;'
               + '(' + question_type (ii_question) + ')');
      var u = [];
      u.push ('<div class="unit_combobox">');
      u.push (   '<select class="unit_topic_combobox">');
      var n_unit_names = qw.unit_names.length;
      for (var i=0; i<n_unit_names; i++) {
         u.push (   '<option>');
         u.push (      qw.unit_names[i]);
         u.push (   '</option>');
      }
      u.push (      '<option>');
      u.push (         '[none]');
      u.push (      '</option>');
      u.push (   '</select>');
      u.push ('</div>');
      var t = [];
      t.push ('<div class="topic_combobox">');
      t.push (   '<select class="unit_topic_combobox">');
      var n_topic_names = qw.topic_names.length;
      for (var i=0; i<n_topic_names; i++) {
         t.push (   '<option>');
         t.push (      qw.topic_names[i]);
         t.push (   '</option>');
      }
      t.push (      '<option>');
      t.push (         '[none]');
      t.push (      '</option>');
      t.push (   '</select>');
      t.push ('</div>');
      var style = '';
      if (ii_question == i_question) {
         style = ' style="font-weight: bold;"';
      }
      m.push ('<div id="rwizard_menu_question-q' + ii_question + '" class="rwizard_menu_item rwizard_menu_question q' + ii_question + sortable + '" data-i_question="' + ii_question + '" onmousedown="rwizard.go_to_question (' + ii_question + ')"' + style + '>');
      m.push (   add_delete_buttons_html (ii_question, false));
      m.push (   '<div class="rwizard_menu_question_label">');
      m.push (      l.join (''));
      m.push (   '</div>');
      m.push (   u.join ('\n'));
      m.push (   t.join ('\n'));
      m.push ('</div>');
   }
   var add_label = 'Add question';
   if (n_questions) {
      m.push ('</div>');
      add_label = 'Add new question at end (click green &ldquo;+&rdquo;, above right, to add earlier)';
   }
   m.push ('<div class="rwizard_menu_item" onmousedown="rwizard.show_new_question_type_menu (this)">');
   m.push (   add_delete_buttons_html (n_questions, true));
   m.push (   add_label);
   m.push ('</div>');
   if (debug[2]) {
      console.log ('[questions_list_html] m.join ():', m.join ('\n'));
   }
   $ ('#rwizard_questions').html (m.join ('\n'));
   if (n_questions) {
      $ ('#rwizard_questions_sortable').sortable ({
         axis:          'y',
         containment:   '#rwizard_questions',
         stop:          reorder_questions_cards
      });
   }
   $ ('select.unit_topic_combobox').combobox ();
   $ ('#rwizard_questions div.rwizard_menu_question').each (function () {
      const $rwizard_menu_question = $ (this);
      var ii_question = $rwizard_menu_question.data ('i_question');
      var unit = qw.questions_cards[ii_question].unit;
      var title = unit ? '' : 'Select an existing unit name or enter a new unit name';
      const $unit_input = $rwizard_menu_question.find ('div.unit_combobox input');
      $unit_input
         .val (unit)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Unit')
         .css  ({width: '85px'})
         .on ('change', function () {
            var ok_f = true;
            var input_unit = trim ($unit_input.val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[unit on (\'change\')] input_unit:', input_unit);
            }
            if (! input_unit || input_unit == '[none]') {
               input_unit = '';
               $unit_input.val ('');
            } else {
               var new_f = qw.unit_names.indexOf (input_unit) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new unit "' + input_unit + '"?');
               }
            }
            var ii_question = $unit_input.parents ('div.rwizard_menu_question').data ('i_question');
            if (ok_f) {
               qw.questions_cards[ii_question].unit = input_unit;
               if (new_f) {
                  qw.unit_names.push (input_unit);
                  qw.unit_names.sort ();
                  $ ('div.unit_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_unit);
                  });
               }
            } else {
               $unit_input.val (unit);
            }
         });
   });
   $ ('#rwizard_questions div.rwizard_menu_question').each (function () {
      const $rwizard_menu_question = $ (this);
      var ii_question = $rwizard_menu_question.data ('i_question');
      var topic = qw.questions_cards[ii_question].topic;
      var title = topic ? '' : 'Select an existing topic name or enter a new topic name';
      const $topic_input = $rwizard_menu_question.find ('div.topic_combobox input');
      $topic_input
         .val (topic)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Topic')
         .css  ({width: '85px'})
         .on ('change', function () {
            var ok_f = true;
            var new_f = false;
            var input_topic = trim ($topic_input.val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[topic on (\'change\')] input_topic:', input_topic);
            }
            if (! input_topic || input_topic == '[none]') {
               input_topic = '';
               $topic_input.val ('');
            } else {
               var new_f = qw.topic_names.indexOf (input_topic) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new topic "' + input_topic + '"?');
               }
            }
            var ii_question = $topic_input.parents ('div.rwizard_menu_question').data ('i_question');
            if (ok_f) {
               qw.questions_cards[ii_question].topic = input_topic;
               if (new_f) {
                  qw.topic_names.push (input_topic);
                  qw.topic_names.sort ();
                  $ ('div.topic_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_topic);
                  });
               }
            } else {
               $topic_input.val (topic);
            }
         });
   });
}
this.cards_list_html = function () {
   if (debug[0]) {
      console.log ('[cards_list_html] n_questions:', n_questions, ', qw.questions_cards.length:', qw.questions_cards.length);
   }
   if (! qw.questions_cards.length) {
      return;
   }
   var m = [];
   var sortable = '';
   if (n_questions) {
      m.push ('Go to...');
      m.push ('<div id="rwizard_questions_sortable">');
   }
   if (n_questions > 1) {
      sortable = ' sortable';
   }
   for (var ii_question=0; ii_question<n_questions; ii_question++) {
      var l = [];
      l.push ('&emsp; ');
      l.push ('' + (ii_question + 1) + '&ensp;');
      if (debug[0]) {
         console.log ('[cards_list_html] ii_question:', ii_question);
      }
      var question_text = qw.questions_cards[ii_question].question_text;
      question_text = placeholder_trim (question_text, ii_question);
      if (question_text) {
         l.push (clean_and_trim (question_text, ii_question));
      } else {
         if (n_questions == 1) {
            l.push ('First card');
         } else {
            l.push ('Card ' +  qqc.number_to_word (ii_question + 1));
         }
      }
      l.push (  '&emsp;'
               + '(' + question_type (ii_question) + ')');
      var u = [];
      u.push ('<div class="unit_combobox">');
      u.push (   '<select class="unit_topic_combobox">');
      var n_unit_names = qw.unit_names.length;
      for (var i=0; i<n_unit_names; i++) {
         u.push (   '<option>');
         u.push (      qw.unit_names[i]);
         u.push (   '</option>');
      }
      u.push (      '<option>');
      u.push (         '[none]');
      u.push (      '</option>');
      u.push (   '</select>');
      u.push ('</div>');
      var t = [];
      t.push ('<div class="topic_combobox">');
      t.push (   '<select class="unit_topic_combobox">');
      var n_topic_names = qw.topic_names.length;
      for (var i=0; i<n_topic_names; i++) {
         t.push (   '<option>');
         t.push (      qw.topic_names[i]);
         t.push (   '</option>');
      }
      t.push (      '<option>');
      t.push (         '[none]');
      t.push (      '</option>');
      t.push (   '</select>');
      t.push ('</div>');
      var style = '';
      if (ii_question == i_question) {
         style = ' style="font-weight: bold;"';
      }
      m.push ('<div id="rwizard_menu_question-q' + ii_question + '" class="rwizard_menu_item rwizard_menu_question q' + ii_question + sortable + '" data-i_question="' + ii_question + '" onmousedown="rwizard.go_to_card (' + ii_question + ')"' + style + '>');
      m.push (   add_delete_buttons_html (ii_question, false));
      m.push (   '<div class="rwizard_menu_question_label">');
      m.push (      l.join (''));
      m.push (   '</div>');
      m.push (   u.join ('\n'));
      m.push (   t.join ('\n'));
      m.push ('</div>');
   }
   var add_label = 'Add card';
   if (n_questions) {
      m.push ('</div>');
      add_label = 'Add new card at end (click green &ldquo;+&rdquo;, above right, to add earlier)';
   }
   m.push ('<div class="rwizard_menu_item" onmousedown="rwizard.show_new_question_type_menu (this)">');
   m.push (   add_delete_buttons_html (n_questions, true));
   m.push (   add_label);
   m.push ('</div>');
   $ ('#rwizard_questions').html (m.join ('\n'));
   if (n_questions) {
      $ ('#rwizard_questions_sortable').sortable ({
         axis:          'y',
         containment:   '#rwizard_questions',
         stop:          reorder_questions_cards
      });
   }
   $ ('select.unit_topic_combobox').combobox ();
   $ ('#rwizard_questions div.rwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var unit = qw.questions_cards[ii_question].unit;
      var title = unit ? '' : 'Select an existing unit name or enter a new unit name';
      $ (this).find ('div.unit_combobox input')
         .val (unit)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Unit')
         .css  ({width: '85px'})
         .on ('change', function () {
            var ok_f = true;
            var input_unit = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[unit on (\'change\')] input_unit:', input_unit);
            }
            if (! input_unit || input_unit == '[none]') {
               input_unit = '';
               $ (this).val ('');
            } else {
               var new_f = qw.unit_names.indexOf (input_unit) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new unit "' + input_unit + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.rwizard_menu_question').data ('i_question');
            if (ok_f) {
               qw.questions_cards[ii_question].unit = input_unit;
               if (new_f) {
                  qw.unit_names.push (input_unit);
                  qw.unit_names.sort ();
                  $ ('div.unit_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_unit);
                  });
               }
            } else {
               $ (this).val (unit);
            }
         });
   });
   $ ('#rwizard_questions div.rwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var topic = qw.questions_cards[ii_question].topic;
      var title = topic ? '' : 'Select an existing topic name or enter a new topic name';
      $ (this).find ('div.topic_combobox input')
         .val (topic)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Topic')
         .css  ({width: '85px'})
         .on ('change', function () {
            var ok_f = true;
            var new_f = false;
            var input_topic = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[topic on (\'change\')] input_topic:', input_topic);
            }
            if (! input_topic || input_topic == '[none]') {
               input_topic = '';
               $ (this).val ('');
            } else {
               var new_f = qw.topic_names.indexOf (input_topic) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new topic "' + input_topic + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.rwizard_menu_question').data ('i_question');
            if (ok_f) {
               var existing_topics = qw.questions_cards[ii_question].topic;
               if (existing_topics) {
                  var add_f = confirm ('Do you want to add "' + input_topic + '" to existing topics "' + existing_topics + '"? (Cancel replaces all!)');
                  if (add_f) {
                     var topics = existing_topics + '; ' + input_topic;
                     qw.questions_cards[ii_question].topic = topics;
                     $ (this).val (topics);
                  } else {
                     qw.questions_cards[ii_question].topic = input_topic;
                  }
               } else {
                  qw.questions_cards[ii_question].topic = input_topic;
               }
               if (new_f) {
                  qw.topic_names.push (input_topic);
                  qw.topic_names.sort ();
                  $ ('div.topic_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_topic);
                  });
               }
            } else {
               $ (this).val (topic);
            }
         });
   });
}
this.unit_topic_selected = function (unit_topic, unused, input_el) {
   unit_topic = trim (unit_topic);
   if (debug[0]) {
      console.log ('[unit_topic_selected] unit:', unit_topic, 'input_el:', input_el);
   }
   var ii_question = $ (input_el).data ('i_question');
   if (! unit_topic || unit_topic == '[none]') {
      unit_topic = '';
      var delay_reset = function () {
         input_el.value = '';
      }
      setTimeout (delay_reset, 200);
   }
   const unit_f = $ (input_el).parents ('div.unit_combobox').length;
   if (unit_f) {
      qw.questions_cards[ii_question].unit  = unit_topic;
   } else {
      qw.questions_cards[ii_question].topic = unit_topic;
   }
}
function add_delete_buttons_html (ii_question, add_at_end_f) {
   m = [];
   var question_card = rdgm_deck == 'rdgm' ? 'question' : 'card';
   var delete_style = '';
   var clone_style  = '';
   var shift_icon = '';
   if (add_at_end_f) {
      delete_style = 'style="visibility: hidden;"';
      clone_style  = delete_style;
   } else {
      shift_icon = ' class="rwizard_shift_icon"';
      if (qw.questions_cards[ii_question].from_dataset_b) {
         clone_style = 'style="visibility: hidden;"';
      }
      if (n_questions == 1) {
         delete_style = 'style="visibility: hidden;"';
      }
   }
   m.push (   '<button class="rdgm_image_button" ' + delete_style + ' onclick="rwizard.delete_question (event, ' + ii_question + ')" title="Delete this ' + question_card + '">');
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/delete.png" class="rwizard_shift_icon" />');
   m.push (   '</button>');
   m.push (   '<button class="rdgm_image_button" ' + clone_style + ' onclick="rwizard.clone_question (event, ' + ii_question + ')" title="Clone this ' + question_card + ' (to new ' + question_card + ' at end)">');
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/clone_icon.png" class="rwizard_shift_icon" />');
   m.push (   '</button>');
   if (add_at_end_f) {
      m.push ('<button class="rdgm_image_button" title="Add new ' + question_card + ' at end">');
   } else {
      m.push ('<button class="rdgm_image_button" onclick="rwizard.insert_question (event, ' + ii_question + ')" title="Insert new ' + question_card + ' before this one">');
   }
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/add_icon.png"' + shift_icon + ' />');
   m.push (   '</button>');
   return m.join ('\n');
}
function question_type (ii_question) {
   var type = qw.questions_cards[ii_question].type;
   if (debug[0]) {
      console.log ('[question_type] ii_question:', ii_question, ', type:', type);
   }
   var label;
   if (type == 'multiple_choice') {
      label = 'mult. choice';
   } else if (type == 'show_me') {
      label = '"show me..."';
   } else if (type == 'hotspot_diagram') {
      label = 'hotspot diagram';
   } else if (type == 'labeled_diagram') {
      label = 'labeled diagram';
   } else if (type == 'textentry') {
      label = 'free-form';
   } else if (type == 'hangman') {
      label = 'hangman';
   } else if (type == 'hangman_labeled_diagram') {
      label = 'hangman diagram';
   } else if (type == 'one_letter_answer') {
      label = 'one-letter answer';
   } else if (type == 'information_only') {
      label = 'information-only';
   } else if (type == 'simple_card') {
      label = 'simple flashcard';
   } else if (type == 'optional_textentry') {
      label = 'optional text input';
   }
   return label;
}
function new_question_type_menu_html () {
}
function reorder_questions_cards (e, ui, local_i_insert_before) {
}
function update_hotspot_diagrams_question_text (local_i_question) {
   var i_beg;
   var i_end;
   if (typeof local_i_question == 'undefined') {
      i_beg = 0;
      i_end = n_questions;
   } else {
      i_beg = local_i_question;
      i_end = local_i_question + 1;
   }
   if (debug[0]) {
      console.log ('[update_hotspot_diagrams_question_text] local_i_question:', local_i_question, ', i_beg:', i_beg, ', i_end:', i_end);
   }
   for (var i_question=i_beg; i_question<i_end; i_question++) {
      var question = qw.questions_cards[i_question];
      if (question.type == 'hotspot_diagram') {
         question.hotspot_updated = false;
         const $rdgmq = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
         const $hotspot_image_stack = $rdgmq.find ('div.hotspot_image_stack');
         if ($hotspot_image_stack.length) {
            const i_pos = question.question_text.indexOf ('<div class="hotspot_image_stack');
            if (i_pos != -1) {
               question.question_text = question.question_text.substr (0, i_pos);
               if (debug[0]) {
                  console.log ('[update_hotspot_diagrams_question_text] $hotspot_image_stack:', $hotspot_image_stack);
               }
            }
            if (question.question_text.indexOf ('rwizard_placeholder') != -1) {
               question.question_text = '';
            }
            $hotspot_image_stack.removeClass ('ui-resizable');
            $rdgmq.find ('div.ui-resizable-handle').remove ();
            question.question_text += $hotspot_image_stack[0].outerHTML;
            question.hotspot_updated = true;
         }
         if (debug[0]) {
            console.log ('[update_hotspot_diagrams_question_text] qw.questions_cards[' + i_question + ']:', qw.questions_cards[i_question]);
         }
      }
   }
}
this.update_diagram_html = function (e, ui) {
   if (debug[0]) {
      console.log ('[update_diagram_html] e:', e);
   }
   const question = qw.questions_cards[i_question];
   if (question.type == 'labeled_diagram') {
      update_labeled_diagram_question_text_from_html ()
   } else if (question.type == 'hangman_labeled_diagram') {
      var $rdgmq = $ ('div#dialog_rwizard div#rdgm' + i_rdgm + '-q' + i_question);
      var $hangman_fields_div = $rdgmq.find ('div.hangman_labeled_diagram_fields');
      if ($hangman_fields_div.length) {
         $ ('body').append ('<div id="rdgm_tmp" style="display: none;"></div>');
         const $tmp_div = $ ('div#rdgm_tmp');
         $tmp_div.append ($hangman_fields_div.html ());
         $tmp_div.find ('div.hangman_label').html ('[hangman]');
         $tmp_div.find ('div.hangman_label').removeClass ('ui-draggable ui-draggable-handle ui-resizable');
         $tmp_div.find ('div.ui-resizable-handle').remove ();
         question.hangman_fields = $tmp_div.html ();
         $tmp_div.remove ();
      }
   }
}
function reset_placeholders () {
   for (var i_question=0; i_question<n_questions; i_question++) {
      var question = qw.questions_cards[i_question];
      if (question.question_text.indexOf ('rwizard_placeholder') != -1) {
         var textentry_hangman = '';
         if (question.type == 'textentry' || question.type == 'hangman' ) {
            textentry_hangman = '[' + question.type + ']';
         } else if (question.type == 'one_letter_answer') {
            textentry_hangman = '[textentry single_char="true"]';
         } else if (question.type == 'optional_textentry') {
            textentry_hangman = '[textentry]';
         }
         if (question.type != 'hotspot_diagram' && question.type != 'labeled_diagram' && question.type != 'hangman_labeled_diagram') {
            question.question_text = question_placeholder (i_question+1, textentry_hangman);
         }
      }
      if (rdgm_deck == 'deck') {
         if (! question.answer_text || question.answer_text.indexOf ('rwizard_placeholder') != -1) {
            if (question.type == 'hangman') {
               question.answer_text = answer_placeholder (i_question+1, '');
            } else {
               question.answer_text = answer_placeholder (i_question+1, textentry_hangman);
            }
         }
      }
   }
}
function redraw_rdgm_deck (local_i_question, no_hotspot_update_f=false) {
   if (debug[0]) {
      console.log ('[redraw_rdgm_deck] local_i_question:', local_i_question);
   }
   remove_rwizard_editors ();
   if (typeof (local_i_question) == 'undefined') {
      if (n_questions > 0) {
         local_i_question = 0;
      }
   }
   const redraw_rdgm_deck2 = function () {
      if (rdgm_deck == 'rdgm') {
         var new_rdgm_text = rdgm_shortcodes_text ();
         var new_rdgm_html
              = rdgm_.process_rdgm_pair (new_rdgm_text, i_rdgm, true, false, true);
         $ ('#rwizard_result').html (new_rdgm_html);
         qw.questions_list_html ();
         if (typeof (local_i_question) != 'undefined') {
            qw.go_to_question (local_i_question, true);
         }
      } else {
         var new_deck_text = deck_shortcodes_text ();
         var new_deck_html
            = qcard_.process_qdeck_pair (new_deck_text, i_rdgm, true, false, true);
         $ ('#rwizard_result').html (new_deck_html);
         qcard_.qdeck_init2 (1, false, true);
         $ ('div.rdgm-parts').each (function () {
            adjust_edit_part ($ (this));
         });
         qw.cards_list_html ();
         if (typeof (local_i_question) != 'undefined') {
            qw.go_to_card (local_i_question, true);
         }
      }
   }
   if (! no_hotspot_update_f) {
      update_hotspot_diagrams_question_text ();
      setTimeout (redraw_rdgm_deck2, 200);
   } else {
      redraw_rdgm_deck2 ();
   }
}
this.go_to_question = function (local_i_question, force_f) {
   if (debug[0]) {
      console.log ('[go_to_question] i_question:', i_question, ', local_i_question:', local_i_question);
   }
   if (waiting_for_hangman_click) {
      waiting_for_hangman_click = false;
      $ ('#hangman_options_menu_feedback').hide ();
   }
   if (local_i_question == i_question && ! force_f) {
      return false;
   }
   qw.hangman_i_choice = 0;
   delay_go_to_question_i_question = local_i_question;
   var delay_go_to_question = function () {
      if (n_questions > 1) {
         rdgm_.next_question_from_intro (i_rdgm);
      }
      if (delay_go_to_question_i_question == -1) {
         var $intro_div = $ ('div.intro-rdgm' + i_rdgm);
         show_intro ($intro_div, rdgm_.no_intro_b[i_rdgm]);
      } else {
         i_question = local_i_question;
         $ ('#rwizard_result div.intro-rdgm' + i_rdgm).hide ();
         $ ('#rwizard_result div.rdgmq').hide ();
         $ ('#rwizard_result #summary-rdgm' + i_rdgm).hide ();
         if (! rdgm_.get_rdgmdata (i_rdgm, 'hide_forward_back_b')) {
            $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible'});
            $ ('span.question-number-rdgm' + i_rdgm).html (i_question + 1);
         }
         rdgm_.set_rdgmdata (i_rdgm, 'i_question', i_question - 1);
         rdgm_.next_question (i_rdgm, false, true);
      }
   }
   setTimeout (delay_go_to_question, 100);
}
this.go_to_question2 = function (from_go_to_question_b) {
   if (debug[0]) {
      console.log ('[go_to_question2] i_question:', i_question);
   }
   qw.hide_editing_menus ();
   selecting_hotspot_f = false;
   $ ('#next_button_text-rdgm' + i_rdgm).html ('Next question');
   /* DKTMP
   var from_dataset_b = false;
   if (qw.questions_cards.length) {
      from_dataset_b = qw.questions_cards[i_question].from_dataset_b;
   }
   */
   var from_dataset_b = qw.questions_cards[i_question].from_dataset_b;
   if (from_dataset_b) {
      $ ('#rwizard_dataset_question_not_editable').show ();
   } else {
      $ ('#rwizard_dataset_question_not_editable').hide ();
   }
   var question_type  = qw.questions_cards[i_question].type;
   if (question_type == 'multiple_choice') {
      if (! from_dataset_b) {
         qw.show_multiple_choice_options_menu ();
         i_current_answer_choice = 0;
         qw.answer_choice_focus ();
      }
   } else if (question_type == 'show_me') {
      if (! from_dataset_b) {
         $ ('#show_me_options_menu').show ();
      }
      $ ('#' + document_rdgm_mobile + 'show_answer_got_it_or_not-rdgm' + i_rdgm + '-q' + i_question).hide ();
   } else if (question_type == 'hotspot_diagram') {
      if (! from_dataset_b) {
         $hotspot_image_stack = $ ('div#dialog_rwizard div#rdgm' + i_rdgm + '-q' + i_question + ' div.hotspot_image_stack')
         qw.show_hotspot_diagram_options_menu ();
         $ ('button.rwizard_add_media').removeAttr ('disabled').html ('Change image');
         $ ('#change_media_info_icon').show ();
         spotmap = '';
         const $rdgmq = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
         const $canvas = $rdgmq.find ('canvas.layer0_edited');
         make_hotspot_image_stack_resizable ($hotspot_image_stack, $canvas);
         const $hotspot_labels = $rdgmq.find ('div.rdgm_hotspot_label');
         $hotspot_labels.addClass ('ui-draggable ui-draggable-handle');
         rdgm_edit.reinit_dragging ($rdgmq);
         $hotspot_labels.off ('dragstop');
         $hotspot_labels.on ('dragstop', qw.position_px_to_pct);
      }
   } else if (question_type == 'labeled_diagram') {
      if (! from_dataset_b) {
         const rdgmq = 'rdgm' + i_rdgm + '-q' + i_question;
         const $rdgm_edit_main_menu = $ ('div#rdgm_edit_main_menu');
         if ($rdgm_edit_main_menu.length) {
            $ ('div#rdgm_edit_main_menu').show ();
         } else {
            var ed = tinyMCE.get ('rdgm_edit_canvas-' + rdgmq);
            rdgm_edit.question_attributes = qw.questions_cards[i_question].question_attributes;
            rdgm_edit.show_main_menu (ed, true, false, true);
         }
         rdgm_edit.$edit_area = $ ('#' + rdgmq);
         qw.$rdgm_edit_canvas = $ ('#rdgm_edit_canvas-rdgm' + i_rdgm + '-q' + i_question);
         $ ('button.rwizard_add_media').removeAttr ('disabled').html ('Change image');
      }
   } else if (question_type == 'textentry' || question_type == 'one_letter_answer') {
      if (! from_dataset_b) {
         qw.show_free_form_options_menu ();
      }
      $ ('div.textentry_check_answer_div').show ();
      rdgm_.set_rdgmdata (-1, 'textentry_i_rdgm', i_rdgm);
   } else if (question_type == 'hangman' || question_type == 'hangman_labeled_diagram') {
      if (! from_dataset_b) {
         qw.show_hangman_options_menu ();
         reinit_hangman_onkeyup ();
         if (question_type == 'hangman_labeled_diagram') {
            var $rdgmq_id = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
            $rdgmq_id.find ('div.hangman_label').addClass ('ui-draggable ui-draggable-handle ui-resizable');
            var delay_reinit = function () {
               rdgm_edit.reinit_dragging ($rdgmq_id, true);
               qw.set_hangman_label_width ($rdgmq_id);
            }
            setTimeout (delay_reinit, 100);
            $ ('button.rwizard_add_media').removeAttr ('disabled').html ('Change image');
         }
      }
   } else if (question_type == 'information_only') {
      $ ('#next_button_text-rdgm' + i_rdgm).html ('Continue');
      var delay_show = function () {
         $ ('#rdgm' + i_rdgm + '-q' + i_question).show ();
      }
      setTimeout (delay_show, 100);
   }
   if (   question_type != 'hotspot_diagram'
       && question_type != 'labeled_diagram'
       && question_type != 'hangman_labeled_diagram') {
      $ ('button.rwizard_add_media').attr ('disabled', true).html ('Add Media');
      $ ('#change_media_info_icon').hide ();
   }
   $ ('div.rwizard_accordion').accordion ('option', 'active', QUESTIONS_ACCORDION);
   qw.highlight_accordion_question (i_question);
   qqc.select_placeholder ($ ('#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm-question').first ());
}
this.hide_editing_menus = function () {
   if (debug[0]) {
      console.log ('[hide_editing_menus] i_question:', i_question);
   }
   $ ('#new_question_type_menu').hide ();
   $ ('#rdgm_edit_main_menu').hide ();
   $ ('div.textentry_check_answer_div').hide ();
   $ ('#multiple_choice_options_menu').hide ();
   $ ('#show_me_options_menu').hide ();
   $ ('#hotspot_diagram_options_menu').hide ();
   $ ('#hotspot_editing_menu').hide ();
   $ ('#label_options_menu').hide ();
   $ ('#free_form_options_menu').hide ();
   $ ('#hangman_options_menu').hide ();
   if (rdgm_edit.waiting_for_target_select_b && rdgm_edit.target_must_be_text_f) {
      rdgm_edit.exit_select_text_target ();
   }
}
this.highlight_accordion_question = function (local_i_question) {
}
function clean_and_trim (text, ii_question) {
   if (qw.questions_cards[ii_question].from_dataset_b) {
      text = text.replace (/\[!+\][^]*?\[\/!+\]/gm, '')
                 .replace (/\[q[^\]]*\]/, '')
                 .replace (/\[[cfa][^\]]*\][^]*/, '');
   }
   var question_type = qw.questions_cards[ii_question].type;
   if (   question_type == 'hangman'
       || question_type == 'hangman_labeled_diagram') {
      var span_pos = text.search (/<span class="(rdgm|qdeck)_hangman/);
      if (span_pos != -1) {
         var hangman_span = qqc.find_matching_block (text.substr (span_pos));
         text = text.replace (hangman_span, ' ');
      } else {
         text = text.replace (/\[hangman[^\]]*\]/g, ' ');
         text = text.replace (/\[q[^\]]*\]/, '');
      }
   } else if (   question_type == 'optional_textentry'
              || question_type == 'textentry'
              || question_type == 'one_letter_answer') {
      text = text.replace (/\[textentry[^\]]*\]/, ' ');
   } else if (   question_type == 'labeled_diagram') {
      text = text.replace (/\[q[^\]]*\]/, '');
   } else if (question_type == 'hotspot_diagram') {
      const i_pos = text.indexOf ('<div class="hotspot_image_stack');
      if (i_pos != -1) {
         text = text.substr (0, i_pos);
      }
   }
   text = text.replace (/<p>|<p [^>]+>|<h>|<h [^>]+>|<br[^>]*>/gm, ' ');
   text = text.replace (/<span class="rdgm-avoid-br" style="display: none;">x<\/span>/g, '');
   var m = text.match (/<[^>]*>/g);
   if (m) {
      var n_tags = m.length;
      for (var i=0; i<n_tags; i++) {
         var tag_i = m[i];
         if (tag_i.search (/su[bp]>/) == -1) {
            text = text.replace (tag_i, '');
         }
      }
   }
   text = text.replace (/&nbsp;/g, ' ');
   text = trim (text.replace (/[\u2002\u2003\u00A0]/g, ' '));
   var len = text.length;
   if (len > 35) {
      text = text.substr (0, 35) + '...';
   }
   if (debug[0]) {
      console.log ('[clean_and_trim] text:', text);
      if (text.length) {
         console.log ('[clean_and_trim] text.charCodeAt (0):', text.charCodeAt (0));
      }
   }
   return text;
}
function placeholder_trim (text, ii_question) {
   if (text.indexOf ('"rwizard_placeholder') != -1) {
      text = '';
   } else {
      text = clean_and_trim (text, ii_question);
   }
   return text;
}
function trim (s) {
   if (s) {
      if ('a'.trim) {
         s = s.trim ();
      } else {
         s = s.replace (/^\s+|\s+$/g, '');
      }
   }
   return s;
}
var $hotspot_image_stack;
var hotspot_image_stack_el;
var spotmap;
var current_hotspot_no;
var current_hotspot_color = {};
var n_hotspots;
var hotspot_changes_f;
var hotspot_deleted_f       = false;
var hotspot_label_deleted_f = false;
var hotspot_style_changes_f;
this.show_hotspot_diagram_options_menu = function () {
   var h = [];
   var m = [];
   h.push ('<div class="rwizard_floating_menu_title">');
   h.push (   '<div class="rwizard_inline_block rwizard_float_right">');
   h.push (      '<button onclick="rwizard.toggle_hotspot_image_hide_show ()" style="padding: 0;" title="On-off: hide image and show only hotspots">');
   h.push (         '<img src="' + rdgm_edit_params.url + '/images/rdgm_icon_image_x.svg" border="0" style="width: 16px; height: 14px;" />');
   h.push (      '</button>');
   h.push (   '</div>');
   h.push (   'Hotspot diagram options');
   h.push ('</div>');
   m.push ('<div id="hotspot_options_header" class="rwizard_menu_item" onclick="rwizard.show_hide_hotspot_options ()">');
   m.push (   '&#9654&#xFE0E; User interaction options');
   m.push ('</div>');
   m.push ('<div class="hotspot_options">');
   m.push (  '<form name="hotspot_options">');
   m.push (   '<div>');
   m.push (      '&emsp; &nbsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" class="hotspot_user_interaction_label_prompt"  name="hotspot_user_interaction" onclick="rwizard.change_hotspot_user_interaction (\'label_prompt\')" />Prompt with label; user clicks hotspot');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push (   '<div class="hotspot_user_interaction_sub_options hotspot_label_prompt_options">');
   m.push (      '<table class="hotspot_label_prompt_options">');
   m.push (         '<tr>');
   m.push (            '<td style="border-top: 0;">');
   m.push (               '<nobr>&emsp; &emsp; &emsp; &nbsp;</nobr>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<nobr>Hotspots show:</nobr>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_always"            type="radio" name="prompt_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="always"          />Always<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_input_smaller rwizard_help" title="Only works if you have highlighted the hotspot or added a border" />');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '&nbsp;&mdash;&nbsp;Hover:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_hover_hide"        type="radio" name="prompt_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="hover_hide"      />no&ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td colspan="2">');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_hover_show"        type="radio" name="prompt_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="hover_show"      />yes&ensp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_long_hover_show"   type="radio" name="prompt_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="long_hover_show" />long-hover');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');  // Spacer.
   m.push (            '</td>');
   m.push (            '<td>');  // "Hotspots show".
   m.push (            '</td>');
   m.push (            '<td>');  // "Always".
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '&nbsp;&mdash;&nbsp;Click:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label class="prompt_hotspots_click">');
   m.push (                  '<input class="hotspots_click_hide"        type="radio" name="prompt_hotspots_click" onclick="rwizard.change_hotspots_show (this)" value="click_hide" />no&nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label class="prompt_hotspots_click">');
   m.push (                  '<input class="hotspots_temporary"         type="radio" name="prompt_hotspots_click" onclick="rwizard.change_hotspots_show (this)" value="temporary" />temporarily&nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label class="prompt_hotspots_click">');
   m.push (                  '<input class="hotspots_keep"              type="radio" name="prompt_hotspots_click" onclick="rwizard.change_hotspots_show (this)" value="keep"      />keep<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_input_smaller rwizard_help" title="Only works if you have highlighted the hotspot or added a border" />');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr class="border-top">');
   m.push (            '<td style="border-top: 0;">');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               'Labels show:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '&nbsp;&mdash;&nbsp;Click:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_hide"      type="radio" name="hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'hide\')" />no&nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_temporary" type="radio" name="hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'temporary\')" />temporarily&nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_keep"      type="radio" name="hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'keep\')" />keep');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (      '</table>');
   m.push (   '</div>');
   m.push (   '<div>');
   m.push (      '&emsp; &nbsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" class="hotspot_user_interaction_find_hotspots" name="hotspot_user_interaction" onclick="rwizard.change_hotspot_user_interaction (\'find_hotspots\')"        />Find hotspots (and click) ');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push (   '<div class="hotspot_user_interaction_sub_options hotspot_find_hotspots_options">');
   m.push (      '&emsp; &emsp; &emsp; &nbsp; Labels on diagram:');
   m.push (      '<label>');
   m.push (         '<input type="radio" class="hotspot_labels_stick_hide"      name="find_hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'hide\')" />Don&rsquo;t show &nbsp;');
   m.push (      '</label>');
   m.push (      '<label>');
   m.push (         '<input type="radio" class="hotspot_labels_stick_temporary" name="find_hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'temporary\')" />Show on click');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push (   '<div>');
   m.push (      '&emsp; &nbsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" class="hotspot_user_interaction_info_only"     name="hotspot_user_interaction" onclick="rwizard.change_hotspot_user_interaction (\'info_only\')"            />Info only...');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push (   '<div class="hotspot_user_interaction_sub_options hotspot_info_only_options">');
   m.push (      '<table class="hotspot_label_prompt_options">');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               '&emsp; &emsp; &emsp; &nbsp; Hotspots show:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_always"            type="radio" name="info_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="always"          />Always<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_input_smaller rwizard_help" title="Only works if you have highlighted the hotspot or added a border" />');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '&nbsp;&mdash;&nbsp;Hover:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_hover_hide"        type="radio" name="info_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="hover_hide"      />no&ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_hover_show"        type="radio" name="info_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="hover_show"      />yes&ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_long_hover_show"   type="radio" name="info_hotspots_hover" onclick="rwizard.change_hotspots_show (this)" value="long_hover_show" />long-hover');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspots_keep"              type="checkbox"                         onclick="rwizard.change_hotspots_show (this)" />Keep<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_input_smaller rwizard_help" title="Only works if you have highlighted the hotspot or added a border" /> &nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               '&emsp; &emsp; &emsp; &nbsp; Labels show:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '&nbsp;&mdash;&nbsp;Hover:');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_hover_hide"      type="radio" name="info_hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'hide\')"     />no&ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_hover_show"      type="radio" name="info_hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'hover_show\')"   />yes&nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_long_hover_show" type="radio" name="info_hotspot_labels_stick" onclick="rwizard.change_hotspot_labels_stick (\'long_hover_show\')" />long-hover &nbsp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input class="hotspot_labels_stick_info_only"       type="checkbox" onclick="rwizard.change_hotspot_labels_stick_info_only (this)" />Keep');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (      '</table>');
   m.push (   '</div>');
   m.push (  '</form>');
   m.push ('</div>');
   m.push ('<div id="hotspot_settings_header" class="rwizard_menu_item" onclick="rwizard.show_hide_hotspot_settings ()">');
   m.push (   '&#9654&#xFE0E; Settings');
   m.push ('</div>');
   m.push ('<div class="hotspot_settings">');
   m.push (   '<div>');
   m.push (      '&emsp; &nbsp;');
   m.push (      'Hotspot image map resolution');
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon rwizard_help" title="Hotspot locations on your image are specified at the resolution given here, typically lower than your image resolution.  The hotspot image map &ldquo;pixels&rdquo; are sized so that the overall size of the image map corresponds to the size of your image" />');
   m.push (      '&ensp;');
   m.push (      '<label>');
   m.push (         'width:  <input id="spotmap_width"  class="spotmap_size" onchange="rwizard.change_spotmap_size (this, 1)" value="' + spotmap_width  + '" />');
   m.push (      '</label>');
   m.push (      '&ensp;');
   m.push (      '<label>');
   m.push (         'height: <input id="spotmap_height" class="spotmap_size" onchange="rwizard.change_spotmap_size (this, 0)" value="' + spotmap_height + '" />');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push (   '<div>');
   m.push (      '&emsp; &nbsp;');
   m.push (      '<label>');
   m.push (         'Sparse hotspot image map');
   m.push (         '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" class="rwizard_shift_icon rwizard_help" title="Ordinarily the hotspot image map is defined for every &ldquo;pixel&rdquo; &ndash; when there are only a few small hotspots it may be more efficient to use this option" />');
   m.push (         '&emsp;');
   const checked = sparsemap ? ' checked' : '';
   m.push (         '<input id="sparsemap_checkbox" type="checkbox" onclick="rwizard.change_sparsemap (this)" ' + checked + ' />');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div class="rwizard_menu_item" onclick="rwizard.show_hotspot_editing_menu (1)">');
   m.push (   'Create new hotspot');
   m.push ('</div>');
   const n_hotspots = $hotspot_image_stack.find ('div.rdgm_hotspot_label').length;
   if (n_hotspots) {
      m.push ('<div class="rwizard_menu_item" onclick="rwizard.select_hotspot ()">');
      m.push (   'Select and edit existing hotspot');
      m.push ('</div>');
   }
   m.push ('<div class="hotspot_diagram_options_menu_feedback"></div>');
   $ ('#hotspot_diagram_options_menu div.rwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#hotspot_diagram_options_menu div.rwizard_floating_menu_body').html (m.join ('\n'));
   $ ('#hotspot_diagram_options_menu').show ();
   hotspot_image_stack_el = $hotspot_image_stack[0];
   hotspot_changes_f       = false;
   hotspot_style_changes_f = false;
   if (! hide_progress_b) {
      rdgm_.display_diagram_progress (i_rdgm, 'Visited', n_hotspots);
   }
   const question = qw.questions_cards[i_question];
   var hotspot_user_interaction = '';
   if (question.hotspot_user_interaction) {
      hotspot_user_interaction = question.hotspot_user_interaction;
   }
   var interaction_class = 'hotspot_user_interaction_';
   if (hotspot_user_interaction == 'find_hotspots') {
      interaction_class += 'find_hotspots';
   } else if (hotspot_user_interaction == 'info_only') {
      interaction_class += 'info_only';
   } else {
      if (rdgm_edit.rdgm_button_b) {
         interaction_class += 'label_prompt';
         hotspot_user_interaction = 'label_prompt';
      } else {
         interaction_class += 'info_only';
         hotspot_user_interaction = 'info_only';
      }
   }
   $ ('input.' + interaction_class).attr ('checked', true);
   qw.change_hotspot_user_interaction (hotspot_user_interaction);
   if (question.show_hotspots) {
      const show_hotspots = question.show_hotspots.split (' ');
      $ ('input.hotspots_' + show_hotspots[0]).prop ('checked', true);
      $ ('input.hotspots_' + show_hotspots[1]).prop ('checked', true);
      enable_disable_hotspots_show_click (show_hotspots[0]);
   } else {
      if (rdgm_edit.swhs_button_b) {
         question.show_hotspots = 'hover_show';
      } else {
         question.show_hotspots = '';
      }
      question.question_attributes = add_update_attributes (question.question_attributes, 'show_hotspots', question.show_hotspots);
   }
   var hotspot_labels_stick;
   if (rdgm_edit.rdgm_button_b) {
      hotspot_labels_stick = 'hide';
   } else {
      hotspot_labels_stick = 'hover_show';
   }
   if (question.hotspot_labels_stick) {
      hotspot_labels_stick = question.hotspot_labels_stick;
   } else {
      if (rdgm_edit.swhs_button_b) {
         question.hotspot_labels_stick = hotspot_labels_stick;
         question.question_attributes  = add_update_attributes (question.question_attributes, 'hotspot_labels_stick', hotspot_labels_stick);
      }
   }
   if (hotspot_labels_stick.indexOf (' keep') != -1) {
      hotspot_labels_stick = hotspot_labels_stick.replace (' keep', '');
      $ ('input.hotspot_labels_stick_info_only')[0].checked = true;
   }
   $ ('input.hotspot_labels_stick_' + hotspot_labels_stick).attr ('checked', true);
}
this.show_hide_hotspot_options = function () {
   const $hotspot_options_header = $ ('div#hotspot_options_header');
   const $hotspot_options        = $ ('div.hotspot_options');
   if ($hotspot_options.first ().is (':visible')) {
      $hotspot_options.hide ();
      $hotspot_options_header.html ('&#9654&#xFE0E; User interaction options');
   } else {
      $hotspot_options.show ();
      $hotspot_options_header.html ('&#9660&#xFE0E; User interaction options');
   }
}
this.show_hide_hotspot_settings = function () {
   const $hotspot_settings_header = $ ('div#hotspot_settings_header');
   const $hotspot_settings        = $ ('div.hotspot_settings');
   if ($hotspot_settings.first ().is (':visible')) {
      $hotspot_settings.hide ();
      $hotspot_settings_header.html ('&#9654&#xFE0E; Settings');
   } else {
      qw.init_hotspot_image_canvas ();
      if (! spotmap) {
         const $canvas = $hotspot_image_stack.find ('canvas.layer0_edited');
         get_or_create_spotmap ($canvas);
      }
      $hotspot_settings.find ('input#spotmap_width').val (spotmap_width);
      $hotspot_settings.find ('input#spotmap_height').val (spotmap_height);
      $hotspot_settings.find ('input#sparsemap_checkbox')[0].checked = sparsemap;
      $hotspot_settings.show ();
      $hotspot_settings_header.html ('&#9660&#xFE0E; Settings');
   }
}
this.change_hotspots_show = function (el) {
   if (debug[0]) {
      console.log ('[change_hotspots_show] el.value:', el.value);
   }
   const className = el.className;
   $ ('input.' + className).prop ('checked', true);
   enable_disable_hotspots_show_click (el.value);
   const f     = document.forms.hotspot_options;
   const part1 = f.prompt_hotspots_hover.value;
   const part2 = f.prompt_hotspots_click.value;
   var attribute = part1 + ' ' + part2;
   const question = qw.questions_cards[i_question];
   question.show_hotspots = attribute;
   question.question_attributes = add_update_attributes (question.question_attributes, 'show_hotspots', attribute);
}
function enable_disable_hotspots_show_click (setting) {
   const always_f = setting == 'always';
   $ ('input[name="prompt_hotspots_click"]').prop ('disabled', always_f);
   const color = always_f ? 'lightgray' : 'black';
   $ ('label.prompt_hotspots_click').css ({color: color});
}
this.change_hotspot_labels_stick = function (setting) {
   const question = qw.questions_cards[i_question];
   $ ('input.hotspot_labels_stick_' + setting).prop ('checked', true);
   if (question.hotspot_user_interaction == 'info_only') {
      const keep = $ ('input.hotspot_labels_stick_info_only')[0].checked;
      if (keep) {
         setting += ' keep';
      }
   }
   question.hotspot_labels_stick = setting;
   question.question_attributes  = add_update_attributes (question.question_attributes, 'hotspot_labels_stick', setting);
}
this.change_hotspot_labels_stick_info_only = function (checkbox_el) {
   const question = qw.questions_cards[i_question];
   var   hotspot_labels_stick = question.hotspot_labels_stick;
   if (checkbox_el.checked) {
      if (hotspot_labels_stick && hotspot_labels_stick != 'hide') {
         if (hotspot_labels_stick.indexOf ('keep') == -1) {
            hotspot_labels_stick += ' keep';
         }
      }
   } else {
      hotspot_labels_stick = hotspot_labels_stick.replace (' keep', '');
   }
   question.hotspot_labels_stick = hotspot_labels_stick;
   question.question_attributes  = add_update_attributes (question.question_attributes, 'hotspot_labels_stick', hotspot_labels_stick);
}
this.change_hotspot_user_interaction = function (labels_hotspots_info) {
   $ ('div.hotspot_user_interaction_sub_options').hide ();
   $ ('div.hotspot_' + labels_hotspots_info + '_options').show ();
   const question = qw.questions_cards[i_question];
   question.hotspot_user_interaction = labels_hotspots_info;
   question.question_attributes      = add_update_attributes (question.question_attributes, 'hotspot_user_interaction', labels_hotspots_info);
}
this.change_spotmap_size = function (input_el, width_f) {
   var wh = parseInt (input_el.value);
   if (! qqc.isInteger (wh)) {
      alert ('Please enter a number');
      return;
   }
   if (wh < 1) {
      alert ('Please enter a positive number');
      return;
   }
   if (width_f) {
      new_spotmap_width  = wh;
   } else {
      new_spotmap_height = wh;
   }
   spotmap_settings_change_f = true;
}
this.change_sparsemap = function (checkbox_el) {
   new_sparsemap      = checkbox_el.checked;
   spotmap_settings_change_f = true;
}
this.init_hotspot_image_canvas = function () {
   if (! qw.questions_cards[i_question].canvas_el) {
      const $rdgmq = $dialog_rwizard.find ('div#rdgm' + i_rdgm + '-q' + i_question);
      $hotspot_image_stack = $rdgmq.find ('div.hotspot_image_stack')
      const $canvas   = $hotspot_image_stack.find ('canvas.layer0_edited');
      const canvas_el = $canvas[0];
      const ctx = canvas_el.getContext ('2d');
      qw.questions_cards[i_question].canvas_el = canvas_el;
      qw.questions_cards[i_question].ctx       = ctx;
      const $edited_img   = $hotspot_image_stack.find ('img.layer0_edited');
      const edited_img_el = $edited_img[0];
      if (debug[0]) {
         console.log ('[init_hotspot_image_canvas] edited_img_el:', edited_img_el);
      }
      if (edited_img_el.src) {
         if (edited_img_el.complete) {
            qw.questions_cards[i_question].hotspot_image_img = edited_img_el;
            ctx.drawImage (edited_img_el, 0, 0, canvas_el.width, canvas_el.height);
         } else {
            const img = new Image ();
            img.src = edited_img_el.src;
            img.onload = function () {
               qw.questions_cards[i_question].hotspot_image_img = img;
               ctx.drawImage (img, 0, 0, canvas_el.width, canvas_el.height);
            }
         }
         update_hotspot_colors ($canvas, ctx, canvas_el.width, canvas_el.height);
         $edited_img.removeClass ('rwizard_display_block_important');
      } else {
         const $rdgm_layer0_img = $hotspot_image_stack.find ('img.rdgm_layer0');
         const rdgm_layer0_img_el = $rdgm_layer0_img[0];
         if (debug[0]) {
            console.log ('[init_hotspot_image_canvas] rdgm_layer0_img_el:', rdgm_layer0_img_el);
         }
         if (rdgm_layer0_img_el.complete) {
            qw.questions_cards[i_question].hotspot_image_img = rdgm_layer0_img_el;
            ctx.drawImage (rdgm_layer0_img_el, 0, 0, canvas_el.width, canvas_el.height);
         } else {
            rdgm_layer0_img_el.onload = function () {
               qw.questions_cards[i_question].hotspot_image_img = rdgm_layer0_img_el;
               ctx.drawImage (rdgm_layer0_img_el, 0, 0, canvas_el.width, canvas_el.height);
            }
         }
      }
   }
}
function init_hotspot_style_canvas (i_width, i_height) {
   var $hotspot_style_canvas;
   var hotspot_style_layer_img_src_f;
   var hotspot_style_ctx;
   $hotspot_style_canvas = $hotspot_image_stack.find ('canvas.rdgm_style_layer');
   if (! $hotspot_style_canvas.length) {
      $hotspot_image_stack.append (  '<canvas class="rdgm_style_layer" width="' + i_width + '" height="' + i_height + '">'
                                   + '</canvas>'
                                   + '<img class="rdgm_style_layer hotspot_image_layer" />');
      $hotspot_style_canvas = $hotspot_image_stack.find ('canvas.rdgm_style_layer');
   }
   hotspot_style_canvas_el = $hotspot_style_canvas[0];
   hotspot_style_ctx       = hotspot_style_canvas_el.getContext ('2d');
   var hotspot_style_layer_img_src_f = qw.questions_cards[i_question].hotspot_style_layer_img_src_f;
   if (typeof hotspot_style_layer_img_src_f == 'undefined') {
      const $style_img   = $hotspot_image_stack.find ('img.rdgm_style_layer');
      const style_img_el = $style_img[0];
      hotspot_style_layer_img_src_f = style_img_el.hasAttribute ('src');
      qw.questions_cards[i_question].hotspot_style_layer_img_src_f = hotspot_style_layer_img_src_f;
      hotspot_style_ctx.drawImage (style_img_el, 0, 0, i_width, i_height);
      $style_img.removeClass ('rwizard_display_block_important');
   }
   return [$hotspot_style_canvas, hotspot_style_ctx, hotspot_style_layer_img_src_f];
}
function update_hotspot_colors ($canvas, ctx, width, height) {
   const $label1 = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1');
   if ($label1.hasClass ('rdgm_hotspot_ver2')) {
      return;
   }
   if (debug[0]) {
      console.log ('[update_hotspot_colors] (doing update)');
   }
   const imageData = ctx.getImageData (0, 0, width, height);
   const data = imageData.data;
   const n_pixels = width * height;
   const $labels = $hotspot_image_stack.find ('div.rdgm_hotspot_label');
   var changes_f = false;
   if ($labels.length > 10) {
      $labels.slice (10).not ('.rdgm_hotspot_deleted').each (function () {
         const $label = $ (this);
         const classnames = $label.attr ('class');
         const m = classnames.match (/ rdgm_hotspot(\d+)/);
         const hotspot_no = m[1];
         const [old_r, old_g, old_b] = rdgm_.hotspot_color_from_no (hotspot_no);
         const [new_r, new_g, new_b] = rdgm_.hotspot_color_from_no (hotspot_no, true);
         if (hotspot_no == 11) {
            var [r1, g1, b1] = rdgm_.hotspot_color_from_no (1);
         } else if (hotspot_no == 13) {
            var [r1, g1, b1] = rdgm_.hotspot_color_from_no (3);
         }
         for (var i=0; i<n_pixels; i++) {
            const idx = i << 2;
            const a = data[idx + 3];
            if (a == rdgm_.hotspot_alpha_value) {
               const r = data[idx];
               const g = data[idx + 1];
               const b = data[idx + 2];
               if (rgb_same (r, old_r) && rgb_same (g, old_g) && rgb_same (b, old_b)) {
                  if (hotspot_no == 11 || hotspot_no == 13) {
                     if (rgb_same (r, r1) && rgb_same (g, g1) && rgb_same (b, b1)) {
                        continue;
                     }
                  }
                  changes_f = true;
                  data[idx]     = new_r;
                  data[idx + 1] = new_g;
                  data[idx + 2] = new_b;
                  data[idx + 3] = rdgm_.hotspot_alpha_value_tmp;
               }
            }
         }
      });
   }
   if (changes_f) {
      for (var i=0; i<n_pixels; i++) {
         const idx = i << 2;
         const a = data[idx + 3];
         if (a == rdgm_.hotspot_alpha_value_tmp) {
            data[idx + 3] = rdgm_.hotspot_alpha_value;
         }
      }
      ctx.putImageData (imageData, 0, 0);
      export_canvas_to_img_src ($canvas, 'img.layer0_edited');
   }
   $label1.addClass ('rdgm_hotspot_ver2');
}
function make_hotspot_image_stack_resizable ($hotspot_image_stack, $canvas) {
   if (debug[0]) {
      console.log ('[make_hotspot_image_stack_resizable] $canvas:', $canvas);
   }
   if ($hotspot_image_stack.resizable ('instance')) {
      $hotspot_image_stack.resizable ('destroy');
      $hotspot_image_stack.find ('div.ui-resizable-handle').remove ();
   }
   var $hotspot_image_stack_size_feedback = $hotspot_image_stack.find ('div.hotspot_image_stack_size_feedback');
   if (! $hotspot_image_stack_size_feedback.length) {
      $hotspot_image_stack.append ('<div class="hotspot_image_stack_size_feedback"></div>');
      $hotspot_image_stack_size_feedback = $hotspot_image_stack.find ('div.hotspot_image_stack_size_feedback');
   }
   $hotspot_image_stack[0].rdgm_canvas_el = $canvas[0];
   const $style_canvas = $hotspot_image_stack.find ('canvas.rdgm_style_layer');
   if ($style_canvas.length) {
      $hotspot_image_stack[0].rdgm_style_canvas_el = $style_canvas[0];
   }
   $hotspot_image_stack.resizable ({
      start:   function(e, ui_obj) {
                  $hotspot_image_stack_size_feedback.show ();
               },
      resize:  function (e, ui_obj) {
                  const cur_width  = parseInt (ui_obj.size.width);
                  const cur_height = parseInt (ui_obj.size.height);
                  $hotspot_image_stack_size_feedback.html (cur_width + ' x ' + cur_height);
                },
      stop:    function (e, ui_obj) {
                  if (debug[0]) {
                     console.log ('[make_hotspot_image_stack_resizable > hotspot_image_stack resize] $canvas:', $canvas);
                     console.log ('[make_hotspot_image_stack_resizable > hotspot_image_stack resize] ui_obj:', ui_obj);
                  }
                  qw.init_hotspot_image_canvas ();
                  $hotspot_image_stack_size_feedback.hide ();
                  const width  = parseInt (ui_obj.size.width);
                  const height = parseInt (ui_obj.size.height);
                  $hotspot_image_stack.removeAttr ('data-mce-style');
                  const canvas_el = $hotspot_image_stack[0].rdgm_canvas_el;
                  const ctx = canvas_el.getContext ('2d');
                  $canvas.attr ('width', width).attr ('height', height);
                  const img = qw.questions_cards[i_question].hotspot_image_img;
                  const delay_draw = function () {
                     ctx.drawImage (img, 0, 0, width, height);
                  }
                  setTimeout (delay_draw, 200);
                  if ($hotspot_image_stack[0].rdgm_style_canvas_el) {
                     const style_canvas_el = $hotspot_image_stack[0].rdgm_style_canvas_el;
                     const $style_canvas   = $ (style_canvas_el);
                     const style_ctx = style_canvas_el.getContext ('2d');
                     $style_canvas.attr ('width', width).attr ('height', height);
                     const style_img = $hotspot_image_stack.find ('img.rdgm_style_layer')[0];
                     const delay_style_draw = function () {
                        style_ctx.drawImage (style_img, 0, 0, width, height);
                     }
                     setTimeout (delay_style_draw, 200);
                  }
               }
   });
}
function check_image_alphas (ctx, width, height) {
   const imageData = ctx.getImageData (0, 0, width, height);
   const data = imageData.data;
   const n_pixels = width * height;
   var n_updates = 0;
   for (var i=0; i<n_pixels; i++) {
      var idx = i << 2;
      const a = data[idx + 3]
      if (a >= 121 && a <= 123) {
         data[idx + 3] = 124;
         n_updates++;
      } else if (a == rdgm_.hotspot_border_alpha_value) {
         data[idx + 3] = 255;
         n_updates++;
      }
   }
   if (n_updates) {
      ctx.putImageData (imageData, 0, 0);
      if (debug[0]) {
         console.log ('[check_image_alphas] n_updates:', n_updates);
      }
   }
}
var editing_hotspot_f = false;
var new_hotspot_f     = false;
this.show_hotspot_editing_menu = function (new_f) {
   selecting_hotspot_f = false;
   n_hotspots = $hotspot_image_stack.find ('div.rdgm_hotspot_label').length;
   if (new_f) {
      new_hotspot_f = true;
      n_hotspots++;
      current_hotspot_no = n_hotspots;
      [current_hotspot_color.r, current_hotspot_color.g,
       current_hotspot_color.b, current_hotspot_color.a]
                       = rdgm_.hotspot_color_from_no (current_hotspot_no, true);
   } else {
      const question = qw.questions_cards[i_question];
      const hotspot_user_interaction = question.hotspot_user_interaction;
      if (! hotspot_user_interaction || hotspot_user_interaction != 'info_only') {
         set_hotspot_feedback_edit_fields ();
      }
   }
   var h = [];
   var m = [];
   h.push ('<div class="rwizard_floating_menu_title">');
   h.push (   '<div class="rwizard_inline_block rwizard_float_right">');
   h.push (      '<button onclick="rwizard.toggle_hotspot_image_hide_show ()" style="padding: 0;" title="On/off: hide image and show only hotspots">');
   h.push (         '<img src="' + rdgm_edit_params.url + '/images/rdgm_icon_image_x.svg" border="0" style="width: 16px; height: 14px;" />');
   h.push (      '</button>');
   h.push (      '&ensp;');
   h.push (      '<button onclick="rwizard.hotspot_undo ()" title="Undo - applies to hotspot add/erase actions">');
   h.push (         '<img src="' + rdgm_edit_params.url + '/images/rdgm_icon_undo.png" border="0" style="width: 12px; height: 12px; padding: 0; filter: invert(1);" />');
   h.push (      '</button>');
   h.push (      '<button onclick="rwizard.hotspot_redo ()" title="Redo - applies to hotspot add/erase actions">');
   h.push (         '<img src="' + rdgm_edit_params.url + '/images/rdgm_icon_redo.png" border="0" style="width: 12px; height: 12px; padding: 0; filter: invert(1);" />');
   h.push (      '</button>');
   h.push (   '</div>');
   if (new_f) {
      h.push ('Create new hotspot');
   } else {
      h.push ('Edit hotspot');
   }
   h.push ('</div>');
   var rectlipse_ovality = $.cookie ('rdgm_hotspot_rectlipse_ovality');
   if (! rectlipse_ovality) {
      rectlipse_ovality = 100;
   }
   m.push ('<div class="rwizard_menu_item add_rectlipse" onclick="rwizard.turn_on_hotspot_rectlipse (' + rectlipse_ovality + ')">');
   m.push (   '<span class="hotspot_edit_spinner rectlipse_ovality rwizard_float_right">');
   m.push (      'Oval:');
   m.push (      '<input class="hotspot_edit_spinner rectlipse_ovality" value="' + rectlipse_ovality + '" />');
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" style="width: 12px; height: 12px;" title="0: square/rectangle; 100: circle/ellipse" />');
   m.push (   '</span>');
   m.push (   '<div class="icon_rectlipse"></div>');  // Circle icon via css.
   if (new_f) {
      m.push ('Create or add ellipse/rectangle');
   } else {
      m.push ('Add ellipse/rectangle');
   }
   m.push ('</div>');
   var floodfill_tolerance = $.cookie ('rdgm_hotspot_floodfill_tolerance');
   if (! floodfill_tolerance) {
      floodfill_tolerance = 5;
   }
   m.push ('<div class="rwizard_menu_item floodfill" onclick="rwizard.turn_on_hotspot_floodfill ()">');
   m.push (   '<span class="hotspot_edit_spinner floodfill_tolerance rwizard_float_right">');
   m.push (      'Tolerance:');
   m.push (      '<input class="hotspot_edit_spinner floodfill_tolerance" value="' + floodfill_tolerance + '" />');
   m.push (      '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" style="width: 12px; height: 12px;" title="Color match for fill; 0: exact match required; 100: anything goes" />');
   m.push (   '</span>');
   m.push (   '<img src="' + rdgm_edit_params.url + '/images/icon_paintbucket16x16.svg" border="0" style="width: 12px; height: 12px;" />');
   if (new_f) {
      m.push ('Create/extend/add - paint fill');
   } else {
      m.push ('Extend or add - paint fill');
   }
   m.push ('</div>');
   var draw_line_width = $.cookie ('rdgm_hotspot_draw_line_width');
   if (! draw_line_width) {
      draw_line_width = 20;
   }
   m.push ('<div class="rwizard_menu_item draw" onclick="rwizard.turn_on_hotspot_draw (\'draw\')">');
   m.push (   '<span class="hotspot_edit_spinner draw_tool_width rwizard_float_right" style="margin-right: 16px;">');
   m.push (      'Width:');
   m.push (      '<input class="hotspot_edit_spinner draw_tool_width" value="' + draw_line_width + '" />');
   m.push (   '</span>');
   var   svg_circle = create_svg_circle (6, 'rgba(0,210,255, 0.47)');
   var   svg_src    = create_svg_src (svg_circle, 12, 12);
   const draw_icon  = "<img src='" + svg_src + "' />";
   m.push (   draw_icon);
   if (new_f) {
      m.push ('Create/extend/add - pencil tool');
   } else {
      m.push ('Extend or add - pencil tool');
   }
   m.push (   '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" style="width: 12px; height: 12px;" title="Click for circle; drag to draw. Note: you cannot overwrite other hotspots; you can select another hotspot and use the eraser" />');
   m.push ('</div>');
   if (! new_f) {
      m.push ('<div class="rwizard_menu_item enlarge" onclick="rwizard.enlarge_hotspot_click ()">');
      m.push (   '<img src="' + rdgm_edit_params.url + '/images/icon_expand_screen.png" border="0" style="width: 12px; height: 12px;" />');
      m.push (   'Enlarge hotspot &mdash; by');
      m.push (   '<select id="enlarge_hotspot_by" class="options_select" onchange="rwizard.enlarge_hotspot_by_selected (this.value)">');
      m.push (      '<option selected>');
      m.push (         '0');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '1px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '2px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '3px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '4px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '5px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '6px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '8px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '10px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '12px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '15px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '20px');
      m.push (      '</option>');
      m.push (   '</select>');
      m.push (   '&emsp;');
      m.push (   '<span title="Enlarge this hotspot over adjacent hotspots, if any">');
      m.push (      '<input id="enlarge_hotspot_overwrite" type="checkbox" class="rwizard_input_smaller" />');
      m.push (      'Overwrite');
      m.push (   '</span>');
      m.push ('</div>');
   }
   var draw_erase_width = $.cookie ('rdgm_hotspot_draw_erase_width');
   if (! draw_erase_width) {
      draw_erase_width = 20;
   }
   m.push ('<div class="rwizard_menu_item erase" onclick="rwizard.turn_on_hotspot_draw (\'erase\')">');
   m.push (   '<span class="hotspot_edit_spinner eraser_tool_width rwizard_float_right" style="margin-right: 16px;">');
   m.push (      'Width:');
   m.push (      '<input class="hotspot_edit_spinner eraser_tool_width" value="' + draw_erase_width + '" />');
   m.push (   '</span>');
   svg_circle = create_svg_circle (6, 'rgba(128, 128, 128, 0.3)');
   svg_src    = create_svg_src (svg_circle, 12, 12);
   const erase_icon  = "<img src='" + svg_src + "' />";
   m.push (   erase_icon);
   m.push (   'Eraser');
   m.push (   '<img src="' + rdgm_edit_plugin_url + 'images/info_icon.png" style="width: 12px; height: 12px;" title="Click to erase circle; drag to rub-erase. Note: you cannot erase other hotspots; select another hotspot and use the eraser" />');
   m.push ('</div>');
   if (! new_f) {
      m.push ('<hr />');
      m.push ('<div class="rwizard_menu_item border_styles" onclick="rwizard.hotspot_editing_menu_all_active ()">');
      m.push (   'Border');
      m.push (   '&emsp; &nbsp;');
      m.push (   'Width');
      m.push (   '<select id="hotspot_border_width" class="options_select" onchange="rwizard.hotspot_border_width_selected (this.value)">');
      m.push (      '<option selected>');
      m.push (         '0');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '1px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '2px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '3px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '4px');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '5px');
      m.push (      '</option>');
      m.push (   '</select>');
      m.push (   '&ensp;');
      m.push (   'Style');
      m.push (   '<select id="hotspot_border_style" class="options_select" onchange="rwizard.hotspot_border_style_selected (this.value)">');
      m.push (      '<option selected>');
      m.push (         'solid');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         'dotted');
      m.push (      '</option>');
      m.push (   '</select>');
      m.push (   '&ensp;');
      m.push (   'Color');
      var   $label             = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
      const border_color       = $label.attr ('data-border_color');
      const border_color_value = border_color ? '#' + border_color : 'black';
      const $label1            = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1');
      const border_all_checked = $label1.attr ('data-border_all') ? ' checked' : '';
      m.push (   '<input id="hotspot_border_color" type="text" value="' + border_color_value + '" />');
      m.push (   '&emsp;');
      m.push (   '<span class="hotspot_style_all" title="Style applies to all hotspots in this diagram">');
      m.push (      '<input id="hotspot_border_all" class="rwizard_input_smaller" type="checkbox" onclick="rwizard.hotspot_style_all_clicked (this, \'border\')"' + border_all_checked + ' />All');
      m.push (   '</span>');
      m.push ('</div>');
      m.push ('<div class="rwizard_menu_item highlight_styles" onclick="rwizard.hotspot_editing_menu_all_active ()">');
      m.push (   'Highlight');
      m.push (   '&ensp;');
      m.push (   'Brightness');
      m.push (   '<select id="hotspot_highlight_brightness" class="options_select" onchange="rwizard.hotspot_brightness_selected (this.value)">');
      m.push (      '<option>');
      m.push (         '-5');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '-4');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '-3');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '-2');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '-1');
      m.push (      '</option>');
      m.push (      '<option selected>');
      m.push (         '&nbsp;0');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '+1');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '+2');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '+3');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '+4');
      m.push (      '</option>');
      m.push (      '<option>');
      m.push (         '+5');
      m.push (      '</option>');
      m.push (   '</select>');
      m.push (   '&emsp;');
      m.push (   'Tint');
      const highlight_tint        = $label.attr ('data-highlight_tint');
      let value;
      let display;
      if (highlight_tint) {
         value   = ' value="#' + highlight_tint + '"';
         display = 'inline-block';
      } else {
         value   = '';
         display = 'none';
      }
      const highlight_all_checked = $label1.attr ('data-highlight_all') ? ' checked' : '';
      m.push (   '<input id="hotspot_highlight_tint" type="text"' + value + ' />');
      m.push (   '<img id="hotspot_erase_tint" src="' + rdgm_edit_plugin_url + 'images/delete.png" class="rwizard_shift_icon" style="display: ' + display + ';" onclick="rwizard.hotspot_erase_tint_clicked (this)" title="Remove tint" />');
      m.push (   '<span class="hotspot_style_all" title="Style applies to all hotspots in this diagram">');
      m.push (      '<input id="hotspot_highlight_all" class="rwizard_input_smaller" type="checkbox" onclick="rwizard.hotspot_style_all_clicked (this, \'highlight\')"' + highlight_all_checked + ' />All');
      m.push (   '</span>');
      m.push ('</div>');
      m.push ('<hr />');
      /*
      m.push ('<div class="rwizard_menu_item" onclick="rwizard.delete_hotspot (false)">');
      m.push (   'Delete hotspot shape(s) - keep label');
      m.push ('</div>');
      */
      m.push ('<div class="rwizard_menu_item" onclick="rwizard.delete_hotspot (true)">');
      m.push (   'Delete hotspot &mdash; shape(s) and label');
      m.push ('</div>');
   }
   m.push ('<hr />');
   m.push ('<div class="hotspot_editing_menu_feedback"></div>');
   m.push ('<div>');
   const disabled_class = new_f ? ' rdgm_button_disabled' : '';
   const disabled       = new_f ? ' disabled'             : '';
   m.push (   '<button id="hotspot_editing_menu_done_save" class="rdgm_button' + disabled_class + ' rwizard_float_right" onclick="rwizard.save_hotspot_edits ()"' + disabled + '>');
   if (new_f) {
      m.push (   'Done - save this hotspot');
   } else {
      m.push (   'Done - save any changes to this hotspot');
   }
   m.push (   '</button>');
   m.push (   '<button class="rwizard_normal rwizard_smaller rwizard_shift_icon" onclick="rwizard.discard_hotspot_edits ()">');
   m.push (      'Cancel/discard');
   m.push (   '</button>');
   m.push ('</div>');
   $ ('#hotspot_editing_menu div.rwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#hotspot_editing_menu div.rwizard_floating_menu_body').html (m.join ('\n'));
   $ ('div.hotspot_diagram_options_menu_feedback').hide ();
   $ ('#hotspot_diagram_options_menu').hide ();
   $ ('#quiz_components_menu_overlay').show ();
   $ ('#hotspot_editing_menu').show ();
   $ ('input.hotspot_edit_spinner.rectlipse_ovality').spinner ({
      min:     0,
      max:     100,
      step:    5,
      stop:    rwizard.hotspot_rectlipse_ovality_change
   });
   $ ('input.hotspot_edit_spinner.floodfill_tolerance').spinner ({
      min:     0,
      max:     100,
      step:    1,
      change:  change_floodfill_tolerance
   });
   $ ('input.hotspot_edit_spinner.draw_tool_width').spinner ({
      min:     1,
      max:     100,
      step:    1,
      stop:    change_draw_erase_width
   });
   $ ('input.hotspot_edit_spinner.eraser_tool_width').spinner ({
      min:     1,
      max:     100,
      step:    1,
      stop:    change_draw_erase_width
   });
   $ ('span.hotspot_edit_spinner').on ('click', function (e) {
                                                  e.stopPropagation ();
                                               });
   if (! new_f) {
      const border_width = $label.attr ('data-border_width');
      var select_el = $ ('select#hotspot_border_width')[0];
      set_selectedIndex (select_el, border_width);
      const border_style = $label.attr ('data-border_style');
      select_el = $ ('select#hotspot_border_style')[0];
      set_selectedIndex (select_el, border_style);
      const highlight_brightness = $label.attr ('data-highlight_brightness');
      select_el = $ ('select#hotspot_highlight_brightness')[0];
      set_selectedIndex (select_el, highlight_brightness, true);
      $ ('#hotspot_border_color').simpleColor ({boxWidth:  '50px',
                                                boxHeight: '17px',
                                                onSelect:  hotspot_border_color_selected});
      $ ('#hotspot_highlight_tint').simpleColor ({boxWidth:  '50px',
                                                  boxHeight: '17px',
                                                  onSelect:  hotspot_tint_selected});
      $ ('#hotspot_highlight_tint').nextAll ('div.simpleColorContainer').find ('div.simpleColorDisplay').css ({opacity: 0.5});
   }
   const current = 'div.rdgm_hotspot' + current_hotspot_no;
   $hotspot_image_stack.find ('div.rdgm_hotspot_label').not (current).addClass ('rwizard_display_none_important');
   if (new_f) {
      const $rdgmq = $ ('div#dialog_rwizard div#rdgm' + i_rdgm + '-q' + i_question);
      $rdgmq.find ('div.hotspot_click_feedback_correct')  .html ('');
      $rdgmq.find ('div.hotspot_click_feedback_incorrect').html ('');
   }
   $hotspot_image_stack.resizable ('disable');
   $hotspot_image_stack.find ('div.ui-resizable-se').not ('div.rdgm_rectlipse').addClass ('rwizard_display_none_important');
   editing_hotspot_f = true;
}
this.hotspot_editing_menu_all_active = function () {
   $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').removeClass ('rwizard_background_light_gray');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item, div#hotspot_editing_menu div.rwizard_menu_item_not_active').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
}
this.hotspot_border_width_selected = function (value) {
   save_hotspot_style_state ();
   update_hotspot_label_data ('border_width', value);
   create_update_hotspot_style_canvas ('border');
}
this.hotspot_border_style_selected = function (value) {
   save_hotspot_style_state ();
   update_hotspot_label_data ('border_style', value);
   const $label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
   const border_style = $label.attr ('data-border_style');
   if (border_style) {
      create_update_hotspot_style_canvas ('border');
   }
}
function hotspot_border_color_selected (hex) {
   save_hotspot_style_state ();
   update_hotspot_label_data ('border_color', hex);
   const $label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
   const border_width = $label.attr ('data-border_width');
   if (border_width) {
      create_update_hotspot_style_canvas ('border');
   }
}
this.hotspot_style_all_clicked = function (input_el, border_highlight) {
   save_hotspot_style_state ();
   const do_all_uniform_different = input_el.checked ? 'uniform' : 'different';
   if (input_el.checked) {
      $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1').attr ('data-' + border_highlight + '_all', current_hotspot_no);
   } else {
      $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1').removeAttr ('data-' + border_highlight + '_all');
   }
   create_update_hotspot_style_canvas (border_highlight, do_all_uniform_different);
}
this.hotspot_brightness_selected = function (value) {
   save_hotspot_style_state ();
   value = parseInt (value);
   update_hotspot_label_data ('highlight_brightness', value);
   create_update_hotspot_style_canvas ('highlight');
}
function hotspot_tint_selected (hex) {
   save_hotspot_style_state ();
   update_hotspot_label_data ('highlight_tint', hex);
   $ ('img#hotspot_erase_tint').css ({display: 'inline-block'});
   create_update_hotspot_style_canvas ('highlight');
}
this.hotspot_erase_tint_clicked = function (img_el) {
   save_hotspot_style_state ();
   const $img = $ (img_el);
   $img.prevAll ('div.simpleColorContainer').find ('div.simpleColorDisplay').css ({background: 'white'});
   $img.hide ();
   $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no).removeAttr ('data-highlight_tint');
   create_update_hotspot_style_canvas ('highlight');
}
var hotspot_saved_style_image;
var hotspot_saved_style_label1;
var hotspot_saved_style_label;
function save_hotspot_style_state () {
   if (! hotspot_saved_style_image) {
      const ctx       = qw.questions_cards[i_question].ctx;
      const i_width   = ctx.canvas.width;
      const i_height  = ctx.canvas.height;
      [$hotspot_style_canvas, hotspot_style_ctx]
                                = init_hotspot_style_canvas (i_width, i_height);
      const hotspot_style_imageData  = hotspot_style_ctx.getImageData(0, 0, i_width, i_height);
      const hotspot_style_image_data = hotspot_style_imageData.data;
      hotspot_saved_style_image = [...hotspot_style_image_data];
      const $label1 = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1')
      const $label  = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
      if ($label1.length) {
         hotspot_saved_style_label1 = $label1[0].outerHTML;
      } else {
         hotspot_saved_style_label1 = '';
      }
      if ($label.length) {
         hotspot_saved_style_label  = $label[0].outerHTML;
      } else {
         hotspot_saved_style_label  = '';
      }
   }
}
function update_hotspot_label_data (attr, value) {
   $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no).attr ('data-' + attr, value);
}
var $hotspot_style_canvas;
var hotspot_style_ctx;
function create_update_hotspot_style_canvas (border_highlight,
                                             do_all_uniform_different) {
   if (debug[0]) {
      console.log ('[create_update_hotspot_style_canvas] border_highlight:', border_highlight, ', do_all_uniform_different:', do_all_uniform_different, ', current_hotspot_no:', current_hotspot_no);
   }
   turn_off_previous_hotspot_edit_mode ();
   hotspot_style_changes_f = true;
   qw.hotspot_editing_menu_all_active ();
   qw.init_hotspot_image_canvas ();
   const ctx       = qw.questions_cards[i_question].ctx;
   const i_width   = ctx.canvas.width;
   const i_height  = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data      = imageData.data;
   const n_pixels  = i_width * i_height;
   const r_obj = get_original_hotspot_image_data (i_width, i_height);
   const orig_image_data = r_obj.orig_image_data;
   [$hotspot_style_canvas, hotspot_style_ctx]
                                = init_hotspot_style_canvas (i_width, i_height);
   const hotspot_style_imageData  = hotspot_style_ctx.getImageData(0, 0, i_width, i_height);
   const hotspot_style_image_data = hotspot_style_imageData.data;
   if ($ ('input#hotspot_' + border_highlight + '_all')[0].checked) {
      do_all_uniform_different = 'uniform';
   }
   const do_border_f = border_highlight == 'border';
   var   $data_label;
   if (do_all_uniform_different) {
      if (do_all_uniform_different == 'uniform') {
         $data_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
      }
      $hotspot_image_stack
         .find ('div.rdgm_hotspot_label').not ('.rdgm_hotspot_deleted')
         .each (
            function () {
               const $this_label = $ (this);
               if (do_all_uniform_different == 'different') {
                  $data_label = $this_label;
               }
               const classnames = $this_label.attr ('class');
               const m = classnames.match (/ rdgm_hotspot(\d+)/);
               const hotspot_no = m[1];
               let $highlight_data_label;
               if (do_border_f && do_all_uniform_different == 'uniform') {
                  $highlight_data_label = $this_label;
               } else {
                  $highlight_data_label = $data_label;
               }
               set_hotspot_highlight (hotspot_no, $highlight_data_label,
                                      n_pixels, data, orig_image_data,
                                      hotspot_style_image_data, do_border_f);
               if (do_border_f) {
                  set_hotspot_border (hotspot_no, $data_label, i_width,
                                      i_height, data, orig_image_data,
                                      hotspot_style_image_data);
               }
            }
         );
   } else {
      const $label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
      set_hotspot_highlight (current_hotspot_no, $label, n_pixels, data,
                             orig_image_data, hotspot_style_image_data, do_border_f);
      if (do_border_f) {
         set_hotspot_border (current_hotspot_no, $label, i_width,
                             i_height, data, orig_image_data,
                             hotspot_style_image_data);
      }
   }
   hotspot_style_ctx.putImageData (hotspot_style_imageData, 0, 0);
}
function set_hotspot_highlight (hotspot_no, $label, n_pixels, layer0_edited_data,
                                orig_image_data, hotspot_style_image_data,
                                                                  do_border_f) {
   const cur_rgba = rdgm_.hotspot_color_from_no (hotspot_no, true);
   var highlight_brightness = $label.attr ('data-highlight_brightness');
   if (debug[0]) {
      console.log ('[set_hotspot_highlight] highlight_brightness:', highlight_brightness);
   }
   var alpha = 255;
   if (! highlight_brightness) {
      highlight_brightness = 0;
      alpha = 0;
   }
   const delta_bright = highlight_brightness/5 * 255;
   const highlight_tint = $label.attr ('data-highlight_tint');
   if (debug[0]) {
      console.log ('[set_hotspot_highlight] highlight_tint:', highlight_tint);
   }
   var   tint_r = 0;
   var   tint_g = 0;
   var   tint_b = 0;
   if (highlight_tint) {
      var rgb_sum      = 0.0;
      var n_sum_pixels = 0;
      for (var i=0; i<n_pixels; i++) {
         const idx = i << 2;
         if (is_pixel_same_hotspot (layer0_edited_data, idx, cur_rgba)) {
            const orig_r = orig_image_data[idx];
            const orig_g = orig_image_data[idx + 1];
            const orig_b = orig_image_data[idx + 2];
            rgb_sum += orig_r + orig_g + orig_b;
            n_sum_pixels++;
         }
      }
      const rgb_avg = rgb_sum / (n_sum_pixels*3);
      if (debug[0]) {
         console.log ('[set_hotspot_highlight] rgb_avg:', rgb_avg);
      }
      const intensity = 0.5;
      [tint_r, tint_g, tint_b] = qqc.hex_to_rgb (highlight_tint);
      if (rgb_avg > 127.0) {
         tint_r -= 255;
         tint_g -= 255;
         tint_b -= 255;
      }
      tint_r = Math.round (tint_r*intensity);
      tint_g = Math.round (tint_g*intensity);
      tint_b = Math.round (tint_b*intensity);
      alpha  = 255;
   }
   for (var i=0; i<n_pixels; i++) {
      const idx = i << 2;
      if (is_pixel_same_hotspot (layer0_edited_data, idx, cur_rgba)) {
         if (! do_border_f) {
            const style_alpha = hotspot_style_image_data[idx + 3];
            if (style_alpha == rdgm_.hotspot_border_alpha_value) {
               continue;
            }
         }
         const orig_r = orig_image_data[idx];
         const orig_g = orig_image_data[idx + 1];
         const orig_b = orig_image_data[idx + 2];
         hotspot_style_image_data[idx]     = orig_r + delta_bright + tint_r;
         hotspot_style_image_data[idx + 1] = orig_g + delta_bright + tint_g;
         hotspot_style_image_data[idx + 2] = orig_b + delta_bright + tint_b;
         hotspot_style_image_data[idx + 3] = alpha;
      }
   }
}
function set_hotspot_border (hotspot_no, $label, i_width, i_height,
                             layer0_edited_data, orig_image_data,
                             hotspot_style_image_data, enlarge_by) {
   var edge_pixels;
   var i_enlarge_overwrite;
   var border_style;
   var guide_border_f;
   var border_width;
   var dotted_border_width;
   var border_rgba;
   var dotted_border_rgba;
   const cur_rgba = rdgm_.hotspot_color_from_no (hotspot_no, true);
   if (enlarge_by) {
      edge_pixels    = [];
      i_enlarge_overwrite = $ ('input#enlarge_hotspot_overwrite')[0].checked ? 1 : -1;
      border_style   = 'solid';
      guide_border_f = false;
      border_width   = parseInt (enlarge_by) + 1;
      border_rgba    = cur_rgba;
   } else {
      border_style = $label.attr ('data-border_style');
      if (typeof border_style == 'undefined') {
         border_style = 'solid';
      }
      guide_border_f = border_style == 'dotted';
      border_width = $label.attr ('data-border_width');
      if (typeof border_width == 'undefined') {
         border_width = 1;
         update_hotspot_label_data ('border_width', 1);
      } else {
         border_width = parseInt (border_width);
         if (border_width == 0) {
            return;
         }
         if (guide_border_f) {
            dotted_border_width = border_width;
            border_width = Math.ceil (0.5*border_width);
         }
      }
      border_rgba = [0, 0, 0, rdgm_.hotspot_border_alpha_value];
      const border_color = $label.attr ('data-border_color');
      if (border_color) {
         border_rgba = qqc.hex_to_rgb (border_color);
         border_rgba.push (rdgm_.hotspot_border_alpha_value);
      }
      dotted_border_rgba = border_rgba;
   }
   const i_width1  = i_width  - 1;
   const i_height1 = i_height - 1;
   for (var iy=0; iy<i_height; iy++) {
      const iy0 = iy * i_width;
      for (var ix=0; ix<i_width; ix++) {
         const ii = iy0  + ix;
         const idx = ii << 2;
         if (is_pixel_same_hotspot (layer0_edited_data, idx, cur_rgba)) {
            var edge_f = iy == 0 || ix == 0 || ix == i_width1 || iy == i_height1;
            if (! edge_f) {
               let iy1  = (iy - 1)*i_width;
               let ii1  = iy1 + ix;
               let idx1 = ii1 << 2;
               edge_f = ! is_pixel_same_hotspot (layer0_edited_data, idx1, cur_rgba);
               if (! edge_f) {
                  iy1  = (iy + 1)*i_width;
                  ii1  = iy1 + ix;
                  idx1 = ii1 << 2;
                  edge_f = ! is_pixel_same_hotspot (layer0_edited_data, idx1, cur_rgba);
                  if (! edge_f) {
                     ii1  = iy0 + ix - 1;
                     idx1 = ii1 << 2;
                     edge_f = ! is_pixel_same_hotspot (layer0_edited_data, idx1, cur_rgba);
                     if (! edge_f) {
                        ii1  = iy0 + ix + 1;
                        idx1 = ii1 << 2;
                        edge_f = ! is_pixel_same_hotspot (layer0_edited_data, idx1, cur_rgba);
                     }
                  }
               }
            }
            if (edge_f) {
               if (enlarge_by) {
                  edge_pixels.push ([ix, iy]);
               } else {
                  set_circle (ix, iy, border_width, border_rgba, i_width, i_height,
                              layer0_edited_data, hotspot_style_image_data,
                              cur_rgba, guide_border_f);
               }
            }
         }
      }
   }
   if (enlarge_by) {
      for (let [ix, iy] of edge_pixels) {
         set_circle (ix, iy, border_width, border_rgba, i_width, i_height,
                     layer0_edited_data, hotspot_style_image_data,
                     cur_rgba, guide_border_f, false, i_enlarge_overwrite);
      }
   }
   if (border_style == 'dotted') {
      for (var iy=0; iy<i_height; iy++) {
         const iy0 = iy * i_width;
         for (var ix=0; ix<i_width; ix++) {
            const ii = iy0  + ix;
            const idx = ii << 2;
            if (is_pixel_same_hotspot (layer0_edited_data, idx, cur_rgba)) {
               const style_a = hotspot_style_image_data[idx + 3];
               if (   style_a == rdgm_.hotspot_alpha_value
                   || style_a == rdgm_.hotspot_alpha_value_tmp) {
                  set_dotted_hotspot_border (ix, iy, i_width, i_height,
                                             dotted_border_width,
                                             dotted_border_rgba,
                                             layer0_edited_data, orig_image_data,
                                             hotspot_style_image_data, cur_rgba);
               }
            }
         }
      }
   }
}
function set_dotted_hotspot_border (ix, iy, i_width, i_height,
                                    border_width, border_rgba,
                                    layer0_edited_data, orig_image_data,
                                    hotspot_style_image_data, cur_rgba) {
   const dot_radius    = Math.max (1, Math.round (border_width * 0.5));
   const erase_radius  = Math.round (border_width * 1.5);
   const erase_f       = true;
   const search_radius = border_width * 2;
   while (true) {
      [dot_cx, dot_cy] =
         find_next_dot_coordinates (ix, iy, i_width, i_height, search_radius,
                                    layer0_edited_data, orig_image_data,
                                    hotspot_style_image_data, cur_rgba);
      if (dot_cx < 0) {
         break;
      }
      ix = dot_cx;
      iy = dot_cy;
      set_circle (ix, iy, erase_radius, border_rgba, i_width, i_height,
                  layer0_edited_data, hotspot_style_image_data, cur_rgba,
                  false, erase_f);
      set_circle (ix, iy, dot_radius, border_rgba, i_width, i_height,
                  layer0_edited_data, hotspot_style_image_data, cur_rgba);
   }
}
function find_next_dot_coordinates (ix, iy, i_width, i_height, search_radius,
                                    layer0_edited_data, orig_image_data,
                                    hotspot_style_image_data, cur_rgba) {
   var prev_pixel_in_guide_border_f;
   var edge_pixel = [-1, 0];
   var prev_pixel = [-1, 0];
   const radian_incr = 1.0 / search_radius;
   const twoPI       = 2.0 * Math.PI;
   for (var radian=0; radian<twoPI; radian+=radian_incr) {
      var ix1 = Math.round (ix + search_radius*Math.cos (radian));
      var iy1 = Math.round (iy + search_radius*Math.sin (radian));
   /*
   const search_diameter = 2 * search_radius;
   const n               = 2 * search_diameter;
   var ix1;
   var iy1;
   var dx;
   var dy;
   for (var i=0; i<n; i++) {
      if (i < search_diameter) {
         dx = i - search_radius;
         dy = search_radius - Math.abs (dx);
      } else {
         dx = search_diameter - i + search_radius;
         dy = Math.abs (dx) - search_radius;
      }
      ix1 = ix + dx;
      iy1 = iy + dy;
      */
      if (ix1 < 0 || ix1 >= i_width || iy1 < 0 || iy1 >= i_height) {
         prev_pixel_in_guide_border_f = false;
         continue;
      }
      const ii = iy1*i_width  + ix1;
      const idx = ii << 2;
      if (is_pixel_same_hotspot (layer0_edited_data, idx, cur_rgba)) {
         const style_a = hotspot_style_image_data[idx + 3];
         const pixel_in_guide_border_f
                                  =    style_a == rdgm_.hotspot_alpha_value
                                    || style_a == rdgm_.hotspot_alpha_value_tmp;
         if (typeof prev_pixel_in_guide_border_f != 'undefined'
                   && pixel_in_guide_border_f != prev_pixel_in_guide_border_f) {
            if (pixel_in_guide_border_f) {
               edge_pixel = [ix1, iy1]
               break;
            } else {
               if (prev_pixel[0] >= 0) {
                  edge_pixel = prev_pixel;
                  break;
               }
            }
         }
         prev_pixel_in_guide_border_f = pixel_in_guide_border_f;
         prev_pixel = [ix1, iy1];
      } else {
         prev_pixel_in_guide_border_f = true;
         prev_pixel[0] = -1;
      }
   }
   return edge_pixel;
}
function is_pixel_same_hotspot (data, idx, rgba) {
   const a = data[idx + 3];
   if (a != rgba[3]) {
      return false;
   } else {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      return rgb_same (r, rgba[0]) && rgb_same (g, rgba[1]) && rgb_same (b, rgba[2]);
   }
}
function set_circle (cx, cy, r, rgba, i_width, i_height, layer0_edited_data,
                     style_layer_data, cur_rgba, guide_border_f, erase_f,
                                                          i_enlarge_overwrite) {
   if (r == 1) {
      const ii = cy*i_width + cx;
      const idx = ii << 2;
      set_circle_pixel (idx, rgba, style_layer_data, guide_border_f, erase_f);
   } else {
      const r2 = r * r;
      for (let iiy=0; iiy<=r; iiy++) {
         const iy1 = (cy - iiy)*i_width;
         const iy2 = (cy + iiy)*i_width;
         const l_half = Math.round (Math.sqrt (r2 - iiy*iiy));
         const iix_beg = Math.max (cx - l_half + 1, 0);
         const iix_end = Math.min (cx + l_half,     i_width - 1);
         for (let iix=iix_beg; iix<iix_end; iix++) {
            const ix1  = iy1 + iix;
            const idx1 = ix1 * 4;
            if (i_enlarge_overwrite) {
               if ((i_enlarge_overwrite > 0)
                                 || (layer0_edited_data[idx1 + 3]
                                                != rdgm_.hotspot_alpha_value)) {
                  style_layer_data[idx1]     = cur_rgba[0]
                  style_layer_data[idx1 + 1] = cur_rgba[1]
                  style_layer_data[idx1 + 2] = cur_rgba[2]
                  style_layer_data[idx1 + 3] = cur_rgba[3]
               }
            } else {
               if (is_pixel_same_hotspot (layer0_edited_data, idx1, cur_rgba)) {
                  set_circle_pixel (idx1, rgba, style_layer_data,
                                    guide_border_f, erase_f);
               }
            }
            if (iiy > 0) {
               const ix2  = iy2 + iix;
               const idx2 = ix2 * 4;
               if (i_enlarge_overwrite) {
                  if ((i_enlarge_overwrite > 0)
                                 || (layer0_edited_data[idx2 + 3]
                                                != rdgm_.hotspot_alpha_value)) {
                     style_layer_data[idx2]     = cur_rgba[0]
                     style_layer_data[idx2 + 1] = cur_rgba[1]
                     style_layer_data[idx2 + 2] = cur_rgba[2]
                     style_layer_data[idx2 + 3] = cur_rgba[3]
                  }
               } else {
                  if (is_pixel_same_hotspot (layer0_edited_data, idx2, cur_rgba)) {
                     set_circle_pixel (idx2, rgba, style_layer_data,
                                       guide_border_f, erase_f);
                  }
               }
            }
         }
      }
   }
}
function set_circle_pixel (idx, rgba, style_layer_data, guide_border_f,
                                                                      erase_f) {
   if (guide_border_f) {
      let style_alpha = style_layer_data[idx + 3];
      if (   style_alpha != rdgm_.hotspot_alpha_value
          && style_alpha != rdgm_.hotspot_alpha_value_tmp) {
         if (style_alpha == 0) {
            style_alpha = rdgm_.hotspot_alpha_value_tmp;
         } else {
            style_alpha = rdgm_.hotspot_alpha_value;
         }
         style_layer_data[idx + 3] = style_alpha;
      }
   } else if (erase_f) {
      let style_alpha = style_layer_data[idx + 3];
      if (style_alpha > 0) {
         if (style_alpha == rdgm_.hotspot_alpha_value_tmp) {
            style_alpha = 0;
         } else {
            style_alpha = 255;
         }
         style_layer_data[idx + 3] = style_alpha;
      }
   } else {
      style_layer_data[idx]     = rgba[0];
      style_layer_data[idx + 1] = rgba[1];
      style_layer_data[idx + 2] = rgba[2];
      style_layer_data[idx + 3] = rgba[3];
   }
}
function create_svg_src (svg, width, height) {
   const url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height +'">'
                                     +     svg
                                     + '</svg>';
   return url;
}
function create_svg_circle (r, fill='transparent') {
   const svg = '<circle cx="' + r + '" cy="' + r + '" r="' + (r - 1) + '" stroke="black" fill="' + fill + '" stroke-width="1"/>'
   return svg;
}
function create_circle_cursor (r, fill='transparent') {
   const w = 2 * r;
   const svg_circle = create_svg_circle (r, fill);
   const url_src = create_svg_src (svg_circle, w, w);
   const url = 'url(\'' + url_src + '\')';
   const cursor = url + ' ' + (r - 1) + ' ' + (r - 1) + ', auto';
   if (debug[0]) {
      console.log ('[create_circle_cursor] url_src:', url_src);
      console.log ('[create_circle_cursor] cursor:', cursor);
   }
   return cursor;
}
this.show_label_options_menu = function (assoc_id) {
   var $label = $ ('div.qtarget_assoc' + assoc_id + ' .rdgm_edit_highlight_label');
   var $labels = $ ('#rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_edit_highlight_label');
   if (debug[0]) {
      console.log ('[show_label_options_menu] assoc_id:', assoc_id);
      console.log ('[show_label_options_menu] $label:', $label);
      console.log ('[show_label_options_menu] $labels:', $labels);
   }
   $labels.removeClass ('highlight_selected_choice_label');
   $label.addClass ('highlight_selected_choice_label');
   var h = [];
   var m = [];
   h.push ('<div class="rwizard_floating_menu_title">');
   h.push (   'Label options');
   h.push ('</div>');
   h.push ('<img src="' + rdgm_edit_plugin_url + 'images/icon_exit_red.png" class="rwizard_icon_menu_exit" onclick="rwizard.exit_label_options_menu ()" />');
   m.push ('<div>');
   m.push (   '<div class="rwizard_menu_item_inactive rdgm_edit_inline_block">');
   m.push (      'Add a new label <b>before</b> <span class="highlight_answer_choice">this label</span> with target on ');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rwizard.add_label (\'' + assoc_id + '\', 1, 0)">');
   m.push (      '<b>image</b>');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item_inactive rdgm_edit_inline_block">');
   m.push (      ' or ');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rwizard.add_label (\'' + assoc_id + '\', 1, 1)">');
   m.push (      '<b>text</b>');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div>');
   m.push (   '<div class="rwizard_menu_item_inactive rdgm_edit_inline_block">');
   m.push (      'Add a new label <b>after</b> <span class="highlight_answer_choice">this label</span> with target on ');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rwizard.add_label (\'' + assoc_id + '\', 0, 0)">');
   m.push (      '<b>image</b>');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item_inactive rdgm_edit_inline_block">');
   m.push (      ' or ');
   m.push (   '</div>');
   m.push (   '<div class="rwizard_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rwizard.add_label (\'' + assoc_id + '\', 0, 1)">');
   m.push (      '<b>text</b>');
   m.push (   '</div>');
   m.push ('</div>');
   if (qw.questions_cards[i_question].n_labels > 1) {
      m.push ('<div class="rwizard_menu_item" onclick="rwizard.delete_label (\'' + assoc_id + '\')">');
      m.push (   'Delete <span class="highlight_answer_choice">this label</span>');
      m.push ('</div>');
   }
   m.push ('<div class="label_options_menu_feedback"></div>');
   $ ('#label_options_menu div.rwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#label_options_menu div.rwizard_floating_menu_body').html (m.join ('\n'));
   $ ('#label_options_menu').show ();
}
this.create_label_tooltips = function ($labels) {
   if (debug[0]) {
      console.log ('[create_label_tooltips] $labels:', $labels);
   }
   $labels.each (function () {
      if (debug[0]) {
         console.log ('[create_label_tooltips] $ (this):', $ (this));
      }
      var classnames = $ (this).parents ('div.rdgm_edit_label').attr ('class');
      var m = classnames.match (/qtarget_assoc([0-9]+)/);
      if (m) {
         var assoc_id = m[1];
         var htm =  '<span style="line-height: 150%;">'
                  +    '(Right-click label to enter/edit text)'
                  +    '<br />'
                  +    '<a href="javascript: void (0);" onclick="rwizard.show_label_options_menu (\'' + assoc_id + '\')">'
                  +       'Label options'
                  +    '</a>'
                  + '</span>';
         interactive_tooltip ($ (this), htm, 'multiple_choice_tooltip');
      }
   });
   close_tooltips ();
}
function interactive_tooltip ($obj, htm, tooltipClass) {
   if (debug[0]) {
      console.log ('[interactive_tooltip] $obj:', $obj);
   }
   if (! tooltipClass) {
      tooltipClass = '';
   }
   $obj.tooltip ({
      items:         'input[type="radio"], .rdgm_editable',
      content:       htm,
      position:      {my: 'left top+0'},
      show:          null, // Show immediately.
      tooltipClass:  tooltipClass,
      open:          function (event, ui) {
                        if (typeof (event.originalEvent) === 'undefined') {
                           return false;
                        }
                        console.log ('[tooltip open]');
                        var $id = $ (ui.tooltip).attr ('id');
                        $ ('div.ui-tooltip').not ('#' + $id).remove ();
                        /*
                        console.log ('[interactive_tooltip > $ (this):', $ (this));
                        $ (this)[0].timeout_id = setTimeout (function () {
                           $ (ui.tooltip).hide ();
                        }, 1500);
                        */
                     },
      close:         function (event, ui) {
                        var target_el = $ (this)[0];
                        ui.tooltip.hover (function () {
                           console.log ('[interactive_tooltip > hover > $ (this):', $ (this));
                           $ (this).stop (true).fadeTo (400, 1);
                        },
                        function () {
                           $ (this).fadeOut ('400', function () {
                              $ (this).remove ();
                           });
                           console.log ('[tooltip close]');
                        });
                    }
   });
}
this.exit_label_options_menu = function () {
   $ ('#label_options_menu').hide ();
   var $labels = $ ('#rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_edit_highlight_label');
   $labels.removeClass ('highlight_selected_choice_label');
}
function close_tooltips () {
   $tooltips = $ ('.choices-rdgm' + i_rdgm + '-q' + i_question).find ('.rdgm-choice.rdgm_editable');
   if (debug[0]) {
      console.log ('[close_tooltips] $tooltips:', $tooltips);
   }
   if ($tooltips.tooltip ('instance')) {
      $tooltips.tooltip ('close');
   }
}
function remove_rwizard_editors (ii_question) {
   current_editor = '';
   if (rdgm_deck == 'rdgm') {
      var selector = 'div.rdgm_editable';
      if (typeof (ii_question) != 'undefined') {
         selector = '#rdgm' + i_rdgm + '-q' + i_question + ' .rdgm_editable';
      }
   } else {
      var selector = 'div.qcard_editable';
   }
   $ (selector).each (function () {
      var id = $ (this).attr ('id');
      var ed = tinyMCE.get (id);
      if (debug[0]) {
         console.log ('[remove_rwizard_editors] $ (this):', $ (this));
         console.log ('[remove_rwizard_editors] id:', id, ', ed:', ed);
      }
      if (ed) {
         ed.destroy ();
      }
   });
}
function set_cursor_on_hotspot_hover (event) {
   const ix = event.offsetX;
   const iy = event.offsetY;
   const new_xy_hotspot_no = is_xy_hotspot (ix, iy);
   if (new_xy_hotspot_no != current_xy_hotspot_no) {
      current_xy_hotspot_no = new_xy_hotspot_no;
      if (current_xy_hotspot_no && current_xy_hotspot_no != current_hotspot_no) {
         hotspot_image_stack_el.style.cursor = 'url(' + rdgm_edit_params.url + 'images/icon_paintbucket_disabled16x16.svg) 22 19, auto';
      } else {
         hotspot_image_stack_el.style.cursor = '';
      }
   }
}
var selecting_hotspot_f = false;
this.select_hotspot = function () {
   qw.init_hotspot_image_canvas ();
   new_hotspot_f = false;
   const msg = '<span class="rwizard_highlight">Click on hotspot (or its label) to edit</span>';
   $ ('div.hotspot_diagram_options_menu_feedback').html (msg).show ();
   $hotspot_image_stack.off ('click');
   $hotspot_image_stack.on ('click', qw.select_hotspot_click);
   selecting_hotspot_f = true;
}
this.select_hotspot_click = function (e) {
   if (debug[0]) {
      console.log ('[select_hotspot_click] event.offsetX:', event.offsetX, ', event.offsetY:', event.offsetY);
   }
   /*
   const ix = event.offsetX;
   const iy = event.offsetY;
   */
   const rect = event.currentTarget.getBoundingClientRect ();
   const ix   = Math.round (event.clientX - rect.left);
   const iy   = Math.round (event.clientY - rect.top);
   if (debug[0]) {
      console.log ('[select_hotspot_click] ix:', ix, ', iy:', iy, ', rect:', rect);
   }
   current_hotspot_no = is_xy_hotspot (ix, iy);
   if (debug[0]) {
      console.log ('[select_hotspot_click] current_hotspot_no:', current_hotspot_no, ', current_hotspot_color:', current_hotspot_color);
   }
   if (current_hotspot_no) {
      $hotspot_image_stack.off ('click');
      selecting_hotspot_f = false;
      var $label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
      if (! $label.length) {
         $label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot0');
         if ($label.length) {
            $label.removeClass ('rdgm_hotspot0').addClass ('rdgm_hotspot' + current_hotspot_no);
            const classes = $label[0].className;
            const m = classes.match (/rdgm_hotspot_color(\d+)/);
            if (m) {
               const old_hotspot_color = m[1];
               $label.removeClass ('rdgm_hotspot_color' + old_hotspot_color);
            }
            $label.addClass ('rdgm_hotspot_color' + (current_hotspot_no - 1));
            alert ('Sorry, there was a problem with the label for this hotspot.\n'
                   + 'Please check the label text.');
         } else {
            alert ('Sorry, missing label for this hotspot.\n'
                   + 'You will have to delete the hotspot and re-create it.');
         }
      }
      [current_hotspot_color.r, current_hotspot_color.g,
       current_hotspot_color.b, current_hotspot_color.a]
                       = rdgm_.hotspot_color_from_no (current_hotspot_no, true);
      const question = qw.questions_cards[i_question];
      const hotspot_user_interaction = question.hotspot_user_interaction;
      if (! hotspot_user_interaction || hotspot_user_interaction != 'info_only') {
         set_hotspot_feedback_edit_fields ();
      }
      qw.show_hotspot_editing_menu ();
   }
}
function set_hotspot_feedback_edit_fields () {
   const rdgmq  = 'div#rdgm' + i_rdgm + '-q' + i_question;
   const $rdgmq = $dialog_rwizard.find (rdgmq);
   const $hotspot_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
   const r = qw.get_or_correct_hotspot_feedback ($hotspot_label);
   if (qqc.is_only_tags_and_whitespace (r.feedback_correct)) {
      r.feedback_correct = hotspot_click_feedback_placeholder ('correct');
   }
   $rdgmq.find ('div.hotspot_click_feedback_correct').html (r.feedback_correct);
   qw.init_remove_placeholder (rdgmq + ' div.hotspot_click_feedback_correct');
   if (qqc.is_only_tags_and_whitespace (r.feedback_incorrect)) {
      r.feedback_incorrect = hotspot_click_feedback_placeholder ('incorrect');
   }
   $rdgmq.find ('div.hotspot_click_feedback_incorrect').html (r.feedback_incorrect);
   qw.init_remove_placeholder (rdgmq + ' div.hotspot_click_feedback_incorrect');
}
this.get_or_correct_hotspot_feedback = function ($hotspot_label) {
   if (debug[0]) {
      console.log ('[get_or_correct_hotspot_feedback] $hotspot_label:', $hotspot_label);
   }
   var feedback_correct   = '';
   var feedback_incorrect = '';
   var $feedback_correct = $hotspot_label.find ('div.hotspot_label_feedback_correct');
   if (! $feedback_correct.length) {
      var htm = '<div class="hotspot_label_feedback hotspot_label_feedback_correct">'
              +    '<span class="hotspot_label_feedback_correct_content">'
              +       '&nbsp;'
              +    '</span>'
              +    '<div class="hotspot_label_feedback hotspot_label_feedback_incorrect">'
              +       '<span class="hotspot_label_feedback_incorrect_content">'
              +          '&nbsp;'
              +       '</span>'
              +    '</div>'
              + '</div>';
      $hotspot_label.append (htm);
   } else {
      var $feedback_correct_content = $feedback_correct.find ('span.hotspot_label_feedback_correct_content');
      if (! $feedback_correct_content.length) {
         var htm = '<span class="hotspot_label_feedback_correct_content">'
                 +    '&nbsp;'
                 + '</span>';
         $feedback_correct.append (htm);
      } else {
         feedback_correct = $feedback_correct_content.html ();
      }
      var $feedback_incorrect = $feedback_correct.find ('div.hotspot_label_feedback_incorrect');
      if (! $feedback_incorrect.length) {
         var htm =   '<div class="hotspot_label_feedback hotspot_label_feedback_incorrect">'
                   +    '<span class="hotspot_label_feedback_incorrect_content">'
                   +       '&nbsp;'
                   +    '</span>'
                   + '</div>';
            $feedback_correct.append (htm);
      } else {
         var $feedback_incorrect_content = $feedback_incorrect.find ('span.hotspot_label_feedback_incorrect_content');
         if (! $feedback_incorrect_content.length) {
            var htm = '<span class="hotspot_label_feedback_incorrect_content">'
                    +    '&nbsp;'
                    + '</span>';
            $feedback_incorrect.append (htm);
         } else {
            feedback_incorrect = $feedback_incorrect_content.html ();
         }
      }
   }
   return {feedback_correct: feedback_correct, feedback_incorrect: feedback_incorrect};
}
function select_hotspot_via_label_click (edit_obj, editor) {
   if (debug[0]) {
      console.log ('[select_hotspot_via_label_click] edit_obj:', edit_obj);
      console.log ('[select_hotspot_via_label_click] editor:', editor);
   }
   const edit_el = edit_obj.currentTarget;
   const classes = edit_el.className;
   const m = classes.match (/rdgm_hotspot(\d+)/);
   if (debug[0]) {
      console.log ('[select_hotspot_via_label_click] m:', m);
   }
   if (m) {
      $hotspot_image_stack.off ('click');
      current_hotspot_no = m[1];
      if (current_hotspot_no == 0) {
         const delete_f
            = confirm ('Sorry, there was a problem with the hotspot label you clicked.\n'
                       + 'You can try again, clicking on the hotspot instead of the label\n'
                       + '(you may have to move the label out of the way) -- click "Cancel".\n'
                       + '\n'
                       + 'Or you can delete the label (you will have to delete the hotspot\n'
                       + 'and re-create it) -- click "OK".\n'
                       + '\n'
                       + 'Delete this label?');
         if (delete_f) {
            $ ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no).remove ();
         }
         $ ('div.hotspot_diagram_options_menu_feedback').hide ();
         selecting_hotspot_f = false;
         return false;
      }
      const question = qw.questions_cards[i_question];
      const hotspot_user_interaction = question.hotspot_user_interaction;
      if (! hotspot_user_interaction || hotspot_user_interaction != 'info_only') {
         set_hotspot_feedback_edit_fields ();
      }
      if (selecting_hotspot_f) {
         selecting_hotspot_f = false;
         [current_hotspot_color.r, current_hotspot_color.g,
          current_hotspot_color.b, current_hotspot_color.a]
                       = rdgm_.hotspot_color_from_no (current_hotspot_no, true);
         qw.show_hotspot_editing_menu ();
      }
      const delay_focus = function () {
         editor.focus ();
      }
      setTimeout (delay_focus, 200);
   }
}
function is_xy_hotspot (ix, iy) {
   const ctx      = qw.questions_cards[i_question].ctx;
   const i_width  = ctx.canvas.width;
   const i_height = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data      = imageData.data;
   const ii = iy*i_width + ix;
   const idx = ii << 2;
   const pixel_a = data[idx + 3];
   if (pixel_a != rdgm_.hotspot_alpha_value) {
      return 0;
   }
   const $canvas = $hotspot_image_stack.find ('canvas.layer0_edited');
   get_or_create_spotmap ($canvas);
   const sx = Math.round (ix/i_width  * spotmap_width);
   const sy = Math.round (iy/i_height * spotmap_height);
   var hotspot_no;
   if (sparsemap) {
      hotspot_no = 0;
      if (spotmap[sx]) {
         if (spotmap[sx][sy]) {
            hotspot_no = spotmap[sx][sy];
         }
      }
   } else {
      hotspot_no = spotmap[sy*spotmap_width + sx];
   }
   return hotspot_no;
}
var hotspot_edit_mode = '';
function turn_off_previous_hotspot_edit_mode () {
   if (hotspot_edit_mode == 'add_rectlipse') {
      qw.turn_off_hotspot_rectlipse ();
   } else if (hotspot_edit_mode == 'floodfill') {
      turn_off_hotspot_floodfill ();
   } else if (hotspot_edit_mode == 'draw' || hotspot_edit_mode == 'erase') {
      turn_off_hotspot_draw ();
   }
   hotspot_edit_mode = '';
}
var $rectlipse;
this.turn_on_hotspot_rectlipse = function (rectlipse_ovality) {
   if (debug[0]) {
      console.log ('[turn_on_hotspot_rectlipse] hotspot_edit_mode:', hotspot_edit_mode);
   }
   turn_off_previous_hotspot_edit_mode ();
   hotspot_edit_mode = 'add_rectlipse';
   $rectlipse = $hotspot_image_stack.find ('div.rdgm_rectlipse');
   if (! $rectlipse.length) {
      const border_radius_pct = ' ' + (rectlipse_ovality/2) + '%';
      const htm = '<div class="rdgm_rectlipse" style="border-radius:' + border_radius_pct + border_radius_pct + ';"></div>';
      $hotspot_image_stack.append (htm);
      $rectlipse = $hotspot_image_stack.find ('div.rdgm_rectlipse');
   }
   $rectlipse.draggable ().resizable ();
   const rgba = rgba_from_values (current_hotspot_color);
   $rectlipse.css ({display: 'block', background: rgba});
   $rectlipse.on ('click', add_rectlipse_to_canvas);
   qw.init_hotspot_image_canvas ();
   $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').addClass ('rwizard_background_light_gray');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item, div#hotspot_editing_menu div.rwizard_menu_item_not_active').removeClass ('rwizard_menu_item').addClass ('rwizard_menu_item_not_active');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item_not_active.add_rectlipse').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
   const msg =    '<button class="rwizard_float_right rwizard_normal rwizard_smaller" onclick="rwizard.turn_off_hotspot_rectlipse ()">'
                +    'Cancel'
                + '</button>'
                + 'Move/resize shape; '
                + '<span class="rwizard_highlight">click shape when done</span>'
                + '<hr />';
   $ ('div.hotspot_editing_menu_feedback').html (msg).show ();
}
this.turn_off_hotspot_rectlipse = function () {
   hotspot_edit_mode = '';
   if ($rectlipse) {
      $rectlipse.remove ();
      $rectlipse = '';
   }
   $ ('div.hotspot_editing_menu_feedback').hide ();
}
const add_shapes_msg = '<span class="rwizard_highlight">'
                     +    'You can add shapes to this hotspot, or finish'
                     +    '<br />'
                     +    '(and add a label and feedback) with &ldquo;Done/save&rdquo;'
                     + '</span>'
                     + '<hr />';
function add_rectlipse_to_canvas (e) {
   if (debug[0]) {
      console.log ('[add_rectlipse_to_canvas] e:', e);
   }
   $rectlipse.off ('click');
   const w  = $rectlipse.width ();
   const h  = $rectlipse.height ();
   const rectlipse_left = Math.round ($rectlipse.position ().left);
   const rectlipse_top  = Math.round ($rectlipse.position ().top );
   const cx = Math.round (rectlipse_left + 0.5*w);
   const cy = Math.round (rectlipse_top  + 0.5*h);
   const o  = $ ('input.rectlipse_ovality').val ()/200.0;
   if (debug[0]) {
      console.log ('[add_rectlipse_to_canvas] rectlipse_left:', rectlipse_left, ', rectlipse_top:', rectlipse_top);
      console.log ('[add_rectlipse_to_canvas] w:', w, ', h:', h, ', cx:', cx, ', cy:', cy, ', o:', o);
   }
   const ctx      = qw.questions_cards[i_question].ctx;
   const i_width  = ctx.canvas.width;
   const i_height = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data      = imageData.data;
   if (hotspot_newest_version == 0) {
      hotspot_saved_images[0] = [...data];
   }
   var any_change_f = false;
   for (var box_y=0; box_y<h; box_y++) {
      const iy = rectlipse_top + box_y
      if (iy < 0 || iy > i_height) {
         continue;
      }
      for (var box_x=0; box_x<w; box_x++) {
         const ix = rectlipse_left + box_x;
         if (ix < 0 || ix > i_width) {
            continue;
         }
         const inside_f = is_inside_rectlipse (cx, cy, w, h, o, ix, iy);
         if (inside_f) {
            const ii = iy*i_width + ix;
            const idx = ii << 2;
            const pixel_a = data[idx + 3];
            if (pixel_a != rdgm_.hotspot_alpha_value) {
               data[idx]     = current_hotspot_color.r;
               data[idx + 1] = current_hotspot_color.g;
               data[idx + 2] = current_hotspot_color.b;
               data[idx + 3] = current_hotspot_color.a;
               any_change_f = true;
            }
         }
      }
   }
   if (any_change_f) {
      hotspot_save_new_version (ctx, imageData, data);
   }
   hotspot_changes_f = true;
   $ ('button#hotspot_editing_menu_done_save').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
   $rectlipse.remove ();
   $rectlipse = '';
   $ ('div.hotspot_editing_menu_feedback').html (add_shapes_msg).show ();
}
function is_inside_rectlipse (cx, cy, w, h, o, x, y) {
   const R = o * w;  // "Major" (horizontal) radius.
   const r = o * h;  // "Minor" (vertical) radius.
   var ok_f = true;
   if (o == 0.5) {
      ok_f = is_inside_ellipse (cx, cy, R, r, x, y);
   } else {
      const x_left   = cx - 0.5*w;
      const x_right  = cx + 0.5*w;
      const y_top    = cy - 0.5*h;
      const y_bottom = cy + 0.5*h;
      const x_test_left   = x_left   + R;
      const x_test_right  = x_right  - R;
      const y_test_top    = y_top    + r;
      const y_test_bottom = y_bottom - r;
      if (x < x_test_left) {
         if (y < y_test_top) {
            const cx_topleft = cx - 0.5*w + R;
            const cy_topleft = cy - 0.5*h + r;
            ok_f = is_inside_ellipse (cx_topleft, cy_topleft, R, r, x, y);
         } else if (y > y_test_bottom) {
            const cx_botleft = cx - 0.5*w + R;
            const cy_botleft = cy + 0.5*h - r;
            ok_f = is_inside_ellipse (cx_botleft, cy_botleft, R, r, x, y);
         }
      } else if (x > x_test_right) {
         if (y < y_test_top) {
            const cx_topright = cx + 0.5*w - R;
            const cy_topright = cy - 0.5*h + r;
            ok_f = is_inside_ellipse (cx_topright, cy_topright, R, r, x, y);
         } else if (y > y_test_bottom) {
            const cx_botright = cx + 0.5*w - R;
            const cy_botright = cy + 0.5*h - r;
            ok_f = is_inside_ellipse (cx_botright, cy_botright, R, r, x, y);
         }
      }
   }
   return ok_f;
}
function is_inside_ellipse (cx, cy, R, r, x, y) {
   const inside_f = (x - cx)**2/(R*R) + (y - cy)**2/(r*r) < 1.0;
   return inside_f;
}
this.hotspot_rectlipse_ovality_change = function (e) {
   if (debug[0]) {
      console.log ('[hotspot_rectlipse_ovality_change] e:', e);
   }
   const ovality = e.target.value;
   const border_radius_pct = (ovality/2) + '% ';
   if ($rectlipse) {
      $rectlipse.css ({'border-radius': border_radius_pct + border_radius_pct});
   }
   const options = {path: '/', expires: 365};
   $.cookie ('rdgm_hotspot_rectlipse_ovality', ovality, options);
}
var hotspot_revert_version = -1;
var hotspot_newest_version = -1;
var hotspot_saved_images   = [];
var current_xy_hotspot_no;
var hotspot_last_clicked_color;
this.turn_on_hotspot_floodfill = function () {
   if (debug[0]) {
      console.log ('[turn_on_hotspot_floodfill]');
   }
   turn_off_previous_hotspot_edit_mode ();
   hotspot_edit_mode = 'floodfill';
   qw.init_hotspot_image_canvas ();
   hotspot_last_clicked_color = '';
   var ctx = qw.questions_cards[i_question].ctx;
   const width  = ctx.canvas.width;
   const height = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, width, height);
   const data = imageData.data;
   if (hotspot_newest_version == -1) {
      hotspot_save_new_version (ctx, imageData, data);
   }
   $hotspot_image_stack.off ('click');
   $hotspot_image_stack.on ('click', qw.floodFill);
   $hotspot_image_stack.addClass ('rwizard_paintbucket');
   $current_xy_hotspot_no = 0;
   $hotspot_image_stack.off ('mousemove');
   $hotspot_image_stack.on  ('mousemove', set_cursor_on_hotspot_hover);
   $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').addClass ('rwizard_background_light_gray');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item, div#hotspot_editing_menu div.rwizard_menu_item_not_active').removeClass ('rwizard_menu_item').addClass ('rwizard_menu_item_not_active');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item_not_active.floodfill').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
}
function turn_off_hotspot_floodfill () {
   $hotspot_image_stack.off ('click')
                       .off ('mousemove');
   $hotspot_image_stack.removeClass ('rwizard_paintbucket').css ({cursor: ''});
}
this.floodFill = function (e) {
   if (debug[0]) {
      console.log ('[floodFill] event.offsetX:', event.offsetX, ', event.offsetY:', event.offsetY);
   }
   const ix = event.offsetX;
   const iy = event.offsetY;
   const hotspot_no = is_xy_hotspot (ix, iy);
   if (debug[0]) {
      console.log ('[floodFill] hotspot_no:', hotspot_no);
   }
   if (hotspot_no && hotspot_no != current_hotspot_no) {
      alert ('You clicked on a another hotspot');  // DKTMP
      return false;
   }
   var tolerance = $ ('input.hotspot_edit_spinner.floodfill_tolerance').val ();
   tolerance *= 255 / 100;
   const ctx = qw.questions_cards[i_question].ctx;
   qw.floodFill2 (ctx, event.offsetX | 0, event.offsetY | 0,
                  current_hotspot_color, tolerance);
   hotspot_changes_f = true;
   $ ('button#hotspot_editing_menu_done_save').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
}
this.floodFill2 = function (ctx, startX, startY, fillColor, tolerance) {
   var idx, blend, dist, rr, gg, bb, aa, spanLeft = true, spanRight = true, leftEdge = false, rightEdge = false;
   const width     = ctx.canvas.width;
   const height    = ctx.canvas.height;
   const pixels    = width * height;
   const imageData = ctx.getImageData(0, 0, width, height);
   const data      = imageData.data;
   const p32 = new Uint32Array (data.buffer);
   const stack = [startX + (startY * width)];
   const targetColor = p32[stack[0]];
   const fill_r = fillColor.r | 0;
   const fill_g = fillColor.g | 0;
   const fill_b = fillColor.b | 0;
   const fill_a = fillColor.a | 0;
   const fillColor32 = (fill_a << 24) + (fill_b << 16) + (fill_g << 8) + fill_r;
   if (targetColor === fillColor32 || targetColor === undefined) { return }
   idx = stack[0] << 2;
   const rightE = width - 1, bottomE = height - 1;
   const distances = new Uint16Array(width*height);
   tolerance *= 4;
   var click_r = data[idx] ;
   var click_g = data[idx + 1];
   var click_b = data[idx + 2];
   var click_a = data[idx + 3];
   if (click_a == rdgm_.hotspot_alpha_value
          && rgb_same (click_r, current_hotspot_color.r)
          && rgb_same (click_g, current_hotspot_color.g)
          && rgb_same (click_b, current_hotspot_color.b)) {
      if (hotspot_last_clicked_color) {
         click_r = hotspot_last_clicked_color.r;
         click_g = hotspot_last_clicked_color.g;
         click_b = hotspot_last_clicked_color.b;
         click_a = hotspot_last_clicked_color.a;
         if (debug[0]) {
            console.log ('[floodFill2] using hotspot_last_clicked_color:', hotspot_last_clicked_color);
         }
      } else {
         const r_obj = get_original_hotspot_image_data (width, height);
         const orig_image_data = r_obj.orig_image_data;
         click_r = orig_image_data[idx] ;
         click_g = orig_image_data[idx + 1];
         click_b = orig_image_data[idx + 2];
         click_a = orig_image_data[idx + 3];
         hotspot_last_clicked_color = {r: click_r, g: click_g, b: click_b, a: click_a};
         if (debug[0]) {
            console.log ('[floodFill2] using original image color > hotspot_last_clicked_color:', hotspot_last_clicked_color);
         }
      }
   } else {
      hotspot_last_clicked_color = {r: click_r, g: click_g, b: click_b, a: click_a};
   }
   if (debug[0]) {
      console.log ('[floodFill2] click_r g b a:', click_r, click_g, click_b, click_a);
   }
   function colorDist (idx) {
      if (distances[idx]) { return Infinity }
      idx <<= 2;
      const test_r = data[idx];
      const test_g = data[idx + 1];
      const test_b = data[idx + 2];
      const test_a = data[idx + 3];
      if (test_a == rdgm_.hotspot_alpha_value) {
         const r_same = rgb_same (test_r, fill_r);
         const g_same = rgb_same (test_g, fill_g);
         const b_same = rgb_same (test_b, fill_b);
         if (! r_same || ! g_same || ! b_same) {
            return Infinity;
         }
         if (r_same && g_same && b_same) {
            return 0;
         }
      }
      const R = click_r - test_r;
      const G = click_g - test_g;
      const B = click_b - test_b;
      const A = click_a - test_a;
      const colordist = (R*R + B*B + G*G + A*A) ** 0.5;
      return colordist;
   }
   while (stack.length) {
      idx = stack.pop();
      while (idx >= width && colorDist (idx - width) <= tolerance) {
         idx -= width; // move to top edge
      }
      spanLeft = spanRight = false;   // not going left right yet
      leftEdge = (idx % width) === 0;
      rightEdge = ((idx + 1) % width) === 0;
      while ((dist = colorDist (idx)) <= tolerance) {
         distances[idx] = (dist/tolerance) * 255 | 0x8000;
         if (!leftEdge) {
            if (colorDist (idx - 1) <= tolerance) {
               if (!spanLeft) {
                  stack.push (idx - 1);
                  spanLeft = true;
               } else if (spanLeft) {
                  spanLeft = false;
               }
            }
         }
         if (!rightEdge) {
            if (colorDist (idx + 1) <= tolerance) {
               if (!spanRight) {
                  stack.push (idx + 1);
                  spanRight = true;
               } else if (spanRight) {
                  spanRight = false;
               }
            }
         }
         idx += width;
      }
   }
   idx = 0;
   var any_change_f = false;
   while (idx < pixels) {
      dist = distances[idx];
      if (dist !== 0) {
         p32[idx] = fillColor32;
         any_change_f = true;
         /*
         if (true || dist === 0x8000) {
             p32[idx] = fillColor32;
             if (debug[0]) {
                console.log ('[floodFill2] dist 0x8000; using fillColor32');
             }
             const idx1 = idx << 2;
             data[idx1]     = fill_r;
             data[idx1 + 1] = fill_g;
             data[idx1 + 2] = fill_b;
             data[idx1 + 3] = fill_a;
         } else {
            blend = false;
            const x = idx % width;
            const y = idx / width | 0;
            if (x > 0 && distances[idx - 1] === 0) { blend = true }
            else if (x < rightE && distances[idx + 1] === 0) { blend = true }
            else if (y > 0 && distances[idx - width] === 0) { blend = true }
            else if (y < bottomE && distances[idx + width] === 0) { blend = true }
            if (blend) {
                dist &= 0xFF;
                dist = dist / 255;
                const invDist = 1 - dist;
                const idx1 = idx << 2;
                data[idx1]     = data[idx1    ] * dist + fill_r * invDist;
                data[idx1 + 1] = data[idx1 + 1] * dist + fill_g * invDist;
                data[idx1 + 2] = data[idx1 + 2] * dist + fill_b * invDist;
                data[idx1 + 3] = data[idx1 + 3] * dist + fill_a * invDist;
             } else {
                if (debug[0]) {
                   console.log ('[floodFill2] blending with fillColor32');
                }
                const idx1 = idx << 2;
                data[idx1]     = fill_r;
                data[idx1 + 1] = fill_g;
                data[idx1 + 2] = fill_b;
                data[idx1 + 3] = fill_a;
             }
          }
          */
       }
       idx++;
   }
   if (any_change_f) {
      hotspot_save_new_version (ctx, imageData, data);
      $ ('div.hotspot_editing_menu_feedback').html (add_shapes_msg).show ();
   }
}
function change_floodfill_tolerance () {
   const tolerance = $ ('input.hotspot_edit_spinner.floodfill_tolerance').val ();
   const options = {path: '/', expires: 365};
   $.cookie ('rdgm_hotspot_floodfill_tolerance', tolerance, options);
}
this.enlarge_hotspot_click = function () {
   $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').addClass ('rwizard_background_light_gray');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item, div#hotspot_editing_menu div.rwizard_menu_item_not_active').removeClass ('rwizard_menu_item').addClass ('rwizard_menu_item_not_active');
   $ ('div#hotspot_editing_menu div.rwizard_menu_item_not_active.enlarge').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
}
this.enlarge_hotspot_by_selected = function (value) {
   turn_off_previous_hotspot_edit_mode ();
   hotspot_edit_mode = 'enlarge';
   qw.init_hotspot_image_canvas ();
   var ctx = qw.questions_cards[i_question].ctx;
   const i_width  = ctx.canvas.width;
   const i_height = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data = imageData.data;
   if (hotspot_newest_version == -1) {
      hotspot_save_new_version (ctx, imageData, data);
   }
   save_hotspot_style_state ();
   set_hotspot_border (current_hotspot_no, '', i_width, i_height, data, '',
                       data, value);
   ctx.putImageData (imageData, 0, 0);
   hotspot_save_new_version (ctx, imageData, data);
   hotspot_changes_f = true;
   const $label1           = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1')
   var   $border_label     = $label1;
   var   $highlight_label  = $label1;
   var   border_hotspot_no = $border_label.attr ('data-border_all');
   if ( border_hotspot_no) {
      $border_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + border_hotspot_no)
   } else {
      $border_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
   }
   const do_border_f = $border_label.attr ('data-border_width');
   var highlight_hotspot_no = $label1.attr ('data-highlight_all');
   if (highlight_hotspot_no) {
      $highlight_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + highlight_hotspot_no)
   } else {
      $highlight_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
   }
   const do_highlight_f = $highlight_label.attr ('data-highlight_brightness') || $highlight_label.attr ('data-highlight_tint');
   if (do_highlight_f || do_border_f) {
      const r_obj = get_original_hotspot_image_data (i_width, i_height);
      const orig_image_data = r_obj.orig_image_data;
      [$hotspot_style_canvas, hotspot_style_ctx]
                                = init_hotspot_style_canvas (i_width, i_height);
      const hotspot_style_imageData  = hotspot_style_ctx.getImageData(0, 0, i_width, i_height);
      const hotspot_style_image_data = hotspot_style_imageData.data;
      const n_pixels = i_width * i_height;
      set_hotspot_highlight (current_hotspot_no, $highlight_label, n_pixels,
                             data, orig_image_data, hotspot_style_image_data,
                             do_border_f);
      if (do_border_f) {
         set_hotspot_border (current_hotspot_no, $border_label, i_width,
                             i_height, data, orig_image_data,
                             hotspot_style_image_data);
      }
      hotspot_style_changes_f = true;
      hotspot_style_ctx.putImageData (hotspot_style_imageData, 0, 0);
   }
   $ ('select#enlarge_hotspot_by')[0].selectedIndex = 0;
}
var hotspot_draw_ctx;
var hotspot_draw_imageData;
var hotspot_draw_data;
var hotspot_image_width;
var hotspot_image_height;
var hotspot_draw_color;
var hotspot_draw_line_width;
var previousMouseX = null;
var previousMouseY = null;
var isDrawing      = false;
var moved          = false;
var hotspot_width_el;
this.turn_on_hotspot_draw = function (draw_erase) {
   turn_off_previous_hotspot_edit_mode ();
   hotspot_edit_mode = draw_erase;
   qw.init_hotspot_image_canvas ();
   hotspot_draw_ctx = qw.questions_cards[i_question].ctx;
   hotspot_image_width  = hotspot_draw_ctx.canvas.width;
   hotspot_image_height = hotspot_draw_ctx.canvas.height;
   hotspot_draw_imageData = hotspot_draw_ctx.getImageData(0, 0, hotspot_image_width, hotspot_image_height);
   hotspot_draw_data = hotspot_draw_imageData.data;
   if (hotspot_newest_version == -1) {
      hotspot_save_new_version (hotspot_draw_ctx, hotspot_draw_imageData, hotspot_draw_data);
   }
   $hotspot_image_stack.off ('mousedown');
   $hotspot_image_stack.on ('mousedown', function (e) {
      if (debug[0]) {
         console.log ('[turn_on_hotspot_draw > mousedown]');
      }
      isDrawing = true;
      moved     = false;
      hotspot_draw_line_width = hotspot_width_el.value;
      move (e.offsetX, e.offsetY);
   });
   $hotspot_image_stack.off ('mousemove');
   $hotspot_image_stack.on ('mousemove', function (e) {
      if (isDrawing) {
         draw_line (previousMouseX, previousMouseY, e.offsetX, e.offsetY, hotspot_draw_line_width);
         draw_circle (e.offsetX, e.offsetY, 0.5*hotspot_draw_line_width)
         move (e.offsetX, e.offsetY);
         moved = true;
      }
   });
   $hotspot_image_stack.off ('mouseup');
   $hotspot_image_stack.on ('mouseup', function (e) {
      if (debug[0]) {
         console.log ('[draw > mouseup]');
      }
      isDrawing = false;
      if (! moved) {
         draw_circle (e.offsetX, e.offsetY, 0.5*hotspot_draw_line_width)
      }
      hotspot_save_new_version (hotspot_draw_ctx, hotspot_draw_imageData, hotspot_draw_data);
      hotspot_changes_f = true;
      $ ('button#hotspot_editing_menu_done_save').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
   });
   const $menu_items = $ ('div#hotspot_editing_menu div.rwizard_menu_item, div#hotspot_editing_menu div.rwizard_menu_item_not_active');
   if (draw_erase == 'draw') {
      hotspot_draw_color = current_hotspot_color;
      hotspot_width_el   = $ ('input.hotspot_edit_spinner.draw_tool_width')[0];
      $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').addClass ('rwizard_background_light_gray');
      $menu_items.not ('.draw').removeClass ('rwizard_menu_item').addClass ('rwizard_menu_item_not_active');
      $menu_items.siblings ('.draw').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
      hotspot_draw_line_width = hotspot_width_el.value;
      const cursor = create_circle_cursor (hotspot_draw_line_width/2, 'rgba(255, 255, 255, 0.5)');
      hotspot_image_stack_el.style.cursor = cursor;
   } else {
      hotspot_draw_color = {r: 0, g: 0, b: 0, a: 0};
      hotspot_width_el   = $ ('input.hotspot_edit_spinner.eraser_tool_width')[0];
      $ ('div#hotspot_editing_menu div.rwizard_floating_menu_body').addClass ('rwizard_background_light_gray');
      $menu_items.not ('.erase').removeClass ('rwizard_menu_item').addClass ('rwizard_menu_item_not_active');
      $menu_items.siblings ('.erase').removeClass ('rwizard_menu_item_not_active').addClass ('rwizard_menu_item');
      hotspot_draw_line_width = hotspot_width_el.value;
      const cursor = create_circle_cursor (hotspot_draw_line_width/2, 'rgba(128, 128, 128, 1.0)');
      hotspot_image_stack_el.style.cursor = cursor;
   }
   $hotspot_image_stack.find ('div.rdgm_hotspot_label').addClass ('rwizard_display_none_important');
}
function change_draw_erase_width (e) {
   if (debug[0]) {
      console.log ('[change_draw_erase_width] e:', e);
   }
   if (hotspot_edit_mode != 'draw' && hotspot_edit_mode != 'erase') {
      return;
   }
   var fill;
   var cursor;
   var cookie_name;
   if (hotspot_edit_mode == 'draw') {
      fill = 'transparent';
      cookie_name = 'rdgm_hotspot_draw_line_width';
   } else {
      fill = 'rgba(128, 128, 128, 0.3)';
      cookie_name = 'rdgm_hotspot_draw_erase_width';
   }
   hotspot_draw_line_width = e.target.value;
   cursor = create_circle_cursor (hotspot_draw_line_width/2, fill);
   hotspot_image_stack_el.style.cursor = cursor;
   const options = {path: '/', expires: 365};
   $.cookie (cookie_name, hotspot_draw_line_width, options);
}
function draw_circle (cx, cy, r) {
   cx = Math.round (cx);
   cy = Math.round (cy);
   r  = Math.round (r);
   const r2 = r * r;
   for (let iiy=0; iiy<=r; iiy++) {
      const iy1 = cy - iiy;
      const iy2 = cy + iiy;
      const l_half = Math.round (Math.sqrt (r2 - iiy*iiy));
      const iix_beg = Math.max (cx - l_half + 1, 0);
      const iix_end = Math.min (cx + l_half,     hotspot_image_width - 1);
      for (let iix=iix_beg; iix<iix_end; iix++) {
         const ix1 = iy1*hotspot_image_width + iix;
         const ix2 = iy2*hotspot_image_width + iix;
         const idx1 = ix1 * 4;
         const idx2 = ix2 * 4;
         update_pixel_if_ok (hotspot_draw_data, idx1, hotspot_draw_color);
         update_pixel_if_ok (hotspot_draw_data, idx2, hotspot_draw_color);
      }
   }
   hotspot_draw_ctx.putImageData (hotspot_draw_imageData, 0, 0);
}
function draw_line (x0, y0, x1, y1, w) {
   x0 = Math.round (x0);
   y0 = Math.round (y0);
   x1 = Math.round (x1);
   y1 = Math.round (y1);
   const dx = x1 - x0;
   const dy = y1 - y0;
   if (dx == 0 && dy == 0) {
      return;
   }
   const theta = Math.atan2 (dx, dy);
   const offset_x = -Math.cos (theta);
   const offset_y =  Math.sin (theta);
   const half_width = Math.round (hotspot_draw_line_width/2);
   for (let i_offset=-half_width; i_offset<=half_width; i_offset+=0.667) {
      const dt = 0.667 / Math.sqrt (dx*dx + dy*dy);
      for (let t=0; t<=1.0; t+=dt) {
         const ix = x0 + Math.round (t*dx + i_offset*offset_x);
         if (ix < 0 || ix >= hotspot_image_width) {
            continue;
         }
         const iy = y0 + Math.round (t*dy + i_offset*offset_y);
         const ii  = iy*hotspot_image_width + ix;
         const idx = ii * 4;
         update_pixel_if_ok (hotspot_draw_data, idx, hotspot_draw_color);
      }
   }
   hotspot_draw_ctx.putImageData (hotspot_draw_imageData, 0, 0);
}
function move (mouseX, mouseY) {
   previousMouseX = mouseX;
   previousMouseY = mouseY;
}
function update_pixel_if_ok (data, idx, new_color) {
   let ok_f = true;
   if (data[idx+3] == rdgm_.hotspot_alpha_value) {
      if (is_pixel_different_hotspot (data, idx)) {
         ok_f = false;
      }
   }
   if (ok_f) {
      data[idx]   = new_color.r;
      data[idx+1] = new_color.g;
      data[idx+2] = new_color.b;
      data[idx+3] = new_color.a;
   }
}
function is_pixel_different_hotspot (data, idx) {
   const test_r = data[idx];
   const test_g = data[idx + 1];
   const test_b = data[idx + 2];
   const not_same =    ! rgb_same (test_r, current_hotspot_color.r)
                    || ! rgb_same (test_g, current_hotspot_color.g)
                    || ! rgb_same (test_b, current_hotspot_color.b);
   return not_same;
}
function turn_off_hotspot_draw () {
   $hotspot_image_stack.off ('mousedown')
                       .off ('mousemove')
                       .off ('mouseup');
   hotspot_image_stack_el.style.cursor = '';
}
function rgba_from_values (color_values) {
   const rgba = 'rgba(' + color_values.r + ', ' + color_values.g + ', ' + color_values.b + ', ' + (color_values.a/255).toFixed (3) + ')';
   return rgba;
}
function hotspot_no_from_rgb (r, g, b) {
   var hotspot_no = 0;
   for (var i=1; i<=n_hotspots; i++) {
      const [hotspot_i_r, hotspot_i_g, hotspot_i_b]
                                        = rdgm_.hotspot_color_from_no (i, true);
      if (   rgb_same (r, hotspot_i_r) && rgb_same (g, hotspot_i_g) && rgb_same (b, hotspot_i_b)) {
         hotspot_no = i;
         break;
      }
   }
   return hotspot_no;
}
function rgb_match (r0, r1, g0, g1, b0, b1) {
}
function rgb_same (v1, v2) {
   return Math.abs (v1 - v2) <= 3;
}
this.toggle_hotspot_image_hide_show = function () {
   const $rdgm_layer0 = $hotspot_image_stack.find ('img.rdgm_layer0');
   if ($rdgm_layer0.hasClass ('rwizard_display_none')) {
      $rdgm_layer0.removeClass ('rwizard_display_none');
   } else {
      $rdgm_layer0.addClass ('rwizard_display_none');
   }
}
this.hotspot_undo = function () {
   if (debug[0]) {
      console.log ('[hotspot_undo] (initial) hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
   }
   if (hotspot_revert_version == 0 || hotspot_newest_version == 0) {
      return;
   }
   if (hotspot_revert_version == -1 ) {
      hotspot_revert_version = hotspot_newest_version - 1;
   } else {
      hotspot_revert_version--;
   }
   hotspot_restore_version (hotspot_revert_version);
   if (debug[0]) {
      console.log ('[hotspot_undo] (updated) hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
   }
   if (hotspot_revert_version == 0) {
      $ ('button#hotspot_editing_menu_done_save').addClass ('rdgm_button_disabled').attr ('disabled', true);
   }
}
this.hotspot_redo = function () {
   if (debug[0]) {
      console.log ('[hotspot_redo] (initial) hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
   }
   if (hotspot_revert_version == -1 || hotspot_revert_version >= hotspot_newest_version) {
      return;
   }
   hotspot_revert_version++;
   hotspot_restore_version (hotspot_revert_version);
   if (debug[0]) {
      console.log ('[hotspot_redo] (updated) hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
   }
   $ ('button#hotspot_editing_menu_done_save').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
}
function hotspot_save_new_version (ctx, imageData, data) {
   if (hotspot_revert_version == -1) {
      hotspot_newest_version++;
   } else {
      hotspot_newest_version = hotspot_revert_version + 1;
      hotspot_revert_version = -1;
   }
   if (debug[0]) {
      console.log ('[hotspot_save_new_version] hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
   }
   hotspot_saved_images[hotspot_newest_version] = [...data];
   ctx.putImageData (imageData, 0, 0);
}
function hotspot_restore_version (version) {
   var ctx = qw.questions_cards[i_question].ctx;
   const width = ctx.canvas.width;
   const height = ctx.canvas.height;
   const imageData = ctx.getImageData (0, 0, width, height);
   var   data = imageData.data;
   const restore_data = hotspot_saved_images[version];
   const len = data.length;
   for (var i=0; i<len; i++) {
      data[i] = restore_data[i];
   }
   ctx.putImageData (imageData, 0, 0);
   hotspot_draw_data = [...data];
}
function export_canvas_to_img_src ($canvas, img_selector, style_layer_f) {
   const canvas_el = $canvas[0];
   const dataURL   = canvas_el.toDataURL ();
   const img_el    = $hotspot_image_stack.find (img_selector)[0];
   img_el.src      = dataURL;
   if (style_layer_f) {
      qw.questions_cards[i_question].hotspot_style_layer_img_src_f = true;
   } else {
      qw.questions_cards[i_question].hotspot_image_img = img_el;
   }
}
var spotmap_width  = 100;
var spotmap_height = 100;
var sparsemap      = false;
var new_spotmap_width   = 0;
var new_spotmap_height  = 0;
var new_sparsemap;
var spotmap_settings_change_f;
this.save_hotspot_edits = function () {
   if (debug[0]) {
      console.log ('[save_hotspot_edits] hotspot_edit_mode:', hotspot_edit_mode, ', hotspot_changes_f:', hotspot_changes_f, ', hotspot_deleted_f:', hotspot_deleted_f);
   }
   const $canvas = $hotspot_image_stack.find ('canvas.layer0_edited');
   var   update_spotmap_f = false;
   if (hotspot_edit_mode || hotspot_style_changes_f) {
      turn_off_previous_hotspot_edit_mode ();
      $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('rwizard_display_none_important');
      qw.hotspot_editing_menu_all_active ();
      if (hotspot_changes_f && hotspot_revert_version != 0) {
         update_spotmap_f = true;
         export_canvas_to_img_src ($canvas, 'img.layer0_edited');
         get_or_create_spotmap ($canvas);
         const ctx       = qw.questions_cards[i_question].ctx;
         const i_width   = ctx.canvas.width;
         const i_height  = ctx.canvas.height;
         const imageData = ctx.getImageData(0, 0, i_width, i_height);
         const data      = imageData.data;
         const hotspot_r = current_hotspot_color.r;
         const hotspot_g = current_hotspot_color.g;
         const hotspot_b = current_hotspot_color.b;
         const hotspot_a = current_hotspot_color.a;
         const width_fac  = i_width  / spotmap_width;
         const height_fac = i_height / spotmap_height;
         var sum_spotmap_ix = 0;
         var sum_spotmap_iy = 0;
         var n_spotmap_pixels = 0;
         var prev_hotspot_no = -1;
         for (var sy=0; sy < spotmap_height; sy++) {
            const iy = Math.floor ((sy + 0.5)*height_fac);
            const iy0 = iy * i_width;
            for (var sx=0; sx < spotmap_width; sx++) {
               const ix = Math.floor ((sx + 0.5)*width_fac);
               const ii = iy0 + ix;
               const idx = ii << 2;
               const pixel_a = data[idx + 3];
               if (pixel_a == rdgm_.hotspot_alpha_value) {
                  const pixel_r = data[idx];
                  const pixel_g = data[idx + 1];
                  const pixel_b = data[idx + 2];
                  const hotspot_no = hotspot_no_from_rgb (pixel_r, pixel_g, pixel_b);
                  if (sparsemap) {
                     if (! spotmap[sx]) {
                        spotmap[sx] = {};
                     }
                     spotmap[sx][sy] = hotspot_no;
                  } else {
                     spotmap[sy*spotmap_width + sx] = hotspot_no;
                  }
                  if (hotspot_no == current_hotspot_no) {
                     sum_spotmap_ix += ix;
                     sum_spotmap_iy += iy;
                     n_spotmap_pixels++;
                  }
               } else {
                  if (! sparsemap) {
                     spotmap[sy*spotmap_width + sx] = 0;
                  }
               }
            }
         }
         if (n_spotmap_pixels == 0) {
            alert ('Could not locate hotspot -- too small?');
            return;
         }
         var center_spotmap_ix = Math.round (sum_spotmap_ix / n_spotmap_pixels);
         var center_spotmap_iy = Math.round (sum_spotmap_iy / n_spotmap_pixels);
         if (debug[0]) {
            console.log ('[save_hotspot_edits] spotmap:', spotmap)
         }
      }
      if (hotspot_style_changes_f) {
         const $hotspot_style_canvas = $hotspot_image_stack.find ('canvas.rdgm_style_layer');
         export_canvas_to_img_src ($hotspot_style_canvas, 'img.rdgm_style_layer', true);
      }
   }
   if (hotspot_deleted_f) {
      if (! spotmap) {
         get_or_create_spotmap ($canvas);
      }
      update_spotmap_f = true;
      if (sparsemap) {
         for (const sx in spotmap) {
            for (const sy in spotmap[sx]) {
               if (spotmap[sx][sy] == current_hotspot_no) {
                  delete spotmap[sx][sy];
               }
            }
         }
      } else {
         const n_spotmap_pixels = spotmap_width * spotmap_height;
         if (debug[0]) {
            console.log ('[save_hotspot_edits] n_spotmap_pixels:', n_spotmap_pixels);
         }
         for (var i=0; i<n_spotmap_pixels; i++) {
            if (spotmap[i] == current_hotspot_no) {
               spotmap[i] = 0;
            }
         }
      }
      export_canvas_to_img_src ($canvas, 'img.layer0_edited');
      hotspot_deleted_f       = false;
      hotspot_label_deleted_f = false;
   }
   if (update_spotmap_f) {
      set_spotmap_attributes ($canvas);
   }
   hotspot_revert_version = -1;
   hotspot_newest_version = -1;
   hotspot_saved_images   = [];
   hotspot_image_stack_el.style.cursor = '';
   $hotspot_image_stack.resizable ('enable');
   $hotspot_image_stack.find ('div.ui-resizable-se').not ('div.rdgm_rectlipse').removeClass ('rwizard_display_none_important');
   editing_hotspot_f = false;
   $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('rwizard_display_none_important');
   if (new_hotspot_f && hotspot_changes_f) {
      new_hotspot_label (center_spotmap_ix, center_spotmap_iy);
   }
   $ ('#hotspot_editing_menu').hide ();
   qw.show_hotspot_diagram_options_menu ();
   $ ('#quiz_components_menu_overlay').hide ();
}
function set_spotmap_attributes ($canvas) {
   var spotmap_data;
   if (sparsemap) {
      spotmap_data = JSON.stringify (spotmap).replace (/"/g, '');
   } else {
      spotmap_data = base64js.fromByteArray (spotmap);
   }
   $canvas.attr ('data-rdgm_spotmap',        spotmap_data)
          .attr ('data-rdgm_spotmap_width',  spotmap_width)
          .attr ('data-rdgm_spotmap_height', spotmap_height)
          .attr ('data-rdgm_sparsemap',      sparsemap ? 1 : 0)
}
function get_or_create_spotmap ($canvas) {
   if (spotmap && ! spotmap_settings_change_f) {
      return;
   }
   if (! spotmap) {
      const spotmap_data = $canvas.attr ('data-rdgm_spotmap');
      if (spotmap_data) {
         spotmap_width  = $canvas.data ('rdgm_spotmap_width');
         spotmap_height = $canvas.data ('rdgm_spotmap_height');
         sparsemap      = $canvas.data ('rdgm_sparsemap') == '1';
         if (sparsemap) {
            spotmap = JSON.parse (spotmap_data.replace (/(\d+):/g, '"$1":'));
         } else {
            spotmap = new Uint8ClampedArray (base64js.toByteArray (spotmap_data));
         }
      } else {
         if (spotmap_settings_change_f) {
            spotmap_settings_change_f = false;
            spotmap_width  = new_spotmap_width;
            spotmap_height = new_spotmap_height;
            sparsemap      = new_sparsemap;
         }
         if (sparsemap) {
            spotmap = {};
         } else {
            spotmap = new Uint8ClampedArray (spotmap_width*spotmap_height);
         }
         return;
      }
   }
   if (spotmap_settings_change_f) {
      update_spotmap_for_settings_change ();
   }
}
function update_spotmap_for_settings_change () {
   spotmap_settings_change_f = false;
   if (! new_spotmap_width) {
      new_spotmap_width = spotmap_width;
   }
   if (! new_spotmap_height) {
      new_spotmap_height = spotmap_height;
   }
   if (typeof new_sparsemap == 'undefined') {
      new_sparsemap = sparsemap;
   }
   if (   new_spotmap_width  == spotmap_width
       && new_spotmap_height == spotmap_height
       && new_sparsemap      == sparsemap     ) {
      return;
   }
   var   new_spotmap;
   const x_fac = spotmap_width  / new_spotmap_width;
   const y_fac = spotmap_height / new_spotmap_height;
   if (new_sparsemap) {
      new_spotmap = {}
      if (sparsemap) {
         for (var new_sx=0; new_sx<new_spotmap_width; new_sx++) {
            const sx = Math.floor (new_sx * x_fac);
            if (spotmap[sx]) {
               for (var new_sy=0; new_sy<new_spotmap_height; new_sy++) {
                  const sy = Math.floor (new_sy * y_fac);
                  if (spotmap[sx]) {
                     if (spotmap[sx][sy]) {
                        if (! new_spotmap[new_sx]) {
                           new_spotmap[new_sx] = {};
                        }
                        new_spotmap[new_sx][new_sy] = spotmap[sx][sy];
                     }
                  }
               }
            }
         }
         for (const sx in spotmap) {
            const new_sx = Math.floor (sx / x_fac);
            if (! new_spotmap[new_sx]) {
               new_spotmap[new_sx] = {};
            }
            for (const sy in spotmap[sx]) {
               const new_sy = Math.floor (sy / y_fac);
               new_spotmap[new_sx][new_sy] = spotmap[sx][sy];
            }
         }
      } else {
         for (var new_sy=0; new_sy<new_spotmap_height; new_sy++) {
            const sy = Math.floor (new_sy * y_fac);
            const sy0 = sy * spotmap_width;
            for (var new_sx=0; new_sx<new_spotmap_width; new_sx++) {
               const sx = Math.floor (new_sx * x_fac);
               if (spotmap[sy0 + sx]) {
                  if (! new_spotmap[new_sx]) {
                     new_spotmap[new_sx] = {};
                  }
                  new_spotmap[new_sx][new_sy] = spotmap[sy0 + sx];
               }
            }
         }
         for (var sy=0; sy<spotmap_height; sy++) {
            const sy0 = sy * spotmap_width;
            for (var sx=0; sx<spotmap_width; sx++) {
               if (spotmap[sy0 + sx]) {
                  const new_sx = Math.floor (sx / x_fac);
                  const new_sy = Math.floor (sy / y_fac);
                  if (! new_spotmap[new_sx]) {
                     new_spotmap[new_sx] = {};
                  }
                  new_spotmap[new_sx][new_sy] = spotmap[sy0 + sx];
               }
            }
         }
      }
   } else {
      new_spotmap = new Uint8ClampedArray (new_spotmap_width*new_spotmap_height);
      if (sparsemap) {
         for (var new_sy=0; new_sy<new_spotmap_height; new_sy++) {
            const sy = Math.floor (new_sy * y_fac);
            const sy0 = sy * spotmap_width;
            for (var new_sx=0; new_sx<new_spotmap_width; new_sx++) {
               const sx = Math.floor (new_sx * x_fac);
               if (spotmap[sx]) {
                  if (spotmap[sx][sy]) {
                     new_spotmap[new_sy*new_spotmap_width + new_sx] = spotmap[sx][sy];
                  }
               }
            }
         }
         for (const sx in spotmap) {
            const new_sx = Math.floor (sx / x_fac);
            for (const sy in spotmap[sx]) {
               const new_sy = Math.floor (sy / y_fac);
               new_spotmap[new_sy*new_spotmap_width + new_sx] = spotmap[sx][sy];
            }
         }
      } else {
         for (var new_sy=0; new_sy<new_spotmap_height; new_sy++) {
            const sy = Math.floor (new_sy * y_fac);
            const sy0 = sy * spotmap_width;
            const new_sy0 = new_sy * new_spotmap_width;
            for (var new_sx=0; new_sx<new_spotmap_width; new_sx++) {
               const sx = Math.floor (new_sx * x_fac);
               if (spotmap[sy0 + sx]) {
                  new_spotmap[new_sy0 + new_sx] = spotmap[sy0 + sx];
               }
            }
         }
         for (var sy=0; sy<spotmap_height; sy++) {
            const sy0 = sy * spotmap_width;
            for (var sx=0; sx<spotmap_width; sx++) {
               if (spotmap[sy0 + sx]) {
                  const new_sx = Math.floor (sx / x_fac);
                  const new_sy = Math.floor (sy / y_fac);
                  new_spotmap[new_sy*new_spotmap_width + new_sx] = spotmap[sy0 + sx];
               }
            }
         }
      }
   }
   var hotspot_nos = {};
   if (sparsemap) {
      for (const sx in spotmap) {
         for (const sy in spotmap[sx]) {
            const hotspot_no = spotmap[sx][sy];
            hotspot_nos[hotspot_no] = 1;
         }
      }
   } else {
      for (var sy=0; sy<spotmap_height; sy++) {
         const sy0 = sy * spotmap_width;
         for (var sx=0; sx<spotmap_width; sx++) {
            if (spotmap[sy0 + sx]) {
               const hotspot_no = spotmap[sy0 + sx];
               hotspot_nos[hotspot_no] = 1;
            }
         }
      }
   }
   var new_hotspot_nos = {};
   if (new_sparsemap) {
      for (const sx in new_spotmap) {
         for (const sy in new_spotmap[sx]) {
            const hotspot_no = new_spotmap[sx][sy];
            new_hotspot_nos[hotspot_no] = 1;
         }
      }
   } else {
      for (var sy=0; sy<new_spotmap_height; sy++) {
         const sy0 = sy * new_spotmap_width;
         for (var sx=0; sx<new_spotmap_width; sx++) {
            if (new_spotmap[sy0 + sx]) {
               const hotspot_no = new_spotmap[sy0 + sx];
               new_hotspot_nos[hotspot_no] = 1;
            }
         }
      }
   }
   var missing_f = false;
   for (const hotspot_no in hotspot_nos) {
      if (! new_hotspot_nos[hotspot_no]) {
         missing_f = true;
         break;
      }
   }
   if (missing_f) {
      if (! confirm ('Not all hotspots are present in new hotspot image map -- resolution too low?  Click "Cancel" to re-do; click "OK" to use new image map anyway.')) {
         return false;
      }
   }
   spotmap        = new_spotmap;
   spotmap_width  = new_spotmap_width;
   spotmap_height = new_spotmap_height;
   sparsemap      = new_sparsemap;
   return true;
}
function new_hotspot_label (center_ix, center_iy) {
   const offset = 0;
   const hotspot_left = center_ix + offset;
   const hotspot_top  = center_iy + offset;
   const width  = $hotspot_image_stack.width ();
   const height = $hotspot_image_stack.height ();
   const hotspot_left_pct = hotspot_left/width  * 100.0;
   const hotspot_top_pct  = hotspot_top /height * 100.0;
   const hotspot_color_base = (current_hotspot_no - 1) % 10;
   const ver2 = current_hotspot_no == 1 ? ' rdgm_hotspot_ver2' : '';
   const htm =  '<div class="rdgm_hotspot_label rdgm_hotspot' + current_hotspot_no + ' rdgm_hotspot_color' + hotspot_color_base + ver2 + '" style="left: ' + hotspot_left_pct.toFixed (0) + '%; top: ' + hotspot_top_pct.toFixed (0) + '%;">'
              +     '<div class="rdgm_hotspot_label_editable rdgm_hotspot' + current_hotspot_no + ' rdgm_editable" style="cursor: default !important;">'
              +        '<span class="rwizard_placeholder">'
              +           '<nobr>Label for hotspot</nobr>'
              +           '<br />'
              +           '<span class="rwizard_smaller">'
              +              'to&nbsp;format:&nbsp;add&nbsp;text&nbsp;and&nbsp;select&nbsp;it;'
              +              '<br />'
              +              'to add image: paste'
              +    '</span>'
              +        '</span>'
              +     '</div>'
              +     '<div class="rdgm_hotspot_label_handle">'
              +     '</div>'
              +     '<div class="hotspot_label_feedback hotspot_label_feedback_correct">'
              +        '<span class="hotspot_label_feedback_correct_content">'
              +           '&nbsp;'
              +        '</span>'
              +        '<div class="hotspot_label_feedback hotspot_label_feedback_incorrect">'
              +           '<span class="hotspot_label_feedback_incorrect_content">'
              +              '&nbsp;'
              +           '</span>'
              +        '</div>'
              +     '</div>'
              + '</div>';
   $hotspot_image_stack.append (htm);
   const hotspot_label_selector = 'div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no;
   const $hotspot_label = $hotspot_image_stack.find (hotspot_label_selector);
   $hotspot_label.draggable ({handle:  'div.rdgm_hotspot_label_handle'});
   $hotspot_label.on ('dragstop', qw.position_px_to_pct);
   $hotspot_label.resizable ();
   const rdgmq_selector = 'div#dialog_rwizard div#rdgm' + i_rdgm + '-q' + i_question;
   const hotspot_label_edit_selector = 'div.rdgm_hotspot_label_editable.rdgm_hotspot' + current_hotspot_no;
   qw.init_tinymce (rdgmq_selector + ' ' + hotspot_label_edit_selector);
   const question = qw.questions_cards[i_question];
   const hotspot_user_interaction = question.hotspot_user_interaction;
   if (! hotspot_user_interaction || hotspot_user_interaction != 'info_only') {
      const $rdgmq = $ (rdgmq_selector);
      $rdgmq.find ('div.hotspot_click_feedback_correct')  .html (hotspot_click_feedback_placeholder ('correct'));
      $rdgmq.find ('div.hotspot_click_feedback_incorrect').html (hotspot_click_feedback_placeholder ('incorrect'));
      qw.init_remove_placeholder (rdgmq_selector + ' div.hotspot_click_feedback_correct');
      qw.init_remove_placeholder (rdgmq_selector + ' div.hotspot_click_feedback_incorrect');
   }
}
this.position_px_to_pct = function (e) {
   if (debug[0]) {
      console.log ('[position_px_to_pct] e:', e);
      console.log ('[position_px_to_pct] this:', this);
   }
   const $this = $ (this);
   const delay_calc = function () {
      const left_px = $this.position ().left;
      const top_px  = $this.position ().top;
      const container_width  = $this.parent ().width ();
      const container_height = $this.parent ().height ();
      const left_pct = 100.0 * left_px/container_width;
      const top_pct  = 100.0 * top_px /container_height;
      $this.css ({left: left_pct.toFixed (1) + '%',
                  top:  top_pct .toFixed (1) + '%'});
   }
   setTimeout (delay_calc, 100);
}
this.discard_hotspot_edits = function () {
   if (debug[0]) {
      console.log ('[discard_hotspot_edits] hotspot_newest_version:', hotspot_newest_version, ', hotspot_revert_version:', hotspot_revert_version);
      console.log ('[discard_hotspot_edits] current_hotspot_no:', current_hotspot_no);
   }
   if (hotspot_edit_mode) {
      turn_off_previous_hotspot_edit_mode ();
      $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('rwizard_display_none_important');
      qw.hotspot_editing_menu_all_active ();
   }
   if (hotspot_revert_version != 0 && hotspot_newest_version > 0) {
      hotspot_restore_version (0);
   }
   hotspot_revert_version = -1;
   hotspot_newest_version = -1;
   hotspot_saved_images   = [];
   if (hotspot_saved_style_image) {
      const width  = hotspot_style_ctx.canvas.width;
      const height = hotspot_style_ctx.canvas.height;
      const imageData  = hotspot_style_ctx.getImageData (0, 0, width, height);
      var   data = imageData.data;
      const len = data.length;
      for (var i=0; i<len; i++) {
         data[i] = hotspot_saved_style_image[i];
      }
      hotspot_style_ctx.putImageData (imageData, 0, 0);
      const $label1 = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot1')
      const $label  = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
      if ($label1.length) {
         $label1[0].outerHTML = hotspot_saved_style_label1;
      }
      if ($label.length) {
         $label[0].outerHTML  = hotspot_saved_style_label;
      }
      hotspot_saved_style_image = '';
   }
   hotspot_image_stack_el.style.cursor = '';
   $ ('#hotspot_editing_menu').hide ();
   $ ('#hotspot_diagram_options_menu').show ();
   $ ('#quiz_components_menu_overlay').hide ();
   $hotspot_image_stack.resizable ('enable');
   $hotspot_image_stack.find ('div.ui-resizable-se').not ('div.rdgm_rectlipse').removeClass ('rwizard_display_none_important');
   editing_hotspot_f = false;
   new_hotspot_f     = false;
   hotspot_deleted_f = false;
   $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('rwizard_display_none_important');
   if (hotspot_label_deleted_f) {
      $hotspot_image_stack
         .find        ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
         .removeClass ('rdgm_hotspot_deleted');
      hotspot_label_deleted_f = false;
   }
}
this.delete_hotspot = function (delete_label_f) {
   if (debug[0]) {
      console.log ('[delete_hotspot] current_hotspot_no:', current_hotspot_no);
   }
   turn_off_previous_hotspot_edit_mode ();
   qw.init_hotspot_image_canvas ();
   const ctx       = qw.questions_cards[i_question].ctx;
   const i_width   = ctx.canvas.width;
   const i_height  = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data      = imageData.data;
   const p32       = new Uint32Array (data.buffer);
   hotspot_saved_images[0] = [...data];
   const r_obj = get_original_hotspot_image_data (i_width, i_height);
   const orig_p32 = r_obj.orig_p32;
   var hotspot_style_layer_img_src_f = false;
   if (typeof qw.questions_cards[i_question].hotspot_style_layer_img_src_f
                                                               == 'undefined') {
      [$hotspot_style_canvas, hotspot_style_ctx, hotspot_style_layer_img_src_f]
                                = init_hotspot_style_canvas (i_width, i_height);
   }
   if (hotspot_style_layer_img_src_f) {
      var hotspot_style_imageData = hotspot_style_ctx.getImageData(0, 0, i_width, i_height);
      var hotspot_style_p32       = new Uint32Array (hotspot_style_imageData.data.buffer);
   }
   const cur_r = current_hotspot_color.r;
   const cur_g = current_hotspot_color.g;
   const cur_b = current_hotspot_color.b;
   const n_pixels = i_width * i_height;
   for (var i=0; i<n_pixels; i++) {
      const idx = i << 2;
      const a = data[idx + 3];
      if (a == rdgm_.hotspot_alpha_value) {
         const r = data[idx];
         const g = data[idx + 1];
         const b = data[idx + 2];
         if (rgb_same (r, cur_r) && rgb_same (g, cur_g) && rgb_same (b, cur_b)) {
            p32[i] = orig_p32[i];
            if (hotspot_style_layer_img_src_f) {
               hotspot_style_p32[i] = 0;
            }
         }
      }
   }
   ctx.putImageData (imageData, 0, 0);
   if (hotspot_style_layer_img_src_f) {
      hotspot_style_ctx.putImageData (hotspot_style_imageData, 0, 0);
      hotspot_style_changes_f = true;
   }
   hotspot_deleted_f = true;
   $ ('button#hotspot_editing_menu_done_save').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
   if (delete_label_f) {
      $hotspot_image_stack
         .find     ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no)
         .addClass ('rdgm_hotspot_deleted');
      hotspot_label_deleted_f = true;
   }
}
function get_original_hotspot_image_data (i_width, i_height) {
   if (debug[0]) {
      console.log ('[get_original_hotspot_image_data] i_width:', i_width, ', i_height:', i_height);
   }
   const canvas_class = 'rdgm_tmp_canvas-rdgm' + i_rdgm + '-q' + i_question;
   var $orig_image_canvas = $ ('canvas.' + canvas_class);
   var new_f = false;
   if (! $orig_image_canvas.length) {
      new_f = true;
      $ ('canvas.rdgm_tmp_canvas').remove ();
      $ ('body').append ('<canvas class="' + canvas_class + '" width="' + i_width + '" height="' + i_height + '"></canvas>');
      $orig_image_canvas = $ ('canvas.' + canvas_class);
   }
   const orig_image_canvas_el = $orig_image_canvas[0];
   var   orig_image_ctx       = orig_image_canvas_el.getContext ('2d');
   if (new_f) {
      const orig_img = $hotspot_image_stack.find ('img.rdgm_layer0')[0];
      orig_image_ctx.drawImage (orig_img, 0, 0, i_width, i_height);
   }
   const orig_imageData  = orig_image_ctx.getImageData(0, 0, i_width, i_height);
   const orig_image_data = orig_imageData.data;
   const orig_p32        = new Uint32Array (orig_image_data.buffer);
   if (debug[0]) {
      console.log ('[get_original_hotspot_image_data] orig_image_data.length:', orig_image_data.length);
   }
   return {orig_image_data: orig_image_data, orig_p32: orig_p32};
}
function discard_edit () {
   var msg;
   var $rwizard_shortcodes = $ ('#rwizard_shortcodes');
   if ($rwizard_shortcodes.length && $rwizard_shortcodes.is (':visible')) {
      msg = 'Discard changes? (includes any made in Wizard as well as here!)';
   } else {
      msg = 'Discard changes? (no save)';
   }
   if (confirm (msg)) {
      qw.hide_editing_menus ();
      $ ('#rdgm_register_qqs_dialog_box').hide ();
      $ ('#rdgm_register_qqs_login').hide ();
      $ ('#rdgm_register_qqs_main').hide ();
      remove_rwizard_editors ();
      if (wp_editing_page_f) {
         rdgm_edit.remove_bookmarks ();
         var ed = rdgm_edit.rdgm_edit_tinymce_ed;
         rdgm_edit.rdgm_edit_tinymce_ed = '';
         rdgm_edit.rwizard_b = false;
         rdgm_edit.show_main_menu (ed, true);
      } else if (typeof (maker_id) != 'undefined' && maker_id
                                                         && ! new_rdgm_deck_f) {
         if (shortcode_ed) {
            shortcode_ed.destroy ();
            shortcode_ed = '';
         }
         $ ('#rwizard_shortcodes').html ('').hide ();
         $ ('div#rwizard_wrapper').show ();
         $ ('a.rwizard_view_edit_shortcodes').show ();
         $ ('a.rwizard_exit_view_edit_shortcodes').hide ();
         var htm =   '<div class="rdgm_wrapper qdeck_wrapper rdgm_shortcodes_hidden">'
                   +    rwizard_rdgm_deck_text
                   + '</div>';
         const selector = '#qxizard_qxiz_deck_div'.replace (/x/g, 'w');
         $ (selector).html (htm);
         if (rdgm_deck == 'rdgm') {
            rdgm_.rwizard_b = false;
            rdgm_.rdgm_init (true);
         } else {
            qcard_.rwizard_b = false;
            qcard_.set_deckdata (i_rdgm, 'click_flip_b', true);
            qcard_.qdeck_init (true);
         }
      }
      if (! wp_editing_page_f) {
         $ (window).off ('beforeunload');
      }
      $dialog_rwizard.dialog ('close');
   }
}
function rwizard_save_and_exit () {
   if (editing_hotspot_f) {
      alert ('Please either Cancel/discard or save hotspot edits');
      return;
   }
   setTimeout (rwizard_save_and_exit1, 150);
}
function rwizard_save_and_exit1 () {
   var $rwizard_shortcodes = $ ('#rwizard_shortcodes');
   if (rdgm_deck == 'rdgm') {
      if (n_questions == 0) {
         alert ('You haven\'t added any questions, yet');
         return false;
      }
      if (spotmap_settings_change_f) {
         const ok_f = update_spotmap_for_settings_change ();
         if (! ok_f) {
            return false;
         }
         const $canvas = $hotspot_image_stack.find ('canvas.layer0_edited');
         set_spotmap_attributes ($canvas);
      }
      var new_text = '';
      if ($rwizard_shortcodes.length && $rwizard_shortcodes.is (':visible')) {
         new_text = $ ('#rwizard_shortcodes').html ();
      } else {
         update_hotspot_diagrams_question_text ();
         new_text = rdgm_shortcodes_text (true);
      }
      rdgm_.set_rdgmdata (-1, 'errmsgs', '[]');
      rdgm_.process_rdgm_pair (new_text, i_rdgm, false);
      for (var ii_question=0; ii_question<n_questions; ii_question++) {
         var question = qw.questions_cards[ii_question];
         if (question.type == 'multiple_choice') {
            if (question.n_choices == 1 ) {
               qw.errmsgs.push ('Multiple-choice question has only one answer-choice (question ' + (i_question + 1) + ')');
            }
         }
      }
   } else {
      if (n_questions == 0) {
         alert ('You haven\'t added any cards, yet');
         return false;
      }
      var new_text = '';
      if ($rwizard_shortcodes.length && $rwizard_shortcodes.is (':visible')) {
         new_text = $ ('#rwizard_shortcodes').html ();
      } else {
         new_text = deck_shortcodes_text (true);
      }
      qcard_.set_deckdata (-1, 'errmsgs', '[]');
      qcard_.process_qdeck_pair (new_text, i_rdgm, false);
   }
   if (qw.errmsgs.length) {
      var s = qw.errmsgs.length > 1 ? 's' : '';
      var errmsgs = qw.errmsgs.join ('\n');
      errmsgs = errmsgs.replace (/(rdgm|qdeck):\s*[0-9]+[,\s]*/g, '');
      var ok_f = confirm (  'Error' + s + ' found:\n\n'
                          + errmsgs + '\n\n'
                          + 'Proceed anyway? (hit cancel to go back and fix first)');
      qw.errmsgs = '';
      if (! ok_f) {
         return false;
      }
   }
   qw.hide_editing_menus ();
   $ ('#rdgm_register_qqs_dialog_box').hide ();
   $ ('#rdgm_register_qqs_login').hide ();
   $ ('#rdgm_register_qqs_main').hide ();
   remove_rwizard_editors ();
   if (wp_editing_page_f) {
      var ed = rdgm_edit.rdgm_edit_tinymce_ed;
      var current_html = rdgm_edit.rwizard_update_edit_area (ed, new_text, new_rdgm_deck_f);
      $dialog_rwizard.dialog ('close');
      rdgm_edit.rdgm_edit_tinymce_ed = '';
      rdgm_edit.rwizard_b = false;
      if (debug[0]) {
         console.log ('[rwizard_save_and_exit] rdgm_edit.gutenberg_f:', rdgm_edit.gutenberg_f);
      }
      if (! rdgm_edit.gutenberg_f) {
         rdgm_edit.show_main_menu (ed, true);
      }
   } else {
      $dialog_rwizard.dialog ('close');
      if (shortcode_ed) {
         shortcode_ed.destroy ();
         shortcode_ed = '';
      }
      $ ('#rwizard_shortcodes').html ('').hide ();
      $ ('div#rwizard_wrapper').show ();
      $ ('a.rwizard_view_edit_shortcodes').show ();
      $ ('a.rwizard_exit_view_edit_shortcodes').hide ();
      if (typeof (maker_id) != 'undefined' && maker_id) {
         if (new_rdgm_deck_f) {
            $ (window).off ('beforeunload');
            go_to_dialog_create_page (new_text);
         } else {
            if (rdgm_deck == 'rdgm') {
               rdgm_.rwizard_b = false;
            } else {
               qcard_.rwizard_b = false;
               qcard_.set_deckdata (i_rdgm, 'click_flip_b', true);
            }
            go_to_create_page (new_text, rwizard_rdgm_deck_text, rwizard_page);
         }
      } else {
         $ (window).off ('beforeunload');
         go_to_login (new_text);
      }
   }
}
function go_to_login (new_text) {
   var f = document.forms.go_to_login_form;
   f.new_text.value = new_text;
   f.swhs.value     = 'rdgm' == 'rdgm' ? 1 : '';
   f.submit ();
}
function go_to_create_page (new_text, prev_text, rwizard_page) {
   var f = document.forms.go_to_create_page_form;
   if (debug[0]) {
      console.log ('[go_to_create_page] rwizard_page: ', rwizard_page);
   }
   f.new_text.value = new_text;
   f.swhs.value     = 'rdgm' == 'rdgm' ? 1 : '';
   if (rwizard_page) {
      f.page.value      = rwizard_page;
      if (qw.dataset_b) {
         f.prev_text.value = prev_text;
         f.dataset_f       = 1;
      }
   }
   f.submit ();
}
function go_to_dialog_create_page (new_text) {
   var f = document.forms.go_to_dialog_create_page_form;
   f.new_text.value = new_text;
   f.swhs.value     = 'rdgm' == 'rdgm' ? 1 : '';
   if (debug[0]) {
      console.log ('[go_to_dialog_create_page] f.new_text.value: ', f.new_text.value);
   }
   f.submit ();
}
function go_to_update_page (new_text, rwizard_page) {
   var f = document.forms.go_to_create_page_form;
   f.new_text.value = new_text;
   f.submit ();
}
function add_update_attributes (attributes, attr, value) {
   if (! attributes) {
      attributes = '';
   }
   var re = new RegExp (attr + '\\s*=\\s*"[^"]*"');
   var new_attr_value = attr + '="' + value + '"';
   if (attributes.match (attr)) {
      if (value == 'rm') {
         attributes = trim (attributes.replace (re, ''));
      } else {
         attributes = attributes.replace (re, new_attr_value);
      }
   } else {
      if (value != 'rm') {
         attributes += ' ' + new_attr_value;
      }
   }
   if (debug[0]) {
      console.log ('[add_update_attributes] attributes:', attributes);
   }
   return attributes;
}
this.set_rwizard_data = function (variable, value) {
   if (debug[0]) {
      console.log ('[set_rwizard_data] variable:', variable, ', value:', value);
   }
   var code;
   if (value !== '' && parseInt (value) == value) {
      code = variable + ' = ' + value;
   } else {
      code = variable + ' = "' + addSlashes (value) + '"';
   }
   eval (code);
}
function set_selectedIndex (select_el, value, int_f) {
   var n_opts = select_el.options.length;
   for (var i_opt=0; i_opt<n_opts; i_opt++) {
      var option_value = select_el.options[i_opt].value;
      if (int_f) {
         option_value = parseInt (option_value);
      }
      if (option_value == value) {
         select_el.selectedIndex = i_opt;
         break;
      }
   }
}
function addSlashes (str) {
   return (str + '').replace(/[\\"']/g, '\\$&').replace (/\n/g, '\\n').replace(/\u0000/g, '\\0');
}
};
rwizard_f.call (rwizard);
rdgm_combobox_callback = rwizard.unit_topic_selected;
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function ($) {
	var pluses = /\+/g;
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}
	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}
	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}
	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}
	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function (key, value, options) {
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}
			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
		var result = key ? undefined : {};
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
			if (key && key === name) {
				result = read(cookie, value);
				break;
			}
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};
}));
/*
Usage: CryptoJS.SHA3 ('text');
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);
