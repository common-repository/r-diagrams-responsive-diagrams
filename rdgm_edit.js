if (! window.console) {
   window.console = {log: function(){} };
}
rdgm_edit = {};
var rdgm_editf = function () {
var qname = 'rdgm_edit';
var debug = [];
debug[0]  = false;     // general.
debug[1]  = false;     // Label checks.
debug[2]  = false;     // Preliminary checks.
debug[3]  = false;     // Register/datasets.
debug[4]  = false;     // Reposition targets.
debug[5]  = false;     // parse_html_block () brief.
debug[10] = false;     // parse_html_block () verbose.
var $ = jQuery;
this.$edit_area;
this.label_border_class = '';
this.rdgm_button_b;
this.swhs_button_b;
this.rdgm_deck_attributes;
this.question_attributes;
this.rdgm_deck;
var q = this;
var editing_page_selector;
var edit_area_selector;
var $rdgm_edit_area;
var $rdgm_edit_main_menu_feedback;
var expand_rdgm_edit_menu_items_b = false;
var errmsgs = [];
var n_rdgmzes = 0;
var no_q_code_b;
var any_labeled_diagram_questions_b;
this.gutenberg_f = false;
this.tinymce_ed = '';
this.rdgm_edit_tinymce_ed = '';
this.dataset_b;
var datasets_used;
var waiting_for_label_click_b = false;
var label_will_have_multiple_targets_b = false;
var add_delete_label_f = false;
this.target_must_be_text_f = false;
var edit_label_feedback = '';
this.waiting_for_target_select_b = false;
var waiting_for_target_to_delete_click_b = false;
var decoy_target_b = false;
var $rdgm_edit_question;
this.el_label_div = null;
this.assoc_id = '';
var bstyles = ['dotted', 'dashed', 'solid'];
var bcolors = ['red', 'magenta', 'blue', 'aqua', 'black', 'silver'];
var horizontal_margin_adjust = 4;
var vertical_margin_adjust   = 4;
var head = '';
var jjax_script_no = 0;
this.maker_logged_in_b = false;
var n_rdgmzes;
var n_decks;
var hide_new_account_info_timeout;
var register_qq3_timeout;
var register_qq3_response_f;
var qq_dataset;
var dataset_save_no_use_f;
this.rwizard_b         = false; // Indicates interactive editing with rwizard.js.
this.wp_editing_page_f = true;  // Indicates whether on WordPress or not.
var $rwizard_dialog;
var waiting_for_quiz_deck_click = '';
var current_html;
var current_rdgm_deck_html;
var qbookmark;
var qbookmark_id;
$ (document).ready (function () {
   if (debug[0]) {
      console.log ('[rdgm_edit.js > document.ready]');
   }
   delay_check = function () {
      check_maker_session_id ('no_action');
   }
   setTimeout (delay_check, 500);
   const delay_ed = function () {
      if  ($ ('iframe#content_ifr, iframe#wpb_tinymce_content_ifr').length == 0) {
         const ed = tinyMCE.activeEditor;
         if (debug[0]) {
            console.log ('[rdgm_edit.js > document.ready] ed:', ed);
         }
         if (ed) {
            q.gutenberg_f = true;
            const $ed_targetElm = $ (ed.targetElm);
            if ($ed_targetElm.hasClass ('wp-block-freeform')
                || $ed_targetElm.hasClass ('wp-block-r_diagrams-blocks-editable')) {
               const htm = ed.getContent ();
               if (htm.indexOf ('[rdgm') != -1 || htm.indexOf ('[qdeck') != -1) {
                  q.show_main_menu (ed, true);
               }
            }
         }
      }
   }
   setTimeout (delay_ed, 500);
});
this.no_action = function () {
}
this.show_main_menu = function (ed, local_rdgm_button_b, local_swhs_button_b,
                                                            no_remove_mce_ids) {
   if (debug[0]) {
      console.log ('[show_main_menu] local_rdgm_button_b:', local_rdgm_button_b);
      console.log ('[show_main_menu] local_swhs_button_b:', local_swhs_button_b);
   }
   if (! local_rdgm_button_b && ! local_swhs_button_b) {
      if (rdgm_edit_params.r_diagrams_active_f && rdgm_edit_params.swinging_hotspot_active_f) {
         local_rdgm_button_b = true;
      } else if (rdgm_edit_params.r_diagrams_active_f) {
         local_rdgm_button_b = true;
      } else {
         local_swhs_button_b = true;
      }
   }
   q.rdgm_button_b = local_rdgm_button_b;
   q.swhs_button_b = local_swhs_button_b;
   if (debug[0]) {
      console.log ('[show_main_menu] ed:', ed);
      console.log ('[show_main_menu] q.rwizard_b:', q.rwizard_b, ', q.rdgm_button_b:', q.rdgm_button_b, ', q.swhs_button_b:', q.swhs_button_b);
   }
   q.permalink = q.get_permalink ();
   if (q.rwizard_b) {
      editing_page_selector = '#rwizard_result';
   } else {
      editing_page_selector = '#wp-content-editor-container';
      if ($ (editing_page_selector).length == 0) {
         editing_page_selector = 'body';
      }
   }
   if (typeof (rdgm_edit_params) == 'undefined') {
      q.init_rdgm_edit_params ();;
   } else {
      if (debug[0]) {
         console.log ('[show_main_menu] rdgm_edit_params:', rdgm_edit_params);
      }
   }
   q.tinymce_ed = ed;
   if (! q.rdgm_edit_tinymce_ed) {
      q.rdgm_edit_tinymce_ed = ed;
   }
   if (debug[0]) {
      var msec = new Date ().getTime ();
      console.log ('[show_main_menu] msec:', msec);
      console.log ('[show_main_menu] ed:', ed);
   }
   if (rdgm_edit_params.update_msg) {
      alert (rdgm_edit_params.update_msg);
      rdgm_edit_params.update_msg = '';
      var post_id = $ ('#post_ID').val ();
      var data = {action:  'erase_update_msg',
                  post_id: post_id};
      $.ajax ({
         type:    'POST',
         url:     ajaxurl,
         data:    data
      });
   }
   var ok_f;
   if (q.rwizard_b) {
      ok_f = true;
      q.$edit_area = $ ('#rwizard_result');
   } else {
      ok_f = false;
      edit_area_selector = 'iframe#content_ifr, iframe#wpb_tinymce_content_ifr';
      if ($ (edit_area_selector).length) {
         if (debug[0]) {
            console.log ('[show_main_menu] $ (edit_area_selector):', $ (edit_area_selector));
         }
         if ($ (edit_area_selector).is (':visible')) {
            q.$edit_area = $ (edit_area_selector).contents ().find ('body');
            if (q.$edit_area.length > 0) {
               ok_f = true;
            }
         }
      } else {
         q.gutenberg_f = true;
         var $ed_targetElm = $ (ed.targetElm);
         if ($ed_targetElm.hasClass ('wp-block-freeform')
             || $ed_targetElm.hasClass ('wp-block-r_diagrams-blocks-editable')) {
            q.$edit_area = $ed_targetElm;
            ok_f = true;
            edit_area_selector = '#' + ed.targetElm.id;
            if (debug[0]) {
               console.log ('[show_main_menu] edit_area_selector:', edit_area_selector);
            }
            var close_main_menu = function (e) {
               if (debug[0]) {
                  console.log ('[show_main_menu > close_main_menu] e:', e);
                  console.log ('[show_main_menu > close_main_menu] q.set_no_gutenberg_blur_f:', q.no_gutenberg_blur_f);
               }
               if (e.type == 'mousedown') {
                  var $wp_block = $ (e.target).parents ('div.wp-block');
                  if (debug[0]) {
                     console.log ('[show_main_menu > close_main_menu] $wp_block:', $wp_block);
                  }
                  $wp_block.off ('mousedown', close_main_menu);
               }
               var delay_exit = function () {
                  if (debug[0]) {
                     console.log ('[show_main_menu > close_main_menu > delay_exit] q.set_no_gutenberg_blur_f:', q.no_gutenberg_blur_f);
                  }
                  if (! q.no_gutenberg_blur_f) {
                     q.exit_main_menu ();
                  }
               }
               setTimeout (delay_exit, 20);
            }
            if ($ed_targetElm.hasClass ('wp-block-freeform')) {
               var selected_block_id = $ (ed.targetElm).parents ('div.wp-block')[0].id;
               if (debug[0]) {
                  console.log ('[show_main_menu] selected_block_id:', selected_block_id);
               }
               $ ('div.wp-block').each (function () {
                  var block_id = this.id;
                  if (block_id) {
                     if (debug[0]) {
                        console.log ('[show_main_menu] block_id:', block_id);
                     }
                     if (block_id != selected_block_id) {
                        var $this = $ (this);
                        $this.off ('mousedown', close_main_menu)
                             .on  ('mousedown', close_main_menu);
                     }
                  }
               });
               $ ('div.edit-post-sidebar, div.edit-post-header')
                                            .off ('mousedown', close_main_menu)
                                            .on  ('mousedown', close_main_menu);
            } else {
               ed.off ('blur',  close_main_menu);
               ed.on  ('blur',  close_main_menu);
            }
            ed.focus ();
            /*
            var rdgm_ed_focus = function () {
            }
            ed.off ('focus', rdgm_ed_focus);
            ed.on  ('focus', rdgm_ed_focus);
            */
         }
      }
   }
   if (ok_f) {
      if (! q.rdgm_button_b && ! q.swhs_button_b) {
         var $contains_rdgm  = q.$edit_area.find ('*:contains("[rdgm")');
         var $contains_qdeck = q.$edit_area.find ('*:contains("[qdeck")');
         if (debug[0]) {
            console.log ('[show_main_menu] $contains_rdgm:', $contains_rdgm, ', $contains_qdeck:', $contains_qdeck);
         }
         if ($contains_rdgm.length == 0 && $contains_qdeck.length == 0) {
            return false;
         }
      }
      var $contains_dataset = q.$edit_area.find ('*:contains(" dataset=")');
      q.dataset_b = $contains_dataset.length;
      if (debug[0]) {
         console.log ('[show_main_menu] $contains_dataset:', $contains_dataset);
         console.log ('[show_main_menu] q.dataset_b:', q.dataset_b);
      }
      if (! q.rwizard_b && ! q.maker_logged_in_b) {
         check_maker_session_id ('show_main_menu2');
      } else {
         q.show_main_menu2 (no_remove_mce_ids);
      }
   } else {
      if (q.rdgm_button_b || q.swhs_button_b) {
         console.log ('[show_main_menu] ed:', ed);
         if (q.gutenberg_f) {
            alert ('Could not find editor block.');
         } else {
            alert ('Could not find editing window.  You need to be editing a page or post in Visual mode.');
         }
         return false;
      }
   }
}
this.show_main_menu2 = function (no_remove_mce_ids) {
   q.set_no_gutenberg_blur ();
   var $existing_menu = $ ('#rdgm_edit_main_menu');
   if (debug[0]) {
      console.log ('[show_main_menu2] $existing_menu:', $existing_menu, ', q.dataset_b:', q.dataset_b);
   }
   if ($existing_menu.length) {
      $existing_menu.remove ();
   }
   if (! q.swhs_button_b) {
      var mm = [];
      mm.push ('<div id="rdgm_edit_main_menu" class="rdgm_edit_main_menu" style="height: auto;" onclick="rdgm_edit.set_no_gutenberg_blur ()" >');
      const icon = q.rdgm_button_b ? 'icon_rdgm32x32.png' : 'icon_swhs.svg';
      mm.push (   '<div id="rdgm_edit_main_menu_header" class="rdgm_edit_main_menu_header">');
      mm.push (      '<img src="' + rdgm_edit_params.url + 'images/' + icon + '" class="icon_rdgm" />');
      mm.push (      '<div class="rdgm_edit_main_menu_title">');
      if (q.rwizard_b) {
         mm.push (      'Labeled diagram ' + T ('editing menu'));
      } else {
         mm.push (      'Swinging Hotspot - ' + T ('editing menu'));
      }
      mm.push (      '</div>');
      mm.push (      '<img src="' + rdgm_edit_params.url + 'images/icon_exit_red.png" class="icon_main_menu_exit" onclick="rdgm_edit.exit_main_menu ()" />');
      mm.push (   '</div>');
      mm.push (   '<div id="rdgm_edit_main_menu_items">');
      if (! q.rwizard_b) {
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rwizard_new_or_edit_existing ()" title="Create or edit a quiz or deck - interactive GUI">');
         mm.push (      'Swinging Hotspot interactive editing wizard');
         mm.push (   '</div>');
         if (! expand_rdgm_edit_menu_items_b) {
            mm.push ('<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.expand_rdgm_edit_menu_items ()" title="Show options for Swinging Hotspot shortcodes">');
            mm.push (   'Edit shortcodes directly - labeled diagram options');
            mm.push ('</div>');
         }
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rdgm_register_qqs (\'qq\')" title="Options for recording student scores">');
         mm.push (      'Enable progress recording for quizzes/flashcard decks');
         mm.push (   '</div>');
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rdgm_register_qqs (\'dataset\')" title="Use a set of questions from the database in a quiz/deck, or save questions to database">');
         mm.push (      'Quizzes/decks &ndash; use &ldquo;dataset&rdquo; or save as &ldquo;dataset&rdquo;');
         mm.push (   '</div>');
         if (rdgm_edit_params.rdgm_syntax_check_manual_only) {
            mm.push ('<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.check_syntax_save_dataset_questions ()" title="Manual-only check/save set in Swinging Hotspot options">');
            mm.push (   'Check shortcode syntax, save dataset questions');
            mm.push ('</div>');
         }
         if (expand_rdgm_edit_menu_items_b) {
            mm.push ('<hr>');
            mm.push ('<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.create_target1 (0, 0)" title="Create a target &ldquo;drop zone&rdquo; for a label - click here, then click label">');
            mm.push (   'Create target for a label');
            mm.push ('</div>');
            mm.push ('<div id="create_another_target_same_label" class="rdgm_edit_main_menu_item_disabled" onclick="rdgm_edit.create_target_for_same_label ()" title="The previously-selected label may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
            mm.push (   'Create another target for the <b>same</b> label');
            mm.push ('</div>');
         }
      }
      if (q.rwizard_b) {
         mm.push (      '<div class="rdgm_edit_main_menu_item_inactive">');
         mm.push (         'Labels:');
         mm.push (         '<input type="radio" name="labels_position" class="labels_right  rwizard_shift_icon" onclick="rwizard.set_labels_position (\'right\')" />');
         mm.push (         'right &ensp;');
         mm.push (         '<input type="radio" name="labels_position" class="labels_top    rwizard_shift_icon" onclick="rwizard.set_labels_position (\'top\')" />');
         mm.push (         'top &ensp;');
         mm.push (         '<input type="radio" name="labels_position" class="labels_left   rwizard_shift_icon" onclick="rwizard.set_labels_position (\'left\')" />');
         mm.push (         'left &ensp;');
         mm.push (         '<input type="radio" name="labels_position" class="labels_bottom rwizard_shift_icon" onclick="rwizard.set_labels_position (\'bottom\')" />');
         mm.push (         'bottom');
         mm.push (      '</div>');
         mm.push (      '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.create_target1 (0, 1)" title="Add a label to or delete a label from the list of labels the user will place on the image or text.">');
         mm.push (         'Add or delete a label/target');
         mm.push (      '</div>');
         mm.push (      '<div>');
         mm.push (         '<div class="rdgm_edit_main_menu_item_inactive rdgm_edit_inline_block">');
         mm.push (            'Enter/edit feedback for label when placed ');
         mm.push (         '</div>');
         mm.push (         '<div class="rdgm_edit_main_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rdgm_edit.edit_label_feedback (\'correct\')" title="Show feedback given when this label is correctly placed.">');
         mm.push (            ' <b>correctly</b> ');
         mm.push (         '</div>');
         mm.push (         '<div class="rdgm_edit_main_menu_item_inactive rdgm_edit_inline_block">');
         mm.push (            ' or ');
         mm.push (         '</div>');
         mm.push (         '<div class="rdgm_edit_main_menu_item rdgm_edit_inline_block rdgm_edit_link" onclick="rdgm_edit.edit_label_feedback (\'incorrect\')" title="Show feedback given when this label is incorrectly placed.">');
         mm.push (            ' <b>incorrectly</b> ');
         mm.push (         '</div>');
         mm.push (      '</div>');
      }
      if (q.rwizard_b || expand_rdgm_edit_menu_items_b) {
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.create_target1 (1, 0)" title="Select a label that may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
         mm.push (      'Create another target for');
         mm.push (      '<span id="main_menu_different_label">');
         mm.push (         'an <b>existing</b>');
         mm.push (      '</span>');
         mm.push (      'label');
         mm.push (   '</div>');
      }
      if (q.rwizard_b) {
         mm.push (   '<div id="create_another_target_same_label" class="rdgm_edit_main_menu_item" onclick="rdgm_edit.create_target_for_same_label ()" style="display: none;" title="The label you selected may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
         mm.push (      'Create another target for this label');
         mm.push (   '</div>');
      }
      if (q.rwizard_b || expand_rdgm_edit_menu_items_b) {
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.create_decoy_target ()" title="Create a target &ldquo;drop zone&rdquo; that will not accept a label">');
         mm.push (      'Create a decoy target');
         mm.push (   '</div>');
         mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.delete_target ()" title="Delete a target &ldquo;drop zone&rdquo; &ndash; though not its underlying image.">');
         mm.push (      'Delete a target')
         mm.push (   '</div>');
      }
      mm.push (   '</div>');  // End rdgm_edit_menu_items.
      mm.push (   '<div class="rdgm_edit_main_menu_feedback"></div>');
      mm.push ('</div>');
      $ (editing_page_selector).append (mm.join ('\n'));
      $rdgm_edit_main_menu_feedback = $ ('div.rdgm_edit_main_menu_feedback');
      if (q.rwizard_b) {
         var top_left_right_bottom = '';
         if (q.question_attributes) {
            top_left_right_bottom = rdgm_utils.get_attr (q.question_attributes, 'labels');
         }
         if (! top_left_right_bottom) {
            top_left_right_bottom = 'right';
         }
         $ ('input[name="labels_position"].labels_' + top_left_right_bottom)[0].checked = true;
      }
      if (q.dataset_b) {
         if (! q.maker_logged_in_b) {
            var login_msg = 'Note: if you want to add or edit dataset questions, please <b><a href="javascript: rdgm_edit.show_login ()">log in</a></b> in order to save them in the Swinging Hotspot database (which happens when you click the WordPress "Update" button)'
                            + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="jQuery (\'div.rdgm_edit_main_menu_feedback\').hide ()" />';
            $rdgm_edit_main_menu_feedback.html (login_msg).show ();
            $.removeCookie ('maker_session_id', {path: '/'});
         }
      }
      $ ('#rdgm_edit_main_menu').draggable ({handle: '#rdgm_edit_main_menu_header'});
   }
   if (q.rwizard_b) {
      q.create_rdgm_register_qqs_dialog_box (editing_page_selector);
   } else {
      q.create_rdgm_register_qqs_dialog_box ('body');
   }
   q.$edit_area.find ('div.rdgm_hotspot_label').each (function () {
      const $this = $ (this);
      if ($this.find ('div.rdgm_hotspot_label_handle').length == 0) {
         $this.append ('<div class="rdgm_hotspot_label_handle"></div>');
      }
   });
   if (q.rwizard_b) {
      var delay_reinit_dragging = function () {
         q.reinit_dragging (q.$edit_area);
      }
      setTimeout (delay_reinit_dragging, 500);
   } else {
      q.reinit_dragging (q.$edit_area);
   }
   if (! no_remove_mce_ids) {
      q.$edit_area.find ('.rdgm_editable, div.rdgm_hotspot_label').each (function () {
         if (this.id.substr (0,4) == 'mce_') {
            this.id = '';
         }
         $ (this).removeAttr ('contenteditable').removeClass ('mce-content-body');
      });
   }
   if (! q.rwizard_b) {
      const $hotspot_labels = q.$edit_area.find ('div.rdgm_hotspot_label');
      if ($hotspot_labels.length) {
         q.init_hotspot_diagram_labels ($hotspot_labels);
         $hotspot_labels.off ('dragstop');
         $hotspot_labels.on ('dragstop', rwizard.position_px_to_pct);
      }
      $hotspot_labels.each (function () {
         rwizard.get_or_correct_hotspot_feedback ($ (this));
      });
   }
   /*
   q.tinymce_ed.on ('ObjectSelected', function (e) {
      q.target_object_selected (e);
   });
   */
   q.tinymce_ed.on ('ObjectResized', function (e) {
      if (e.target.nodeName == 'IMG') {
         var $image = $ (e.target);
         var $image_wrapper = $image.parents ('[id^="rdgm_edit_img_wrapper"]');
         if (debug[0]) {
            console.log ('resized:', e.target);
            console.log ('width:', e.width, 'height:', e.height);
            console.log ('$image:', $image);
            console.log ('$image_wrapper:', $image_wrapper);
         }
         if ($image_wrapper.length) {
            var old_width  = $image_wrapper.width ();
            var old_height = $image_wrapper.height ();
            var width_factor  = e.width  / old_width;
            var height_factor = e.height / old_height;
            $image_wrapper.removeAttr ('data-mce-style').css ({width: e.width + 'px', height: e.height + 'px'});;
            $image_wrapper.find ('.rdgm_edit_target').each (function () {
               var position = $ (this).position ();
               var old_left = position.left;
               var old_top  = position.top;
               var new_left = old_left * width_factor;
               var new_top  = old_top  * height_factor;
               $ (this).css ({left: new_left + 'px', top: new_top + 'px'});
               if (debug[4]) {
                  console.log ('[on ObjectResized] old_left:', old_left, ', old_top:', old_top);
               }
            });
         }
      }
   });
   if ($ ('#bubbleBarWrapper').length == 0) {
      $ ('<div id="bubbleBarWrapper"></div>').appendTo ('body');
   }
   if (q.swhs_button_b) {
      q.rwizard_new_or_edit_existing ();
   }
};
this.init_hotspot_diagram_labels = function ($hotspot_labels) {
   q.$edit_area.find ('img.rdgm_layer0').css ({display: ''}).removeAttr ('data-mce-style');
   var $anywhere;
   if (q.rwizard_b) {
      $anywhere = $ ('div#dialog_rwizard');
   } else {
      $anywhere = q.$edit_area;
   }
   $anywhere.find ('div.rdgm_hotspot_label').each (function () {
      const $rdgm_hotspot_label = $ (this);
      $rdgm_hotspot_label.find ('div.hotspot_label_feedback').removeClass ('hotspot_label_feedback_show');
      $rdgm_hotspot_label.off ('click');
      $rdgm_hotspot_label.on ('click', function (e) {
         if (debug[0]) {
            console.log ('[init_hotspot_diagram_labels > click] e:', e);
         }
         e.stopPropagation ();
         if (! q.rwizard_b) {
            $rdgm_hotspot_label.find ('div.rdgm_hotspot_label_tooltip').remove ();
            $rdgm_hotspot_label.off ('mouseenter');
            $rdgm_hotspot_label.find ('div.hotspot_label_feedback').each (function () {
               const $hotspot_label_feedback = $ (this);
               $hotspot_label_feedback.on ('click', function (e) {
                  e.stopPropagation ();
               });
               if ($hotspot_label_feedback.hasClass ('hotspot_label_feedback_show')) {
                  $hotspot_label_feedback.removeClass ('hotspot_label_feedback_show');
               } else {
                  $hotspot_label_feedback.addClass ('hotspot_label_feedback_show');
               }
            });
         }
      });
      if (! q.rwizard_b) {
         const hotspot_label_tooltip_htm
            =  '<div class="rdgm_hotspot_label_tooltip" onclick="jQuery (this).remove ()">'
             +    'Click label to see/edit feedback (correct and incorrect) for this label.<br />'
             +    'Click label again to hide feedback'
             + '</div>';
         var hotspot_label_tooltip_timeout_id;
         $rdgm_hotspot_label.off ('mouseenter');
         $rdgm_hotspot_label.on ('mouseenter', function (e) {
            const delay_show = function () {
               $rdgm_hotspot_label.append (hotspot_label_tooltip_htm);
            }
            hotspot_label_tooltip_timeout_id = setTimeout (delay_show, 700);
         });
         $rdgm_hotspot_label.off ('mouseleave');
         $rdgm_hotspot_label.on ('mouseleave', function (e) {
            clearTimeout (hotspot_label_tooltip_timeout_id);
            $rdgm_hotspot_label.find ('div.rdgm_hotspot_label_tooltip').remove ();
         });
      }
   });
}
this.create_rdgm_register_qqs_dialog_box = function (local_editing_page_selector) {
   if ( $ ('#rdgm_register_qqs_dialog_box').length == 0) {
      var ddiv = [];
      const icon = q.rdgm_button_b ? 'icon_rdgm32x32.png' : 'icon_swhs.svg';
      ddiv.push ('<div id="rdgm_register_qqs_dialog_box">');
      ddiv.push (   '<div id="rdgm_register_qqs_header" class="rdgm_edit_main_menu_header">');
      ddiv.push (      '<img src="' + rdgm_edit_params.url + 'images/' + icon + '" class="icon_rdgm" />');
      ddiv.push (      '<div class="rdgm_edit_main_menu_title">');
      ddiv.push (      '</div>');
      ddiv.push (      '<img src="' + rdgm_edit_params.url + 'images/icon_exit_red.png" class="icon_main_menu_exit" onclick="rdgm_edit.rdgm_exit_register_qqs ()" />');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="rdgm_register_qqs_login">');
      ddiv.push (      '<br />');
      if (! q.username) {
         if (typeof (document_rdgm_username) == 'undefined') {
            q.username = '';
         } else {
            q.username = document_rdgm_username;
         }
      }
      var mini_maker_f = q.username.substr (0, 10) == 'mini-maker';
      if (mini_maker_f) {
         ddiv.push (   '<b>Please confirm your login to <span id="enable_progress_save_dataset"><span></b>');
      } else {
         ddiv.push (   '<b>Swinging Hotspot administrative login</b>');
      }
      ddiv.push (      '<form action="nada" onSubmit="return rdgm_edit.login ()">');
      ddiv.push (      '<table border="0" align="center">');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td>');
      ddiv.push (               '<label for="rdgm_edit_username">'+ T ('User name') + '</label>');
      ddiv.push (            '</td>');
      var onfocus = 'onfocus="jQuery (\'#rdgm_register_qqs_login p.login_error\').css ({visibility: \'hidden\'})"';
      ddiv.push (            '<td>');
      ddiv.push (               '<input type="text" id="rdgm_edit_username" ' + onfocus + ' />');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td>');
      ddiv.push (               '<label for="rdgm_edit_password">'+ T ('Password') + '</label>');
      ddiv.push (            '</td>');
      ddiv.push (            '<td>');
      ddiv.push (               '<input type="password" id="rdgm_edit_password" />');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td colspan="2" align="center">');
      ddiv.push (               '<input type="submit" style="font-size: 120%" value="Login" />');
      ddiv.push (               '&emsp;');
      ddiv.push (               '<input type="button" style="font-size: 100%" value="Cancel" onclick="rdgm_edit.rdgm_exit_register_qqs ()" />');
      ddiv.push (               ' &emsp; ');
      if (! mini_maker_f) {
         ddiv.push (            '<a href="' + rdgm_edit_params.secure_server_loc + '/new_account" target="_blank">');
         ddiv.push (               'Create new account</a> <img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="new_account_info" onmouseenter="rdgm_edit.show_new_account_info ()" onmouseleave="rdgm_edit.hide_new_account_info ()">');
      }
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td colspan="2">');
      ddiv.push (               '<a href="' + rdgm_edit_params.server_loc + '/password_reset_request?m=1" class="rdgm_edit_smaller" target="_blank">');
      ddiv.push (                  'Forgot password?</a>');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (      '</table>\n');
      ddiv.push (      '</form>\n');
      ddiv.push (      '<p class="login_error">');
      ddiv.push (         T ('Incorrect administrative login. Please try again'));
      ddiv.push (      '</p>\n');
      ddiv.push (      '<div id="new_account_info">');
      ddiv.push (         'With a Swinging Hotspot administrative account you can get reports of your students&rsquo; quiz scores and use of flashcard decks.');
      ddiv.push (      '</div>');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="rdgm_register_qqs_user">');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="rdgm_register_qqs_main">');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="rdgm_register_qqs_return_to_wizard">');
      ddiv.push (      '<button onclick="rdgm_edit.rdgm_exit_register_qqs ()">');
      ddiv.push (         'Close / return to wizard');
      ddiv.push (      '</button>');
      ddiv.push (   '</div>');
      ddiv.push ('</div>');
      $ (local_editing_page_selector).append (ddiv.join ('\n'));
      rdgm_utils.init_hide_show_password ('#rdgm_edit_password');
      $ ('#rdgm_register_qqs_dialog_box').draggable ({handle: '#rdgm_register_qqs_header'});
   }
}
this.rdgm_edit_password_focus = function (el) {
   el.rdgm_pw = '';
   el.value = '';
   $ ('#rdgm_register_qqs_login p.login_error').css ({visibility: 'hidden'});
}
this.init_rdgm_edit_params = function () {
   var local_server_loc = get_rdgm_param ('server_loc');
   var admin = local_server_loc.indexOf ('admin') == -1 ? 'admin/' : '';
   rdgm_edit_params = {url:                get_rdgm_param ('url', './'),
                      server_loc:         get_rdgm_param ('server_loc', 'http://r_diagrams.com') + admin,
                      secure_server_loc:  get_rdgm_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/rdgm') + admin,
                      rdgm_syntax_check_manual_only:
                                          get_rdgm_param ('rdgm_syntax_check_manual_only'),
                     }
   if (debug[0]) {
      console.log ('[init_rdgm_edit_params] rdgm_edit_params:', rdgm_edit_params);
   }
}
this.reinit_dragging = function ($edit_area, update_diagram_html_f) {
   var $draggables;
   if (q.rwizard_b) {
      $draggables = $edit_area.find ('.rdgm_edit_target.ui-draggable, .hangman_label.ui-draggable, .rdgm_hotspot_label.ui-draggable');
   } else {
      $draggables = $edit_area.find ('.ui-draggable, .hangman_label');
   }
   var $resizables = $edit_area.find ('div.ui-resizable, div.rdgm_hotspot_label').not ('div.hotspot_image_stack');
   if (debug[0]) {
      console.log ('[reinit_dragging] $edit_area:', $edit_area);
      console.log ('[reinit_dragging] $draggables:', $draggables);
      console.log ('[reinit_dragging] $resizables:', $resizables);
   }
   $draggables.each (function () {
      if ($ (this).draggable ('instance')) {
         $ (this).draggable ('destroy');
      }
   });
   $draggables.draggable ();
   $draggables.removeAttr ('data-mce-style');
   $edit_area.find ('div.rdgm_hotspot_label').each (function () {
      if ($ (this).draggable ('instance')) {
         $ (this).draggable ('option', 'handle', 'div.rdgm_hotspot_label_handle');
      }
   });
   $resizables.each (function () {
      if ($ (this).resizable ('instance')) {
         $ (this).resizable ('destroy');
      }
   });
   $resizables.find ('div.ui-resizable-handle').remove ();
   $resizables.resizable ({
      resize: function (e, ui_obj) {
         if (debug[0]) {
            console.log ('[reinit_dragging > resize]: $ (this):', $ (this));
         }
         $ (this).css ({'margin-right': -(ui_obj.size.width + horizontal_margin_adjust) + 'px', 'margin-bottom': -(ui_obj.size.height + vertical_margin_adjust) + 'px'});
      }
   }).removeAttr ('data-mce-style');
   var $resizable_handles = $resizables.find ('div.ui-resizable-handle');
   if (debug[0]) {
      console.log ('[reinit_dragging] $resizable_handles:', $resizable_handles);
   }
   $resizable_handles.css ({'z-index': 105});
   if (update_diagram_html_f) {
      $draggables.off ('dragstop');
      $draggables.on ('dragstop', rwizard.update_diagram_html);
      $draggables.off ('resizestop');
      $resizables.on ('resizestop', rwizard.update_diagram_html);
   }
}
this.show_new_account_info = function () {
   clearTimeout (hide_new_account_info_timeout);
   $ ('#new_account_info').show ();
}
this.hide_new_account_info = function () {
   hide_new_account_info_timeout = setTimeout ("jQuery ('#new_account_info').hide ()", 2000);
}
this.set_no_gutenberg_blur = function () {
   q.no_gutenberg_blur_f = true;
   setTimeout (q.unset_no_gutenberg_blur, 100);
}
this.unset_no_gutenberg_blur = function () {
   q.no_gutenberg_blur_f = false;
}
this.exit_main_menu = function () {
   $ ('#rdgm_edit_main_menu').hide ();
   q.waiting_for_target_select_b        = false;
   waiting_for_label_click_b            = false;
   waiting_for_target_to_delete_click_b = false;
   label_will_have_multiple_targets_b   = false;
   add_delete_label_f                   = false;
   q.target_must_be_text_f              = false;
   edit_label_feedback                  = '';
   decoy_target_b                       = false;
   q.rdgm_exit_register_qqs ();
   if (q.rwizard_b) {
      q.exit_select_text_target ();
   }
}
this.expand_rdgm_edit_menu_items = function () {
   var ok_f = preliminary_label_checks ();
   if (ok_f) {
      expand_rdgm_edit_menu_items_b = true;
      q.show_main_menu2 ();
   }
}
this.create_target1 = function (multiple_targets_f, add_delete_f) {
   if (! q.rwizard_b && ! $ (edit_area_selector).is (':visible')) {
      alert (T ('Please select "Visual" mode to create a target/drop zone'));
      return;
   }
   setTimeout ('rdgm_edit.create_target2 (' + multiple_targets_f + ', ' + add_delete_f + ')', 100);
}
this.create_target2 = function (multiple_targets_f, local_add_delete_label_f) {
   if (debug[0]) {
      console.log ('[create_target2]: multiple_targets_f:', multiple_targets_f, ', local_add_delete_label_f:', local_add_delete_label_f);
   }
   if (waiting_for_target_to_delete_click_b) {
      q.exit_click_on_a_target ();
   }
   if (q.rwizard_b) {
      q.exit_select_text_target ();
   } else {
      var ok_f = preliminary_label_checks ();
      if (! ok_f) {
         return;
      }
   }
   var $rdgm_edit_imgs = q.$edit_area.find ('div.rdgm_edit_question img');
   if (debug[0]) {
      console.log ('[create_target2] $rdgm_edit_imgs: ', $rdgm_edit_imgs);
      console.log ('                 length: ', $rdgm_edit_imgs.length);
   }
   $rdgm_edit_imgs.css ({'max-width': 'none', padding: '0px', border: '0px'});
   var $label_imgs = q.$edit_area.find ('*.rdgm_edit_label img');
   if (debug[0]) {
      console.log ('[create_target2] $label_imgs: ', $label_imgs);
      console.log ('                 length: ', $label_imgs.length);
   }
   $label_imgs.css ({margin: '0px', padding: '0px'});
   q.$edit_area.find ('.rdgm_edit_label').click (function () {
      q.label_clicked (this);
   });
   waiting_for_label_click_b = true;
   label_will_have_multiple_targets_b = multiple_targets_f == 1;
   add_delete_label_f = local_add_delete_label_f;
   var style = 'background: white;';
   if (multiple_targets_f) {
      style += ' border-color: red;';
   }
   var click_on_label;
   if (add_delete_label_f) {
      click_on_a_label =   'Click on '
                         + '<span class="rdgm_edit_highlight_label_border" style="' + style + '">'
                         +    'label'
                         + '</span> '
                         + 'to which you want to add before/after, or delete'
                         + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="rdgm_edit.exit_click_on_a_label ()" />';
      rwizard.no_remove_placeholder_f = true;
   } else {
      click_on_a_label =   'Click on a '
                         + '<span class="rdgm_edit_highlight_label_border" style="' + style + '">'
                         +    'label'
                         + '</span>'
                         + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="rdgm_edit.exit_click_on_a_label ()" />';
}
   $rdgm_edit_main_menu_feedback.stop ().html (click_on_a_label).show ().css ('opacity', '1.0');
   report_errors ();
};
this.edit_label_feedback = function (correct_incorrect) {
   q.exit_select_text_target ();
   q.$edit_area.find ('.rdgm_edit_label').click (function () {
      q.label_clicked (this);
   });
   waiting_for_label_click_b = true;
   edit_label_feedback = correct_incorrect;
   var style = 'background: white;';
   var msg =   'Click on a '
             + '<span class="rdgm_edit_highlight_label_border" style="' + style + '">'
             +    'label'
             + '</span>'
             + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="rdgm_edit.exit_click_on_a_label ()" />';
   rwizard.no_remove_placeholder_f = true;
   $rdgm_edit_main_menu_feedback.stop ().html (msg).show ().css ('opacity', '1.0');
}
function preliminary_label_checks () {
   q.$edit_area.find ('.rdgm_edit_label').each (function () {
      var label_html = $ (this).html ();
      var m = label_html.match (/\[(<code><\/code>)*l\]/gm);
      if (m && m.length > 1) {
         var first_label_pos = label_html.search (/\[(<code><\/code>)*l\]/);
         var r = parse_html_block (label_html.substr (first_label_pos + 1), ['[l]'], []);
         var new_label_html = r.htm_block;
         if (new_label_html != 'NA') {
            if (debug[2]) {
               console.log ('[preliminary_label_checks] new_label_html:', new_label_html);
            }
            label_html = label_html.replace (new_label_html, '');
            $ (this).html (label_html);
            $ (this).after (new_label_html);
         }
      }
   });
   no_q_code_b = true;
   any_labeled_diagram_questions_b = false;
   var any_new_question_div_b = process_wrapped_questions ();
   var htm = q.$edit_area.html ();
   if (debug[0]) {
      console.log ('[preliminary_label_checks] htm: ', htm);
   }
   if (debug[0]) {
      console.log ('[preliminary_label_checks] q.rwizard_b:', q.rwizard_b);
   }
   if (! q.rwizard_b && ! check_rdgm_tag_pairs_ok (htm)) {
      return false;
   }
   var any_new_html_b = false;
   var new_html = htm;
   if (htm.indexOf ('rdgm_edit_question') != -1) {
      if (debug[2]) {
         console.log ('[preliminary_label_checks] preliminary check 2...');
      }
      var error_b = false;
      q.$edit_area.find ('div.rdgm_edit_question').each (function () {
         if (! error_b) {
            var rdgm_edit_question_html = $ (this).html ()
            var m = rdgm_edit_question_html.match (/\[(<code><\/code>)*q[ \]]/gm);
            if (debug[2]) {
               console.log ('[preliminary_label_checks] m:', m);
            }
            if (m && m.length > 1) {
               alert (T ('A new question shortcode [q] has been placed inside an existing question.  Please move it outside and try again.') + '*');
               error_b = true;
            }
         }
      });
      if (error_b) {
         return false;
      }
      var question_start_tags = ['<div class="rdgm_edit_question">'];
      var question_next_tags = question_start_tags.concat (['[x]', '[/rdgm]']);
      if (debug[2]) {
         console.log ('[preliminary_label_checks] preliminary check 3...');
      }
      var ipos = 0;
      while (true) {
         var rrdgm = parse_html_block (htm.substr (ipos), question_start_tags,
                                       question_next_tags);
         var question_html = rrdgm.htm_block;
         if (question_html == 'NA') {
            break;
         }
         var new_question_html = check_fix_matching_divs (question_html);
         if (new_question_html) {
            any_new_html_b = true;
            new_html = new_html.replace (question_html, new_question_html);
            if (debug[2]) {
               console.log ('[preliminary_label_checks] new_html:', new_html);
            }
         }
         ipos += rrdgm.htm_index + question_html.length;
      }
   }
   var rdgm_matches = new_html.match (/\[rdgm[\s\S]*?\[\/rdgm\]/gm);
   if (debug[0]) {
      console.log ('[preliminary_label_checks] rdgm_matches:', rdgm_matches);
   }
   if (! rdgm_matches) {
      report_errors ();
      return false;
   }
   n_rdgmzes = rdgm_matches.length;
   for (var i_rdgm=0; i_rdgm<n_rdgmzes; i_rdgm++) {
      question_start_tags = ['[q]', '[q '];
      var question_html = process_notwrapped_questions (rdgm_matches[i_rdgm], question_start_tags);
      if (question_html) {
         any_new_html_b = true;
         new_html = new_html.replace (rdgm_matches[i_rdgm], question_html);
      }
   }
   if (! any_labeled_diagram_questions_b) {
      if (no_q_code_b) {
         alert (T ('Did not find any questions [q] within [rdgm]...[/rdgm] shortcode pairs'));
      } else {
         alert (T ('Did not find any labeled diagram questions (labels [l] within [rdgm]...[/rdgm] shortcode pairs)'));
      }
      return false;
   }
   if (any_new_html_b) {
      q.$edit_area.html (new_html);
      q.tinymce_ed.isNotDirty = false;
      q.tinymce_ed.focus ();
   }
   if (any_new_html_b || any_new_question_div_b) {
      check_fix_label_divs ();
      q.$edit_area.find ('*.rdgm_edit_label > p, *.rdgm_edit_label > :header').each (function () {
         var innerhtm = $ (this).html ();
         if (innerhtm.indexOf ('rdgm_edit_highlight_label') == -1) {
            $ (this).html ('<span class="rdgm_edit_highlight_label rdgm_edit_highlight_label_border">' + innerhtm + '</span>');
         }
      });
   }
   return true;
}
this.exit_click_on_a_label = function () {
   if (debug[2]) {
      console.log ('[exit_click_on_a_label] $rdgm_edit_main_menu_feedback:', $rdgm_edit_main_menu_feedback);
   }
   $rdgm_edit_main_menu_feedback.hide ();
   waiting_for_label_click_b = false;
   label_will_have_multiple_targets_b = false;
}
this.exit_click_on_a_target = function () {
   if (debug[2]) {
      console.log ('[exit_click_on_a_target] $rdgm_edit_main_menu_feedback:', $rdgm_edit_main_menu_feedback);
   }
   q.$edit_area.find ('.rdgm_edit_target').off ('click');
   $rdgm_edit_main_menu_feedback.hide ();
   waiting_for_target_to_delete_click_b = false;
   decoy_target_b = false;
}
this.exit_select_text_target = function () {
   var $label_options_menu_feedback = $ ('div.label_options_menu_feedback');
   if (debug[2]) {
      console.log ('[exit_select_text_target] $label_options_menu_feedback:', $label_options_menu_feedback);
   }
   if (rwizard.$rdgm_edit_canvas) {
      rwizard.$rdgm_edit_canvas.off ('mouseup');
      rwizard.$rdgm_edit_canvas.attr ('contenteditable', true);
   }
   $ ('div.label_options_menu_feedback').hide ();
   document_rdgm_bubblebar_enabled_b = true;
   q.waiting_for_target_select_b = false;
   q.target_must_be_text_f = false;
}
this.create_target_for_same_label = function () {
   if (waiting_for_target_to_delete_click_b) {
      q.exit_click_on_a_target ();
   }
   if (q.rwizard_b) {
      q.exit_select_text_target ();
   }
   if (! q.el_label_div) {
      return false;
   }
   label_will_have_multiple_targets_b = true;
   waiting_for_label_click_b = true;
   q.label_clicked (q.el_label_div);
}
this.label_clicked = function (local_el_label_div) {
   if (! waiting_for_label_click_b) {
      return false;
   }
   q.el_label_div = local_el_label_div;
   var $el_label_div = $ (local_el_label_div);
   if (debug[0]) {
      console.log ('[label_clicked] q.el_label_div:', q.el_label_div);
   }
   var classes = $el_label_div.attr ('class');
   var m = classes.match (/qtarget_assoc([0-9]*)/);
   if (m) {
      q.assoc_id = m[1];
   } else {
      q.assoc_id = $el_label_div.data ('label_target_id');
   }
   waiting_for_label_click_b = false;
   $rdgm_edit_main_menu_feedback.hide ();
   if (add_delete_label_f) {
      add_delete_label_f = false;
      $rdgm_edit_question = $el_label_div.parents ('div.rdgmq');
      if (debug[0]) {
         console.log ('[label_clicked] $rdgm_edit_question:', $rdgm_edit_question);
      }
      rwizard.show_label_options_menu (q.assoc_id);
      return false;
   }
   if (edit_label_feedback) {
      rwizard.show_label_options_menu (q.assoc_id);
      var id = q.el_label_div.id;
      var pieces = id.split ('-');
      var rdgmq = pieces[1] + '-' + pieces[2];
      $ ('#' + rdgmq + ' div.rdgm-feedback').hide ();
      var feedback_selector = '#' + rdgmq + '-' + pieces[3];
      feedback_selector += (edit_label_feedback == 'correct' ? 'c' : 'x');
      var $feedback_selector = $ (feedback_selector);
      $feedback_selector.show ();
      rdgm_utils.select_placeholder ($feedback_selector);
      edit_label_feedback = '';
      return false;
   }
   $el_label_div.find ('img').css ({margin: '0px', padding: '0px'});
   $rdgm_edit_question = $el_label_div.parents ('.rdgm_edit_question');
   if (debug[0]) {
      console.log ('[label_clicked] $rdgm_edit_question:', $rdgm_edit_question);
   }
   var create_target_b = true;
   q.label_border_class = '';
   if (q.assoc_id) {
      if (label_will_have_multiple_targets_b) {
         q.label_border_class = get_label_border_class (q.el_label_div);
      } else {
         if (confirm (T ('This label already has a target.\nDo you want to replace the existing target?'))) {
            if (debug[0]) {
               console.log ('[label_clicked] classes:', classes, ', q.assoc_id:', q.assoc_id);
            }
            remove_target ($rdgm_edit_question, q.assoc_id);
            q.label_border_class = get_label_border_class (q.el_label_div);
            if (debug[0]) {
               console.log ('[label_clicked] q.label_border_class:', q.label_border_class);
            }
         } else {
            create_target_b = false;
         }
      }
   } else {
      if (label_will_have_multiple_targets_b) {
         if (! confirm (T ('This label does not have a target, while you clicked "Create another target for a label."  Do you want to create a target for this label?'))) {
            create_target_b = false;
         }
         label_will_have_multiple_targets_b = false;
      }
   }
   if (debug[0]) {
      console.log ('[label_clicked] create_target_b:', create_target_b)
   }
   if (create_target_b) {
      $rdgm_edit_main_menu_feedback.html (T ('Select the text or click on the image (you may have to click twice) where you want the target "drop zone" for this label')).show ();
      q.waiting_for_target_select_b = true;
      if (q.rwizard_b) {
         rwizard.$rdgm_edit_canvas.off ('mouseup');
         rwizard.$rdgm_edit_canvas.on ('mouseup', q.target_text_selected);
      } else {
         q.$edit_area.off ('mouseup');
         q.$edit_area.on ('mouseup', q.target_text_selected);
      }
   }
}
this.create_decoy_target = function () {
   var feedback = T ('Select the text or click on the image (you may have to click twice) where you want the decoy target "drop zone" (that will not accept a label)')
                  + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="rdgm_edit.exit_select_for_decoy ()" />';
   $rdgm_edit_main_menu_feedback.html (feedback).show ();
   q.waiting_for_target_select_b = true;
   decoy_target_b = true;
   if (q.rwizard_b) {
      rwizard.$rdgm_edit_canvas.off ('mouseup');
      rwizard.$rdgm_edit_canvas.on ('mouseup', q.target_text_selected);
   } else {
      q.$edit_area.off ('mouseup');
      q.$edit_area.on ('mouseup', q.target_text_selected);
   }
}
this.exit_select_for_decoy = function () {
   if (debug[2]) {
      console.log ('[exit_select_for_decoy] $rdgm_edit_main_menu_feedback:', $rdgm_edit_main_menu_feedback);
   }
   $rdgm_edit_main_menu_feedback.hide ();
   q.waiting_for_target_select_b = false;
   decoy_target_b = false;
}
this.delete_target = function () {
   var $targets = q.$edit_area.find ('.rdgm_edit_target');
   if (! $targets.length) {
      alert (T ('Did not find any targets'));
      return false;
   }
   var feedback = T ('Click on the target you want to delete')
                  + '<img src="' + rdgm_edit_params.url + 'images/icon_exit_bw.png" class="click_on____exit" onclick="rdgm_edit.exit_click_on_a_target ()" />';
   $rdgm_edit_main_menu_feedback.html (feedback).show ();
   $targets.click (function () {
      q.target_to_delete_clicked (this);
   });
   waiting_for_target_to_delete_click_b = true;
}
this.target_to_delete_clicked = function (target_el) {
   $rdgm_edit_main_menu_feedback.hide ();
   q.$edit_area.find ('.rdgm_edit_target').off ('click');
   waiting_for_target_to_delete_click_b = false;
   var $target_div_span = $ (target_el);
   var classes = $target_div_span.attr ('class');
   var m = classes.match (/rdgm_edit_target-([0-9]*)/);
   var delete_label_b = false;
   if (m) {
      var assoc_id = m[1];
      var $label = q.$edit_area.find ('div.qtarget_assoc' + assoc_id + ', div.rdgm_edit_label[data-label_target_id="' + assoc_id + '"]');
      if (debug[0]) {
         console.log ('[target_to_delete_clicked] $label:', $label);
         console.log ('[target_to_delete_clicked] $label.length:', $label.length);
      }
      if ($label.length) {
         classes = $label.attr ('class');
         m = classes.match (/rdgm_edit_n_targets([0-9]*)/);
         if (m) {
            var n_targets = m[1];
            if (n_targets == 2) {
               $label.removeClass ('rdgm_edit_n_targets2');
            } else {
               n_targets--;
               $label.removeClass (m[0]).addClass ('rdgm_edit_n_targets' + n_targets);
            }
            if (q.rwizard_b) {
               update_rwizard_label ($label);
            }
         } else {
            if (confirm (T ('Note: the label for this target will no longer be associated with any target'))) {
               delete_label_b = true;
            } else {
               return false;
            }
         }
      }
   }
   if ($target_div_span[0].tagName.toLowerCase () == 'div') {
      $target_div_span.remove ();
   } else {
      $target_div_span.parents ('span.text_target_wrapper').contents ().unwrap ();
      $target_div_span.contents ().unwrap ();
   }
   if (delete_label_b) {
      if (debug[0]) {
         console.log ('[target_to_delete_clicked] $label.contents ():', $label.contents ());
      }
      var $label_contents = $label.contents ();
      $label_contents.find ('span.rdgm_edit_highlight_label').contents ().unwrap ();
      var htm = $label_contents.html ();
      if (htm.search ('<code></code>') != -1) {
         htm = htm.replace ('<code></code>', '');
         $label_contents.html (htm);
      }
      $label_contents.unwrap ();
   }
}
function remove_target ($rdgm_edit_question, assoc_id) {
   var div_span_obj = $rdgm_edit_question.find ('.rdgm_edit_target-' + assoc_id);
   if (div_span_obj.length) {
      if (div_span_obj[0].tagName.toLowerCase () == 'div') {
         div_span_obj.remove ();
      } else {
         div_span_obj.parents ('span.text_target_wrapper').contents ().unwrap ();
         div_span_obj.contents ().unwrap ();
      }
   }
}
this.target_text_selected = function (e) {
   if (debug[0]) {
      console.log ('[target_text_selected] e:', e);
      console.log ('[target_text_selected] q.label_border_class:', q.label_border_class);
   }
   var tinymce_ed_selection = q.tinymce_ed.selection;
   var selected_text = '';
   if (tinymce_ed_selection) {
      selected_text = tinymce_ed_selection.getContent ();
   }
   var node = '';
   if (e.target) {
      node = e.target;
   }
   var $node = $ (node);
   if (q.target_must_be_text_f && selected_text == '') {
      alert (T ('No text selected.  Please try again'));
      return;
   }
   if (q.target_must_be_text_f) {
      rwizard.$rdgm_edit_canvas.off ('mouseup');
      $ ('div.label_options_menu_feedback').hide ();
      rwizard.$rdgm_edit_canvas.attr ('contenteditable', true);
      document_rdgm_bubblebar_enabled_b = true;
   } else {
      q.$edit_area.off ('mouseup');
   }
   var img_el;
   if (selected_text || (node && node.tagName.toLowerCase () == 'img')) {
      img_el = node;
   } else {
      var $image;
      if ($node.hasClass ('rdgm_edit_canvas')) {
         $image = $node.find ('img').first ();
      } else {
         $image = $node.parents ('.rdgm_edit_canvas').find ('img').first ();
      }
      if (debug[0]) {
         console.log ('[target_text_selected] $image:', $image);
      }
      if ($image.length) {
         img_el = $image[0];
         selected_text = img_el.outerHTML;
         $node = $image;
         if (debug[0]) {
            console.log ('[target_text_selected] selected_text:', selected_text);
         }
      } else {
         return false;;
      }
   }
   if (! q.waiting_for_target_select_b) {
      return false;
   }
   q.waiting_for_target_select_b = false;
   var $target = $node.parents ('.rdgm_edit_target');
   var classes = $node.attr ('class');
   if ($target.length || (classes && classes.indexOf ('rdgm_edit_target') != -1)) {
      alert (T ('Selection already is a target'));
      $rdgm_edit_main_menu_feedback.hide ();
      return false;
   }
   if (! q.target_must_be_text_f) {
      var $node_offset   = $node.offset ();
      var $node_position = $node.position ();
      var target_left    = e.clientX - $node_offset.left;
      var target_top     = e.clientY - $node_offset.top;
      if (q.rwizard_b) {
         target_top += $ (window).scrollTop ();
      }
      target_left = Math.round (target_left);
      target_top  = Math.round (target_top);
      if (debug[0]) {
         console.log ('[target_text_selected] selected_text: ' + selected_text);
         console.log ('                       $node:', $node);
         console.log ('                       $node_offset:', $node_offset);
         console.log ('                       $node_position:', $node_position);
         console.log ('                       e.clientX:', e.clientX, ', e.clientY:', e.clientY);
         if (q.rwizard_b) {
            console.log ('                       $ (window).scrollTop ():', $ (window).scrollTop ());
         }
         console.log ('                       target_left:', target_left, ', target_top:', target_top);
      }
   }
   if (decoy_target_b) {
      q.assoc_id = time_id ();
      bcolor = 'gray';
      bstyle = 'solid';
      q.label_border_class = '';
   } else {
      if (! q.assoc_id) {
         q.assoc_id = time_id ();
      }
      var ok_b = false;
      var bcolor;
      var bcolor = '';
      if (q.label_border_class == '') {
         var n_bcolors = bcolors.length;
         var n_bstyles = bstyles.length;
         for (var i_bcolor=0; i_bcolor<n_bcolors; i_bcolor++) {
            bcolor = bcolors[i_bcolor];
            var $labels = $rdgm_edit_question.find ('span.rdgm_edit_border_class_' + bcolor);
            if (debug[0]) {
               console.log ('[target_text_selected] bcolor:', bcolor, ', $labels.length:', $labels.length);
            }
            if ($labels.length == 0) {
               bstyle = bstyles[0];
               break;
            } else {
               var bstyles_used = new Array (n_bstyles+1).join ('0').split ('');
               $labels.each (function () {
                                   var classes = $ (this).attr ('class');
                                   for (var i_bstyle=0; i_bstyle<n_bstyles; i_bstyle++) {
                                      var bstyle_i = bstyles[i_bstyle];
                                      if (classes.indexOf (bstyle_i) != -1) {
                                         bstyles_used[i_bstyle] = '1';
                                         break;
                                      }
                                   }
                                });
               var i_bstyle = bstyles_used.indexOf ('0');
               if (debug[0]) {
                  console.log ('[target_text_selected] bstyles_used:', bstyles_used, ', i_bstyle:', i_bstyle);
               }
               if (i_bstyle == -1) {
                  continue;
               } else {
                  bstyle = bstyles[i_bstyle];
                  break;
               }
            }
         }
         if (debug[0]) {
            console.log ('[target_text_selected] bcolor:', bcolor, ', bstyle:', bstyle);
         }
      }
   }
   var img_b;
   if (selected_text) {
      img_txt = selected_text.match (/<img.*?>/m);
      var slen = selected_text.length;
      img_b = img_txt && img_txt[0].length == slen;
   } else {
      img_b = node.tagName.toLowerCase () == 'img';
   }
   if (img_b) {
      if (debug[0]) {
         console.log ('[target_text_selected] node tagName:', $node[0].tagName);
         console.log ('                       parent tagName:', $node.parent ()[0].tagName);
         console.log ('                       parent parent tagName:', $node.parent ().parent ()[0].tagName);
      }
      if (q.target_must_be_text_f) {
         alert (T ('Selection must be text.  Please try again.'));
         q.target_must_be_text_f = false;
         $ ('div.label_options_menu_feedback').hide ();
         return false;
      }
      var $img_wrapper = '';
      $img = $ (img_el);
      if (debug[0]) {
         console.log ('[target_text_selected] $img:', $img);
      }
      if ($img.parents ().hasClass ('rdgm_edit_image')) {
         $img_wrapper = $img.parents ('.rdgm_edit_image');
         if (debug[0]) {
            console.log ('[target_text_selected] Found $img_wrapper:', $img_wrapper);
         }
      }
      var caption_b = false;
      if ($img_wrapper == '') {
         parent_parent_tagname = $node.parent ().parent ()[0].tagName;
         caption_b = parent_parent_tagname.toLowerCase () == 'dt';
         if (caption_b) {
            alert (T ('Sorry, labeled diagrams do not work with images that have captions.  Please edit the image, delete the caption, and try again.'));
            $rdgm_edit_main_menu_feedback.hide ();
         } else {
            var img_el_html = img_el.outerHTML;
            var img_attributes = img_el.outerHTML.substr (5).replace (/\/*>$/, '');
            if (debug[0]) {
               console.log ('[target_text_selected] img_attributes:', img_attributes);
            }
            var img_wrapper_attributes = img_attributes.replace (/(id|src|alt|width|height)\s*=\s*".*?"/gm, '');
            var img_wrapper_id = 'id="rdgm_edit_img_wrapper-' + q.assoc_id + '" ';
            var img_wrapper_style = ' style="position: relative; ';
            if (img_attributes.indexOf ('aligncenter') == -1) {
               img_wrapper_style += 'margin: 0px; ';
            } else {
               img_wrapper_style += 'margin: 0px auto; ';
            }
            var width = '';
            var m = img_attributes.match (/width="([0-9]+)"/);
            if (m) {
               width = m[1];
               img_wrapper_style += 'width: ' + width + 'px; ';
            }
            var height = '';
            var m = img_attributes.match (/height="([0-9]+)"/);
            if (m) {
               height = m[1];
               img_wrapper_style += 'height: ' + height + 'px; ';
            }
            img_wrapper_style += '" ';
            img_attributes = img_attributes.replace (/align(left|center|right|none)/m, '');
            img_attributes = add_attr_value ('class', 'rdgm_edit_image', img_attributes);
            var new_txt = '<div ' + img_wrapper_id + img_wrapper_style + img_wrapper_attributes + '><img ' + img_attributes + ' /></div>';
            if (debug[0]) {
               console.log ('[target_text_selected] new_txt: ' + new_txt);
            }
            var img_href = '';
            var $link = $img.parent ('a');
            if ($link.length) {
               img_href = $link.attr ('href');
               if (debug[0]) {
                  console.log ('[target_text_selected] img_href:', img_href);
               }
            }
            var $p = $img.parents ('p');
            if ($p.length) {
               $p.before (new_txt);
               $img.remove ();
               if (debug[0]) {
                  console.log ('inserted wrapper before $p:', $p);
                  console.log ('$p.html ():', $p.html ());
               }
            } else {
               $img.replaceWith (new_txt);
            }
            $img_wrapper = q.$edit_area.find ('#rdgm_edit_img_wrapper-' + q.assoc_id);
            if (img_href) {
               $link = q.$edit_area.find ('a[href="' + img_href + '"]');
               if ($link.length) {
                  if (debug[0]) {
                     console.log ('[target_text_selected] $link.html():', $link.html());
                  }
                  var link_html = $link.html ();
                  if (link_html.search (/\S/) == -1) {
                     $p = $link.parents ('p');
                     if ($p.length) {
                        $link.remove ();
                        q.$edit_area.find ('[data-mce-bogus]').remove ();
                        var p_html = $p.html ();
                        if (debug[0]) {
                           console.log ('[target_text_selected] p_html:', p_html);
                        }
                        if (p_html.search (/\S/) == -1) {
                           $p.remove ();
                        }
                     }
                  }
               }
            }
            if (debug[0]) {
               console.log ('[target_text_selected] updated q.$edit_area html:', q.$edit_area.html ());
            }
         }
      }
      if (! caption_b) {
         if (! decoy_target_b) {
            var $el_label_div = $ (q.el_label_div);
            if (label_will_have_multiple_targets_b) {
               set_mult_targets_indicator ($el_label_div);
               label_will_have_multiple_targets_b = false;
            } else {
               var classes = $el_label_div.attr ('class');
               var m = classes.match (/qtarget_assoc[0-9]*/g);
               if (m) {
                  var qtargets = m.join (' ');
                  if (debug[0]) {
                     console.log ('[target_text_selected] q.el_label_div: ', q.el_label_div, ', removeClass (' + qtargets + ')');
                  }
                  $el_label_div.removeClass (qtargets);
               }
               $el_label_div.addClass ('qtarget_assoc' + q.assoc_id);
               if (q.label_border_class == '') {
                  if ($el_label_div.hasClass ('rdgm_edit_highlight_label')) {
                     $el_label_div.removeClass ('rdgm_edit_highlight_label_border').addClass ('rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_width');
                  } else {
                     $el_label_div.find ('.rdgm_edit_highlight_label').removeClass ('rdgm_edit_highlight_label_border').addClass ('rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_width');
                  }
               }
            }
         }
         var style = 'left: ' + target_left + 'px; top: ' + target_top + 'px;';
         if (! q.label_border_class) {
            q.label_border_class = 'rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_' + bcolor + ' rdgm_edit_border_class_width';
         }
         var decoy = decoy_target_b ? 'decoy ' : '';
         var target_html = '<div class="rdgm_edit_target-' + q.assoc_id + ' rdgm_edit_target ' + decoy + q.label_border_class + '" style="' + style + '"></div>';
         $img_wrapper.prepend (target_html);
         var $target = q.$edit_area.find ('.rdgm_edit_target-' + q.assoc_id);
         $target.draggable ();
         $target.resizable ({
            resize: function (e, ui_obj) {
               $ (this).css ({'margin-right': -(ui_obj.size.width + horizontal_margin_adjust) + 'px', 'margin-bottom': -(ui_obj.size.height + vertical_margin_adjust) + 'px'});
            }
         }).css ({'z-index': 105});
         $rdgm_edit_main_menu_feedback.html (T ('You can position and resize the target "drop zone" how you want in relation to the image.')).show ().fadeOut (10000, 'easeInCubic');
      }
   } else {
      if (q.label_border_class == '') {
         q.label_border_class = 'rdgm_edit_border_class_' + bstyle + ' rdgm_edit_border_class_' + bcolor;
      }
      sib_id = time_id ();
      var new_txt = create_text_target (selected_text, q.assoc_id, sib_id, q.label_border_class, decoy_target_b);
      tinymce_ed_selection.setContent (new_txt);
      if (! decoy_target_b) {
         var $el_label_div = $ (q.el_label_div);
         if (label_will_have_multiple_targets_b) {
            set_mult_targets_indicator ($el_label_div);
            label_will_have_multiple_targets_b = false;
         }
         $el_label_div.addClass ('qtarget_assoc' + q.assoc_id);
         $el_label_div.find ('.rdgm_edit_highlight_label').removeClass ('rdgm_edit_highlight_label_border').addClass (q.label_border_class + ' rdgm_edit_border_class_width');
      }
      $rdgm_edit_main_menu_feedback.hide ();
   }
   if (decoy_target_b) {
      decoy_target_b = false;
   } else {
      if (q.rwizard_b) {
         $ ('#create_another_target_same_label').show ();
      } else {
         $ ('#create_another_target_same_label').removeClass ('rdgm_edit_main_menu_item_disabled').addClass ('rdgm_edit_main_menu_item');
      }
   }
}
function create_text_target (htm, assoc_id, sib_id, border_class, decoy_target_b) {
   var t = parse_tags_text (htm);
   var tokens = t.tokens;
   var token_types = t.token_types;
   var n_tokens = tokens.length;
   var i_first = -1;
   var i_last  = -1;
   var n_texts = 0;
   for (var i=0; i<n_tokens; i++) {
      if (token_types[i] != 'tag') {
         n_texts++;
         if (i_first == -1) {
            i_first = i;
         }
         i_last = i;
      }
   }
   border_class = border_class.replace ('rdgm_edit_border_class_width', '');
   var decoy = decoy_target_b ? 'decoy ' : '';
   var common = '<span class="rdgm_edit_target-' + assoc_id + ' qtarget_sib-' + sib_id + ' rdgm_edit_target ' + decoy;
   if (n_texts == 0) {
      alert (T ('Error: no text selected.'));
   } else if (n_texts == 1) {
      tokens[i_first] = common + 'rdgm_edit_border_all '       + border_class + '">' + tokens[i_first] + '</span>';
   } else if (n_texts >= 2) {
      tokens[i_first] = common + 'rdgm_edit_border_left '      + border_class + '">' + tokens[i_first] + '</span>';
      tokens[i_last]  = common + 'rdgm_edit_border_right '     + border_class + '">' + tokens[i_last]  + '</span>';
      for (var i=i_first+1; i<i_last; i++) {
         if (token_types[i] != 'tag') {
            if (tokens[i].search (/\S/) == -1) {
               tokens[i] = '<br data-mce-bogus="1">';
            } else {
               tokens[i]    = common + 'rdgm_edit_border_center ' + border_class + '">' + tokens[i]  + '</span>';
            }
         }
      }
   }
   var new_htm = tokens.join ('');
   if (debug[0]) {
      console.log ('[create_text_target] i_first, i_last, n_texts:', i_first, i_last, n_texts);
      console.log ('[create_text_target] new_htm:', new_htm);
   }
   return new_htm;
}
function get_label_border_class (el_label_div) {
   var label_border_class = '';
   var label_class = $ (el_label_div).find ('.rdgm_edit_highlight_label').attr ('class');
   if (debug[0]) {
      console.log ('[get_label_border_class] label_class:', label_class);
   }
   var m = label_class.match (/rdgm_edit_border_class_[a-z]*/g);
   if (m) {
      label_border_class = m.join (' ');
   }
   return label_border_class;
}
function set_mult_targets_indicator ($label) {
   var label_class = $label.attr ('class');
   if (debug[0]) {
      console.log ('[set_mult_targets_indicator] $label:', $label);
      console.log ('[set_mult_targets_indicator] label_class:', label_class);
   }
   var m = label_class.match (/rdgm_edit_n_targets([0-9]*)/);
   if (m) {
      var current_class = m[0];
      var n_targets = parseInt (m[1], 10);
      if (debug[0]) {
         console.log ('[set_mult_targets_indicator] current_class:', current_class, ', n_targets:', n_targets);
      }
      var new_class = 'rdgm_edit_n_targets' + (++n_targets);
      $label.removeClass (current_class).addClass (new_class);
   } else {
      $label.addClass ('rdgm_edit_n_targets2');
   }
   if (q.rwizard_b) {
      update_rwizard_label ($label);
   }
}
function update_rwizard_label ($label) {
   var label_el = $label[0];
   var div_html = label_el.outerHTML;
   var id = label_el.id;
   var i_question = id.match (/-q([0-9]+)/)[1];
   var i_label    = id.match (/-a([0-9]+)/)[1];
   div_html = div_html.replace (/id="[^"]+" /, '');
   div_html = div_html.replace (' no_move', '');
   rwizard.questions_cards[i_question].labels[i_label] = div_html;
}
function parse_tags_text (htm) {
   var tokens = [''];
   var token_types = [''];
   var i_token = 0;
   var len = htm.length;
   for (var i=0; i<len; i++) {
      if (htm[i] == '<') {
         if (tokens[i_token] == '') {
            tokens[i_token] = '<';
            token_types[i_token] = 'tag';
         } else {
            tokens.push ('<');
            token_types.push ('tag');
            i_token++;
         }
      } else if (htm[i] == '>') {
         tokens[i_token] += '>';
         tokens.push ('');
         token_types.push ('');
         i_token++;
      } else {
         tokens[i_token] += htm[i];
      }
   }
   var new_tokens = [];
   var new_token_types = [];
   var n_tokens = tokens.length;
   for (var i=0; i<n_tokens; i++) {
      if (token_types[i] == 'tag' || tokens[i] != '') {
         new_tokens.push (tokens[i]);
         new_token_types.push (token_types[i]);
      }
   }
   if (debug[0]) {
      console.log ('[parse_tags_text] new_tokens:', new_tokens);
   }
   return {'tokens': new_tokens, 'token_types': new_token_types}
}
function add_attr_value (attr, value, attributes) {
   if (debug[0]) {
      console.log ('[add_attr_value] attributes:', attributes);
   }
   var re = new RegExp (attr + '\\s*=\\s*["\']', 'im');
   var m = attributes.match (re);
   if (m) {
      if (attributes.indexOf (value) == -1) {
         attributes = attributes.replace (re, m[0] + value + ' ');
      }
   } else {
      attributes += ' ' + attr + '="' + value + '"';
   }
   if (debug[0]) {
      console.log ('[add_attr_value] attributes:', attributes);
   }
   return attributes;
}
function process_wrapped_questions () {
   var any_new_question_div_b = false;
   q.$edit_area.find ('div.rdgm_edit_question').each (function () {
      var htm = $ (this).html ();
      if (debug[1]) {
         console.log ('[process_wrapped_questions] htm:', htm);
      }
      if (is_only_tags_and_whitespace (htm)) {
         $ (this).remove ();
      } else {
         any_labeled_diagram_questions_b = true;
         var m = htm.match (/\[q[ \]]/gm);
         if (m && m.length > 1) {
            alert (T ('A new question shortcode [q] has been placed inside an existing question.  Please move it outside and try again.'));
            q.exit_click_on_a_label ();
         } else {
            no_q_code_b = false;
            htm = q.process_question (htm, true);
            if (htm) {
               any_new_question_div_b = true;
               $ (this).html (htm);
               q.reinit_dragging (q.$edit_area);
            }
         }
      }
   });
   return any_new_question_div_b;
}
function process_notwrapped_questions (rdgm_html, question_start_tags) {
   if (debug[0]) {
      console.log ('[process_notwrapped_questions] question_start_tags:', question_start_tags);
   }
   var question_next_tags = ['[q]', '[q ', '<div class="rdgm_edit_question">', '[x]', '[/rdgm]'];
   var any_new_html_b = false;
   var any_labels_b   = false;
   var ipos = 0;
   var new_rdgm_html = rdgm_html;
   while (true) {
      var rdgm_edit_question_div_pos = rdgm_html.substr (ipos).search (/<div class="rdgm_edit_question[^_]/);
      if (rdgm_edit_question_div_pos != -1) {
         var q_pos = rdgm_html.substr (ipos).search (/\[q[ \]]/);
         if (debug[0]) {
            console.log ('[process_notwrapped_questions] rdgm_edit_question_div_pos:', rdgm_edit_question_div_pos, ', q_pos:', q_pos);
         }
         if (rdgm_edit_question_div_pos < q_pos) {
            ipos += q_pos + 2;
            continue;
         }
      }
      var rrdgm = parse_html_block (rdgm_html.substr (ipos), question_start_tags,
                                    question_next_tags, false);
      var question_html = rrdgm.htm_block;
      if (question_html == 'NA') {
         break;
      }
      no_q_code_b = false;
      var new_question_html = question_html;
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] create canvas div...');
      }
      var label_pos = new_question_html.search (/\[l\]|\[f*\]|\[fx\]|\[hint\]/m);
      var label_etc_start_tags = ['[l]', '[f*]', '[fx]', '[hint]'];
      var r = parse_html_block (new_question_html, question_start_tags, label_etc_start_tags);
      var canvas_div_content = r.htm_block;
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] canvas_div_content:', canvas_div_content);
      }
      var canvas_div = '<div class="rdgm_edit_canvas rdgm_editable rdgm-question">'
                       + canvas_div_content
                       + '<div style="clear: both;"></div>'
                       + '</div> <!-- close rdgm_edit_canvas -->';
      new_question_html = new_question_html.replace (canvas_div_content, canvas_div);
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] new_question_html:', new_question_html);
      }
      new_question_html = q.process_question (new_question_html, false);
      if (new_question_html) {
         any_new_html_b = true;
         new_rdgm_html = new_rdgm_html.replace (question_html, new_question_html);
      }
      ipos += rrdgm.htm_index + question_html.length;
   }
   if (! any_new_html_b) {
      new_rdgm_html = '';
   }
   if (debug[0]) {
      console.log ('[process_notwrapped_questions] new_rdgm_html:', new_rdgm_html);
   }
   return new_rdgm_html;
}
this.process_question = function (question_html, doing_wrapped_b) {
   if (debug[0]) {
      console.log ('[process_question] doing_wrapped_b:', doing_wrapped_b);
   }
   if (debug[1]) {
      console.log ('[process_question] question_html:', question_html);
   }
   var any_new_html_b = false;
   var comment_html = '';
   var comment_pos = question_html.search (/(<[^\/][^>]*>\s*)*\[!+\][^\[]*\[\/!+\]\s*(<\/[^>]+>\s*)*(<[^>]+>|&nbsp;|\s)*$/);
   if (comment_pos != -1) {
      comment_html = question_html.substr (comment_pos);
      question_html = question_html.substr (0, comment_pos);
      if (debug[0]) {
         console.log ('[process_question] comment_html:', comment_html);
      }
   }
   label_start_tags = ['[l]'];
   var r = process_labels (question_html, label_start_tags, false);
   if (r.any_labels_b) {
      any_labeled_diagram_questions_b = true;
   }
   if (r.new_html) {
      any_new_html_b = true;
      question_html = r.new_html;
      if (! doing_wrapped_b) {
         question_html = '<div class="rdgm_edit_question">'
                       +    question_html
                       +    '<div class="rdgm_edit_question_bottom_border_title" title="' + T ('End of labeled-diagram question') +'">'
                       +    '</div>'
                       + '</div> <!-- close rdgm_edit_question -->'
                       + comment_html;
      }
   }
   return any_new_html_b ? question_html : '';
}
function check_fix_label_divs () {
   q.$edit_area.find ('div.rdgm_edit_label').each (function () {
      var label_html = $ (this).html ();
      if (debug[1]) {
         console.log ('[check_fix_label_divs] label_html:', label_html);
      }
      if (is_only_tags_and_whitespace (label_html)) {
         var classes = $ (this).attr ('class');
         var m = classes.match (/qtarget_assoc([0-9]*)/);
         if (m) {
            q.assoc_id = m[1];
            var $rdgm_edit_question = $ (this).parents ('.rdgm_edit_question');
            remove_target ($rdgm_edit_question, q.assoc_id);
         }
         $ (this).remove ();
      } else if (is_only_tags_and_whitespace (label_html, '[l]')) {
         errmsgs.push (T ('Label [l] is blank'));
      } else {
         var new_label_html = label_html;
         var label_comments = '';
         var re = new RegExp ('\\s*(<[^\/][^>]*>)*\\s*\\[!+\\][\\s\\S]*?\\[\\/!+\\]\\s*(<\\/[^>]+>)*\\s*', 'gm');
         var m = new_label_html.match (re);
         if (m) {
            label_comments = m.join ('');
            if (debug[0]) {
               console.log ('[process_wrapped_labels] new_label_html:', new_label_html);
               console.log ('[process_wrapped_labels] label_comments:', label_comments);
            }
            new_label_html = new_label_html.replace (re, '');
            $ (this).html (new_label_html);
            $ (this).after (label_comments);
         }
      }
   });
}
function process_labels (question_html, label_start_tags, doing_wrapped_b) {
   var label_next_tags  = ['[l]', '[x]]',
                           '<div{^>}#?class\\s#=\\s#"{^"}#?rdgm_edit_label'];
   var feedback_start_tags = ['[f*]', '[fx]'];
   var feedback_next_tags = ['[l]', '[f*]', '[fx]', '[hint]', '[x]'];
   var any_new_html_b = false;
   var any_labels_b = false;
   var ipos = 0;
   var new_question_html = question_html;
   while (true) {
      var rdgm_edit_label_div_pos = question_html.substr (ipos).indexOf ('<div class="rdgm_edit_label">');
      if (rdgm_edit_label_div_pos != -1) {
         var q_pos = question_html.substr (ipos).search (/\[q[ \]]/);
         if (debug[0]) {
            console.log ('[process_labels] rdgm_edit_label_div_pos:', rdgm_edit_label_div_pos, ', q_pos:', q_pos);
         }
         if (rdgm_edit_label_div_pos < q_pos) {
            ipos += q_pos + 2;
            continue;
         }
      }
      var r = parse_html_block (question_html.substr (ipos), label_start_tags,
                                label_next_tags, doing_wrapped_b);
      var label_html = r.htm_block;
      if (label_html == 'NA') {
         break;
      }
      if (doing_wrapped_b) {
         if (r.all_whitespace) {
            new_question_html = new_question_html.replace (label_html, '');
            ipos += r.htm_index + label_html.length;
            any_new_html_b = true;
            continue
         }
      }
      var new_label_html = label_html;
      var label_comments = '';
      var re = new RegExp ('\\s*(<[^\/][^>]*>)*\\s*\\[!+\\][\\s\\S]*?\\[\\/!+\\]\\s*(<\\/[^>]+>)*\\s*', 'gm');
      var m = new_label_html.match (re);
      if (m) {
         label_comments = m.join ('');
         if (debug[0]) {
            console.log ('[process_labels] new_label_html:', new_label_html);
            console.log ('[process_labels] label_comments:', label_comments);
         }
         new_label_html = new_label_html.replace (re, '');
      }
      if (! is_only_tags_and_whitespace (new_label_html)) {
         any_labels_b = true;
         if (! doing_wrapped_b) {
            any_new_html_b = true;
            if (debug[0]) {
               console.log ('[process_labels] new_label_html:', new_label_html);
            }
            var feedback_htmls = [];
            while (true) {
               var rf = parse_html_block (new_label_html, feedback_start_tags,
                                          feedback_next_tags);
               var feedback_html = rf.htm_block;
               if (feedback_html == 'NA') {
                  break;
               }
               new_label_html = new_label_html.replace (feedback_html, '');
               if (debug[0]) {
                  console.log ('[process_labels] feedback_html:', feedback_html);
                  console.log ('[process_labels] new_label_html:', new_label_html);
               }
               if (! is_only_tags_and_whitespace (feedback_html.replace (/\[f[\*x]\]/, ''))) {
                  feedback_htmls.push (feedback_html);
               }
            }
            new_label_html = new_label_html.replace (/(\s*(<[ph][^>]*>)*\s*(&nbsp;|<br[^>]*>)*\s*(<\/[ph][^>]*>)*\s*)*$/gm, '');
            if (new_label_html.indexOf ('rdgm_edit_label') == -1) {
               var highlight = '';
               var style     = '';
               var ph_pos = new_label_html.search (/<p|<h[1-6]/m);
               if (ph_pos == -1) {
                  highlight = ' rdgm_edit_highlight_label';
                  style     = ' style="display: inline;"';
               }
               new_label_html = '<div class="rdgm_edit_label rdgm_editable' + highlight + '"' + style + '>' + new_label_html + '</div>';
            }
            new_label_html += label_comments;
            var fc_b = false;
            var fx_b = false;
            var f_len = feedback_htmls.length;
            if (f_len > 2) {
               errmsgs.push (T ('Too many feedback shortcodes'));
            }
            for (var i=0; i<f_len; i++) {
               if (feedback_htmls[i].search (/\[fx\]/) != -1) {
                  fx_b = true;
               } else {
                  fc_b = true;
               }
            }
            if (debug[0]) {
               console.log ('[process_labels] fx_b:', fx_b, ', fc_b:', fc_b);
            }
            if (! fx_b) {
               feedback_htmls.push (canned_feedback (false));
            }
            if (! fc_b) {
               feedback_htmls.push (canned_feedback (true));
            }
            if (debug[0]) {
               console.log ('[process_labels] feedback_htmls:', feedback_htmls.join ('\n'));
            }
            new_label_html += feedback_htmls.join ('\n');
            new_question_html = new_question_html.replace (label_html, new_label_html);
         }
      }
      ipos += r.htm_index + label_html.length;
   }
   if (! any_new_html_b) {
      new_question_html = '';
   }
   if (debug[0]) {
      console.log ('[process_labels] any_labels_b: ', any_labels_b);
      console.log ('[process_labels] new_question_html: ', new_question_html);
   }
   return {'any_labels_b': any_labels_b, 'new_html': new_question_html};
}
var correct = [T ('Good!'), T ('Correct!'), T ('Excellent!'), T ('Great!')];
var incorrect = [T ('No.'), T ('No, that\'s not correct.')];
function canned_feedback (correct_b) {
   var response;
   if (correct_b) {
      var i = Math.floor (Math.random () * correct.length);
      response = '[f*] ' + correct[i];
   } else {
      var i = Math.floor (Math.random () * incorrect.length);
      response = '[fx] ' + incorrect[i] + ' ' + T ('Please try again') + '.';
   }
   response = '<p><strong>' + response + '</strong></p>';
   if (debug[0]) {
      console.log ('[canned_feedback] response:', response);
   }
   return response;
}
function check_rdgm_tag_pairs_ok (htm) {
   var error_b = false;
   var matches = htm.match (/\[rdgm|\[\/rdgm\]/gm);
   if (matches) {
      var n_tags = matches.length;
      if (n_tags == 0) {
         alert (T ('Did not find [rdgm]...[/rdgm] shortcodes'));
         error_b = true;
      } else {
         if (n_tags % 2 != 0) {
            error_b = true;
         } else {
            for (var i=0; i<n_tags; i++) {
               var tag = matches[i];
               if (i % 2 == 0) {
                  if (matches[i] != '[rdgm') {
                     error_b = true;
                     break;
                  }
               } else {
                  if (matches[i] != '[/rdgm]') {
                     error_b = true;
                     break;
                  }
               }
            }
         }
         if (error_b){
            alert (  T ('Unmatched [rdgm] - [/rdgm] pairs.')  + '  '
                   + T ('Please fix and try again.'));
         }
      }
   } else {
      alert (  T ('Did not find [rdgm]...[/rdgm] shortcodes') + '  '
             + T ('Please fix and try again.'));
   }
   return ! error_b;
}
function check_fix_matching_divs (htm) {
   var new_htm = [];
   var div_re = RegExp ('<div[^>]*>|<\/div>', 'gm');
   var div_matches = htm.match (div_re);
   if (div_matches) {
      var matched_pair_b = [];
      var n_tags = div_matches.length;
      for (var i=0; i<n_tags; i++) {
         matched_pair_b.push (false);
         if (div_matches[i].substr(0, 2) == '</') {
            for (var jj=i-1; jj>=0; jj--) {
               if (div_matches[jj].substr (0, 2) == '<d' && ! matched_pair_b[jj]) {
                  matched_pair_b[jj] = true;
                  matched_pair_b[i]  = true;
                  break;
               }
            }
         }
      }
      if (matched_pair_b.indexOf (false) != -1) {
         var comment_html = '';
         var comment_match = htm.match (/((<[^\/][^>]*>\s*)*\[!+\][^\[]*\[\/!+\]\s*(<\/[^>]+>\s*)*(<[^>]+>&nbsp;<\/[^>]+>\s*)*)(<div class="rdgm_edit_question_bottom_border_title"[^>]*>\s*)*(<\/div>\s*)*$/);
         if (comment_match) {
            comment_html = comment_match[1];
            htm = htm.replace (comment_html, '');
            if (debug[2]) {
               console.log ('[check_fix_matching_divs] comment_html:', comment_html);
            }
         }
         var pieces = htm.split (div_re);
         new_htm.push (pieces[0]);
         var n_new_closing_divs = 0;
         for (var i=0; i<n_tags; i++) {
            if (matched_pair_b[i]) {
               new_htm.push (div_matches[i]);
            } else {
               if (div_matches[i].substr(0, 2) == '<d') {
                  new_htm.push (div_matches[i]);
                  n_new_closing_divs++;
                  if (debug[2]) {
                     console.log ('[check_fix_matching_divs] unmatched opening div:', div_matches[i]);
                  }
               } else {
                  if (debug[2]) {
                     console.log ('[check_fix_matching_divs] unmatched closing div', i);
                  }
               }
            }
            new_htm.push (pieces[i+1]);
         }
         for (var i=0; i<n_new_closing_divs; i++) {
            new_htm.push ('</div>');
         }
         if (comment_html) {
            new_htm.push (comment_html);
         }
      }
   }
   new_htm = new_htm.join ('');
   if (debug[2]) {
      console.log ('[check_fix_matching_divs] new_htm:', new_htm);
   }
   return new_htm;
}
function report_errors () {
   if (errmsgs.length) {
      alert (rdgm_utils.plural ('Error found', 'Errors found', errmsgs.length) + ':\n\n' + errmsgs.join ('\n'));
   }
}
function parse_html_block_pattern (tags) {
   var tags_pat = '(' + tags.join (')|(') + ')';
   tags_pat = tags_pat.replace (/([\[\]\*])/g, '\\$1');
   tags_pat = '((' + tags_pat + ')\\s*)';
   return tags_pat;
}
function find_opening_tags_at_end (htm) {
   var all_opening_tags_match = htm.match (/(\s*(<[^/][^>]*>\s*)*)$/);
   if (debug[10]) {
      console.log ('[find_opening_tags_at_end] htm:', htm);
      console.log ('[find_opening_tags_at_end] all_opening_tags_match:', all_opening_tags_match);
   }
   var opening_tags = '';
   if (all_opening_tags_match && typeof (all_opening_tags_match[1]) != 'undefined') {
      var all_opening_tags = all_opening_tags_match[1];
      var opening_tags_match = all_opening_tags.match (/\s*(<[^/][^>]*>\s*)|([^<]*$)/g);
      if (debug[10]) {
         console.log ('[find_opening_tags_at_end] all_opening_tags:', all_opening_tags);
         console.log ('[find_opening_tags_at_end] opening_tags_match:', opening_tags_match);
      }
      if (opening_tags_match) {
         var opening_tags_array = [];
         var n_matches = opening_tags_match.length;
         for (var i_match=n_matches-1; i_match>=0; i_match--) {
            var tag = opening_tags_match[i_match];
            if (tag == '') {
               continue;
            }
            if (tag[0] != '<' && ! /\s/.test(tag[0])) {
               break;
            }
            var stag = tag.replace (/\s/g, '').substr (0, 4);
            if (stag == '<img' || stag == '<inp') {
               break;
            }
            opening_tags_array.unshift (tag);
         }
         opening_tags = opening_tags_array.join ('');
      }
   }
   if (debug[10]) {
      console.log ('[find_opening_tags_at_end] opening_tags:', opening_tags);
   }
   return opening_tags;
}
function parse_html_block (htm, shortcodes, next_shortcodes, is_all_whitespace_b) {
   if (debug[5] || debug[10]) {
      console.log ('[parse_html_block] shortcodes: ', shortcodes, ', next_shortcodes: ', next_shortcodes);
      console.log ('[parse_html_block] htm: ', htm);
   }
   var all_whitespace_b = false;
   var html_block;
   var htm_index;
   var offset       = 0;
   var opening_tags = '';
   if (shortcodes[0] != '^') {
      var shortcodes_pat = parse_html_block_pattern (shortcodes);
      var re = new RegExp (shortcodes_pat);
      var shortcodes_pos = htm.search (re);
      if (shortcodes_pos == -1) {
         if (debug[10]) {
            console.log ('[parse_html_block] html_block: NA');
         }
         return {htm_block: 'NA', htm_index: -1};
      }
      offset = 3;
      var all_before_shortcode = htm.substr (0, shortcodes_pos);
      opening_tags = find_opening_tags_at_end (all_before_shortcode);
   }
   var next_shortcodes_pos = -1;
   if (next_shortcodes.length) {
      var shortcodes_pat = parse_html_block_pattern (next_shortcodes);
      re = new RegExp (shortcodes_pat);
      next_shortcodes_pos = htm.substr (shortcodes_pos+offset).search (re);
   }
   if (next_shortcodes_pos == -1) {
      html_block = opening_tags + htm.substr (shortcodes_pos);
   } else if (next_shortcodes_pos == 0) {
      html_block = '';
   } else {
      var next_opening_tags = '';
      var all_before_next_shortcode = htm.substr (shortcodes_pos, offset + next_shortcodes_pos);
      next_opening_tags = find_opening_tags_at_end (all_before_next_shortcode);
      var html_before_next_opening_tags;
      if (next_opening_tags != '') {
         var next_opening_tags_pat = next_opening_tags + '$';
         re = new RegExp (next_opening_tags_pat);
         html_before_next_opening_tags = all_before_next_shortcode.replace (re, '');
      } else {
         html_before_next_opening_tags = all_before_next_shortcode;
      }
      html_block = opening_tags + html_before_next_opening_tags;
      if (html_block != '') {
         var htm_wo_tags = html_before_next_opening_tags.replace (/<[^>]+>/gm, '');
         if (is_all_whitespace_b != undefined) {
            htm_wo_tags = htm_wo_tags.replace (/&nbsp;|&emsp;|<br[^>]*>/gm, '');
            if (htm_wo_tags.search (/\S/) == -1) {
               if (debug[0]) {
                  console.log ('[parse_html_block] all whitespace html_block:', html_block);
               }
               all_whitespace_b = true;
            }
         }
      }
   }
   var htm_index = shortcodes_pos - opening_tags.length;
   var r = {'htm_block': html_block, 'htm_index': htm_index};
   if (is_all_whitespace_b) {
      r.all_whitespace = all_whitespace_b;
   }
   if (debug[5] || debug[10]) {
      console.log ('[parse_html_block] r:', r);
   }
   return r;
}
function is_only_tags_and_whitespace (htm, take_out_shortcode) {
   if (debug[10]) {
      console.log ('[is_only_tags_and_whitespace] htm:', htm);
   }
   var htm = htm.replace (/<[^>]+>/gm, '');
   if (take_out_shortcode) {
      htm = htm.replace (take_out_shortcode, '');
   }
   var only_tags_and_whitespace_b = htm.search (/\S/) == -1;
   if (debug[10]) {
      console.log ('[is_only_tags_and_whitespace] only_tags_and_whitespace_b:', only_tags_and_whitespace_b);
   }
   return only_tags_and_whitespace_b;
}
this.rdgm_register_qqs = function (local_qq_dataset, local_no_use_f) {
   qq_dataset            = local_qq_dataset;
   dataset_save_no_use_f = local_no_use_f;
   var title;
   if (qq_dataset == 'qq') {
      title = 'Swinging Hotspot - ' + T ('Enable progress recording for quizzes and flashcard decks');
   } else {
      if (dataset_save_no_use_f) {
         title = 'Swinging Hotspot - ' + T ('Save quiz/deck as dataset');
      } else {
         title = 'Swinging Hotspot - ' + T ('Use datasets or save quizzes and decks as datasets');
      }
   }
   $ ('#rdgm_register_qqs_header div.rdgm_edit_main_menu_title').html (title);
   if (! q.maker_logged_in_b) {
      check_maker_session_id ('rdgm_register_qqs2');
   } else {
      q.rdgm_register_qqs2 ();
   }
}
this.rdgm_register_qqs2 = function () {
   if (q.username.substr (0, 10) == 'mini-maker') {
      q.maker_logged_in_b = false;
   }
   if (! q.maker_logged_in_b) {
      $.removeCookie ('maker_session_id', {path: '/'});
      if (q.username.substr (0, 10) == 'mini-maker') {
         var enable_progress_save_dataset = qq_dataset == 'qq' ? 'enable progress recording' : 'save as dataset';
         $ ('#enable_progress_save_dataset').html (enable_progress_save_dataset);
      }
      $ ('#rdgm_register_qqs_main').hide ();
      $ ('#rdgm_register_qqs_login').show ();
      $ ('#rdgm_register_qqs_dialog_box').show ();
      $ ('#rdgm_edit_username').focus ();
   } else {
      q.rdgm_register_qqs3 ();
   }
}
this.rdgm_register_qqs3 = function (change_f) {
   if (! change_f) {
      change_f = 0;
   }
   if (debug[0]) {
      console.log ('[rdgm_register_qqs3] change_f:', change_f);
   }
   $ ('#rdgm_register_qqs_login').hide ();
   $ ('#rdgm_register_qqs_main').html ('');
   var sign_out =   '<a href="javascript: rdgm_edit.sign_out ()" class="rdgm_edit_smaller">'
                  +    T ('Sign out')
                  + '</a>';
   var display_username = q.username;
   if (display_username.substr (4, 6) == '-maker') {
      display_username = display_username.substr (11);
   }
   $ ('#rdgm_register_qqs_user').html (display_username + '&ensp;' + sign_out).show ();
   if (! q.permalink) {
      q.permalink = q.get_permalink ();
   }
   var check_b = false;
   q.qrecord_ids_datasets    = [];
   q.dataset_intros          = [];
   q.use_dataset_question_fs = [];
   if (q.rwizard_b) {
      var q_f = q.rdgm_deck == 'rdgm' ? 'Q' : 'F';
      q.q_fs                 = [q_f];
      var qrecord_id_dataset     = '';
      var dataset_intro_b        = false;
      var use_dataset_question_f = false;
      if (qq_dataset == 'qq') {
         qrecord_id_dataset = rdgm_utils.get_attr (q.rdgm_deck_attributes, 'qrecord_id');
         if (! qrecord_id_dataset) {
            qrecord_id_dataset = rdgm_utils.get_attr (q.rdgm_deck_attributes, 'xqrecord_id');
            if (qrecord_id_dataset) {
               qrecord_id_dataset = '$x$' + qrecord_id_dataset;
            }
         }
      } else {
         qrecord_id_dataset = rdgm_utils.get_attr (q.rdgm_deck_attributes, 'dataset');
         dataset_intro_b    = rdgm_utils.get_attr (q.rdgm_deck_attributes, 'dataset_intro') != 'false';
         check_b = true;
         if (q.rdgm_deck == 'rdgm') {
            use_dataset_question_f = !! rdgm_.get_rdgmdata (0, 'use_dataset_questions_htm');
         } else {
            use_dataset_question_f = !! qcard_.get_deckdata (0, 'use_dataset_card_html');
         }
      }
      q.qrecord_ids_datasets    = [qrecord_id_dataset];
      q.dataset_intros          = [dataset_intro_b];
      q.use_dataset_question_fs = [use_dataset_question_f];
   } else {
      var r = get_rdgm_qdeck_shortcodes ();
      if (! r) {
         return false;
      }
      var matches = r.matches;
      if (matches) {
         var htm = r.htm;
         var i_start_pos = -4;
         var shortcode;
         q.q_fs = [];
         var n_matches = matches.length;
         for (var i=0; i<n_matches; i++) {
            shortcode = matches[i];
            var q_f = shortcode.substr (0, 5) == '[rdgm' ? 'Q' : 'F';
            q.q_fs.push (q_f);
            var shortcode_r = rdgm_utils.replace_smart_quotes (shortcode);
            var qrecord_id_dataset = '';
            if (qq_dataset == 'qq') {
               qrecord_id_dataset = rdgm_utils.get_attr (shortcode_r, 'qrecord_id');
               if (! qrecord_id_dataset) {
                  qrecord_id_dataset = rdgm_utils.get_attr (shortcode_r, 'xqrecord_id');
                  if (qrecord_id_dataset) {
                     qrecord_id_dataset = '$x$' + qrecord_id_dataset;
                  }
               }
            } else {
               qrecord_id_dataset = rdgm_utils.get_attr (shortcode_r, 'dataset');
               if (! qrecord_id_dataset) {
                  qrecord_id_dataset = rdgm_utils.get_attr (shortcode_r, 'use_dataset');
                  if (qrecord_id_dataset) {
                     qrecord_id_dataset = '$use$' + qrecord_id_dataset;
                  }
               }
            }
            var dataset_intro_b = false;
            if (qrecord_id_dataset) {
               check_b = true;
               dataset_intro_b = rdgm_utils.get_attr (shortcode, 'dataset_intro') != 'false';
            }
            var i_pos = htm.indexOf (shortcode, i_start_pos+4);
            i_start_pos = i_pos;
            var i_end_quiz_deck = htm.indexOf ('[/q', i_start_pos);
            if (debug[0] || debug[3]) {
               console.log ('[rdgm_register_qqs3] shortcode:', shortcode, ', i_pos:', i_pos, ', i_end_quiz_deck:', i_end_quiz_deck);
            }
            var qdhtm = htm.substring (i_start_pos, i_end_quiz_deck);
            var use_dataset_question_f = qdhtm.search (/use_dataset_(question|card)=/) != -1;
            q.qrecord_ids_datasets.push (qrecord_id_dataset);
            q.dataset_intros.push (dataset_intro_b);
            q.use_dataset_question_fs.push (use_dataset_question_f);
         }
      } else {
         $ ('#rdgm_register_qqs_main').html ('<span style="color: red; font-weight: bold;">' + T ('Did not find "[rdgm...]" or ["qdeck...]" shortcodes') + '</span>').show ();
         $ ('#rdgm_register_qqs_dialog_box').show ();
      }
   }
   if (check_b || qq_dataset == 'dataset') {
      var qrecord_ids = [];
      var n_qrecord_ids = q.qrecord_ids_datasets.length;
      for (var i=0; i<n_qrecord_ids; i++) {
         qrecord_ids.push (q.qrecord_ids_datasets[i].replace ('$x$', ''));
      }
      var data = {maker_session_id: q.maker_session_id,
                  qq_dataset:       qq_dataset,
                  qrecord_ids:      JSON.stringify (qrecord_ids),
                  q_fs:             JSON.stringify (q.q_fs),
                  change_f:         change_f,
                  callback:         'rdgm_register_qqs4',
                  permalink:        q.permalink};
      if (qq_dataset == 'dataset') {
         data.ip = get_rdgm_param ('wp_server_address', '');
      }
      rdgm_utils.jjax (qname, 0, '', 'check_registered', data);
   } else {
      q.rdgm_qdeck_ids = [];
      q.rdgm_page_urls = [];
      q.rdgm_register_qqs4 (change_f);
   }
}
this.rdgm_register_qqs4 = function (change_f) {
   if (debug[0]) {
      console.log ('[rdgm_register_qqs4] q.rdgm_qdeck_ids:', q.rdgm_qdeck_ids);
      console.log ('[rdgm_register_qqs4] q.rdgm_page_urls:', q.rdgm_page_urls);
   }
   var h = [];
   h.push ('<table class="rdgm_register_qqs" align="center" border="0">');
   h.push ('<tr>');
   if (! dataset_save_no_use_f) {
      h.push (   '<th>');
      h.push (      'Quiz/deck&nbsp;no.');
      h.push (   '</th>');
   }
   if (qq_dataset == 'qq') {
      h.push ('<th>');
      h.push (   'Name&nbsp;(qrecord_id)&nbsp;<img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="cursor_help" title="You can change the display name - go to r_diagrams.com/admin &ldquo;Manage quizzes and decks&rdquo;" />');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Registered?');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Enabled?');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Enable/<br />disable');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'URL <img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="cursor_help" title="Save/do not save page address in database. Uncheck and check to update."/>');
      h.push ('</th>');
   } else {
      h.push ('<th>');
      h.push (   'Intro<img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="rdgm_edit_icon_smaller cursor_help" title="Whether quiz/deck will start with a menu to choose units/topics"/>');
      h.push ('</th>');
      if (! dataset_save_no_use_f) {
         h.push ('<th colspan="2" class="rdgm_edit-border-left">');
         h.push (   'Use&nbsp;dataset(s)');
         h.push ('</th>');
         h.push ('<th class="rdgm_edit-border-left">');
      } else {
         h.push ('<th>');
      }
      h.push (   'Dataset');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Saved?');
      h.push ('</th>');
      h.push (   '<th>');
      h.push (      'Save');
      h.push (   '</th>');
   }
   h.push ('</tr>');
   var i_rdgm = 0;
   var i_deck = 0;
   datasets_used = [];
   var n_rows = q.qrecord_ids_datasets.length;
   for (var i_row=0; i_row<n_rows; i_row++) {
      datasets_used[i_row] = '';
      h.push ('<tr class="row' + i_row + '">');
      var Quiz_Deck;
      var quiz_deck;
      var question_card;
      if (q.q_fs[i_row] == 'Q') {
         i_rdgm++;
         Quiz_Deck     = 'Quiz ' + i_rdgm;
         quiz_deck     = 'quiz';
         question_card = 'question';
      } else {
         i_deck++;
         Quiz_Deck     = 'Deck ' + i_deck;
         quiz_deck     = 'deck';
         question_card = 'card';
      }
      if (! dataset_save_no_use_f) {
         h.push (   '<td>');
         h.push (      Quiz_Deck);
         h.push (   '</td>');
      }
      var using_dataset_b = false;
      var qrecord_id_dataset;
      if (qq_dataset == 'qq') {
         h.push (   '<td>');
         h.push (      q.qrecord_ids_datasets[i_row].replace ('$x$', ''));
         h.push (   '</td>');
      } else {
         h.push (   '<td class="rdgm_edit_center">');
         if (! dataset_save_no_use_f) {
            qrecord_id_dataset = rdgm_utils.addSlashes (q.qrecord_ids_datasets[i_row]);
            using_dataset_b = qrecord_id_dataset.substr (0, 5) == '$use$';
            if (using_dataset_b || q.rdgm_qdeck_ids[i_row]) {
               var checked = q.dataset_intros[i_row] ? 'checked' : '';
               h.push ('<input type="checkbox" class="rdgm_checkbox" onclick="rdgm_edit.update_qrecord_id_dataset_attr (' + i_row + ', \'dataset_intro\', this.checked ? \'true\' : \'false\', false)" ' + checked + ' />');
            }
         }
         h.push (   '</td>');
         if (! dataset_save_no_use_f) {
            var select      = ' select';
            if (using_dataset_b) {
               datasets_used[i_row] = qrecord_id_dataset.substr (5).split ('; ');
            } else {
               if (q.qrecord_ids_datasets[i_row]) {
                  select = '';
               }
            }
            h.push (   '<td class="rdgm_edit-border-left use_dataset' + select + '">');
            h.push (   '</td>');
            h.push (   '<td>');
            h.push (   '</td>');
            h.push (   '<td class="rdgm_edit-border-left">');
            if (! using_dataset_b) {
               h.push (    q.qrecord_ids_datasets[i_row]);
            }
         } else {
            h.push (   '<td>');
            if (! using_dataset_b) {
               h.push (    q.qrecord_ids_datasets[i_row]);
            }
         }
         h.push (   '</td>');
      }
      if (! using_dataset_b) {
         var registered;
         var enabled;
         var add_delete;
         var save_url = '';
         var url_checked = '';
         var title;
         qrecord_id_dataset = q.qrecord_ids_datasets[i_row];
         if (q.rdgm_qdeck_ids[i_row] && qrecord_id_dataset.substr (0, 3) != '$x$') {
            registered = 'Yes';
            enabled = 'Yes';
            if (qq_dataset == 'qq') {
               title = 'Disable progress recording for this ' + quiz_deck + '. (You can reenable it later)';
            } else {
               title = 'Changes to this ' + quiz_deck + ' will not be saved in dataset ' + qrecord_id_dataset.replace (/'/g, '&#39;');
            }
            add_delete =   '<button class="rdgm_edit_image_button" onclick="rdgm_edit.deregister_qq (' + i_row + ')">'
                         +    '<img src="' + rdgm_edit_params.url + 'images/delete.png" '
                         +         'title="' + title + '" '
                         +         'class="icon_clickable" />'
                         + '</button>';
            title = 'Saved page address currently: ';
            if (qq_dataset == 'qq' && q.rdgm_page_urls[i_row]) {
               if (q.rdgm_page_urls[i_row] == q.permalink) {
                  url_checked = 'checked';
               }
               title += q.permalink;
            } else {
               title += '(none)';
            }
            save_url =   '<span id="update_page_url' + i_row + '" title="' + title + '">'
                       +    '<input type="checkbox" class="register_checkbox" onclick="rdgm_edit.update_page_url (this, ' + i_row + ')" ' + url_checked + ' />'
                       + '</span>';
         } else {
            registered = q.rdgm_qdeck_ids[i_row] ? 'Yes' : 'No';
            enabled = 'No';
            if (qq_dataset == 'qq') {
               title = 'Enable recording and reporting of student scores for this ' + quiz_deck;
            } else {
               title = 'Save this ' + quiz_deck + ' in database';
            }
            if (qq_dataset == 'dataset' && q.use_dataset_question_fs[i_row]) {
               title = 'Unavailable - ' + quiz_deck.substr (0, 4) + ' with ' + question_card + 's from a dataset (&ldquo;use_dataset_' + question_card + '=...&rdquo;) cannot be saved as a dataset';
               add_delete =   '<img src="' + rdgm_edit_params.url + 'images/add_icon.png" '
                            +      'style="filter: grayscale(100%);" title="' + title + '" />';
            } else {
               add_delete =   '<img src="' + rdgm_edit_params.url + 'images/add_icon.png" '
                            +      'title="' + title + '" '
                            +      'onclick="rdgm_edit.register_qq (\'' + rdgm_utils.addSlashes (qrecord_id_dataset) + '\', ' + i_row + ', false, true)" '
                            +      'class="icon_clickable" />';
            }
         }
         h.push (   '<td class="rdgm_edit_center">');
         h.push (      registered);
         h.push (   '</td>');
         if (qq_dataset == 'qq') {
            h.push (   '<td class="rdgm_edit_center">');
            h.push (      enabled);
            h.push (   '</td>');
         }
         h.push (   '<td class="rdgm_edit_center">');
         h.push (      add_delete);
         h.push (   '</td>');
      }
      if (qq_dataset == 'qq') {
         h.push ('<td class="rdgm_edit_center" valign="middle">');
         h.push (   save_url);
         h.push ('</td>');
      }
      h.push (   '<td class="enter_qrecord_id">');
      h.push (   '</td>');
      h.push ('</tr>');
   }
   n_rdgmzes = i_rdgm;
   n_decks   = i_deck;
   h.push ('</table>');
   h.push ('<div id="register_qq_feedback">');
   h.push ('<div>');
   $ ('#rdgm_register_qqs_main').html (h.join ('\n')).show ();
   if (qq_dataset == 'dataset') {
      for (var i_row=0; i_row<n_rows; i_row++) {
         q.register_qq (q.qrecord_ids_datasets[i_row], i_row, datasets_used[i_row]);
      }
   }
   $ ('#rdgm_register_qqs_dialog_box').show ();
   if (change_f == 1 && ! q.rwizard_b) {
      var msg;
      if (qq_dataset == 'qq') {
         msg = 'registration changed page text';
      } else {
         msg = 'page text changed';
      }
      $ ('#register_qq_feedback').html ('Please remember to Update - ' + msg).css ({color: 'green'});
   }
}
this.rdgm_exit_register_qqs = function () {
   $ ('#rdgm_register_qqs_dialog_box').hide ();
   $ ('#rdgm_register_qqs_login').hide ();
   $ ('#rdgm_register_qqs_main').hide ();
   if (waiting_for_quiz_deck_click) {
      waiting_for_quiz_deck_click = '';
      q.$edit_area.off ('mouseup');
   }
   if (q.rwizard_b) {
      $ ('div.modal_dialog_rwizard').show ();
      $ ('div#rdgm_register_qqs_return_to_wizard').hide ();
   }
}
this.deregister_qq = function (i_row) {
   $ ('#register_qq_feedback').html ('');
   /* MARK DELETED IN DATABASE - NO LONGER DOING HERE.
   if (qq_dataset == 'qq') {
      var data = {maker_session_id: q.maker_session_id,
                  jjax:             1,
                  qrecord_id:       q.qrecord_ids_datasets[i_row],
                  i_row:            i_row};
      rdgm_utils.jjax (qname, 0, '', 'mark_quiz_deck_deleted', data);
   }
   */
   var remove_f = true;
   q.rdgm_register_qq3 ('', q.q_fs[i_row], i_row, q.qrecord_ids_datasets[i_row], remove_f);
}
this.qq_deregistered = function (i_row, shared_f) {
   if (i_row >= 0) {
      q.rdgm_register_qqs3 ();
      var htm;
      if (shared_f && shared_f == 1) {
         htm =   'Quiz/deck no longer active for you.&nbsp; Note that it had been<br />'
               + 'shared and that others are using it in their classes.<br />'
               + 'Please leave qrecord_id="..." in place.';
      } else {
         htm = 'Quiz/deck registration removed from database.  (It can be restored on the Manage quizzes/decks page)';
      }
      setTimeout ("jQuery ('#register_qq_feedback').html ('" + htm + "').css ({color: 'green'})", 500);
   } else {
      $ ('#register_qq_feedback').html ('Unable to remove quiz/deck registration').css ({color: 'red'});
   }
}
this.register_qq = function (qrecord_id_dataset, i_row, local_datasets_used,
                                                                new_dataset_f) {
   if (debug[0]) {
      console.log ('[register_qq] qrecord_id_dataset:', qrecord_id_dataset, ', i_row:', i_row, ', local_datasets_used:', local_datasets_used);
   }
   $ ('#register_qq_feedback').html ('');
   if (qrecord_id_dataset) {
      if (qq_dataset == 'qq') {
         if (qrecord_id_dataset.substr (0, 3) == '$x$') {
            q.update_qrecord_id_dataset_attr (i_row, 'xqrecord_id', qrecord_id_dataset.substr (3));
            return;
         }
         qrecord_id_dataset = qrecord_id_dataset.replace (q.username + '-', '');
      }
   } else {
      qrecord_id_dataset = '';
   }
   var htm = [];
   if (qq_dataset == 'qq') {
      var display_username = q.username;
      if (display_username.substr (4, 6) == '-maker') {
         display_username = display_username.substr (11);
      }
      htm.push ('<form action="nada" onSubmit="return rdgm_edit.register_qq2 (' + i_row + ')">');
      htm.push (   '<nobr>');
      htm.push (   'Name:&nbsp;' + display_username + '-');
      htm.push (   '<input id="enter_qrecord_id' + i_row + '" type="text" class="enter_qrecord_id" onfocus="jQuery (\'#register_qq_feedback\').html (\'\')" value="' + qrecord_id_dataset + '" />');
      htm.push (   '&nbsp;');
      htm.push (   '<input type="submit" value="Register" />');
      htm.push (   '</nobr>');
      htm.push ('</form>');
   } else {
      htm.push ('<nobr>');
      var onchange = '';
      if (! local_datasets_used && new_dataset_f) {
         onchange = 'onchange="rdgm_edit.set_save_create_button (' + i_row + ', this)" ';
      }
      var n_dataset_options = 0;
      var opt = [];
      if (q.available_datasets) {
         var n_existing_datasets = q.available_datasets.length;
         for (var i=0; i<n_existing_datasets; i++) {
            if (q.available_dataset_q_fs[i] == q.q_fs[i_row]) {
               if (local_datasets_used || q.available_dataset_is_this_maker_fs[i]) {
                  var selected = '';
                  if (local_datasets_used) {
                     if (local_datasets_used.indexOf (q.available_datasets[i]) != -1) {
                        selected = ' selected';
                     }
                  }
                  opt.push ('   <option' + selected + '>');
                  opt.push (       q.available_datasets[i]);
                  opt.push ('   </option>');
                  n_dataset_options++;
               }
            }
         }
      }
      var title = '';
      var questions_cards = q.q_fs[i_row] == 'Q' ? 'questions' : 'cards';
      if (local_datasets_used) {
         title = ' title="Select dataset(s) from which ' + questions_cards + ' will be drawn';
         if (! q.rwizard_b) {
            title += '.  You can mix and match questions from datasets using the interactive wizard';
         }
         title += '"';
      } else {
         if (opt.length) {
            title = ' title="Add ' + questions_cards + ' to an existing dataset or create a new dataset"';
         }
      }
      if (opt.length || ! local_datasets_used) {
         var multiple = '';
         if (local_datasets_used && ! new_dataset_f) {
            multiple = 'multiple="multiple" ';
         }
         htm.push ('<select class="new_existing_dataset" ' + multiple + onchange + 'data-i_row="' + i_row + '">');
      }
      if (opt.length) {
         htm.push (   '<option>');
         htm.push (      'Select...');
         htm.push (   '</option>');
         if (! local_datasets_used) {
            if (new_dataset_f) {
               if (n_dataset_options > 8) {
                  htm.push (   '<option>');
                  htm.push (      'Create new');
                  htm.push (   '</option>');
               }
            } else {
               htm.push (   '<option>');
               htm.push (   '</option>');
            }
         }
         htm.push (opt.join ('\n'));
      } else if (local_datasets_used) {
         htm.push (   'None available');
         htm.push (   '<img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="rdgm_edit_icon_smaller" title="You can use the wizard and &ldquo;Select from database...&rdquo; to request permission to use datasets">');
      }
      if (! local_datasets_used && new_dataset_f) {
         htm.push (   '<option>');
         htm.push (      'Create new');
         htm.push (   '</option>');
      }
      if (opt.length || ! local_datasets_used) {
         htm.push ('</select><img src="' + rdgm_edit_params.url + 'images/info_icon.png" class="rdgm_edit_icon_smaller cursor_help"' + title + ' />');
      }
      if (! local_datasets_used && new_dataset_f) {
         htm.push ('&nbsp;');
         var disabled = opt.length ? 'disabled' : '';
         htm.push ('<button onclick="rdgm_edit.new_existing_dataset (' + i_row + ')" ' + disabled +'>');
         if (opt.length && n_dataset_options <= 8) {
            htm.push ('Save');
         } else {
            htm.push ('Create');
         }
         htm.push ('</button>');
      }
      htm.push ('</nobr>');
   }
   $ ('#rdgm_register_qqs_dialog_box').css ('width', '');
   $ ('table.rdgm_register_qqs  tr.row' + i_row + ' td.enter_qrecord_id').html ('');
   if (local_datasets_used || ! new_dataset_f) {
      var $td = $ ('table.rdgm_register_qqs tr.row' + i_row + ' td.use_dataset.select');
      $td.html (htm.join (''));
      if ($td.length) {
         var $select = $td.find ('select');
         $select.select2 ({placeholder: 'Select... (type to search)',
                           width: '250px'});
         if (! local_datasets_used) {
            $td.find ('input.select2-search__field').width (248);
         }
         $select.on ('select2:close', rdgm_edit.update_use_dataset);
      }
   } else {
      $ ('table.rdgm_register_qqs tr.row' + i_row + ' td.enter_qrecord_id').html (htm.join (''));
      $ ('table.rdgm_register_qqs tr.row' + i_row + ' input.enter_qrecord_id').focus ();
   }
}
this.get_permalink = function () {
   var permalink;
   if (q.wp_editing_page_f) {
      var site_url = $ ('#wp-admin-bar-site-name a').attr ('href');
      if (! site_url) {
         site_url = '';
      }
      permalink = $ ('#sample-permalink a').attr ('href');
      if (! permalink) {
         var post_name = $ ('#editable-post-name-full').html ();
         if (post_name) {
            permalink = site_url + post_name;
         } else {
            permalink = $ ('#view-post-btn a').attr ('href');
         }
      }
      if (! permalink) {
         permalink = $ ('a:contains("View Page")').attr ('href');
      }
      if (permalink) {
         permalink = permalink.replace ('&preview=true', '');
      }
   } else {
      permalink = document.location.href;
   }
   return permalink
}
this.new_existing_dataset = function (i_row) {
   var select_el = $ ('table.rdgm_register_qqs tr.row' + i_row + ' td.enter_qrecord_id select.new_existing_dataset')[0];
   var selectedIndex = select_el.selectedIndex;
   if (debug[3]) {
      console.log ('[new_existing_dataset] selectedIndex:', selectedIndex);
   }
   var value = select_el.options[selectedIndex].value;
   if (debug[3]) {
      console.log ('[new_existing_dataset] value:', value);
   }
   if (value == 'Select...') {
      alert ('Please select an option from the drop-down list');
   } else {
      if (value == 'Create new') {
         var htm =   '<input id="enter_qrecord_id' + i_row + '" type="text" class="enter_qrecord_id" onfocus="jQuery (\'#register_qq_feedback\').html (\'\')" placeholder="Dataset name" />'
                   + '&nbsp;'
                   + '<input type="button" onclick="rdgm_edit.register_qq2 (' + i_row + ', 1)" value="Create" />';
         $ ('#rdgm_register_qqs_dialog_box').css ('width', '');
         $ ('table.rdgm_register_qqs tr.row' + i_row + ' td.enter_qrecord_id').html (htm);
         $ ('table.rdgm_register_qqs tr.row' + i_row + ' input.enter_qrecord_id').focus ();
      } else {
         var i_dataset = q.available_datasets.indexOf (value);
         q.rdgm_register_qq3 ('', q.available_dataset_q_fs[i_dataset], i_row, value);
      }
   }
}
this.set_save_create_button = function (i_row, select_el) {
   var label;
   if (select_el.value == 'Create new') {
      label = 'Create';
   } else {
      label = 'Save';
   }
   var $button = $ ('table.rdgm_register_qqs tr.row' + i_row + ' button');
   $button.html (label);
   if (select_el.value == "Select...") {
      $button.attr ('disabled', true);
   } else {
      $button.removeAttr ('disabled');
   }
}
this.register_qq2 = function (i_row, create_f) {
   var qrecord_id_dataset;
   if (qq_dataset == 'qq' || create_f) {
      qrecord_id_dataset = $ ('table.rdgm_register_qqs tr.row' + i_row + ' input.enter_qrecord_id').val ();
      if (debug[0]) {
         console.log ('[register_qq2] qrecord_id_dataset:', qrecord_id_dataset);
      }
      var quiz_deck = q.q_fs[i_row] == 'Q' ? 'quiz' : 'deck';
      if (qrecord_id_dataset == '') {
         $ ('#register_qq_feedback').html ('Please enter name for ' + quiz_deck).css ({color: 'red'});
         return false;
      } else if (qrecord_id_dataset.indexOf ('"') != -1) {
         $ ('#register_qq_feedback').html ('Double-quotes not allowed in name for ' + quiz_deck).css ({color: 'red'});
         return false;
      } else if (qrecord_id_dataset.indexOf (';') != -1) {
         $ ('#register_qq_feedback').html ('Semicolons not allowed in name for ' + quiz_deck).css ({color: 'red'});
         return false;
      }
      if (qq_dataset == 'qq') {
         var username = q.username;
         if (username.substr (0, 10) == 'also-maker') {
            username = username.substr (11);
         }
         qrecord_id_dataset = username + '-' + qrecord_id_dataset;
      }
   } else {
      qrecord_id_dataset = $ ('table.rdgm_register_qqs tr.row' + i_row + ' select.new_existing_dataset').val ();
   }
   qrecord_id_dataset = qrecord_id_dataset.replace (/ +/g, ' ');
   var data = {qq_dataset:       qq_dataset,
               maker_session_id: q.maker_session_id,
               q_f:              q.q_fs[i_row].toUpperCase (),
               i_row:            i_row,
               callback:         'rdgm_register_qq3',
               permalink:        q.permalink};
   if (qq_dataset == 'dataset') {
      data.ip = get_rdgm_param ('wp_server_address', '');
   }
   if (debug[0]) {
      console.log ('[register_qq2] data:', data);
   }
   rdgm_utils.jjax (qname, 0, qrecord_id_dataset, 'register_qq', data);
   clearTimeout (register_qq3_timeout);
   register_qq3_response_f = false;
   register_qq3_timeout = setTimeout ('rdgm_edit.check_register_qq3_response ()', 3000);
   return false;
}
this.rdgm_register_qq3 = function (result, q_f, i_row, qrecord_id_dataset, remove_f) {
   if (debug[3]) {
      console.log ('[rdgm_register_qq3] i_row:', i_row, ', qrecord_id_dataset:', qrecord_id_dataset);
   }
   register_qq3_response_f = true;
   if (result == 'dup') {
      var htm = 'That name is already in use.';
      $ ('#register_qq_feedback').html (htm).css ({color: 'red'});
   } else if (result == 'err') {
      $ ('#register_qq_feedback').html ('Unable to update database.').css ({color: 'red'});
   } else {
      var attr;
      if (qq_dataset == 'qq') {
         attr = 'qrecord_id';
      } else {
         attr = 'dataset';
      }
      q.update_qrecord_id_dataset_attr (i_row, attr, qrecord_id_dataset, remove_f);
   }
}
this.check_register_qq3_response = function () {
   if (debug[0]) {
      console.log ('[check_register_qq3_response] register_qq3_response_f:', register_qq3_response_f);
   }
   if (! register_qq3_response_f) {
      var registration_save = qq_dataset == 'qq' ? T ('registration') : T ('save');
      $ ('#register_qq_feedback').html (T ('Did not get') + ' ' + registration_save + ' ' + T ('confirmation') + '.&nbsp; ' + T ('Please close and re-open this menu and check/try again.')).css ({color: 'red'});
   }
}
this.check_syntax_save_dataset_questions = function () {
   rdgm_syntax_check ();
}
this.update_use_dataset = function (e) {
   var $target  = $ (e.target);
   var i_row    = $target.data ('i_row');
   var datasets = $target.val ();
   if (typeof (datasets) == 'string') {
      datasets = [datasets];
   }
   if (debug[3]) {
      console.log ('[update_use_dataset] i_row:', i_row, ', datasets:', datasets);
   }
   var prev_datasets = '';
   if (typeof datasets_used[i_row] == 'object') {
      prev_datasets = datasets_used[i_row].join ('; ');
   }
   if (debug[3]) {
      console.log ('[update_use_dataset] prev_datasets:', prev_datasets);
   }
   var new_datasets = '';
   var n_datasets   = 0;
   if (typeof datasets == 'object') {
      new_datasets = datasets.join ('; ');
      n_datasets   = datasets.length;
   }
   if (new_datasets == prev_datasets) {
      return;
   }
   datasets_used[i_row] = new_datasets;
   for (var i=0; i<n_datasets; i++) {
      var i_available = q.available_datasets.indexOf (datasets[i]);
      if (q.available_dataset_is_this_maker_fs[i_available]) {
         var data = {maker_session_id: q.maker_session_id,
                     dataset:          datasets[i],
                     page_url:         q.permalink
                    }
         rdgm_utils.jjax (qname, 0, '', 'update_dataset_permission', data);
      }
   }
   var remove_f = n_datasets == 0;
   q.update_qrecord_id_dataset_attr (i_row, 'use_dataset', new_datasets, remove_f);
}
this.update_qrecord_id_dataset_attr = function (i_row, attr,
                                                qrecord_id_dataset, remove_f) {
   if (debug[3]) {
      console.log ('[update_qrecord_id_dataset_attr] i_row:', i_row, ', attr:', attr, ', qrecord_id_dataset:', qrecord_id_dataset);
   }
   if (qrecord_id_dataset == 'Select...') {
      return false;
   }
   if (q.rwizard_b) {
      var old_qrecord_id_dataset = rdgm_utils.get_attr (q.rdgm_deck_attributes, attr);
      if (old_qrecord_id_dataset) {
         if (remove_f) {
            if (qq_dataset == 'qq') {
               q.rdgm_deck_attributes = q.rdgm_deck_attributes.replace (' ' + attr, ' x' + attr);
            } else {
               q.rdgm_deck_attributes = q.rdgm_deck_attributes.replace (' ' + attr + '="' + old_qrecord_id_dataset + '"', '');
               var n_questions_cards = rwizard.questions_cards.length;
               for (var i=0; i<n_questions_cards; i++) {
                  rwizard.questions_cards[i].question_attributes
                     = rwizard.questions_cards[i].question_attributes.replace (/dataset_id="[^"]+"\s*/, '');
               }
            }
         } else {
            q.rdgm_deck_attributes = q.rdgm_deck_attributes.replace (old_qrecord_id_dataset, qrecord_id_dataset);
            if (attr == 'xqrecord_id') {
               q.rdgm_deck_attributes = q.rdgm_deck_attributes.replace (attr, 'qrecord_id');
            }
            if (debug[0]) {
               console.log ('[update_qrecord_id_dataset_attr] old_qrecord_id_dataset:', old_qrecord_id_dataset, ', qrecord_id_dataset: ', qrecord_id_dataset, ', q.rdgm_deck_attributes:', q.rdgm_deck_attributes);
            }
         }
      } else {
         q.rdgm_deck_attributes += ' ' + attr + '="' + qrecord_id_dataset + '"';
         if (debug[0]) {
            console.log ('[update_qrecord_id_dataset_attr] q.rdgm_deck_attributes:', q.rdgm_deck_attributes);
         }
      }
      rwizard.set_rwizard_data ('rdgm_deck_attributes', q.rdgm_deck_attributes);
      if (qq_dataset == 'qq') {
         var checked = q.rdgm_deck_attributes.indexOf ('xqrecord_id') == -1;
         $ ('#enable_progress_recording_checkbox')[0].checked = checked;
      } else {
         var checked = q.rdgm_deck_attributes.indexOf ('dataset') != -1;
         $ ('#save_as_dataset_checkbox')[0].checked = checked;
         rwizard.dataset_b = true;
      }
      q.rdgm_register_qqs3 ();
   } else {
      var r = get_rdgm_qdeck_shortcodes ();
      if (! r) {
         return false;
      }
      var matches = r.matches;
      if (matches) {
         var htm = r.htm;
         q.q_fs = [];
         q.qrecord_ids_datasets = [];
         var n_check_rdgmzes = 0;
         var n_check_decks   = 0;
         var n_matches = matches.length;
         for (var i=0; i<n_matches; i++) {
            var m = matches[i];
            if (m.substr (0, 5) == '[rdgm') {
               n_check_rdgmzes++;
            } else {
               n_check_decks++;
            }
         }
         if (n_check_rdgmzes != n_rdgmzes || n_check_decks != n_decks) {
            $ ('#register_qq_feedback').html ('The number of quizzes and/or flashcard decks has changed -- perhaps from editing.<br />Please close this "Enable progress recording" box and try again.').css ({color: 'red'});
            return false;
         }
         var i_start_pos = -4;
         var shortcode;
         for (var i=0; i<=i_row; i++) {
            shortcode = matches[i];
            var i_pos = htm.indexOf (shortcode, i_start_pos+4);
            i_start_pos = i_pos;
         }
         var i_end_pos = htm.indexOf (']', i_start_pos);
         if (debug[0] || debug[3]) {
            var shortcode_check = htm.substring (i_start_pos, i_end_pos+1);
            console.log ('[update_qrecord_id_dataset_attr] shortcode:', shortcode, ', i_pos:', i_pos, ', i_end_pos:', i_end_pos, ', shortcode_check:', shortcode_check);
         }
         shortcode = rdgm_utils.replace_smart_quotes (shortcode);
         var old_qrecord_id_dataset = rdgm_utils.get_attr (shortcode, attr);
         if (old_qrecord_id_dataset) {
            if (remove_f) {
               if (qq_dataset == 'qq') {
                  shortcode = shortcode.replace (' ' + attr, ' x' + attr);
               } else {
                  shortcode = shortcode.replace (' ' + attr + '="' + old_qrecord_id_dataset + '"', '');
               }
               htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);
               if (qq_dataset == 'dataset') {
                  var i_end_quiz_deck = htm.indexOf ('[/q', i_start_pos);
                  var qdhtm = htm.substring (i_start_pos, i_end_quiz_deck);
                  var qmatches = qdhtm.match (/\[q\s[^\]]*\]/gm);
                  if (debug[3]) {
                     console.log ('[update_qrecord_id_dataset_attr] qmatches:', qmatches);
                  }
                  if (qmatches) {
                     var n_qmatches = qmatches.length;
                     for (var i=0; i<n_qmatches; i++) {
                        var qshortcode = qmatches[i];
                        var new_qshortcode = rdgm_utils.replace_smart_quotes (qshortcode);
                        new_qshortcode = new_qshortcode.replace (/\sdataset_id="[^"]+"/, '');
                        if (debug[3]) {
                           console.log ('[update_qrecord_id_dataset_attr] new_qshortcode:', new_qshortcode);
                        }
                        qdhtm = qdhtm.replace (/\[q\s[^\]]*\]/m, new_qshortcode);
                     }
                  }
                  htm = htm.substring (0, i_start_pos) + qdhtm + htm.substring (i_end_quiz_deck);
                  if (debug[3]) {
                     console.log ('[update_qrecord_id_dataset_attr] qdhtm:', qdhtm);
                     console.log ('[update_qrecord_id_dataset_attr] htm:', htm);
                  }
               }
            } else {
               shortcode = shortcode.replace (old_qrecord_id_dataset, qrecord_id_dataset);
               if (attr == 'xqrecord_id') {
                  shortcode = shortcode.replace (attr, 'qrecord_id');
               }
               htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);
               if (debug[0]) {
                  console.log ('[update_qrecord_id_dataset_attr] old_qrecord_id_dataset:', old_qrecord_id_dataset, ', qrecord_id_dataset: ', qrecord_id_dataset, ', shortcode:', shortcode);
               }
            }
         } else {
            var len = shortcode.length;
            shortcode = shortcode.substring (0, len-1) + ' ' + attr + '="' + qrecord_id_dataset + '"]';
            htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);
            if (debug[0]) {
               console.log ('[update_qrecord_id_dataset_attr] shortcode:', shortcode, ', i_start_pos:', i_start_pos, ', i_end_pos:', i_end_pos);
            }
         }
         q.$edit_area.html (htm);
         q.tinymce_ed.isNotDirty = false;
         q.tinymce_ed.focus ();
         q.rdgm_register_qqs3 (1);
      } else {
         $ ('#register_qq_feedback').html (T ('Did not find "[rdgm...]" or ["qdeck...]" shortcodes')).css ({color: 'red'});
      }
   }
}
this.update_page_url = function (checkbox_el, i_row) {
   var save_page_url_f = checkbox_el.checked ? 1 : 0;
   var data = {maker_session_id: q.maker_session_id,
               qq_dataset:       qq_dataset,
               save_page_url_f:  save_page_url_f,
               i_row:            i_row,
               permalink:        q.permalink
              };
   var qrecord_id = q.qrecord_ids_datasets[i_row];
   rdgm_utils.jjax (qname, 0, qrecord_id, 'update_page_url', data);
}
this.page_url_updated = function (save_page_url_f, i_row, affected_rows) {
   if (affected_rows > 0) {
      var current;
      if (save_page_url_f == 1) {
         $ ('#register_qq_feedback').html ('Page address updated in database').css ({color: 'green'});
         current = q.permalink;
      } else {
         $ ('#register_qq_feedback').html ('Page address removed from database').css ({color: 'green'});
         current = '(none)';
      }
      $ ('span#update_page_url' + i_row).attr ('title', 'Saved page address currently: ' + current);
   } else {
      $ ('span#update_page_url' + i_row + ' input')[0].checked = save_page_url_f == 1 ? false : true;
      $ ('#register_qq_feedback').html ('Unable to update page address in database').css ({color: 'red'});
   }
}
this.rwizard_new_or_edit_existing = function () {
   mm = [];
   mm.push ('<div id="rdgm_edit_main_menu_items">');
   const quiz_hotspot_image = q.rdgm_button_b ? 'quiz' : 'hotspot image';
   mm.push (   '<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rwizard_new_or_edit_existing2 (\'rdgm\')" title="Create and add a new ' + quiz_hotspot_image + '">');
   if (q.rdgm_button_b) {
      mm.push (   'Insert new quiz');
   } else {
      mm.push (   'Insert new hotspot image');
   }
   mm.push (   '</div>');
   if (q.rdgm_button_b) {
      mm.push ('<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rwizard_new_or_edit_existing2 (\'deck\')" title="Create and add a new flashcard deck">');
      mm.push (   'Insert new flashcard deck');
      mm.push ('</div>');
   }
   var r = get_rdgm_qdeck_shortcodes ();
   if (! r) {
      return false;
   }
   var n_existing_quizzes_decks;
   var n_non_dataset_quizzes_decks = 0;
   var matches = r.matches;
   if (matches) {
      n_existing_quizzes_decks = matches.length;
      if (debug[0]) {
         console.log ('[rwizard_new_or_edit_existing] n_existing_quizzes_decks:', n_existing_quizzes_decks);
      }
      for (var i=0; i<n_existing_quizzes_decks; i++) {
         var m = matches[i];
         m = rdgm_utils.replace_smart_quotes (m);
         if (! rdgm_utils.get_attr (m, 'use_dataset')) {
            n_non_dataset_quizzes_decks++;
         }
      }
   }
   if (n_non_dataset_quizzes_decks) {
      const title = q.rdgm_button_b ? 'Select quiz or flashcard deck to edit' : 'Select hotspot image to edit';
      mm.push ('<div class="rdgm_edit_main_menu_item" onclick="rdgm_edit.rwizard_new_or_edit_existing2 (' + n_existing_quizzes_decks + ')" title="' + title + '">');
      if (q.rdgm_button_b) {
         mm.push ('Edit existing quiz or flashcard deck');
      } else {
         mm.push ('Edit existing hotspot image');
      }
      mm.push ('</div>');
   }
   mm.push ('</div>');  // End rdgm_edit_menu_items.
   mm.push ('<div class="rdgm_edit_main_menu_feedback"></div>');
   var title = 'Interactive editing options';
   $ ('#rdgm_register_qqs_header div.rdgm_edit_main_menu_title').html (title);
   $ ('#rdgm_register_qqs_main').html (mm.join ('\n')).show ();
   $ ('#rdgm_register_qqs_dialog_box').show ();
   if (q.swhs_button_b) {
      if (! n_non_dataset_quizzes_decks) {
         q.rwizard_new_or_edit_existing2 ('rdgm');
      }
   }
}
this.rwizard_new_or_edit_existing2 = function (rdgm_qdeck) {
   if (debug[0]) {
      console.log ('[rwizard_new_or_edit_existing2] rdgm_qdeck:', rdgm_qdeck);
   }
   var msg = '';
   if (typeof (rdgm_qdeck) == 'number') {
      if (rdgm_qdeck > 1) {
         waiting_for_quiz_deck_click = 'edit';
         if (q.rdgm_button_b) {
            msg = 'Click on quiz or flashcard deck you want to edit';
         } else {
            msg = 'Click on the hotspot image you want to edit';
         }
      } else {
         waiting_for_quiz_deck_click = 'edit_only_one';
      }
   } else {
      var quiz_flashcard_deck;
      if (q.rdgm_button_b) {
         quiz_flashcard_deck = rdgm_qdeck == 'rdgm' ? 'quiz' : 'flashcard deck';
      } else {
         quiz_flashcard_deck = 'hotspot image';
      }
      waiting_for_quiz_deck_click = 'new_' + rdgm_qdeck;
      msg = 'Click where you want to insert new ' + quiz_flashcard_deck;
   }
   if (msg) {
      $ ('#rdgm_register_qqs_main div.rdgm_edit_main_menu_feedback').html (msg).show ();
      q.$edit_area.off ('mouseup');
      q.$edit_area.on ('mouseup', new_quiz_deck_click);
   } else {
      new_quiz_deck_click ();
   }
}
function new_quiz_deck_click (e) {
   if (! waiting_for_quiz_deck_click) {
      return false;
   }
   $ ('#rdgm_register_qqs_main div.rdgm_edit_main_menu_feedback').hide ();
   $ ('#rdgm_register_qqs_dialog_box').hide ();
   var pat;
   if (waiting_for_quiz_deck_click != 'edit_only_one') {
      var tinymce_ed_selection = q.tinymce_ed.selection;
      var selected_text;
      var node;
      var $node;
      if (tinymce_ed_selection) {
         selected_text = tinymce_ed_selection.getContent ();
         node = tinymce_ed_selection.getNode ();
         $node = $ (node);
      } else {
         selected_text = '';
         node = '';
      }
      if (debug[0]) {
         console.log ('[new_quiz_deck_click] selected_text:', selected_text, ', waiting_for_quiz_deck_click:', waiting_for_quiz_deck_click);
         console.log ('[new_quiz_deck_click] node:', node);
      }
      q.$edit_area.off ('mouseup');
      qbookmark_id = 'qbookmark' + time_id ();
      qbookmark = '<span id="' + qbookmark_id + '" class="qbookmark">&hairsp;</span>';
      tinymce_ed_selection.setContent (selected_text + qbookmark);
      pat = qbookmark.replace ('&hairsp;', '[^<]+');
   } else {
      pat = '\\[rdgm| \\[qdeck';
   }
   var i_tries = 0;
   var delay_get = function () {
      if (q.gutenberg_f) {
         current_html = q.tinymce_ed.getContent ();
         if (debug[0]) {
            console.log ('[new_quiz_deck_click] current_html.length:', current_html.length);
         }
         current_html = current_html.replace (/\[\/audio\]|\[\/video\]/g, '');
      } else {
         current_html = q.$edit_area.html ();
      }
      $rdgm_edit_area = q.$edit_area;
      var i_bookmarked;
      var m;
      if (waiting_for_quiz_deck_click != 'edit_only_one') {
         var re = new RegExp ('\\[\\/[^\\]<]*' + pat + '[^\\]]*\\]');
         m = current_html.match (re);
         if (m) {
            var old_closing_shortcode = m[0];
            if (debug[0]) {
               console.log ('[new_quiz_deck_click] old_closing_shortcode:', old_closing_shortcode);
            }
            var shortcode = old_closing_shortcode.replace (/<span id="qbookmark[^<]+<\/span>/, '');
            var first_six = shortcode.substr (0, 6);
            if (first_six == '[/rdgm' || first_six == '[/qdec') {
               var new_shortcode = qbookmark + shortcode;
               current_html = current_html.replace (old_closing_shortcode, new_shortcode);
               if (debug[0]) {
                  console.log ('[new_quiz_deck_click] new_shortcode:', new_shortcode);
                  console.log ('[new_quiz_deck_click] current_html:', current_html);
               }
            }
         } else {
            re = new RegExp ('\\[[^\\]<]*' + pat + '[^\\]]*\\]');
            m = current_html.match (re);
            if (m) {
               var old_opening_shortcode = m[0];
               if (debug[0]) {
                  console.log ('[new_quiz_deck_click] old_opening_shortcode:', old_opening_shortcode);
               }
               var shortcode = old_opening_shortcode.replace (/<span id="qbookmark[^<]+<\/span>/, '');
               var first_five = shortcode.substr (0, 5);
               if (first_five == '[rdgm' || first_five == '[qdec') {
                  var new_shortcode = shortcode + qbookmark;
                  current_html = current_html.replace (old_opening_shortcode, new_shortcode);
                  if (debug[0]) {
                     console.log ('[new_quiz_deck_click] new_shortcode:', new_shortcode);
                     console.log ('[new_quiz_deck_click] current_html:', current_html);
                  }
               }
            }
         }
         m = current_html.match (/\[(rdgm|qdeck)[^]*?\[\/(rdgm|qdeck)\]/gm);
         i_bookmarked = -1;
         if (m) {
            const n_quizzes_decks = m.length;
            if (debug[0]) {
               console.log ('[new_quiz_deck_click] m:', m);
               console.log ('[new_quiz_deck_click] n_quizzes_decks:', n_quizzes_decks);
            }
            var re = new RegExp (pat);
            for (var ii=0; ii<n_quizzes_decks; ii++) {
               if (m[ii].search (re) != -1) {
                  i_bookmarked = ii;
                  break;
               }
            }
         }
      } else {
         m = current_html.match (/\[(rdgm|qdeck)[^]*?\[\/(rdgm|qdeck)\]/gm);
         if (m) {
            i_bookmarked = 0;
         } else {
            alert ('Sorry, could not find quiz or deck');
            return;
         }
      }
      var ok_f = true;
      if (waiting_for_quiz_deck_click.substr (0, 3) == 'new') {
         if (i_bookmarked != -1) {
            alert ('Cannot insert new quiz or deck inside an existing quiz or deck.\n'
                   + 'Please try again');
            q.rwizard_new_or_edit_existing ();
            ok_f = false;
         } else {
            var rdgm_qdeck = waiting_for_quiz_deck_click.substr (4);
            q.rdgm_edit_start_rwizard (rdgm_qdeck);
         }
      } else {
         if (i_bookmarked != -1) {
            current_rdgm_deck_html = m[i_bookmarked];
            const pos_use_dataset = current_rdgm_deck_html.indexOf ('use_dataset=');
            if (pos_use_dataset != -1) {
               const m = current_rdgm_deck_html.match (/[^_]dataset=/);
               if (! m) {
                  alert ('Cannot edit a use_dataset="..." quiz or deck.\n'
                         + 'You have to edit the quiz or deck that defines the dataset\n'
                         + '(that is, the one with dataset="")');
                  q.rwizard_new_or_edit_existing ();
                  ok_f = false;
               }
            } else {
               q.rdgm_edit_start_rwizard (current_rdgm_deck_html);
            }
         } else {
            if (q.rdgm_button_b) {
               alert ('Sorry, click did not appear to be on an existing quiz or deck.\n'
                      + 'Please try again');
            } else {
               alert ('Sorry, could not detect quiz or deck, or click was not on an existing quiz or deck.\n'
                      + 'Please try again, perhaps clicking on adjacent shortcode ("[rdgm...]") rather than image');
            }
            q.rwizard_new_or_edit_existing ();
            ok_f = false;
         }
      }
      if (! ok_f) {
         if (waiting_for_quiz_deck_click != 'edit_only_one') {
            var re = new RegExp (pat);
            current_html = current_html.replace (re, '');
            q.$edit_area.html (current_html);
         }
      }
      waiting_for_quiz_deck_click = '';
   }
   setTimeout (delay_get, 50);
}
this.rdgm_edit_start_rwizard = function (rdgm_deck_html) {
   if (debug[0]) {
      console.log ('[rdgm_edit_start_rwizard] q.tinymce_ed:', q.tinymce_ed, ', rdgm_deck_html:', rdgm_deck_html);
   }
   $ ('.rdgm_edit_main_menu').remove ();
   $ ('#adminmenuwrap, #wpadminbar').css ({'z-index': 99});
   q.permalink = q.get_permalink ();
   rwizard.start_modal (q.tinymce_ed, rdgm_deck_html, q.permalink);
}
this.remove_bookmarks = function () {
   q.$edit_area = $rdgm_edit_area;
   q.$edit_area.find ('span.qbookmark').remove ();
}
this.rwizard_update_edit_area = function (ed, new_html, new_rdgm_qdeck_f) {
   if (debug[0]) {
      console.log ('[rwizard_update_edit_area] current_html:', current_html);
   }
   if (new_rdgm_qdeck_f) {
      var pat = qbookmark.replace ('&hairsp;', '[^<]+');
      var re = new RegExp (pat);
      if (debug[0]) {
         console.log ('[rwizard_update_edit_area] qbookmark:', qbookmark);
         console.log ('[rwizard_update_edit_area] re:', re);
      }
      current_html = current_html.replace (re, new_html)
   } else {
      current_html = current_html.replace (current_rdgm_deck_html, new_html);
   }
   if (debug[0]) {
      console.log ('[rwizard_update_edit_area] current_html:', current_html);
   }
   q.$edit_area = $rdgm_edit_area;
   q.$edit_area.html (current_html);
   ed.isNotDirty = false;
   ed.focus ();
   return current_html;
}
this.rwizard_dialog = function () {
   $ ('#rdgm_edit_main_menu, #rdgm_register_qqs_main').hide ();
   console.log ('[rwizard_dialog] $rwizard_dialog:', $rwizard_dialog);
   $rwizard_dialog.dialog ('open');
}
this.rwizard_dialog_close = function () {
   $rwizard_dialog.dialog ('close');
   $ ('#rdgm_edit_main_menu').show ();
}
function get_rdgm_qdeck_shortcodes () {
   if (! q.rwizard_b && ! $ (edit_area_selector).is (':visible')) {
      var htm =   '<br /><br />'
                + ('Please select "Visual" mode, then click "Continue"')
                + '<br /><br />'
                + '<button onclick="rdgm_edit.rwizard_new_or_edit_existing ()">'
                +    T ('Continue')
                + '</button>'
                + '&emsp;'
                + '<button onclick="jQuery (\'#rdgm_register_qqs_dialog_box\').hide (); return false">'
                +    T ('Cancel')
                + '</button>'
                + '<br /><br />';
      $ ('#rdgm_register_qqs_main').html (htm).show ();
      $ ('#rdgm_register_qqs_dialog_box').show ();
      return;
   }
   var htm = q.$edit_area.html ();
   var matches;
   if (q.rwizard_b) {
      matches = htm.match (/<div id="rdgm0"[^>]*>/gm);
      if (! matches ) {
         var $tag = $ ('div.front table.qcard_table');
         if ($tag.length) {
            var table_div = $tag[0].outerHTML;
            matches = [table_div];
         }
      }
   } else {
      matches = htm.match (/\[(rdgm|qdeck)[^\]]*\]/gm);
   }
   if (debug[3]) {
      console.log ('[get_rdgm_qdeck_shortcodes] matches:', matches);
   }
   return {matches: matches, htm: htm};
}
function check_maker_session_id (callback) {
   var logged_in_b;
   var cookie_session_id = $.cookie ('maker_session_id');
   if (debug[0]) {
      console.log ('[check_maker_session_id] cookie_session_id:', cookie_session_id);
   }
   if (! cookie_session_id) {
      logged_in_b = false;
      eval ('q.' + callback + ' ()');
   } else {
      var data = {cookie_session_id: cookie_session_id,
                  callback:          callback
                 };
      rdgm_utils.jjax (qname, 0, '', 'check_maker_session_id', data);
   }
}
this.show_login = function () {
   qq_dataset = 'login';
   var title = T ('Swinging Hotspot administrative login');
   $ ('#rdgm_register_qqs_header div.rdgm_edit_main_menu_title').html (title);
   q.rdgm_register_qqs2 ();
}
this.login = function () {
   var $username = $ ('#rdgm_edit_username');
   var username = $username.val ();
   if (! username ) {
      alert (T ('Please enter User name'));
      $username.focus ();
      return false;
   }
   var $password = $ ('#rdgm_edit_password');
   var password = $password.val ();
   if (! password) {
      alert (T ('Please enter Password'));
      $password.focus ();
      return false;
   }
   $password.blur ();
   var sha3_password = CryptoJS.SHA3 (password).toString ();
   if (q.username.substr (0, 10) == 'mini-maker') {
      var data = {email:              username,
                  sha3_password:      sha3_password,
                  confirm_mini_also:  1
                 };
      rdgm_utils.jjax (qname, 0, '', 'rwizard_login_create', data);
   } else {
      var data = {jjax:          1,
                  username:      username,
                  sha3_password: sha3_password};
      rdgm_utils.jjax (qname, 0, '', 'maker_login', data);
   }
   return false;
}
this.login_ok = function () {
   var options = {path: '/', expires: 1};
   $.cookie ('maker_session_id', q.maker_session_id, options);
   q.maker_logged_in_b = true;
   maker_current_login_sec = new Date ().getTime ()/1000.0;
   if (debug[0]) {
      console.log ('[login_ok] qq_dataset:', qq_dataset);
      console.log ('[login_ok] maker_current_login_sec:', maker_current_login_sec);
   }
   if (qq_dataset == 'login') {
      $ ('#rdgm_register_qqs_login').hide ();
      $ ('#rdgm_register_qqs_main').html ('');
      $ ('#rdgm_register_qqs_dialog_box').hide ();
      $rdgm_edit_main_menu_feedback.hide ();
   } else {
      q.rdgm_register_qqs3 ();
   }
}
this.login_not_ok = function () {
   $ ('#rdgm_register_qqs_login p.login_error').css ({visibility: 'visible'});
   $ ('#rdgm_edit_password').blur ();
}
this.sign_out = function () {
   $.removeCookie ('maker_session_id', {path: '/'});
   q.maker_logged_in_b = false;
   var data = {session_id: q.maker_session_id, table: 'maker_session_id'};
   rdgm_utils.jjax ('', 0, '', 'delete_session_id', data);
   $ ('#rdgm_register_qqs_user').hide ();
   $ ('#rdgm_register_qqs_main').hide ();
   $ ('#rdgm_register_qqs_login').show ();
   $ ('#rdgm_edit_username').val ('').focus ();
   $ ('#rdgm_edit_password').val ('');
}
function T (string) {
   return string;
}
function time_id () {
   var now = new Date ();
   var now_millisec = now.getTime ();
   return parseInt (now_millisec / 1000.0, 10);
}
function get_rdgm_param (key, default_value) {
   var value = '';
   if (typeof (rdgm_params) != 'undefined') {
      if (typeof (rdgm_params[key]) != 'undefined') {
         value = rdgm_params[key];
      }
   } else if (typeof (rdgm_edit_params) != 'undefined') {
      if (typeof (rdgm_edit_params[key]) != 'undefined') {
         value = rdgm_edit_params[key];
      }
   }
   if (! value) {
      if (default_value != undefined) {
         value = default_value;
      }
   }
   return value;
}
function trim (s) {
   if ('a'.trim) {
      s = s.trim ();
   } else {
      s = s.replace (/^\s+|\s+$/g, '');
   }
   return s;
}
};
rdgm_editf.call (rdgm_edit);
