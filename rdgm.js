if (! window.console) {
   window.console = {log: function(){} };
}
rdgm_ = {};
var rdgmf = function () {
var qname = 'rdgm_';
var debug = [];
debug.push (false);    // 0 - general.
debug.push (false);    // 1 - radio/choices html.
debug.push (false);    // 2 - feedback html.
debug.push (false);    // 3 - old/new html dump.
debug.push (false);    // 4 - question tags/topics.
debug.push (false);    // 5 - unused.
debug.push (false);    // 6 - [textentry] / autocomplete.
debug.push (false);    // 7 - Enter -> click.
debug.push (false);    // 8 - Drag and drop.
debug.push (false);    // 9 - [hangman].
debug.push (false);    // 10 - unused.
debug.push (false);    // 11 - use_dataset.
debug.push (false);    // 12 - Wizard.
var $ = jQuery;
this.no_intro_b = [];
this.processing_complete_b = false;
this.qrecord_b = false;
this.dataset_b = false;
this.preview = false;
this.any_pay_quiz_f = false;
this.hotspot_alpha_value        = 121;
this.hotspot_alpha_value_tmp    = 122;
this.hotspot_border_alpha_value = 254;
var q = this;
var qqc;
var regular_page_f = true;
var content;
var default_use_dict;
var default_use_terms;
var hint_timeout_sec;
var default_hangman_max_hints;
var correct;
var incorrect;
var errmsgs = [];
var n_rdgmzes = 0;
var rdgm_edit_b;
var r_diagrams_page_f = false;
var rdgmdata = [];
var header_html;
var drag_and_drop_initialized_b = false;
var try_again_obj = '';
var $label_clicked = [];
var $prev_label_clicked = [];
var ignore_label_click_b = false;
var next_button_active_b = false;
var textentry_b = false;
var loaded_metaphone_js_b = false;
var default_textentry_terms_metaphones;
var current_question_textentry_terms_metaphones = {};
var textentry_answers = {};
var textentry_answer_metaphones = {};
var textentry_matches = {};
var lc_textentry_matches = {};
var textentry_i_rdgm;
var suppress_hangman_hint_b = false;
var Tcheck_answer_message;
var show_hint_timeout = {};
var panel_exit_mobile_open_b = false;
var panel_exit_mobile_just_closed_b;
var non_mobile_scrollLeft;
var non_mobile_scrollTop;
var qw;
var set_rwizard_data_b = false;
var preview_mode = 'questions_active';
this.wordpress_page_f = false;
var reinit_highlighting_f = false;
var restart_timer_i_rdgm = -1;
$ (document).ready (function () {
   qqc = rdgm_utils;
   var preview_i_rdgm = $.cookie ('rdgm_preview');
   if (typeof preview_i_rdgm != 'undefined') {
      q.preview_i_rdgm_plus1 = parseInt (preview_i_rdgm, 10) + 1;
      $.removeCookie ('rdgm_preview', {path: '/'});
   }
   if (debug[0]) {
      console.log ('[rdgm.js > document ready] typeof (document_rwizard_user_page):', typeof (document_rwizard_user_page));
      console.log ('[rdgm.js > document ready] q.preview_i_rdgm_plus1:', q.preview_i_rdgm_plus1);
   }
   correct = [S ('Good!'), S ('Correct!'), S ('Excellent!'), S ('Great!')];
   incorrect = [S ('Sorry, no.'), S ('No, that\'s not correct.'), S ('Sorry, that\'s not correct.')];
   var page_url = document.location.href;
   r_diagrams_page_f =    page_url.indexOf ('r_diagrams.com/u/')     != -1
                      || page_url.indexOf ('r_diagrams.com/admin/') != -1
                      || page_url.indexOf ('r_diagrams.net/u/')     != -1
                      || page_url.indexOf ('r_diagrams.net/admin/') != -1
                      || page_url.indexOf ('localhost/u/')         != -1
                      || page_url.indexOf ('localhost/admin/')     != -1
                      || page_url.indexOf ('192.168.1.120/u/'    ) != -1
                      || page_url.indexOf ('192.168.1.120/admin/') != -1;
   if (typeof document_rwizard_user_page == 'undefined'
               && page_url.indexOf ('admin-ajax') == -1
               && window.location.href.indexOf ('action=edit') == -1
                          && window.location.href.indexOf ('post-new') == -1) {
      q.rdgm_init ();
   } else {
      regular_page_f = false;
   }
});
this.rdgm_init = function (skip_error_check_f, only_get_rdgm_param_f) {
   content                   = qqc.get_rdgm_param ('content', 'body');
   default_use_dict          = qqc.get_rdgm_param ('use_dict', 'true');
   default_use_terms         = qqc.get_rdgm_param ('use_terms', 'true');
   default_hangman_max_hints = parseInt (qqc.get_rdgm_param ('hangman_hints', 2), 10);
   hint_timeout_sec          = qqc.get_rdgm_param ('hint_timeout_sec', 20);
   q.r_diagrams_version       = qqc.get_rdgm_param ('r_diagrams_version', '');
   document_rdgm_mobile_enabled = qqc.get_rdgm_param ('mobile_enabled', 'Always');
   if (document_rdgm_mobile_enabled == 'Enabled') {
      document_rdgm_mobile_enabled = 'Always';
   }
   Tcheck_answer_message = T ('Need help?  Try the "hint" button');
   if (only_get_rdgm_param_f) {
      return;
   }
   qqc.set_force_mobile ();
   process_html ();
   if (errmsgs.length && ! skip_error_check_f) {
      if (! q.rwizard_b) {
         if (qqc.get_rdgm_param ('regular_page_error_check')) {
            alert (plural (S ('Error found'), S ('Errors found'), errmsgs.length) + ':\n\n' + errmsgs.join ('\n'));
         } else {
            console.log ('Errors found:\n', errmsgs.join ('\n'));
         }
      }
   }
   if (document_rdgm_force_mobile_f) {
      q.go_mobile (0);
   }
   if (n_rdgmzes) {
      for (var i_rdgm=0; i_rdgm<n_rdgmzes; i_rdgm++) {
         if (rdgmdata[i_rdgm].questions) {
            if (! document_rdgm_force_mobile_f) {
               const mobile_enabled = rdgmdata[i_rdgm].mobile_enabled;
               if (mobile_enabled == 'Always'
                      || (mobile_enabled == 'Small screens only'
                                           && qqc.is_mobile (mobile_enabled))) {
                  $ ('.go-mobile-rdgm' + i_rdgm).show ();
               }
            }
            if (rdgmdata[i_rdgm].qrecord_id) {
               rdgmdata[i_rdgm].record_start_b = true;
            }
            if (! rdgmdata[i_rdgm].use_dataset) {
               q.init_question_order (i_rdgm)
            }
            if (q.no_intro_b[i_rdgm] || rdgmdata[i_rdgm].n_questions == 1
                                                    || q.preview_i_rdgm_plus1) {
               q.next_question (i_rdgm);
            } else {
               if (! rdgmdata[i_rdgm].display_pay_screen) {
                  $ ('div.intro-rdgm' + i_rdgm).show ();
                  $ ('div#next_button-rdgm' + i_rdgm).show ();
               }
            }
         }
      }
      if (! q.$dialog_no_credit) {
         $ ('body').append (dialog_no_credit_html ());
         q.$usernames_is_are = $ ('#rdgm_usernames_is_are');
         q.$dialog_no_credit = $ ('#rdgm_dialog_no_credit').dialog ({
            height:        400,
            width:         550,
            modal:         true,
            autoOpen:      false,
            open:          function () {
                              check_timers ();
                              $ ('div#rdgm_request_assign_to_class_feedback').html ('');
                              $ ('button#rdgm_request_assign_to_class').removeClass ('rdgm_button_disabled').removeAttr ('disabled');
                           },
            buttons:       {'Close':   function () {
                                          q.$dialog_no_credit.dialog ('close');
                                          if (restart_timer_i_rdgm != -1) {
                                             const i_rdgm = restart_timer_i_rdgm;
                                             if (rdgmdata[i_rdgm].question_time_limit) {
                                                start_rdgm_timer (i_rdgm, rdgmdata[i_rdgm].question_time_limit);
                                             } else {
                                                start_rdgm_timer (i_rdgm);
                                             }
                                             restart_timer_i_rdgm = -1;
                                          }
                                       }
                           }
         });
      }
      if (q.preview_i_rdgm_plus1) {
         var i_preview_rdgm = q.preview_i_rdgm_plus1 - 1;
         if (! rdgmdata[i_preview_rdgm].use_dataset) {
            q.init_preview (i_preview_rdgm);
         }
      } else {
         if (q.preview && ! q.rwizard_b) {
            q.init_preview (0);
         }
      }
   }
   if (reinit_highlighting_f) {
      if (typeof Prism != 'undefined') {
         Prism.highlightAll ();
      } else if (typeof hljs != 'undefined') {
         $ ('code').each (function (i, e) {
                             hljs.highlightBlock (e);
                             this.style.display = 'inline-block';
                          });
      }
   }
}
function process_html () {
   $ ('p:contains("[!]"), :header:contains("[!]")').each (function () {
      var comment_htm = $ (this).html ();
      if (comment_htm.search (/\s*(<.+?>)*\s*\[!+\][^]*?\[\/!+\]\s*(<.+?>)*\s*$/m) == 0) {
         $ (this).remove ();
      }
   });
   $ ('p:contains("rdgm"), :header:contains("rdgm")').each (function () {
      var tag_htm = $ (this).html ();
      if (tag_htm.search (/\s*\[\/{0,1}rdgm[^\]]*\]\s*/m) == 0) {
         $ (this).replaceWith (tag_htm);
      }
   });
   if (! q.rwizard_b) {
      q.wordpress_page_f = qqc.get_rdgm_param ('wppf', '') == 1;
   }
   var div_html_selector = '';
   var $rdgm_divs= $ ('div.rdgm_wrapper');
   var $fallback_wrappers = $ ('div.rdgm_wrapper_fallback');
   if ($rdgm_divs.length) {
      div_html_selector = 'div.rdgm_wrapper';
      $fallback_wrappers.css ({display: 'none'});
   } else {
      if ($fallback_wrappers.length == 0) {
         var style =   '<style type="text/css">\n'
                     +    '.rdgm_wrapper_fallback_visible {\n'
                     +       'visibility: visible;\n'
                     +    '}\n'
                     + '</style>\n';
         $ ('head').append (style);
      }
      div_html_selector = content;
      if (div_html_selector.indexOf ('wp-block-post-excerpt') == -1) {
         div_html_selector += ', div.wp-block-post-excerpt';
      }
   }
   n_rdgmzes = 0;
   var i_rdgm = 0;
   $ (div_html_selector).each (function () {
      const $this = $ (this);
      var htm = $this.html ();
      if (! htm) {
      } else {
         var rdgm_pos = htm.indexOf ('[rdgm');
         if (rdgm_pos != -1) {
            var r = q.process_html2 (htm, i_rdgm);
            htm = r.htm;
            if (q.rdgmdemos) {
               var n_rdgmdemos = q.rdgmdemos.length;
               for (var i_rdgmdemo=0; i_rdgmdemo< n_rdgmdemos; i_rdgmdemo++) {
                  var rdgmdemo_i = q.rdgmdemos[i_rdgmdemo];
                  var len = rdgmdemo_i.length;
                  rdgmdemo_i = rdgmdemo_i.substring (10, len - 11);
                  htm = htm.replace ('<rdgmdemo></rdgmdemo>', rdgmdemo_i);
               }
            }
            if (r.replace_body) {
               if (debug[0]) {
                  console.log ('[process_html] document_rdgm_user_logged_in_b:', document_rdgm_user_logged_in_b);
               }
                  var h =  '<div id="preview_header">'
                         +    '<h2 style="margin-bottom: 10px;">Preview quiz</h2>'
                         +    '<a href="javascript: void (0)" style="float: right; margin-right: 50px;" onclick="' + qname + '.reset_preview (' + i_rdgm + ')">Reload preview</a>'
                         +    '<label>'
                         +       '<input type="radio" name="preview_radio" value="questions_active"          onclick="' + qname + '.change_preview_mode (this, ' + i_rdgm + ')" checked /> '
                         +       'Questions active'
                         +    '</label>'
                         +    '&emsp;'
                         +    '<label>'
                         +       '<input type="radio" name="preview_radio" value="show_answers"              onclick="' + qname + '.change_preview_mode (this, ' + i_rdgm + ')" /> '
                         +       'Show answers'
                         +    '</label>'
                         +    '&emsp;'
                         +    '<label>'
                         +       '<input type="radio" name="preview_radio" value="show_answers_and_feedback" onclick="' + qname + '.change_preview_mode (this, ' + i_rdgm + ')" /> '
                         +       'Show answers and feedback'
                         +    '</label>'
                         +    '&emsp;'
                         + '</div>';
                  $ ('body').html (h + htm);
                  $ ('div#rdgm' + i_rdgm).css ({margin: 'auto'});
            } else {
               $this.html (htm);
            }
            if (i_rdgm != r.i_rdgm) {
               i_rdgm = r.i_rdgm;
               $this.find ('div.rdgm')
                  .on ('mouseenter',
                       function (e) {
                          if (e.target.tagName.toLowerCase () == 'div'
                                                 && e.target.className == 'rdgm') {
                             document_active_rdgm_qdeck = e.target;
                          } else {
                             var $rdgmdiv = $ (e.target).parents ('div.rdgm');
                             if ($rdgmdiv.length) {
                                document_active_rdgm_qdeck = $rdgmdiv[0];
                             }
                          }
                          if (debug[7]) {
                             console.log ('[rdgm mouseenter] e.target:', e.target);
                             console.log ('[rdgm mouseenter] document_active_rdgm_qdeck:', document_active_rdgm_qdeck);
                          }
                      });
               var ii_rdgm = i_rdgm - 1;
               if (rdgmdata[ii_rdgm]) {
                  var n_questions = rdgmdata[ii_rdgm].n_questions;
                  for (var i_question=0; i_question<n_questions; i_question++) {
                     if (rdgmdata[ii_rdgm].bg_img[i_question]) {
                        var bg_img = rdgmdata[ii_rdgm].bg_img[i_question];
                        var img = new Image ();
                        img.src = bg_img.src;
                        img.i_rdgm = ii_rdgm;
                        img.i_question = i_question;
                        img.onload = function () {
                           var w = this.width;
                           var h = this.height;
                           var $rdgmq = $ ('#rdgm' + img.i_rdgm + '-q' + img.i_question);
                           if (debug[0]) {
                              console.log ('[process_html] w:', w, ', h:', h, ', $rdgmq:', $rdgmq);
                           }
                           var min_height;
                           if (bg_img.height) {
                              min_height = bg_img.height;
                           } else if (bg_img.width) {
                              min_height = Math.floor (bg_img.width/w * h);
                           } else {
                              min_height = h;
                           }
                           min_height = '' + min_height + 'px';
                           if (bg_img.top) {
                              min_height = 'calc(' + bg_img.top + 'px + ' + min_height + ')';
                           }
                           $rdgmq.css ({'min-height': min_height});
                        }
                     }
                  }
               }
            }
         }
         if ($rdgm_divs.length) {
            $this.contents ().unwrap ();
         }
      }
   });
   n_rdgmzes = i_rdgm;
   $ ('div.rdgm_wrapper').removeClass ('rdgm_shortcodes_hidden');
   /*
   $ ('button.hangman_hint').tooltip ({tooltipClass:  'rdgm_hint_tooltip',
                                       show:          {delay: 500}
                                      });
                                      */
   $ ('div.hangman_label').each (function () {
                                    var $this = $ (this);
                                    var width = $this.outerWidth ();
                                    $this.outerWidth (1.2 * width);
                                 });
   for (var i_rdgm=0; i_rdgm<n_rdgmzes; i_rdgm++) {
      if (rdgmdata[i_rdgm].qrecord_id) {
         var n_questions = rdgmdata[i_rdgm].n_questions;
         var data = {rdgm_qdeck: 'rdgm', n_questions_cards: n_questions};
         qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'check_registered', data);
      }
   };
   if (n_rdgmzes) {
      qqc.init_enter_intercept ();
   }
   if (q.qrecord_b) {
      qqc.set_user_menus_and_icons ();
   }
   if (textentry_b) {
      if (content == 'body' && typeof (qcard_) != 'undefined') {
         var n_tries = 0;
         var run_init_textentry_autocomplete = function () {
            var ok_b = false;
            if (debug[6]) {
               console.log ('[run_init_textentry_autocomplete]', n_tries);
            }
            if (qcard_.processing_complete_b || n_tries > 30) {
               if (debug[6]) {
                  console.log ('[run_init_textentry_autocomplete] OK');
               }
               q.init_textentry_autocomplete ($ ('body'));
               ok_b = true;
            }
            if (! ok_b) {
               setTimeout (run_init_textentry_autocomplete, 100);
               n_tries++;
            }
         }
         run_init_textentry_autocomplete ();
      } else {
         q.init_textentry_autocomplete ($ ('body'));
      }
   }
   for (var i_rdgm=0; i_rdgm<n_rdgmzes; i_rdgm++) {
      const $xrdgm = $ ('#xrdgm' + i_rdgm);
      if ($xrdgm.length) {
         $xrdgm.css ({height: '', 'min-height': ''});
         const initial_width = $xrdgm.outerWidth ();
         if (debug[0]) {
            console.log ('[process_html] i_rdgm:', i_rdgm, ', initial_width:', initial_width);
         }
         if (initial_width) {
            rdgmdata[i_rdgm].initial_width = initial_width;
         }
      }
   }
   q.processing_complete_b = true;
}
this.process_html2 = function (htm, i_rdgm, rwizard_b, create_rwizard_json_f) {
   var rdgmdemo_re = new RegExp ('\\[rdgmdemo\\][\\s\\S]*?\\[\\/rdgmdemo\\]', 'gm');
   q.rdgmdemos = htm.match (rdgmdemo_re);
   if (q.rdgmdemos) {
      htm = htm.replace (rdgmdemo_re, '<rdgmdemo></rdgmdemo>');
      if (debug[0]) {
         console.log ('[process_html2] q.rdgmdemos.length: ', q.rdgmdemos.length);
      }
   }
   htm = htm.replace (/<!--[^]*?-->/gm, '');
   htm = htm.replace (/\[!+\][^]*?\[\/!+\]/gm, '');
   var local_n_rdgmzes = 0;
   var do_not_process_htm = check_rdgm_tag_pairs (htm);
   if (do_not_process_htm) {
      htm = do_not_process_htm;
      if (typeof rwizard != 'undefined') {
         rwizard.errmsgs = errmsgs;
      }
   } else {
      rdgm_edit_b = false;
      var rdgm_matches = htm.match (/\[rdgm[^]*?\[\/rdgm\]/gm);
      if (rdgm_matches) {
         local_n_rdgmzes = rdgm_matches.length;
         if (debug[0]) {
            console.log ('[process_html2] local_n_rdgmzes: ', local_n_rdgmzes);
            console.log ('                rdgm_matches[0]: ', rdgm_matches[0]);
         }
         if (q.preview_i_rdgm_plus1) {
            q.preview = true;
         }
         var do_rdgm_pair = true;
         var replace_body = false;
         q.quizzes_questions = [];
         for (var ii_rdgm=0; ii_rdgm<local_n_rdgmzes; ii_rdgm++) {
            if (q.preview_i_rdgm_plus1) {
               if (q.preview_i_rdgm_plus1 == i_rdgm + 1) {
                  replace_body = true;
                  do_rdgm_pair = true;
               } else {
                  do_rdgm_pair = false;
               }
            }
            if (do_rdgm_pair) {
               var new_rdgm_html
                           = q.process_rdgm_pair (rdgm_matches[ii_rdgm], i_rdgm,
                                                  rwizard_b,
                                                  create_rwizard_json_f,
                                                  create_rwizard_json_f);
               if (create_rwizard_json_f) {
                  if (rwizard.questions_cards && rwizard.questions_cards.length) {
                     if (debug[0]) {
                        console.log ('[process_html2] rwizard.questions_cards:', rwizard.questions_cards);
                     }
                     rwizard.questions_cards[0].dataset_b = rwizard.questions_cards_dataset_b;
                     q.quizzes_questions[i_rdgm] = JSON.parse (JSON.stringify (rwizard.questions_cards));
                  }
                  if (debug[0]) {
                     console.log ('[process_html2] i_rdgm:', i_rdgm, ', rwizard.questions_cards:', rwizard.questions_cards);
                     if (rwizard.questions_cards) {
                        console.log ('[process_html2] JSON.stringify (rwizard.questions_cards):', JSON.stringify (rwizard.questions_cards));
                        console.log ('[process_html2] rwizard.questions_cards.length:', rwizard.questions_cards.length);
                        var ll = rwizard.questions_cards.length;
                        for (var ii=0; ii<ll; ii++) {
                           if (rwizard.questions_cards[ii] == '') {
                              console.log ('[process_html2] NULL JSON ii:', ii);
                           }
                        }
                     }
                  }
               }
               htm = htm.replace (/(<[ph][^>]*>\s*)*?\[rdgm[^]*?\[\/rdgm\]/m, function () {return new_rdgm_html});
            } else {
               rdgmdata[i_rdgm] = {};
            }
            i_rdgm++;
         }
         if (debug[0] && q.quizzes_questions.length) {
            var n = q.quizzes_questions.length;
            for (var i=0; i<n; i++) {
               console.log ('[process_html2] q.quizzes_questions[' + i + ']:', q.quizzes_questions[i]);
            }
         }
         if (debug[3]) {
            console.log ('[process_html2] htm:', htm);
         }
      }
   }
   if (debug[0]) {
      console.log ('[process_html2] replace_body:', replace_body);
   }
   return {'htm': htm, 'i_rdgm': i_rdgm, 'replace_body': replace_body};
}
this.reset_preview = function (i_rdgm) {
   $.cookie ('rdgm_preview', i_rdgm, {path: '/'});
   window.location = window.location.href;
}
function dialog_no_credit_html () {
   htm = [];
   htm.push ('<div id="rdgm_dialog_no_credit" title="Quiz not assigned in your class">');
   htm.push (   '<p style="margin-bottom: 1em;">');
   htm.push (      'Note: this quiz has not been assigned as work you need to do.'); //DKTMP <span id="rdgm_usernames_is_are"></span> ');
   htm.push (      'Your work will be recorded, but it may not count for your class.');
   htm.push (   '</p>');
   htm.push (   '<p>');
   htm.push (      'You can send a request message to your teacher asking them to include this quiz in your class.');
   htm.push (      '<br />');
   htm.push (      '<br />');
   htm.push (      '<button id="rdgm_request_assign_to_class" class="rdgm_button" onclick="rdgm_utils.request_assign_to_class (1)">');
   htm.push (         'Send request');
   htm.push (      '</button>');
   htm.push (   '</p>');
   htm.push (   '<br />');
   htm.push (   '<div id="rdgm_request_assign_to_class_feedback">');
   htm.push (   '</div>');
   htm.push (   '<p>');
   htm.push (      '<label>');
   htm.push (         '<input type="checkbox" onclick="rdgm_utils.do_not_show_assign_to_class (this)" />');
   htm.push (         'Don&rsquo;t show me this again for quizzes and flashcard decks on this page');
   htm.push (      '</label>');
   htm.push (   '</p>');
   htm.push ('</div>');
   return htm.join ('\n');
}
this.process_reg_code = function (reg_code) {
   if (debug[0]) {
      console.log ('[process_reg_code] reg_code:', reg_code);
   }
   if (reg_code != '') {
      var data = {reg_code: reg_code};
      qqc.jjax (qname, 0, 0, 'reg_code_add_to_class', data);
   }
}
this.hide_reg_code_error = function () {
   $ ('div.rdgm_reg_code_errmsg').html ('').hide ();
}
this.set_i_rdgm_i_question = function () {
   if (debug[0]) {
      console.log ('[set_i_rdgm_i_question] this:', this);
   }
   var id = this.id;
   var i_rdgm = id.match (/rdgm([^-]+)/)[1];
   var i_question = id.match (/-q(.+)/)[1];
   rdgmdata[i_rdgm].i_question = i_question;
}
this.init_rdgm_edit = function ($content, i_rdgm, i_question) {
   if (debug[0]) {
      console.log ('[init_rdgm_edit] i_rdgm:', i_rdgm);
   }
   sibs = {};
   var t_id;
   var ii = 0;
   $content.find ('div.rdgm_edit_canvas .rdgm_edit_target').each (function () {
      var $this = $ (this);
      $this.removeClass ('ui-draggable ui-draggable-handle');
      $this.css ({'border-style': 'dotted', 'border-color': 'gray'});
      var classes = $this.attr ('class');
      var m = classes.match (/qtarget_sib-([0-9]+)/);
      if (m) {
         var sib = m[1];
         if (sibs[sib]) {
            t_id = sibs[sib];
         } else {
            t_id = 't' + ii;
            sibs[sib] = t_id;
            ii++;
         }
      } else {
         t_id = 't' + ii;
         ii++;
      }
      $this.attr ('id', t_id);
      $this.on ('click', function (event) {
                               if (debug[8]) {
                                  console.log ('[target clicked] $ (event.target):', $ (event.target));
                               }
                               var $target = $ (event.target);
                               if ($target.hasClass ('rdgm_edit_target')) {
                                  if (! $target.droppable ('option', 'disabled')) {
                                     q.label_dropped ($target);
                                  }
                               }
                            });
   });
   $content.find ('td.rdgm_edit_labels div.rdgm_edit_label').each (function () {
      $ (this).on ('click', function (event) {
                               if (debug[8]) {
                                  console.log ('[label clicked] $ (event.target).html ():', $ (event.target).html ());
                               }
                               if (ignore_label_click_b) {
                                  ignore_label_click_b = false;
                               } else {
                                  var $label;
                                  if (event.target.tagName.toLowerCase () == 'div') {
                                     $label = $ (event.target);
                                  } else {
                                     $label = $ (event.target).parents ('div.rdgm_edit_label');
                                  }
                                  var ii_rdgm = $label[0].id.match (/rdgm([^-]+)/)[1];
                                  $label_clicked[ii_rdgm] = $label;
                                  var $td_rdgm_edit_labels = $label.parents ('td.rdgm_edit_labels');
                                  $td_rdgm_edit_labels.find ('.rdgm_edit_highlight_label').removeClass ('label_click_highlight');
                                  $td_rdgm_edit_labels.find ('.rdgm_edit_label_head').hide ();
                                  $td_rdgm_edit_labels.find ('.rdgm_edit_label_head_label_clicked').show ();
                                  $label.find ('.rdgm_edit_highlight_label').addClass ('label_click_highlight');
                                  q.label_dragstart ($label, true);
                               }
                            });
   });
   $content.find ('div.rdgm_edit_canvas div.ui-resizable-handle').remove ();
   $content.find ('div.rdgm_edit_image div.rdgm_edit_target').css ('border-width', '2px');
   $content.find ('.rdgm_edit_highlight_label').css ('border', 'none');
   $content.find ('.rdgm_edit_highlight_label *').css ('word-wrap', 'normal');
   $content.find ('div.rdgm_edit_image').each (function () {
      var wrapper_width  = $ (this).width ();
      var wrapper_height = $ (this).height ();
      $ (this).find ('img').attr ('width', wrapper_width).attr ('height', wrapper_height)
                           .removeAttr ('sizes').removeAttr ('srcset');
   });
   q.init_rdgm_edit2 ($content, i_rdgm, i_question);
}
this.init_rdgm_edit2 = function ($content, i_rdgm, i_question) {
   if (! rdgmdata[i_rdgm].$rdgm_edit) {
      rdgmdata[i_rdgm].$rdgm_edit = {};
   }
   var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
   rdgmdata[i_rdgm].$rdgm_edit[rdgmq_id] = $content.clone (true);
}
this.process_rdgm_pair = function (htm, i_rdgm, rwizard_b,
                                   existing_quiz_to_rwizard_f,
                                   rwizard_process_dataset_questions_f) {
   q.rwizard_b = rwizard_b;
   if (typeof rwizard != 'undefined') {
      qw = rwizard;
   }
   if (existing_quiz_to_rwizard_f) {
      n_rdgmzes = 1;
      set_rwizard_data_b = true;
      q.no_intro_b = [];
      if (debug[0]) {
         console.log ('[process_rdgm_pair] htm.substr (0, 2000):', htm.substr (0, 2000));
      }
   } else {
      set_rwizard_data_b = false;
   }
   rdgmdata[i_rdgm] = {};
   rdgmdata[i_rdgm].questions            = [];
   rdgmdata[i_rdgm].answered_correctly   = [];
   rdgmdata[i_rdgm].n_correct            = 0;
   rdgmdata[i_rdgm].n_incorrect          = 0;
   rdgmdata[i_rdgm].i_question           = -1;
   rdgmdata[i_rdgm].i_user_question      = -1;
   rdgmdata[i_rdgm].ii_question          = 0;
   rdgmdata[i_rdgm].user_question_number = 0;
   rdgmdata[i_rdgm].initial_width        = 500;
   rdgmdata[i_rdgm].hangman = {};
   rdgmdata[i_rdgm].use_dataset = '';
   rdgmdata[i_rdgm].dataset_id = {};
   rdgmdata[i_rdgm].use_dataset_question_ids = {};
   rdgmdata[i_rdgm].bg_img = {};
   rdgmdata[i_rdgm].align = '';
   rdgmdata[i_rdgm].qrecord_id = '';
   rdgmdata[i_rdgm].qrecord_id_ok = 'check credit';
   rdgmdata[i_rdgm].information_question_b = {};
   rdgmdata[i_rdgm].unit = [];
   rdgmdata[i_rdgm].parts_htm = {};
   rdgmdata[i_rdgm].hotspot_user_interaction = {};
   rdgmdata[i_rdgm].hotspot_labels_stick     = {};
   rdgmdata[i_rdgm].show_hotspots            = {};
   rdgmdata[i_rdgm].find_the_dot             = {};
   rdgmdata[i_rdgm].ctx                      = {};
   rdgmdata[i_rdgm].current_xy_hotspot_no    = {};
   var m = htm.match (/\[rdgm([^\]]*)\]/m);
   var rdgm_tag   = m[0];
   var attributes = m[1];
   rdgm_tag   = qqc.replace_smart_quotes (rdgm_tag);
   attributes = qqc.replace_smart_quotes (attributes);
   if (debug[0]) {
      console.log ('[process_rdgm_pair] rdgm_tag: ', rdgm_tag);
      console.log ('[process_rdgm_pair] attributes: ', attributes);
   }
   if (set_rwizard_data_b) {
      qw.set_rwizard_data ('rdgm_deck_attributes', attributes);
   }
   var use_dataset_questions_b = false;
   rdgmdata[i_rdgm].icon_swhs = 'rdgm' == 'rdgm';
   rdgmdata[i_rdgm].summary_b = get_attr (rdgm_tag, 'summary') != 'false';
   const random_b = get_attr (rdgm_tag, 'random') == 'true';
   rdgmdata[i_rdgm].random_b = random_b;
   if (q.rwizard_b) {
      rdgmdata[i_rdgm].attr_random_b = random_b;
   }
   var use_dataset = get_attr (rdgm_tag, 'use_dataset', true);
   if (! use_dataset && regular_page_f) {
      use_dataset = get_attr (rdgm_tag, 'dataset');
   }
   if (use_dataset) {
      rdgmdata[i_rdgm].use_dataset = use_dataset;
      var dataset_intro_f = get_attr (rdgm_tag, 'dataset_intro');
      if (! dataset_intro_f || dataset_intro_f == 'true') {
         dataset_intro_f = true;
      } else if (dataset_intro_f == 'false') {
         dataset_intro_f = false;
      }
      rdgmdata[i_rdgm].dataset_intro_f = dataset_intro_f;
      var spaced_repetition_f = get_attr (rdgm_tag, 'spaced_repetition') != 'false';
      rdgmdata[i_rdgm].dataset_questions_to_do = spaced_repetition_f ? 'spaced_repetition' : 'all';
      var m = rdgm_tag.match (/\sstyle\s*=\s*"[^"]+"/gm);
      if (m) {
         var len = m.length;
         for (var i=0; i<len; i++) {
            var encoded_style = encodeURIComponent (m[i]);
            rdgm_tag = rdgm_tag.replace (m[i], encoded_style);
         }
      }
      var display_name = get_attr (rdgm_tag, 'display_name');
      if (display_name) {
         rdgmdata[i_rdgm].use_dataset_options_display_name = decodeURIComponent (display_name);
         var rdgm_tag = rdgm_tag.replace (/\sdisplay_name\s*=\s*"[^"]*?"/, '');
      }
      rdgm_tag = decodeURIComponent (rdgm_tag);
   }
   const questions_to_show = parseInt (get_attr (rdgm_tag, 'questions_to_show'));
   if (qqc.isInteger (questions_to_show) && questions_to_show > 0) {
      rdgmdata[i_rdgm].questions_to_show = questions_to_show;
   }
   var repeat_incorrect_value = get_attr (attributes, 'repeat_incorrect');
   rdgmdata[i_rdgm].repeat_incorrect_b = repeat_incorrect_value != 'false';
   if (debug[0]) {
      console.log ('[create_rdgm_divs] repeat_incorrect_value:', repeat_incorrect_value, ', repeat_incorrect_b:', rdgmdata[i_rdgm].repeat_incorrect_b);
   }
   var align = get_attr (attributes, 'align');
   if (align == 'center' || align == 'right' || align == 'tiled') {
      rdgmdata[i_rdgm].align = align;
      if (align == 'tiled') {
         rdgmdata[i_rdgm].spacing = 20;
      }
   }
   var spacing = parseInt (get_attr (attributes, 'spacing'));
   if (qqc.isInteger (spacing)) {
      rdgmdata[i_rdgm].spacing = spacing;
   }
   rdgmdata[i_rdgm].hide_forward_back_b = get_attr (rdgm_tag, 'hide_forward_back') == 'true';
   rdgmdata[i_rdgm].hide_progress_b = get_attr (rdgm_tag, 'hide_progress') == 'true';
   rdgmdata[i_rdgm].hide_r_diagrams_icon_b = get_attr (rdgm_tag, 'hide_r_diagrams_icon') == 'true';
   var mobile_enabled = get_attr (rdgm_tag, 'mobile_enabled');
   if (! mobile_enabled) {
      mobile_enabled = document_rdgm_mobile_enabled;
   }
   rdgmdata[i_rdgm].mobile_enabled = mobile_enabled;
   var qrecord_id = get_attr (attributes, 'qrecord_id');
   if (qrecord_id) {
      rdgmdata[i_rdgm].qrecord_id = qrecord_id;
      rdgmdata[i_rdgm].q_and_a_text  = {};
      rdgmdata[i_rdgm].q_and_a_crc32 = {};
      if (! q.qrecord_b) {
         q.qrecord_b = true;
         if (typeof (document_rdgm_user_logged_in_b) == 'undefined'
                              || document_rdgm_user_logged_in_b == 'not ready') {
            qqc.check_session_id (i_rdgm);
         }
      }
      var display_pay_screen = get_attr (attributes, 'display_pay_screen');
      if (display_pay_screen && display_pay_screen != 'false') {
         if (display_pay_screen == 'true' || display_pay_screen == 'login') {
            display_pay_screen = 'login';
         } else if (display_pay_screen == 'register') {
            display_pay_screen = 'register';
         }
         rdgmdata[i_rdgm].display_pay_screen = display_pay_screen;
      } else {
         display_pay_screen = '';
      }
   }
   if (q.rwizard_b || set_rwizard_data_b) {
      if (get_attr (attributes, 'dataset')) {
         q.dataset_b = true;
         if (set_rwizard_data_b) {
            qw.questions_cards_dataset_b = true;
         }
      }
   }
   const question_time_limit = get_attr (attributes, 'question_time_limit');
   if (question_time_limit) {
      rdgmdata[i_rdgm].question_time_limit = parseInt (question_time_limit);
   } else {
      rdgmdata[i_rdgm].rdgm_timer = get_attr (attributes, 'quiz_timer') == 'true';
   }
   var unit = get_attr (attributes, 'unit');
   if (unit) {
      rdgmdata[i_rdgm].default_unit = unit.replace (/\s/g, '_');
      if (set_rwizard_data_b) {
         qw.set_rwizard_data ('default_unit', unit);
      }
   } else {
      rdgmdata[i_rdgm].default_unit = 'null';
   }
   var new_htm = '';
   var no_intro_i_b = false;
   var m = htm.match (/\[rdgm[^\]]*\]((<\/[^>]+>\s*)*)/m, '');
   if (m) {
      var initial_closing_tags = m[1];
      if (debug[0]) {
         console.log ('[process_rdgm_pair] initial_closing_tags: ', initial_closing_tags);
      }
   }
   htm = htm.replace (/\[rdgm[^\]]*\]((<\/[^>]+>\s*)*)/m, '');
   htm = htm.replace (/(<(p|h[1-6]|span)[^>]*>)*\[\/rdgm\]$/, '');
   htm = qqc.trim (htm);
   m = htm.match (/\[(q|<code><\/code>q)([^\]]*)\]/gm);
   var n_questions = m ? m.length : 0;
   if (! use_dataset && ! q.rwizard_b && n_questions == 0) {
      errmsgs.push (T ('Did not find question tags ("[q]")') + '.  rdgm: ' + (i_rdgm + 1));
      header_html = '';
   } else {
      var whitespace = qqc.parse_html_block (htm.substr (0, 2000), ['^'], ['[h]', '[i]', '[q]', '[q '], '[<code></code>q', 'return whitespace');
      if (whitespace) {
         htm = htm.replace (whitespace, '');
      }
      htm = process_header (htm, i_rdgm, 0, true);
      if (set_rwizard_data_b && header_html != 'NA') {
         qw.set_rwizard_data ('header_text', header_html);
      }
      var intro_html = qqc.parse_html_block (htm.substr (0, 5000), ['[i]'], ['[q]', '[q ', '[<code></code>q', '<div class="rdgm_edit_question', '[x]']);
      if (intro_html == 'NA') {
         intro_html = qqc.parse_html_block (htm.substr (0, 5000), ['^'], ['[q]', '[q ', '[<code></code>q', '<div class="rdgm_edit_question', '[x]'], true);
         if (intro_html == '') {
            if (use_dataset) {
               intro_html = '<br /><br /><br />';
            } else {
               no_intro_i_b = true;
            }
         }
      } else {
         var htmx = htm.substr (0, 200);
         htmx = qqc.trim (htmx);
         var i_pos = qqc.opening_tag_shortcode_pos ('[i]', htmx);
         htmx = htmx.substr (i_pos, 5);
         var intro_htmlx = intro_html.replace (/<br[^>]*>/g, '');
         intro_htmlx = qqc.trim (intro_htmlx).substr (0, 5);
         if (htmx != intro_htmlx) {
            errmsgs.push (T ('Text before intro') + ' [i].  rdgm: ' + (i_rdgm + 1));
         }
         intro_html = intro_html.replace ('[i]', '');
         intro_html = qqc.balance_closing_tag (intro_html);
      }
      if (q.rwizard_b) {
         intro_html = qqc.shortcodes_to_video_elements (intro_html);
      }
      if (! no_intro_i_b || q.rwizard_b || rdgmdata[i_rdgm].question_time_limit) {
         if (debug[0]) {
            console.log ('[process_rdgm_pair] intro_html:', intro_html);
         }
         new_htm += '<div class="intro-rdgm' + i_rdgm + ' rdgm-intro rdgm_editable">'
                  +    qqc.decode_image_tags (intro_html)
                  + '</div>\n';
      }
      if (set_rwizard_data_b) {
         intro_hmtl = qqc.remove_empty_opening_tags (intro_html);
         qw.set_rwizard_data ('intro_text', intro_html);
      }
      var exit_html = qqc.parse_html_block (htm, ['[x]'], []);
      if (exit_html != 'NA') {
         exit_html = exit_html.replace (/\[x\]/, '');
         if (exit_html.search (/\[q[ \]]|<div class="rdgm_edit_question/) != -1) {
            errmsgs.push ('[x] ' + T ('(exit text) must be last') + '.  rdgm: ' + (i_rdgm + 1));
         } else {
            var i_pos_exit_opening = qqc. opening_tag_shortcode_pos ('[x]', htm);
            htm = htm.substr (0, i_pos_exit_opening);
         }
      } else {
         exit_html = '';
      }
      if (set_rwizard_data_b) {
         var rwizard_exit_html = qqc.shortcodes_to_video_elements (exit_html);
         rwizard_exit_html = qqc.remove_empty_opening_tags (rwizard_exit_html);
         qw.set_rwizard_data ('exit_text', rwizard_exit_html);
      }
      if (! use_dataset) {
         if (htm.search (/use_dataset_question\s*=\s*/) != -1) {
            use_dataset_questions_b = true;
            rdgmdata[i_rdgm].use_dataset_questions_htm = htm;
         }
      }
      if (! use_dataset && (! use_dataset_questions_b || rwizard_process_dataset_questions_f)) {
         if (n_questions == 0) {
            rdgmdata[i_rdgm].n_questions = 0;
            new_htm += '<div id="rdgm' + i_rdgm + '-q-1" class="rdgmq">'
                       + '</div>';
         } else {
            rdgmdata[i_rdgm].n_questions = n_questions;
            const questions_to_show = rdgmdata[i_rdgm].questions_to_show;
            if (questions_to_show && questions_to_show < n_questions) {
               rdgmdata[i_rdgm].n_questions_for_done = questions_to_show;
               rdgmdata[i_rdgm].random_b = true;
            } else {
               rdgmdata[i_rdgm].n_questions_for_done = n_questions;
            }
            new_htm = q.process_questions (htm, new_htm, i_rdgm, undefined,
                                           undefined, rwizard_process_dataset_questions_f);
         }
      } else {
         if (rwizard_process_dataset_questions_f) {
            rwizard.questions_cards_dataset_b = false;
         }
         new_htm +=   '<div id="dataset_questions-rdgm' + i_rdgm + '">'
                    + '</div>';
      }
   }
   q.no_intro_b[i_rdgm] = no_intro_i_b && ! rdgmdata[i_rdgm].question_time_limit;
   new_htm = create_rdgm_divs (i_rdgm, rdgm_tag, new_htm, exit_html);
   if (typeof q.rwizard_b != 'undefined') {
      if (typeof rwizard != 'undefined') {
         rwizard.errmsgs = errmsgs;
      }
   }
   return new_htm;
}
this.process_questions = function (htm, new_htm, i_rdgm, i_rwizard_question,
                                   set_rwizard_f,
                                   rwizard_process_dataset_questions_f) {
   if (set_rwizard_f) {
      qw = rwizard;
      n_rdgmzes = 1;
      set_rwizard_data_b = true;
      q.rwizard_b = true;
   }
   if (typeof (i_rwizard_question) != 'undefined') {
      number_first_question = i_rwizard_question;
   } else {
      number_first_question = 0;
   }
   if (! set_rwizard_data_b) {
      if (htm.indexOf ('[!') != -1) {
         htm = htm.replace (/\[!+\][^]*?\[\/!+\]/gm, '');
      }
   }
   var question_html = htm.match (/(\[q [^\]]*\]|<div class="rdgm_edit_question|\[q\])[^]*/m)[0];
   var question_shortcodes = question_html.match (/\[(<code><\/code>)*q([^\]]*)\]/gm);
   if (debug[4] || debug[11]) {
      console.log ('[process_questions] question_shortcodes: ', question_shortcodes);
   }
   n_questions = question_shortcodes.length;
   rdgmdata[i_rdgm].question_topics = new Array (n_questions);
   if (q.rwizard_b) {
      rdgmdata[i_rdgm].rwizard_multiple_choice_b = [];
   }
   rdgmdata[i_rdgm].units  = [];
   rdgmdata[i_rdgm].topics = [];
   var matches = htm.match (/(<[^\/][^>]*>\s*)*?(\[q[ \]]|\[<code><\/code>q)/gm);
   var q_opening_tags = [];
   var n_q_opening_tags = matches.length;
   for (var i_tag=0; i_tag<n_q_opening_tags; i_tag++) {
      var q_opening_tag = matches[i_tag];
      q_opening_tag = q_opening_tag.replace (/\[q[ \]]|\[<code><\/code>q/gm, '');
      q_opening_tag = q_opening_tag.replace (/[^]*<(img|input)[^>]+>/, '');
      q_opening_tags.push (q_opening_tag);
   }
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] q_opening_tags: ', q_opening_tags);
      console.log ('[process_questions] question_html: ', question_html);
   }
   var first_q_rdgm_edit_b = question_html.substr (0, 2) != '[q';
   if (first_q_rdgm_edit_b) {
      question_html = question_html.replace (/<div class="rdgm_edit_question[^>]*>/, '');
   } else {
      var start = question_html.indexOf (']') + 1;
      question_html = question_html.substr (start);
   }
   var rdgm_edit_pieces = question_html.split (/<div class="rdgm_edit_question[^_][^>]*>/);
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] rdgm_edit_pieces.length:', rdgm_edit_pieces.length);
   }
   var questions_html = [];
   if (rdgm_edit_pieces.length == 1) {
      var q_split = question_html.split (/(?:<(?:p|h[1-6]|span)[^>]*>)*?(?:\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\])/);
      var i_qbeg = 0;
      if (first_q_rdgm_edit_b) {
         questions_html.push (q_split[0] + '[q]' + q_split[1]);
         i_qbeg = 2;
      }
      for (var i_q=i_qbeg; i_q<q_split.length; i_q++) {
         questions_html.push (q_split[i_q]);
      }
   } else if (rdgm_edit_pieces.length > 1) {
      if (first_q_rdgm_edit_b) {
         for (var i_rdgm_edit=0; i_rdgm_edit<rdgm_edit_pieces.length; i_rdgm_edit++) {
            var q_split = rdgm_edit_pieces[i_rdgm_edit].split (/\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\]/);
            questions_html.push (q_split[0] + '[q]' + q_split[1]);
            for (var i_q=2; i_q<q_split.length; i_q++) {
               questions_html.push (q_split[i_q]);
            }
         }
      } else {
         var q_split =  rdgm_edit_pieces[0].split (/\[q [^\]]*\]|\[q\]/);
         for (var i_q=0; i_q<q_split.length; i_q++) {
            questions_html.push (q_split[i_q]);
         }
         for (var i_rdgm_edit=1; i_rdgm_edit<rdgm_edit_pieces.length; i_rdgm_edit++) {
            var q_split = rdgm_edit_pieces[i_rdgm_edit].split (/\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\]/);
            questions_html.push (q_split[0] + '[q]' + q_split[1]);
            for (var i_q=2; i_q<q_split.length; i_q++) {
               questions_html.push (q_split[i_q]);
            }
         }
      }
   }
   if (set_rwizard_data_b && typeof (i_rwizard_question) == 'undefined') {
      qw.set_rwizard_data ('n_questions', n_questions);
   }
   if (! q.rwizard_b) {
      rdgmdata[i_rdgm].n_questions = n_questions;
      const questions_to_show = rdgmdata[i_rdgm].questions_to_show;
      if (questions_to_show && questions_to_show < n_questions) {
         rdgmdata[i_rdgm].n_questions_for_done = questions_to_show;
         rdgmdata[i_rdgm].random_b = true;
      } else {
         rdgmdata[i_rdgm].n_questions_for_done = n_questions;
      }
   }
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] n_questions:', n_questions);
      console.log ('[process_questions] questions_html:', questions_html.join ('\n================================================\n'));
   }
   var question_divs = [];
   var question_div;
   var questions_w_topics_b = false;
   for (var ii=0; ii<n_questions; ii++) {
      var i_question = ii + number_first_question;
      var question_shortcode;
      if (typeof (i_rwizard_question) != 'undefined') {
         question_shortcode = question_shortcodes[0];
      } else {
         question_shortcode = question_shortcodes[i_question];
      }
      question_topic = process_question_attributes (i_rdgm, i_question, question_shortcode, i_rwizard_question);
      if (question_topic) {
         questions_w_topics_b = true;
      }
         rdgmdata[i_rdgm].hotspot_b = true;
         question_div = process_hotspot_diagram (i_rdgm, i_question,
                                                 questions_html[ii],
                                                 q_opening_tags[ii],
                                                 rwizard_process_dataset_questions_f);
      question_divs.push (question_div);
   }
   new_htm += question_divs.join ('\n');
   if (questions_w_topics_b) {
      if (debug[4]) {
         console.log ('[process_questions] topics: ' + rdgmdata[i_rdgm].topics.join ('; '));
      }
   }
   if (set_rwizard_data_b) {
      qw.unit_names = rdgmdata[i_rdgm].units;
   }
   if (rdgmdata[i_rdgm].topics.length) {
      check_questions_have_topics (i_rdgm);
      if (set_rwizard_data_b) {
         qw.topic_names = rdgmdata[i_rdgm].topics;
      }
   }
   if (debug[3] || debug[11]) {
      console.log ('[process_questions] new_htm: ', new_htm);
   }
   if (debug[12]) {
      console.log ('[process_questions] errmsgs: ', errmsgs.join ('\n'));
   }
   return new_htm;
}
function create_rdgm_divs (i_rdgm, rdgm_tag, htm, exit_html) {
   var m = rdgm_tag.match (/\[rdgm([^\]]*)\]/m);
   var attributes = m[1];
   if (debug[0]) {
      console.log ('[create_rdgm_divs] attributes: ', attributes);
   }
   attributes = qqc.replace_smart_quotes (attributes);
   var non_default_width_b = attributes.search (/[\s;"]width/m) != -1;
   var top_html = [];
   if (non_default_width_b) {
      var xattributes = attributes.replace (/(style\s*=\s*"[^"]*)/, '$1');
      xattributes = xattributes.replace (/;\s*;/g, ';');
      top_html.push ('<div id="xrdgm' + i_rdgm + '" class="xrdgm" ' + xattributes + '></div>\n');
   }
   if (rdgmdata[i_rdgm].align) {
      var align = rdgmdata[i_rdgm].align;
      var style = '';
      if (align == 'center') {
         style = 'margin: auto;';
      } else if (align == 'right') {
         style = 'margin-left: auto;';
      } else if (align == 'tiled') {
         style = 'float: left;';
         if (rdgmdata[i_rdgm].spacing) {
            var spacing = rdgmdata[i_rdgm].spacing + 'px !important';
            style += ' margin-left: ' + spacing + '; margin-bottom: ' + spacing + ';';
         }
      }
      m = attributes.match (/style\s*=\s*"[^"]*/m);
      if (m) {
         attributes = attributes.replace (/(style\s*=\s*"[^"]*)/m, '$1' + '; ' + style);
         attributes = attributes.replace (/;\s*;/g, ';');
      } else {
         attributes += ' style="' + style + '"';
      }
      attributes = attributes.replace (/align\s*=\s*"[^"]*"/, '');
      if (debug[0]) {
         console.log ('[create_rdgm_divs] attributes: ', attributes);
      }
   }
   top_html.push ('<div id="rdgm' + i_rdgm + '" class="rdgm visibilityhidden" ' + attributes + '>');
   top_html.push (   '<div id="overlay-times-up-rdgm' + i_rdgm + '" class="overlay-times-up">');
   top_html.push (      '<div class="overlay-times-up-msg">');
   top_html.push (         'Sorry, time&rsquo;s up');
   top_html.push (      '</div>');
   top_html.push (   '</div>');
   top_html.push (   '<div id="overlay-exit-mobile-rdgm' + i_rdgm + '" class="overlay-exit-mobile-rdgm" onclick="' + qname + '.close_panel_exit_mobile(this)">');
   top_html.push (      '<div id="panel-exit-mobile-rdgm' + i_rdgm + '" class="panel-exit-mobile-rdgm">');
   top_html.push (         '<button onclick="' + qname + '.exit_mobile (' + i_rdgm + ')">');
   top_html.push (            'Back to page view');
   top_html.push (         '</button>');
   top_html.push (         '<br />');
   top_html.push (         '<span>');
   top_html.push (            '(To return to this full-screen view, tap ');
   top_html.push (            '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAk0lEQVR4nI3QMQ6EIBAF0BG2YLiGtjRcgt7EcBfDhShtbLwBHIgCJrPFbrGJqPvrl/k/MzAzPOUFAMYYRCSiaZpijGckAAARSynM3BVf1FpTSkkpQwiXaBzHnLNzbtu2Lhr+GS4exSUyxqzrCgDLssDnBefM87zv+3EcRHS3yVpba0XElFK/znsvhNBal1LuLv3mDbu1OYLB67+mAAAAAElFTkSuQmCC" />');
   top_html.push (            ')');
   top_html.push (         '</span>');
   top_html.push (         '<div class="panel-icon-exit-mobile-rdgm"></div>');
   top_html.push (      '</div>');
   top_html.push (   '</div>');
   top_html.push (   '<div id="icon-exit-mobile-rdgm' + i_rdgm + '" class="icon-exit-mobile-rdgm" onclick="' + qname + '.open_panel_exit_mobile (' + i_rdgm + ')"></div>');
   var style = '';
   if (header_html == '' || header_html == 'NA' || header_html.indexOf ('Enter header text') != -1) {
      style = ' style="display: none;"';
   }
   top_html.push ('<div class="header-rdgm' + i_rdgm + ' rdgm-header rdgm_editable"' + style + '>');
   top_html.push (    header_html);
   top_html.push ('</div>');
   top_html = top_html.join ('\n');
   /*
   var learn_mode_title = T ('Learn mode: questions repeat until answered correctly.');
   var test_mode_title  = T ('Test mode: incorrectly-answered questions do not repeat.');
   var mode;
   var title;
   if (rdgmdata[i_rdgm].repeat_incorrect_b) {
      mode = T ('Learn');
      title = learn_mode_title + ' ' + test_mode_title;
   } else {
      mode = T ('Test');
      title = test_mode_title + ' ' + learn_mode_title;
   }
   */
   const plugin_url = qqc.get_rdgm_param ('url', './');
   var progress_div_html = [];
   progress_div_html.push ('<div class="rdgm-progress-container rdgm' + i_rdgm + '">');
   progress_div_html.push (   '<div class="go-mobile-rdgm go-mobile-rdgm' + i_rdgm + '" onclick="' + qname + '.go_mobile (' + i_rdgm + ')" title="Full-screen view">');
   progress_div_html.push (   '</div>');
   progress_div_html.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAKwmlDQ1BJQ0MgUHJvZmlsZQAASImVlwdUU9kWhs+96Y2WEAEpofcuXUroAZReRSUkgYQSY0JQsSviCCqKiAiWoQxVwUEpMhbEgm1QbNgnyKCiPgcLNlTeBYYw89567633r3XW/e6+++y9z1nnrLUvABQ8WyTKgJUAyBRmiSMCvBlx8QkM3O8AAligChSAHpsjETHDwkIAounn3/XhDuKN6KblRKx///5fpczlSTgAQGEIJ3MlnEyEjyHjNUckzgIAVY3Y9ZdliSb4IsI0MVIgwg8nOHWKRyY4eZLR6EmfqAgfhNUAwJPZbHEqAGQDxM7I5qQicci+CNsIuQIhwsg78ODw2VyEkbzAIjNzyQTLEDZJ/kuc1L/FTJbHZLNT5Ty1lknhfQUSUQZ7xf+5Hf9bmRnS6RxGyCDzxYERyJOO7Nnd9CXBchYmzw+dZgF30n+S+dLA6GnmSHwSppnL9g2Wz82YHzLNKQJ/ljxOFitqmnkSv8hpFi+JkOdKEfswp5ktnskrTY+W2/k8ljx+Dj8qdpqzBTHzp1mSHhk84+Mjt4ulEfL6ecIA75m8/vK1Z0r+sl4BSz43ix8VKF87e6Z+npA5E1MSJ6+Ny/P1m/GJlvuLsrzluUQZYXJ/XkaA3C7JjpTPzUIO5MzcMPkeprGDwqYZhIAAwADRIANkATFgIxwIkJOaxVs+cUaBzxLRCrEglZ/FYCK3jMdgCTlWFgw7GzsbACbu7NSReHd38i5CdPyMTYJ4uG5DjKIZ20IaAMf4AChwZmxGRch1JAFwNoEjFWdP2SauE8AAIlAENKAOtIE+MAGWwA44AjfgBfxAEAgFUSAeLAIcwAeZSOXLwCqwHuSBArAD7AZl4CCoAnXgMGgB7eAEOAMugCvgOrgNHgAZGAIvwQj4AMYgCMJBFIgKqUM6kCFkDtlBzpAH5AeFQBFQPJQEpUJCSAqtgjZCBVARVAZVQPXQz9Bx6Ax0CeqD7kED0DD0FvoCo2AyTIO1YCPYGnaGmXAwHAUvhFPhpXAOnAtvh0vhSvgQ3Aafga/At2EZ/BIeRQEUCUVH6aIsUc4oH1QoKgGVghKj1qDyUSWoSlQTqhPVg7qJkqFeoT6jsWgqmoG2RLuhA9HRaA56KXoNeiu6DF2HbkOfQ99ED6BH0N8xFIwmxhzjimFh4jCpmGWYPEwJpgbTijmPuY0ZwnzAYrF0rDHWCRuIjcemYVdit2L3Y5uxXdg+7CB2FIfDqePMce64UBwbl4XLw+3FHcKdxt3ADeE+4Ul4Hbwd3h+fgBfiN+BL8A34U/gb+Gf4MYISwZDgSgglcAkrCIWEakIn4RphiDBGVCYaE92JUcQ04npiKbGJeJ74kPiORCLpkVxI4SQBaR2plHSEdJE0QPpMViGbkX3IiWQpeTu5ltxFvkd+R6FQjChelARKFmU7pZ5ylvKY8kmBqmClwFLgKqxVKFdoU7ih8FqRoGioyFRcpJijWKJ4VPGa4islgpKRko8SW2mNUrnScaV+pVFlqrKtcqhypvJW5QblS8rPVXAqRip+KlyVXJUqlbMqg1QUVZ/qQ+VQN1KrqeepQzQszZjGoqXRCmiHab20EVUV1TmqMarLVctVT6rK6Ci6EZ1Fz6AX0lvod+hfZmnNYs7izdoyq2nWjVkf1Wareanx1PLVmtVuq31RZ6j7qaer71RvV3+kgdYw0wjXWKZxQOO8xqvZtNluszmz82e3zL6vCWuaaUZortSs0ryqOaqlrRWgJdLaq3VW65U2XdtLO027WPuU9rAOVcdDR6BTrHNa5wVDlcFkZDBKGecYI7qauoG6Ut0K3V7dMT1jvWi9DXrNeo/0ifrO+in6xfrd+iMGOgbzDFYZNBrcNyQYOhvyDfcY9hh+NDI2ijXabNRu9NxYzZhlnGPcaPzQhGLiabLUpNLklinW1Nk03XS/6XUz2MzBjG9WbnbNHDZ3NBeY7zfvs8BYuFgILSot+i3JlkzLbMtGywErulWI1QardqvX1gbWCdY7rXusv9s42GTYVNs8sFWxDbLdYNtp+9bOzI5jV253y55i72+/1r7D/s0c8zm8OQfm3HWgOsxz2OzQ7fDN0clR7NjkOOxk4JTktM+p35nmHOa81fmiC8bF22WtywmXz66OrlmuLa5/uFm6pbs1uD2fazyXN7d67qC7njvbvcJd5sHwSPL40UPmqevJ9qz0fOKl78X1qvF6xjRlpjEPMV9723iLvVu9P/q4+qz26fJF+Qb45vv2+qn4RfuV+T321/NP9W/0HwlwCFgZ0BWICQwO3BnYz9JicVj1rJEgp6DVQeeCycGRwWXBT0LMQsQhnfPgeUHzds17ON9wvnB+eygIZYXuCn0UZhy2NOyXcGx4WHh5+NMI24hVET2R1MjFkQ2RH6K8owqjHkSbREuju2MUYxJj6mM+xvrGFsXK4qzjVsddideIF8R3JOASYhJqEkYX+C3YvWAo0SExL/HOQuOFyxdeWqSxKGPRycWKi9mLjyZhkmKTGpK+skPZlezRZFbyvuQRjg9nD+cl14tbzB3mufOKeM9S3FOKUp6nuqfuSh3me/JL+K8EPoIywZu0wLSDaR/TQ9Nr08czYjOaM/GZSZnHhSrCdOG5JdpLli/pE5mL8kSypa5Ldy8dEQeLaySQZKGkI4uGNEdXpSbSTdKBbI/s8uxPy2KWHV2uvFy4/OoKsxVbVjzL8c/5aSV6JWdl9yrdVetXDaxmrq5YA61JXtO9Vn9t7tqhdQHr6tYT16ev/3WDzYaiDe83xm7szNXKXZc7uClgU2OeQp44r3+z2+aDP6B/EPzQu8V+y94t3/O5+ZcLbApKCr5u5Wy9vM12W+m28e0p23sLHQsP7MDuEO64s9NzZ12RclFO0eCuebvaihnF+cXvdy/efalkTsnBPcQ90j2y0pDSjr0Ge3fs/VrGL7td7l3evE9z35Z9H/dz99844HWg6aDWwYKDX34U/Hi3IqCirdKosqQKW5Vd9bQ6prrnJ+ef6ms0agpqvtUKa2V1EXXn6p3q6xs0Gwob4UZp4/ChxEPXD/se7miybKpopjcXHAFHpEde/Jz0852W4Jbuo85Hm44ZHtvXSm3Nb4PaVrSNtPPbZR3xHX3Hg453d7p1tv5i9UvtCd0T5SdVTxaeIp7KPTV+Ouf0aJeo69WZ1DOD3Yu7H5yNO3vrXPi53vPB5y9e8L9wtofZc/qi+8UTl1wvHb/sfLn9iuOVtqsOV1t/dfi1tdext+2a07WO6y7XO/vm9p264XnjzE3fmxdusW5duT3/dt+d6Dt3+xP7ZXe5d5/fy7j35n72/bEH6x5iHuY/UnpU8ljzceVvpr81yxxlJwd8B64+iXzyYJAz+PJ3ye9fh3KfUp6WPNN5Vv/c7vmJYf/h6y8WvBh6KXo59irvH8r/2Pfa5PWxP7z+uDoSNzL0Rvxm/O3Wd+rvat/Ped89Gjb6+EPmh7GP+Z/UP9V9dv7c8yX2y7OxZV9xX0u/mX7r/B78/eF45vi4iC1mT7YCKGTAKSkAvK0FgBIPAPU6AMQFUz31pKCp/4BJAv+Jp/ruSTkCgIQC0V0ATLRoVX+2tIrIe5gXAFFeALa3l48/JUmxt5uKRWpHWpOS8fF3SP+IMwXgW//4+Fj7+Pi3GqTY+wB0fZjq5SekjfxXLMADqHzTrZYB8K/6J1bAD27htQDfAAAACXBIWXMAABYlAAAWJQFJUiTwAAACBGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NDY4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ2NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrdRrnkAAADWklEQVRIDZ1VW08TQRT+uvRqCBoI5ckCD3JRjEALCfFNMJHfIH9B0V+BkIj6omgiEilPBiFyT+TRAAX1wQj0JpBIFYQaa6Db7WWcc8rWBKl2nWR2Z3bOfOf2nbMmfzAk1tfWYLfbkclkABN4KIqCpJZEs7sZ5eVOpFIpmExHh1mRwp53+/uFlMw7P3xcFRkhxGEiIVQtaXiaHQ4HW+LxtCAS2UZxcTHS6TS2IxG8np/HhfP1SEhPFJNSmMXHpJRMhowHYrEfUkEEaiKBcDgMr3cEl9vaEFcTx64Y2yp6zK1WG5wVFUglk4wwNPQMgVAYp+y2bG6M4eakFY6+3MbVOHZ3dqCqKmpqazE5MQGPTHAw/ImVUNj+ZyhWq5XvlZWVoae3F9FoFAG/Hw0NF/EzFkODzIHuicy1cR29fX3MIN/yirwvxIvRUd47nRVCesJrm80mAqGQSMvzQ9UYm/D23Xux6FtmcKIhUXJ0bIyBJf/FpcZGXkvTxe7evkhLgYO4WjBdQVYRaDyh5awjbS/Hxhn4rMvF74ePBvg8kUyxbKE1gd/AGltFIaBvNMZfTTD4wOMnIiWt0FLpHDjJHar/9sRElhzPHLWMoqIiULsIh0JwVVbCYrEgKSlM36ltyLzI4oOsG43ljmPo+xMV0KF0gGXsVgtkWHhPCgncIWvj294+Dg8OUFXpoijkVZK3/qmx0ZShYHBaUy1Q4UWj39F98waqqyqxHgjCYbPyWbalZY2jKLCRhSaLYk55iHzdEde7ujg35CjN1XU/pYzZRXKESSMpKYdCFRA1aSwsLjHouZoa0djUlFOkKyEiEOb07Kz4HPlSuAK6ROwiWk9OzzBwSUmJqD0qRt0TovzTwUE+f7OwaFyB7v7k1DSDyPYu6urreX2lvV303OnlNSn0rawYU6B7odfJ1JEnBFZXV5cDdrvdvF5c8om8LJKXThzEJhkFyh06O69hZm6O5YLBIFwuF6qqq+W/JZa9K+vEsAK6SfVANKR/VUfHVXTfus001TQNmxsboLeuwXy0MvQiD8xmM4N6h5/jwf17aGltRTwex+kzZ1BaWoqtra0sJsXV6KQcEFuGvSO5uEu0P9bEoryt4m8ukQfUkwKBALY2N7kv8R9Pxlwf0gK4PR78Ak4cQYObEn/YAAAAAElFTkSuQmCC" class="go-mobile-rdgm go-mobile-rdgm' + i_rdgm + '" />');
   progress_div_html.push (   '<div class="exit-mobile-rdgm exit-mobile-rdgm' + i_rdgm + '" onclick="' + qname + '.exit_mobile (' + i_rdgm + ')" title="Exit full-screen view">');
   progress_div_html.push (   '</div>');
   progress_div_html.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAoVJREFUSA2lVj2PEkEY3plZV5I9Q3KBqzFHQkFJaCx0sTCxo6EnsfMPWPjBctqoueqMNf/CwtODxo7ySCxMaAjhgiRGiXjsh8+zzl5WKoZ7k+GdnZ33ed6PeWdRtVrtxnQ6jWxbvrUs8SCO449cq1Qqst1uWxBVr9fFaDSKW62WouaikTiO0xVCxBy2bXdpXC6Xb5ZKpZzv+xKkIp/PH3JuBMzN9FyD/4Fea5IjvmMk1FLKExAfc24sMH6tCQgeYgSa5BXB4MAz/ewbg6cG8M4niAZPotDPZ1ozdZ10v5GuVqsODTIkJGIkkQZn6q5qYwSOzbJYLEYsaBAEvlLqpQYQWq+h07leMlPS87wI4IIFhX4B8zMNGkAnRTaD/H+37Pf7PO+Xw+FwzYLidQPjUm9jBCSiRP+U4S+bJ44twaOoc570w+YcNUIjmkuSXzbRcrl8DPOfGOzUbEPR8z0QfFitVp8xNxNGsG2Hpo1nxmC4e1sSOo0DZO90BHO53H2cuIfw7RfGZjqJeWt/331/cfHjG+bmwoJvHoLss1LyHS9Ipl+ZwyeX3x0AeLD9re15EEIM9KrqhGH4BIQSV7vMhqf3bqVSOxu702bkldNH6o5Yp16v57CJd42ggQjuAZCec5CIchvpsyeTyWmhUFCLxcK6LgHTklyW0OwfAeK74JDz+fzUdd2UGK8MBACdTFGvrnSs8apPvyddQl4nAg8FfR5F0SOmhZ4DL4kCOsRzA9fPHkmMBXjHOIonNEwbD2tdHRWjSL4hIHhjDM4OPTjIH8JDwTn/GPB7QiCQpF9GfqB8ru2SInV+/vX7YDCwx+OxaDabAU8LCzqbzT7BaxcRfEEvPGV0fwEIA/zW345reQAAAABJRU5ErkJggg==" class="exit-mobile-rdgm exit-mobile-rdgm' + i_rdgm + '" />');
   /*
   progress_div_html.push (   '<div id="mode-rdgm' + i_rdgm + '" class="rdgm-mode" title="' + title + '">');
   progress_div_html.push (      'Mode: ' + mode);
   progress_div_html.push (   '</div>');
   */
   var n_questions = rdgmdata[i_rdgm].n_questions;
   if (   (   n_questions > 1
           || rdgmdata[i_rdgm].use_dataset
           || rdgmdata[i_rdgm].use_dataset_questions_htm)
       && (! q.preview || q.preview_i_rdgm_plus1)        ) {
      style = '';
      if (rdgmdata[i_rdgm].hide_forward_back_b) {
         style = ' style="visibility: hidden;"';
      }
      var title;
      if (rdgmdata[i_rdgm].use_dataset && rdgmdata[i_rdgm].dataset_intro_f) {
         title = T ('Go to &ldquo;Choose questions&rdquo;');
      } else {
         title = T ('Go to first question');
      }
      progress_div_html.push ('<span class="bbfe-wrapper bbfe-wrapper' + i_rdgm + '">');
      progress_div_html.push (   '<span class="bbfe bbfe-rdgm' + i_rdgm + ' bck-question-rdgm' + i_rdgm + '"' + style + ' onclick="' + qname + '.bck_question (' + i_rdgm + ', true )" title="' + title + '">');
      progress_div_html.push (      '<img class="icon-beg-end-rdgm" src="' + plugin_url + '/images/icon_beg.svg">');
      progress_div_html.push (   '</span>');
      progress_div_html.push (   '<span class="bbfe bbfe-rdgm' + i_rdgm + ' bck-question-rdgm' + i_rdgm + '"' + style + ' onclick="' + qname + '.bck_question (' + i_rdgm + ', false)" title="' + T ('Go to previous question') + '">');
      progress_div_html.push (      '<img class="icon-bck-fwd-rdgm" src="' + plugin_url + '/images/icon_bck.svg">');
      progress_div_html.push (   '</span>');
      progress_div_html.push (   '<span class="question-number-rdgm question-number-rdgm' + i_rdgm + '"' + style + '>');
      progress_div_html.push (   '</span>');
      progress_div_html.push (   '<span class="bbfe bbfe-rdgm' + i_rdgm + ' fwd-question-rdgm' + i_rdgm + '"' + style + ' onclick="' + qname + '.fwd_question (' + i_rdgm + ', false)" title="' + T ('Go to next question') + '">');
      progress_div_html.push (      '<img class="icon-bck-fwd-rdgm" src="' + plugin_url + '/images/icon_fwd.svg">');
      progress_div_html.push (   '</span>');
      progress_div_html.push (   '<span class="bbfe bbfe-rdgm' + i_rdgm + ' fwd-question-rdgm' + i_rdgm + '"' + style + ' onclick="' + qname + '.fwd_question (' + i_rdgm + ', true )" title="' + T ('Go to most-recent question') + '">');
      progress_div_html.push (      '<img class="icon-beg-end-rdgm" src="' + plugin_url + '/images/icon_end.svg">');
      progress_div_html.push (   '</span>');
      progress_div_html.push ('</span>');
   }
   style = '';
   var mmss = '';
   if ((rdgmdata[i_rdgm].rdgm_timer || rdgmdata[i_rdgm].question_time_limit)
                                                               && ! q.preview) {
      style = ' style="display: inline-block;"';
      mmss = '0:00';
      if (rdgmdata[i_rdgm].question_time_limit) {
         mmss = qqc.hhmmss_from_sec (rdgmdata[i_rdgm].question_time_limit);
      }
   }
   progress_div_html.push ('<span id="rdgm' + i_rdgm+ '-timer" class="rdgm-timer"' + style + '>' + mmss + '</span>');
   if (rdgmdata[i_rdgm].qrecord_id) {
      progress_div_html.push ('<span class="response_recorded_wrapper response_recorded_wrapper-rdgm' + i_rdgm + '">');
      progress_div_html.push (   '<span class="response_recorded response_recorded-rdgm' + i_rdgm + '">');
      progress_div_html.push (      '&#x2714;&#xFE0E;');
      progress_div_html.push (   '</span>');
      progress_div_html.push (   '<span class="response_recorded response_recorded_shadow response_recorded_shadow-rdgm' + i_rdgm + '">');
      progress_div_html.push (      '&#x2714;&#xFE0E;');
      progress_div_html.push (   '</span>');
      progress_div_html.push ('</span>');
      progress_div_html.push ('<div class="rdgm_icon_and_menu_container  lock_unlock rdgm' + i_rdgm + '">');
      progress_div_html.push (   '<div id="locked-rdgm' + i_rdgm + '" class="rdgm-locked rdgm_menu_icon">');
      progress_div_html.push (      '<img src="' + plugin_url + '/images/icon_locked.png" />');
      progress_div_html.push (   '</div>');
      progress_div_html.push (   '<div id="unlocked-rdgm' + i_rdgm + '" class="rdgm-unlocked rdgm_menu_icon">');
      progress_div_html.push (      '<img src="' + plugin_url + '/images/icon_unlocked.png" />');
      progress_div_html.push (   '</div>');
      progress_div_html.push (   '<div class="rdgm_icon_trigger_and_menu rdgm-hover">');
      progress_div_html.push (      '<div class="rdgm_icon_trigger">');
      progress_div_html.push (      '</div>');
      progress_div_html.push (      '<div id="pay_unlock_menu-rdgm' + i_rdgm + '" class="rdgm-pay_unlock_menu rdgm_menu">');
      progress_div_html.push (      '</div>');
      progress_div_html.push (   '</div>');
      progress_div_html.push ('</div>');
      var addclass = '';
      if (q.no_intro_b[i_rdgm] || n_questions == 1) {
         addclass = ' rdgm-usermenu_icon_no_intro';
      }
      progress_div_html.push ('<div class="rdgm_icon_and_menu_container rdgm' + i_rdgm + '">');
      progress_div_html.push (   '<div class="rdgm-usermenu_icon rdgm_menu_icon' + addclass + '">');
      progress_div_html.push (      '&#x25bc;');
      progress_div_html.push (   '</div>');
      progress_div_html.push (   '<div class="rdgm_icon_trigger_and_menu rdgm-hover">');
      progress_div_html.push (      '<div class="rdgm_icon_trigger" style="left: -12px; top: -4px;">');
      progress_div_html.push (      '</div>');
      progress_div_html.push (      '<div id="usermenu-rdgm' + i_rdgm + '" class="rdgm-usermenu rdgm_menu">');
      progress_div_html.push (      '</div>');
      progress_div_html.push (   '</div>');
      progress_div_html.push ('</div>');
   }
   style = '';
   if (rdgmdata[i_rdgm].hide_progress_b) {
      style = ' style="display: none;"';
   }
   progress_div_html.push (   '<div id="progress-rdgm' + i_rdgm + '" class="rdgm-progress"' + style + '>');
   progress_div_html.push (   '</div>');
   progress_div_html.push ('</div>');
   progress_div_html = progress_div_html.join ('\n');
   var login_div = '';
   if (rdgmdata[i_rdgm].qrecord_id || rdgmdata[i_rdgm].use_dataset) {
      login_div =  '<div id="rdgm_login-rdgm' + i_rdgm + '" class="rdgm-login">\n'
                 + '</div>';
   }
   var bottom_html = [];
   if (   n_questions > 1
       || rdgmdata[i_rdgm].use_dataset
       || rdgmdata[i_rdgm].use_dataset_questions_htm || q.rwizard_b) {
      if (exit_html) {
         if (exit_html.indexOf ('[unpaid') != -1 && exit_html.indexOf ('[/unpaid]') != -1) {
            exit_html = exit_html.replace ('[unpaid]', '<span class="unpaid_msg">');
            exit_html = exit_html.replace ('[/unpaid]', '</span>');
         } else {
            exit_html += '<span class="unpaid_msg_payment_type unpaid_msg"></span>';
         }
      } else {
         exit_html += '<span class="unpaid_msg_payment_type unpaid_msg"></span>';
      }
      if (rdgmdata[i_rdgm].use_dataset && ! q.preview) {
         if (exit_html.indexOf ('[restart') == -1) {
            exit_html += '<br />[restart]';
         }
      }
      if (exit_html) {
         exit_html = create_restart_button (i_rdgm, exit_html);
      }
      if (q.rwizard_b) {
         exit_html = qqc.shortcodes_to_video_elements (exit_html);
      }
      if (rdgmdata[i_rdgm].summary_b) {
         bottom_html.push (create_summary_report_div (i_rdgm, exit_html));
      }
   } else {
      if (n_questions == 1 && exit_html) {
         exit_html = create_restart_button (i_rdgm, exit_html);
         bottom_html.push ('<div class="single-question_exit">');
         bottom_html.push (   exit_html);
         bottom_html.push ('</div>');
      }
      if (   ! rdgmdata[i_rdgm].rdgm_edit_b && ! rdgmdata[i_rdgm].hotspot_b
          && ! rdgmdata[i_rdgm].qrecord_id
          && ! qqc.is_mobile (rdgmdata[i_rdgm].mobile_enabled)
          && ! q.rwizard_b) {
         progress_div_html = '';
      }
   }
   bottom_html.push ('<div class="next_button" id="next_button-rdgm' + i_rdgm + '">\n');
   bottom_html.push (   '<button class="rdgm_button" onclick="' + qname + '.next_question (' + i_rdgm + ')">');
   bottom_html.push (       '<span id="next_button_text-rdgm' + i_rdgm + '">');
   bottom_html.push (          T ('Start quiz'));
   bottom_html.push (       '</span>');
   bottom_html.push (   '</button>\n');
   bottom_html.push ('</div>\n');
   if (! rdgmdata[i_rdgm].summary_b) {
      if (n_questions > 1 && exit_html) {
         bottom_html.push (create_summary_report_div (i_rdgm, exit_html));
      }
   }
   if (! rdgmdata[i_rdgm].hide_r_diagrams_icon_b) {
      if (! rdgmdata[i_rdgm].icon_swhs) {
         bottom_html.push (create_icon_rdgm_div (i_rdgm));
      }
   }
   bottom_html.push ('</div>');
   htm = top_html + progress_div_html + login_div
         + htm + bottom_html.join ('')
         + '</div>\n';  // This rdgm closing div.
   return htm;
}
function create_icon_rdgm_div (i_rdgm) {
   const icon_swhs = rdgmdata[i_rdgm].icon_swhs;
   var htm = [];
   htm.push ('<div class="icon_rdgm" id="icon_rdgm' + i_rdgm + '">');
   var icon_rdgm = qqc.get_rdgm_param ('icon_rdgm');
   if (icon_rdgm != 'Not displayed') {
      const r_diagrams_swhs = icon_swhs ? 'swinginghotspot' : 'r_diagrams';
      if (icon_rdgm != 'Icon only') {
         htm.push ('<a href="mailto:support@' + r_diagrams_swhs + '.com" style="border: none; box-shadow: none;">');
      }
      const title = 'Questions, comments, suggestions? support@' + r_diagrams_swhs + '.com';
      var icon_b64;
      if (icon_swhs) {
         icon_b64 = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAABnWAAAZ1gEY0crtAAABiElEQVQ4jZWSv0sCYRyHnzvvinCIhBwEoyFBcJB0CKSmBJejIWhqbAuhv8DFCAdndRehqVDIKdokWlsEI1qiqesMkQNf77yGC/qh1t0zfvg8vO/3fb/gnUiE8/PvgexDLhQIh330v0ilEILNze+Z8qMRCLC7y+oqqoosI8s4DrZNr0e5jK6jafR6mOYs+fSUoyOenrBtAElClllYYGMDReHiguNj3t6oVmfdrVik2yUU+hFms+g6Z2fkcoxGbG3NGUxVabfpdFha+kySSSwLIahUeH/n5OTPhwkGubuj1UJRANJphMCycBxqtT9Nl3CYx8evwba3MQxublBVDzIQi/H6Sj4P0Gjw8MDKijfTZW8Pw2B/n8GAeNyPCSwv4zjU6zSb8yrz19OyAIJBhkP/8mQCIEmMx/5lF3c9fcvuPwvB4uI/B/xmfZ12m+dnNA3TpFQiEPAs399zfc3aGsDODobB4aFn+fIS2+bqioMD+n1Mk0xmuiXNliWJRIJolJcXolFub+n3p1sfn3l/Jjmrf3gAAAAASUVORK5CYII=';
      } else {
         icon_b64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAIAAAALACogAAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABP0lEQVR4nGP8//8/AymAiSTV5GhgwSZ4rcRrxRooW3futlBnJDlGND/cXzXVccFLVP0oepiwqtZJyH2wrenBtogQBgYGhsv9q15j9cO1qTDVW8JEGRgYGBi0PJ0YGBgYrjzCpuH+qv1rGBgYGHQLoaoZGBgYlOTEGRgYGB68uY+h4fXuQy8ZGBgYnLSRvXjv0UsGBgYGBRFFdA1Prm+6x8DAwBBio4XsyO37GBgYGHTkEHaixYO4mszrWTl1CjmH7iMcKe5nhdAAi4cnL6/A3HbrHgMDw56pJ0QYIOHr5JgmgzASZoOFdggDAwPDy03HRCEhs6YJEne6c0uQHYkUcXt76pL3oTqQQbxqVjay8Sh+cC5pmuuEpkFMWQZNBCNpwMDrWTmT2+5hCCu54EqtomkVLjqYwgoiuGzACWifgQDhK2rq5bcX2gAAAABJRU5ErkJggg==';
      }
      htm.push ('<img class="icon_rdgm" style="border: none;" title="' + title + '" src="data:image/png;base64,' + icon_b64 + '" />');
      if (icon_rdgm != 'Icon only') {
         htm.push ('</a>');
      }
   }
   return htm.join ('');
}
function create_summary_report_div (i_rdgm, exit_html) {
   bottom_html = [];
   bottom_html.push ('<div id="summary-rdgm' + i_rdgm + '" class="rdgm-summary">\n');
   bottom_html.push (   '<div id="summary_report-rdgm' + i_rdgm + '" class="rdgm_summary_report">');
   bottom_html.push (   '</div>\n');
   bottom_html.push (   '<div id="summary-quiz_times_histogram-rdgm' + i_rdgm + '">');
   bottom_html.push (   '</div>\n');
   bottom_html.push (   '<div id="rdgm_exit-rdgm' + i_rdgm + '" class="rdgm-exit rdgm_editable">');
   bottom_html.push (       exit_html);
   bottom_html.push (   '</div>\n');
   bottom_html.push (   '<button class="summary_exit_mobile_rdgm" onclick="' + qname + '.exit_mobile (' + i_rdgm + ')">\n');
   bottom_html.push (      'Return to page view');
   bottom_html.push (   '</button>\n');
   bottom_html.push ('</div>\n');
   return bottom_html.join ('');
}
function get_login_html (i_rdgm, add_team_member_f, msg, proceed_to_pay_f) {
   add_team_member_f = add_team_member_f ? 1 : 0;
   proceed_to_pay_f  = proceed_to_pay_f  ? 1 : 0;
   var onfocus = 'onfocus="jQuery (\'#rdgm_login-rdgm' + i_rdgm + ' p.login_error\').hide ()"';
   var login_div_html = '<p>';
   if (msg) {
      login_div_html += '<strong>' + msg + '</strong>';
   } else if (add_team_member_f) {
      login_div_html += '<strong>' + T ('Add team member') + '</strong>';
   } else {
      login_div_html += '<strong>' + T ('Record score/credit?') + '</strong>';
   }
   login_div_html += '</p>';
   login_div_html +=
      '<form action="nada" onSubmit="return rdgm_.login (' + i_rdgm + ', ' + add_team_member_f + ', ' + proceed_to_pay_f + ')">\n'
     +   '<table border="0" align="center" width="100%">'
     +      '<tr>'
     +         '<td>'
     +            '<label for="rdgm_username-rdgm' + i_rdgm + '"><nobr>'+ T ('Login name') + '</nobr></label>'
     +         '</td>'
     +         '<td>'
     +            '<input type="text" id="rdgm_username-rdgm' + i_rdgm + '" ' + onfocus + ' />'
     +         '</td>'
     +      '</tr>'
     +      '<tr>'
     +         '<td>'
     +            '<label for="rdgm_password-rdgm' + i_rdgm + '">'+ T ('Password') + '</label>'
     +         '</td>'
     +         '<td>'
     +            '<input type="password" id="rdgm_password-rdgm' + i_rdgm + '" />'
     +         '</td>'
     +      '</tr>'
     +      '<tr>'
     +         '<td style="text-align: right;">'
     +            '<span class="rdgm-remember" title="' + T ('Save preference (do not use on shared computer)') + '">'
     +               '<label>'
     +                  '<span class="rdgm-remember">'
     +                     '<input type="checkbox" />&nbsp;' + T ('Remember')
     +                  '</span>'
     +               '</label>'
     +            '</span>'
     +         '</td>'
     +         '<td>'
     +            '<button type="submit" class="rdgm_button">'
     +               T ('Student login')
     +            '</button>'
     +            '&ensp;';
   if (! add_team_member_f) {
      login_div_html +=
                  '<span class="rdgm_button" onclick="rdgm_utils.create_register_taker_screen (\'' + qname + '\', ' + i_rdgm + ', ' + proceed_to_pay_f + ')">'
     +               T ('New student - register')
     +            '</span>'
     +            '&ensp;';
   }
   login_div_html +=
                  '<span class="rdgm_login_cancel_no_thanks rdgm_button" onclick="' + qname + '.no_login (' + i_rdgm + ',' + add_team_member_f + ')">';
   if (add_team_member_f) {
      login_div_html +=
                     T ('Cancel');
   } else {
      login_div_html +=
                    T ('No thanks');
   }
   login_div_html +=
                 '</span>'
     +         '</td>'
     +      '</tr>';
   if (! add_team_member_f) {
      login_div_html +=
            '<tr>'
     +         '<td>'
     +         '</td>'
     +         '<td class="rdgm-smaller">'
     +            '<a href="' + qqc.get_rdgm_param ('server_loc', 'http://r_diagrams.com/admin') + '/password_reset_request" target="_blank">'
     +               T ('Forgot password?') + '</a>'
     +         '</td>'
     +      '</tr>'
   }
   var register_page = 'new_account';
   if (window.location.href.indexOf ('learn-biology.com') != -1) {
      register_page = 'new_account_smv';
   }
   login_div_html +=
             '<tr>'
     +          '<td colspan="2">'
     +             '<hr style="margin: 5px;">'
     +          '</td>'
     +       '</tr>'
     +       '<tr>'
     +          '<td colspan="2" class="rdgm-center">'
     +             '<b>' + T ('Teachers: track your students&rsquo; progress on quizzes and flashcards') + '.&nbsp; '
     +                '<a href="' + qqc.get_rdgm_param ('secure_server_loc', 'https://r_diagrams.com/admin') + '/' + register_page + '" target="_blank">'
     +                '<nobr>' + T ('Create teacher administrative account') + '</nobr></a></b>'
     +          '</td>'
     +       '</tr>'
     +    '</table>\n'
     + '</form>'
     + '<p class="login_error">'
     +     T ('Login incorrect. Please try again')
     + '</p>\n';
   return login_div_html;
}
this.rdgm_password_focus = function (el, i_rdgm) {
   el.rdgm_pw = '';
   el.value = '';
   $ ('#rdgm_login-rdgm' + i_rdgm + ' p.login_error').hide ();
}
function create_restart_button (i_rdgm, htm, feedback_f) {
   var restart = htm.match (/\[restart[^\]]*\]/);
   if (restart) {
      var label;
      if (feedback_f || rdgmdata[i_rdgm].n_questions == 1) {
         label = T ('Do this question again');
      } else {
         if (rdgmdata[i_rdgm].use_dataset && rdgmdata[i_rdgm].dataset_intro_f) {
            label = T ('Practice more questions');
         } else {
            label = T ('Take this quiz again');
         }
      }
      var attr = qqc.replace_smart_quotes (restart[0]);
      var custom_label = get_attr (attr, 'label');
      if (custom_label) {
         label = custom_label;
      }
      var restart_redo = feedback_f ? 'redo_question' : 'restart_quiz' ;
      var restart_button_html =
                       '<button class="rdgm_button rdgm_restart" onclick="' + qname + '.' + restart_redo + ' (' + i_rdgm + ')">'
                     +    label
                     + '</button>';
      htm = htm.replace (restart, restart_button_html);
   }
   return htm;
}
function create_bg_img_style (i_rdgm, i_question) {
   var style = '';
   var bg_img = rdgmdata[i_rdgm].bg_img[i_question];
   if (bg_img) {
      var top    = bg_img.top    ? bg_img.top    + 'px' : '0';
      var left   = bg_img.left   ? bg_img.left   + 'px' : '0';
      var width  = bg_img.width  ? bg_img.width  + 'px' : 'auto';
      var height = bg_img.height ? bg_img.height + 'px' : 'auto';
      var style = ' style="background: no-repeat ' + left + ' ' + top
                                       + ' / ' + width + ' ' + height
                                       + ' url(' + bg_img.src + ')"';
      if (debug[0]) {
         console.log ('[create_bg_img_style] style:', style);
      }
   }
   return style;
}
function process_question_attributes (i_rdgm, i_question, question_shortcode, i_rwizard_question) {
   if (set_rwizard_data_b) {
      if (typeof (i_rwizard_question) == 'undefined') {
         i_rwizard_question = i_question;
      }
      qw.questions_cards[i_rwizard_question] = {};
   }
   rdgmdata[i_rdgm].dataset_id[i_question] = i_question;
   rdgmdata[i_rdgm].unit[i_question] = rdgmdata[i_rdgm].default_unit;
   var m = question_shortcode.match (/\[(<code><\/code>)*q\s*([^\]]*)\]/m);
   var attributes = m[2];
   if (attributes) {
      attributes = qqc.replace_smart_quotes (attributes);
      if (set_rwizard_data_b) {
         qw.questions_cards[i_rwizard_question].question_attributes = attributes;
      }
      if (q.rwizard_b) {
         rdgmdata[i_rdgm].rwizard_multiple_choice_b[i_question] = get_attr (attributes, 'multiple_choice') == 'true';
      }
      var question_topics = get_attr (attributes, 'topic', true);
      if (! question_topics) {
         question_topics = get_attr (attributes, 'unit', true);
      }
      if (question_topics) {
         if (debug[4]) {
            console.log ('[process_question_attributes] question_topics: ', question_topics);
         }
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].topic = question_topics;
         }
         question_topics = question_topics.split (/; */);
         for (var i=0; i<question_topics.length; i++) {
            question_topics[i] = question_topics[i].replace (/\s/g, '_');
            var topic = question_topics[i];
            if (rdgmdata[i_rdgm].topics.indexOf (topic) == -1) {
               rdgmdata[i_rdgm].topics.push (topic);
            }
         }
         rdgmdata[i_rdgm].question_topics[i_question] = question_topics;
      }
      var dataset_id = get_attr (attributes, 'dataset_id');
      if (dataset_id) {
         rdgmdata[i_rdgm].dataset_id[i_question] = dataset_id;
      }
      var unit = get_attr (attributes, 'unit');
      if (unit) {
         rdgmdata[i_rdgm].unit[i_question] = unit;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].unit = unit;
         }
         if (rdgmdata[i_rdgm].units.indexOf (unit) == -1) {
            rdgmdata[i_rdgm].units.push (unit);
         }
      }
      var use_dataset_question_id = get_attr (attributes, 'use_dataset_question');
      if (use_dataset_question_id) {
         rdgmdata[i_rdgm].use_dataset_question_ids[i_question] = use_dataset_question_id;
         rdgmdata[i_rdgm].dataset_id[i_question]               = use_dataset_question_id;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].from_dataset_b = true;
         }
      }
      var bg_img_src = get_attr (attributes, 'bg_img_src');
      if (bg_img_src) {
         var bg_img = {};
         bg_img.src    = bg_img_src;
         bg_img.left   = get_attr (attributes, 'bg_img_left');
         bg_img.top    = get_attr (attributes, 'bg_img_top');
         bg_img.width  = get_attr (attributes, 'bg_img_width');
         bg_img.height = get_attr (attributes, 'bg_img_height');
         rdgmdata[i_rdgm].bg_img[i_question] = bg_img;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].bg_img = bg_img;
         }
      }
      const hotspot_user_interaction = get_attr (attributes, 'hotspot_user_interaction');
      if (hotspot_user_interaction) {
         rdgmdata[i_rdgm].hotspot_user_interaction[i_question] = hotspot_user_interaction;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].hotspot_user_interaction = hotspot_user_interaction;
         }
      }
      const hotspot_labels_stick = get_attr (attributes, 'hotspot_labels_stick');
      if (hotspot_labels_stick) {
         rdgmdata[i_rdgm].hotspot_labels_stick[i_question] = hotspot_labels_stick;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].hotspot_labels_stick = hotspot_labels_stick;
         }
      }
      const show_hotspots = get_attr (attributes, 'show_hotspots');
      if (show_hotspots) {
         rdgmdata[i_rdgm].show_hotspots[i_question] = show_hotspots;
         if (set_rwizard_data_b) {
            qw.questions_cards[i_rwizard_question].show_hotspots = show_hotspots;
         }
      }
      const find_the_dot_width = get_attr (attributes, 'find_the_dot_width');
      if (find_the_dot_width) {
         rdgmdata[i_rdgm].find_the_dot[i_question] = {};
         rdgmdata[i_rdgm].find_the_dot[i_question].width = find_the_dot_width;
         rdgmdata[i_rdgm].find_the_dot[i_question].height           = get_attr (attributes, 'find_the_dot_height');
         rdgmdata[i_rdgm].find_the_dot[i_question].dot_color        = get_attr (attributes, 'find_the_dot_dot_color');
         rdgmdata[i_rdgm].find_the_dot[i_question].background_color = get_attr (attributes, 'find_the_dot_background_color');
         rdgmdata[i_rdgm].find_the_dot[i_question].controls         = get_attr (attributes, 'find_the_dot_controls') != 'false';
      }
   }
   return question_topics;
}
function check_questions_have_topics (i_rdgm) {
   var add_other_b = false;
   for (var i_question=0; i_question<rdgmdata[i_rdgm].n_questions; i_question++) {
      if (! rdgmdata[i_rdgm].information_question_b[i_question]) {
         if (! rdgmdata[i_rdgm].question_topics[i_question]) {
            rdgmdata[i_rdgm].question_topics[i_question] = ['Other'];
            add_other_b = true;
         }
      }
   }
   if (add_other_b) {
      if (rdgmdata[i_rdgm].topics.indexOf ('Other') == -1) {
         rdgmdata[i_rdgm].topics.push ('Other');
      }
   }
   if (debug[4]) {
      console.log ('[check_questions_have_topics] rdgmdata[i_rdgm].question_topics:', rdgmdata[i_rdgm].question_topics);
   }
   rdgmdata[i_rdgm].topic_statistics = {};
   var n_topics = rdgmdata[i_rdgm].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = rdgmdata[i_rdgm].topics[i_topic];
      rdgmdata[i_rdgm].topic_statistics[topic] = {};
      rdgmdata[i_rdgm].topic_statistics[topic].n_correct = 0;
      rdgmdata[i_rdgm].topic_statistics[topic].n_incorrect = 0;
   }
}
this.restart_quiz = function (i_rdgm) {
   var $summary = $ ('#summary-rdgm' + i_rdgm);
   $summary.hide ();
   $summary.find ('button.summary_exit_mobile_rdgm').hide ();
   $ ('#rdgm' + i_rdgm + ' div.show_answer_got_it_or_not').hide ();
   if (rdgmdata[i_rdgm].n_questions == 1) {
      $( '#rdgm' + i_rdgm + ' div.single-question_exit').hide ();
   }
   rdgmdata[i_rdgm].n_correct = 0;
   rdgmdata[i_rdgm].n_incorrect = 0;
   if (rdgmdata[i_rdgm].use_dataset) {
      rdgmdata[i_rdgm].information_question_b = {};
      rdgmdata[i_rdgm].hangman = {};
      rdgmdata[i_rdgm].textentry = '';
   }
   q.display_progress (i_rdgm);
   for (var rdgm_edit_div_id in rdgmdata[i_rdgm].$rdgm_edit) {
      $ ('div#' + rdgm_edit_div_id).replaceWith (rdgmdata[i_rdgm].$rdgm_edit[rdgm_edit_div_id]);
      rdgmdata[i_rdgm].$rdgm_edit[rdgm_edit_div_id] = $ ('div#' + rdgm_edit_div_id).clone (true);
   }
   if (rdgmdata[i_rdgm].rdgm_edit_b) {
      rdgmdata[i_rdgm].correct_on_try1 = [];
   }
   $ ('#rdgm' + i_rdgm).find ('div.rdgmq').hide ();
   var n_questions = rdgmdata[i_rdgm].n_questions;
   for (var i_question=0; i_question<n_questions; i_question++) {
      rdgmdata[i_rdgm].answered_correctly[i_question] = 0;
      rdgmdata[i_rdgm].questions[i_question] = {};
   }
   if (! rdgmdata[i_rdgm].hide_forward_back_b) {
      $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible', opacity: 0.2}).removeClass ('hover');
      $ ('span.question-number-rdgm' + i_rdgm).css ({visibility: 'visible'}).html (1);
   }
   if (rdgmdata[i_rdgm].rdgm_timer) {
      rdgmdata[i_rdgm].$rdgm_timer.html ('0:00');
   }
   var n_topics = rdgmdata[i_rdgm].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = rdgmdata[i_rdgm].topics[i_topic];
      rdgmdata[i_rdgm].topic_statistics[topic].n_correct = 0;
      rdgmdata[i_rdgm].topic_statistics[topic].n_incorrect = 0;
   }
   rdgmdata[i_rdgm].i_question           = -1;
   rdgmdata[i_rdgm].i_user_question      = -1;
   rdgmdata[i_rdgm].ii_question          = 0;
   rdgmdata[i_rdgm].user_question_number = 0;
   if (rdgmdata[i_rdgm].qrecord_id && document_rdgm_user_logged_in_b) {
      rdgmdata[i_rdgm].record_start_b = false;
      var data = {qrecord_id_ok: rdgmdata[i_rdgm].qrecord_id_ok, type: 'start', confirm: 'js'};
      qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
   }
   q.init_question_order (i_rdgm);
   q.next_question (i_rdgm, true);
};
function start_rdgm_timer (i_rdgm, time_limit_sec) {
   if (debug[0]) {
      console.log ('[start_rdgm_timer] i_rdgm:', i_rdgm, ', time_limit_sec:', time_limit_sec);
   }
   if (! q.rwizard_b && ! rdgmdata[i_rdgm].timer_interval_id && ! q.preview) {
      const $rdgm_timer = $ ('#rdgm' + i_rdgm + '-timer');
      rdgmdata[i_rdgm].$rdgm_timer = $rdgm_timer;
      if (time_limit_sec) {
         const hhmmss = qqc.hhmmss_from_sec (time_limit_sec);
         $rdgm_timer.html (hhmmss);
         rdgmdata[i_rdgm].timer_interval_id = setInterval (update_rdgm_timer, 1000, i_rdgm, true);
         rdgmdata[i_rdgm].times_up_msec     = new Date ().getTime () + time_limit_sec*1000 + 500;
      } else {
         rdgmdata[i_rdgm].timer_interval_id = setInterval (update_rdgm_timer, 1000, i_rdgm);
         rdgmdata[i_rdgm].timer_start_msec  = new Date ().getTime ();
      }
   }
}
function stop_rdgm_timer (i_rdgm, no_record_f=false) {
   if (rdgmdata[i_rdgm].timer_interval_id) {
      clearInterval (rdgmdata[i_rdgm].timer_interval_id);
      rdgmdata[i_rdgm].timer_interval_id = '';
      if (! no_record_f && rdgmdata[i_rdgm].qrecord_id
                                            && document_rdgm_user_logged_in_b) {
         const sec = parseInt ((new Date ().getTime () - rdgmdata[i_rdgm].timer_start_msec)/1000.0);
         var data = {elapsed_time: sec, callback: 'record_quiz_time_callback'};
         qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_quiz_time', data);
      }
      if (rdgmdata[i_rdgm].qrecord_id.indexOf ('finish_times_demo') != -1) {
         rdgmdata[i_rdgm].elapsed_time = parseInt ((new Date ().getTime () - rdgmdata[i_rdgm].timer_start_msec)/1000.0);
      }
   }
}
this.record_quiz_time_callback = function (data) {
   if (data.errmsg) {
      alert (data.errmsg);
      rdgmdata[i_rdgm].when_done_unix = 0;
   } else {
      const i_rdgm = data.i_rdgm;
      rdgmdata[i_rdgm].quiz_elapsed_time_id = data.quiz_elapsed_time_id;
      rdgmdata[i_rdgm].when_done_unix       = data.when_done_unix;
   }
}
function update_rdgm_timer (i_rdgm, time_limit_f) {
   var sec;
   if (time_limit_f) {
      sec = parseInt ((rdgmdata[i_rdgm].times_up_msec - new Date ().getTime ())/1000.0);
      if (sec <= 0) {
         times_up (i_rdgm);
         sec = 0;
      }
   } else {
      sec = parseInt ((new Date ().getTime () - rdgmdata[i_rdgm].timer_start_msec)/1000.0);
   }
   const hhmmss = qqc.hhmmss_from_sec (sec);
   rdgmdata[i_rdgm].$rdgm_timer.html (hhmmss);
}
function times_up (i_rdgm) {
   stop_rdgm_timer (i_rdgm, true);
   rdgmdata[i_rdgm].$rdgm_timer.html ('0:00');
   $ ('div#overlay-times-up-rdgm' + i_rdgm).show ();
   rdgmdata[i_rdgm].n_incorrect++;
   update_progress_show_next (i_rdgm);
}
function check_timers () {
   for (var i_rdgm=0; i_rdgm<n_rdgmzes; i_rdgm++) {
      if (rdgmdata[i_rdgm].timer_interval_id) {
         stop_rdgm_timer (i_rdgm, true);
         restart_timer_i_rdgm = i_rdgm;
         break;
      }
   }
}
this.redo_question = function (i_rdgm) {
   if (rdgmdata[i_rdgm].n_questions == 1) {
      $( '#rdgm' + i_rdgm + ' div.single-question_exit').hide ();
   }
   rdgmdata[i_rdgm].i_question = rdgmdata[i_rdgm].i_question - 1;
   rdgmdata[i_rdgm].answered_correctly[0] = 0;
   rdgmdata[i_rdgm].n_correct = 0;
   q.next_question (i_rdgm, true);
}
this.next_question = function (i_rdgm, no_login_b, simple_go_f) {
   if (debug[0]) {
      console.log ('[next_question] rdgmdata[i_rdgm].i_question:', rdgmdata[i_rdgm].i_question);
   }
   if (rdgmdata[i_rdgm].bck_f) {
      q.fwd_question (i_rdgm, false);
      return;
   }
   const $overlay_times_up = $ ('div#overlay-times-up-rdgm' + i_rdgm);
   if ($overlay_times_up.is (':visible')) {
      $overlay_times_up.hide ();
   }
   var i_question = rdgmdata[i_rdgm].i_question;
   if (i_question == -1) {
      if (! rdgmdata[i_rdgm].use_dataset || ! rdgmdata[i_rdgm].dataset_intro_f) {
         $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible', opacity: 0.2}).removeClass ('hover');
      }
   }
   const n_questions = rdgmdata[i_rdgm].n_questions;
   if (debug[0]) {
      console.log ('[next_question] i_question: ', i_question, ', n_questions: ', n_questions);
   }
   var rdgm_id = 'rdgm' + i_rdgm;
   var $rdgm = $ ('#' + rdgm_id);
   if (document_rdgm_mobile) {
      $rdgm.css ('width', '');
   } else {
      if (rdgmdata[i_rdgm].width_reset) {
         if ($ ('#xrdgm' + i_rdgm).length) {
            $rdgm.css ({width: rdgmdata[i_rdgm].initial_width + 'px', 'max-width': ''});
         } else {
            $rdgm.css ({width: '', 'max-width': ''});
         }
         $rdgm.css ({transform: ''});
         $rdgm[0].qscale_fac  = '';
         $rdgm[0].qstart_left = '';
         $rdgm[0].qstart_top  = '';
         rdgmdata[i_rdgm].width_reset = false;
      }
   }
   var start_quiz_b = false;
   simple_go_f = !! simple_go_f;
   if (i_question == -1 && ! simple_go_f) {
      if (rdgmdata[i_rdgm].use_dataset || rdgmdata[i_rdgm].use_dataset_questions_htm || n_questions > 1 || q.rwizard_b) {
         var i_user_question = -1;
         if (! q.no_intro_b[i_rdgm] || rdgmdata[i_rdgm].use_dataset_questions_htm) {
            start_quiz_b = true;
            if (! no_login_b && ! q.rwizard_b) {
               if (rdgmdata[i_rdgm].qrecord_id) {
                  var user_logged_in_b
                     =    typeof (document_rdgm_user_logged_in_b) != 'undefined'
                                               && document_rdgm_user_logged_in_b
                       && typeof (document_rdgm_username) != 'undefined';
                  if (   user_logged_in_b
                      || (   typeof (document_rdgm_declined_login_b) != 'undefined'
                          && document_rdgm_declined_login_b)) {
                     if (user_logged_in_b) {
                        var check_team_b = true;
                        if (! $.cookie ('rdgm_current_login_lt_nmin_ago')) {
                           check_team_b = false;
                           var a_team = '';
                           if (document_rdgm_team_b) {
                              a_team = ' ' + T ('a team') + ':';
                           }
                           if (confirm (T ('You are logged in as') + a_team + ' ' + document_rdgm_username + '.\n' + T ('Do you want to continue?  (Click "Cancel" to sign out)'))) {
                              var login_timeout_min = qqc.get_rdgm_param ('login_timeout_min', 40);
                              var options = {path:    '/',
                                             expires: login_timeout_min/(24.0*60.0)};
                              $.cookie ('rdgm_current_login_lt_nmin_ago', 1, options);
                           } else {
                              qqc.sign_out ();
                              document_rdgm_user_logged_in_b = false;
                           }
                        }
                        if (check_team_b && document_rdgm_team_b) {
                           if (! confirm (T ('You are logged in as team') + ': ' + document_rdgm_username + '.\n' + T ('Do you want to continue as this team?'))) {
                              document_rdgm_session_id = document_rdgm_session_id.split (';')[0];
                              document_rdgm_username   = document_rdgm_username.split ('; ')[0];
                              document_rdgm_team_b     = false;
                              qqc.set_user_menus_and_icons ();
                              var msg = T ('OK.  Only %s is logged in now');
                              msg = msg.replace ('%s', document_rdgm_username);
                              alert (msg);
                           }
                        }
                        rdgmdata[i_rdgm].record_start_b = false;
                        if (document_rdgm_user_logged_in_b) {
                           var data = {qrecord_id_ok: rdgmdata[i_rdgm].qrecord_id_ok, type: 'start', confirm: 'js'};
                           qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
                        }
                     }
                  } else {
                     q.display_login (i_rdgm);
                     return false;
                  }
               }
            }
            if (rdgmdata[i_rdgm].use_dataset || rdgmdata[i_rdgm].use_dataset_questions_htm) {
               var dataset_intro_f = rdgmdata[i_rdgm].dataset_intro_f;
               if (dataset_intro_f && dataset_intro_f != 'topics_only') {
                  q.display_login (i_rdgm, false, 'use_dataset_options');
               } else {
                  $ ('.intro-rdgm' + i_rdgm).hide ();
                  qqc.get_dataset_questions (rdgmdata[i_rdgm].use_dataset, qname,
                                             i_rdgm, rdgmdata[i_rdgm].qrecord_id,
                                             [], [], 10000,
                                             rdgmdata[i_rdgm].dataset_questions_to_do,
                                             rdgmdata[i_rdgm].random_b,
                                             rdgmdata[i_rdgm].use_dataset_questions_htm);
                  i_user_question = 0;
               }
            }
         } else {
            if (! q.no_intro_b[i_rdgm]) {
               if (rdgmdata[i_rdgm].rdgm_timer) {
                  start_rdgm_timer (i_rdgm);
               }
            }
         }
         q.next_question_from_intro (i_rdgm, i_user_question);
      } else {
         $ ('#mode-' + rdgm_id).css ('visibility', 'hidden');
         /* DKTMP
         if (q.rwizard_b && ! q.no_intro_b[i_rdgm]) {
            $ ('#intro-' + rdgm_id).hide ();
         }
         */
      }
   } else {
      var rdgmq_id = rdgm_id + '-q' + i_question;
      $ ('#' + rdgmq_id).hide ();
      if (document_rdgm_mobile) {
         $ ('#mobile_' + rdgmq_id).hide ();
      }
      if (rdgmdata[i_rdgm].pay_quiz_deck_id
            && (   rdgmdata[i_rdgm].pay_quiz_ok == 'preview_questions'
                || rdgmdata[i_rdgm].pay_quiz_ok == 'preview_period_expired'
                || rdgmdata[i_rdgm].pay_quiz_ok == 'no_free_trial')) {
         if (qqc.preview_limit ('rdgm', rdgmdata, i_rdgm)) {
            return;
         }
      }
   }
   if (n_questions == 0) {
      if (debug[0]) {
         console.log ('[next_question] n_questions:', n_questions);
      }
      return;
   }
   if (! next_button_active_b) {
      $ ('#next_button-' + rdgm_id).hide ();
      rdgmdata[i_rdgm].next_button_show_b = false;
   }
   if (i_question != -1 || simple_go_f) {
      if (rdgmdata[i_rdgm].information_question_b[i_question]) {
         $ ('#next_button_text-rdgm' + i_rdgm).html (T ('Next question'));
         if (! q.rwizard_b) {
            rdgmdata[i_rdgm].answered_correctly[i_question] = 1;
            rdgmdata[i_rdgm].n_correct++;
            q.display_progress (i_rdgm);
            if     (rdgmdata[i_rdgm].user_question_number == 1
                && (q.no_intro_b[i_rdgm]
                                        || rdgmdata[i_rdgm].n_questions == 1)) {
               $ ('div#icon_rdgm' + i_rdgm).hide ();
               alert_not_logged_in (i_rdgm);
               if (rdgmdata[i_rdgm].rdgm_timer) {
                  start_rdgm_timer (i_rdgm);
               }
            }
            if (rdgmdata[i_rdgm].qrecord_id && document_rdgm_user_logged_in_b) {
               var data = {q_and_a_text:  btoa (encodeURIComponent (rdgmdata[i_rdgm].q_and_a_text[i_question])),
                           q_and_a_crc32: rdgmdata[i_rdgm].q_and_a_crc32[i_question],
                           i_question:    rdgmdata[i_rdgm].dataset_id[i_question],
                           unit:          rdgmdata[i_rdgm].unit[i_question],
                           type:          'information_only',
                           response:      'continue',
                           correct_b:     1,
                           confirm:       'js'};
               qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
            }
         }
      }
   }
   if (next_button_active_b) {
      if (rdgmdata[i_rdgm].user_question_number == n_questions) {
         q.display_summary_and_exit (i_rdgm);
         return;
      }
   }
   if (! (rdgmdata[i_rdgm].use_dataset && i_question == -1)
                                            || (simple_go_f && ! q.rwizard_b)) {
      var n_done = rdgmdata[i_rdgm].n_correct;
      if (! rdgmdata[i_rdgm].repeat_incorrect_b) {
         n_done += rdgmdata[i_rdgm].n_incorrect;
      }
      var n_questions_for_done = rdgmdata[i_rdgm].n_questions_for_done;
      if (debug[0]) {
         console.log ('[next_question] n_done:', n_done, ', n_questions:', n_questions, ', n_questions_for_done:', n_questions_for_done);
      }
      if (n_done == n_questions_for_done) {
         var i_user_question = rdgmdata[i_rdgm].i_user_question;
         rdgmdata[i_rdgm].questions[n_questions] = {i_user_prev_question: i_user_question, user_question_number: '--'};
         rdgmdata[i_rdgm].questions[i_user_question].i_user_next_question = n_questions;
         rdgmdata[i_rdgm].i_user_question  = n_questions;
         rdgmdata[i_rdgm].saved_i_question = n_questions;
         $ ('span.question-number-rdgm' + i_rdgm).html ('--');
         stop_rdgm_timer (i_rdgm);
         q.display_summary_and_exit (i_rdgm);
      } else {
         if (q.rwizard_b) {
            rdgmdata[i_rdgm].i_question++;
            i_question = rdgmdata[i_rdgm].i_question;
         } else {
            var ii_question;
            while (true) {
               ii_question = rdgmdata[i_rdgm].ii_question;
               if (ii_question >= rdgmdata[i_rdgm].n_questions_for_done) {
                  ii_question = 0;
                  rdgmdata[i_rdgm].ii_question = 0;
               }
               i_question = rdgmdata[i_rdgm].question_order[ii_question];
               if (rdgmdata[i_rdgm].repeat_incorrect_b) {
                  if (rdgmdata[i_rdgm].answered_correctly[i_question] != 1) {
                     rdgmdata[i_rdgm].ii_question++;
                     break;
                  }
               } else {
                  if (typeof rdgmdata[i_rdgm].answered_correctly[i_question]
                                                                  == 'undefined'
                         || rdgmdata[i_rdgm].answered_correctly[i_question] == 0) {
                     rdgmdata[i_rdgm].ii_question++;
                     break;
                  }
               }
               rdgmdata[i_rdgm].ii_question++;
            }
         }
         var i_prev_question = rdgmdata[i_rdgm].i_user_question;
         rdgmdata[i_rdgm].i_question = i_question;
         if (typeof (rdgmdata[i_rdgm].questions[i_question]) == 'undefined') {
            rdgmdata[i_rdgm].questions[i_question] = {};
         }
         var question = rdgmdata[i_rdgm].questions[i_question];
         if (i_prev_question != question.i_user_prev_question) {
            question.i_user_prev_question = i_prev_question;
         }
         if (i_prev_question == -1) {
            rdgmdata[i_rdgm].i_first_user_question = i_question;
            if (debug[0]) {
               console.log ('[next_question] i_first_user_question:', i_question);
            }
         } else {
            var prev_question = rdgmdata[i_rdgm].questions[i_prev_question];
            if (prev_question) {
               prev_question.i_user_next_question = i_question;
            } else {
               console.log ('[next_question] prev_question for i_prev_question', i_prev_question, 'does not exist');
            }
            if (! q.rwizard_b) {
               $ ('.bck-question-rdgm' + i_rdgm).css ({opacity: 0.5}).addClass ('hover');
            }
         }
         rdgmdata[i_rdgm].i_user_question = i_question;
         if (typeof question.user_question_number == 'undefined') {
            rdgmdata[i_rdgm].user_question_number++;
            question.user_question_number = rdgmdata[i_rdgm].user_question_number;
         }
         if (! q.rwizard_b) {
            $ ('span.question-number-rdgm' + i_rdgm).html (question.user_question_number);
         }
         q.display_question (i_rdgm, i_question, start_quiz_b);
         if (q.rwizard_b && n_questions) {
            rwizard.set_rwizard_data ('i_question', i_question);
            rwizard.go_to_question2 ();
            if (qw.questions_cards[i_question].type != 'hotspot_diagram') {
               q.display_progress (i_rdgm);
            }
         }
      }
   }
};
this.next_question_from_intro = function (i_rdgm, i_user_question) {
   if (! rdgmdata[i_rdgm].n_questions) {
      return;
   }
   $ ('.intro-rdgm' + i_rdgm).hide ();
   if (! q.no_intro_b[i_rdgm]) {
      $ ('#icon_rdgm' + i_rdgm).hide ();
      if (rdgmdata[i_rdgm].rdgm_timer) {
         start_rdgm_timer (i_rdgm);
      }
   }
   $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible', opacity: 0.2}).removeClass ('hover');
   $ ('span.question-number-rdgm' + i_rdgm).html (1);
   $ ('#next_button-rdgm' + i_rdgm).css ('text-align', 'left');
   if (! (rdgmdata[i_rdgm].use_dataset || rdgmdata[i_rdgm].use_dataset_questions_htm)) {
      q.display_progress (i_rdgm, true);
   }
   $ ('#next_button_text-rdgm' + i_rdgm).html (T ('Next question'));
}
this.bck_question = function (i_rdgm, go_to_beg_f) {
   if (! $ ('.bck-question-rdgm' + i_rdgm).hasClass ('hover')) {
      return;
   }
   rdgmdata[i_rdgm].bck_f = true;
   var i_user_question = rdgmdata[i_rdgm].i_user_question;
   var i_current_user_question = i_user_question;
   if (go_to_beg_f) {
      if (rdgmdata[i_rdgm].use_dataset && rdgmdata[i_rdgm].dataset_intro_f) {
         rdgmdata[i_rdgm].saved_i_question = rdgmdata[i_rdgm].i_question;
         $ ('.bck-question-rdgm' + i_rdgm).css ({opacity: 0.2}).removeClass ('hover');
         $ ('.fwd-question-rdgm' + i_rdgm).css ({opacity: 0.5}).addClass ('hover');
         $ ('span.question-number-rdgm' + i_rdgm).html ('--');
         hide_current_question (i_rdgm, i_current_user_question);
         rdgmdata[i_rdgm].i_question = -1;
         q.display_login (i_rdgm, false, 'use_dataset_options');
         return;
      } else {
         i_user_question = rdgmdata[i_rdgm].i_first_user_question;
      }
   } else {
      i_user_question = rdgmdata[i_rdgm].questions[i_user_question].i_user_prev_question;
      if (i_user_question == -1) {
         return;
      }
   }
   hide_current_question (i_rdgm, i_current_user_question);
   $ ('div#summary-rdgm' + i_rdgm).hide ();
   rdgmdata[i_rdgm].i_user_question = i_user_question;
   var question = rdgmdata[i_rdgm].questions[i_user_question];
   if (go_to_beg_f || question.i_user_prev_question == -1) {
      var $bck = $ ('.bck-question-rdgm' + i_rdgm);
      if (rdgmdata[i_rdgm].use_dataset && rdgmdata[i_rdgm].dataset_intro_f) {
         $bck = $bck.last ();
      }
      $bck.css ({opacity: 0.2}).removeClass ('hover');
   }
   var user_question_number = question.user_question_number;
   $ ('span.question-number-rdgm' + i_rdgm).html (user_question_number);
   $ ('.fwd-question-rdgm' + i_rdgm).css ({opacity: 0.5}).addClass ('hover');
   rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_user_question;
   $ ('#' + rdgmq_id).show ();
   $ ('#next_button-rdgm' + i_rdgm).hide ();
   if (document_rdgm_mobile) {
      $ ('#mobile_' + rdgmq_id).show ();
   }
}
this.fwd_question = function (i_rdgm, go_to_end_f) {
   if (! $ ('.fwd-question-rdgm' + i_rdgm).hasClass ('hover')) {
      return;
   }
   if (rdgmdata[i_rdgm].i_question == -1) {
      $ ('#rdgm_login-rdgm' + i_rdgm).hide ();
   } else {
      var i_user_question = rdgmdata[i_rdgm].i_user_question;
      var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_user_question;
      $ ('#' + rdgmq_id).hide ();
      if (document_rdgm_mobile) {
         $ ('#mobile_' + rdgmq_id).hide ();
      }
   }
   if (go_to_end_f) {
      if (rdgmdata[i_rdgm].i_question == -1) {
         rdgmdata[i_rdgm].i_question = rdgmdata[i_rdgm].saved_i_question;
      }
      i_user_question = rdgmdata[i_rdgm].i_question;
   } else {
      if (rdgmdata[i_rdgm].i_question == -1) {
         i_user_question = rdgmdata[i_rdgm].i_first_user_question;
         rdgmdata[i_rdgm].i_question = rdgmdata[i_rdgm].saved_i_question;
      } else {
         i_user_question = rdgmdata[i_rdgm].questions[i_user_question].i_user_next_question;
      }
   }
   rdgmdata[i_rdgm].i_user_question = i_user_question;
   var question = rdgmdata[i_rdgm].questions[i_user_question];
   if (i_user_question == rdgmdata[i_rdgm].i_question) {
      rdgmdata[i_rdgm].bck_f = false;
      $ ('.fwd-question-rdgm' + i_rdgm).css ({opacity: 0.2}).removeClass ('hover');
      if (rdgmdata[i_rdgm].next_button_show_b) {
         $ ('#next_button-rdgm' + i_rdgm).show ();
      }
   }
   var user_question_number = question.user_question_number;
   $ ('span.question-number-rdgm' + i_rdgm).html (user_question_number);
   if (i_user_question == rdgmdata[i_rdgm].n_questions) {
      $ ('div#summary-rdgm' + i_rdgm).show ();
   } else {
      rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_user_question;
      $ ('#' + rdgmq_id).show ();
      if (document_rdgm_mobile) {
         $ ('#mobile_' + rdgmq_id).show ();
      }
      if (! rdgmdata[i_rdgm].summary_b) {
         if (user_question_number == rdgmdata[i_rdgm].n_questions) {
            $ ('div#summary-rdgm' + i_rdgm).show ();
         }
      }
   }
   var $bck = $ ('.bck-question-rdgm' + i_rdgm);
   if (question.i_user_prev_question == -1) {
      $bck = $bck.first ();
   }
   $bck.css ({opacity: 0.5}).addClass ('hover');
}
this.init_question_order = function (i_rdgm) {
   var n_questions = rdgmdata[i_rdgm].n_questions;
   rdgmdata[i_rdgm].question_order = new Array (n_questions);
   for (var i=0; i<n_questions; i++) {
      rdgmdata[i_rdgm].question_order[i] = i;
   }
   if (rdgmdata[i_rdgm].random_b) {
      rdgmdata[i_rdgm].question_order = qqc.shuffle (rdgmdata[i_rdgm].question_order);
      if (debug[0]) {
         console.log ('[init_question_order] rdgmdata[i_rdgm].question_order:', rdgmdata[i_rdgm].question_order);
      }
   }
}
function hide_current_question (i_rdgm, i_question) {
   var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
   $ ('#' + rdgmq_id).hide ();
   if (document_rdgm_mobile) {
      $ ('#mobile_' + rdgmq_id).hide ();
   }
}
this.display_question = function (i_rdgm, i_question, start_quiz_b) {
   var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
   var $rdgmq = $ ('div#' + rdgmq_id);
   if (debug[0]) {
      console.log ('[display_question] start_quiz_b:', start_quiz_b);
      console.log ('[display_question] $rdgmq:', $rdgmq);
   }
   $rdgmq.find ('[id^=' + rdgmq_id + '-a]').hide ();
   var $mobile_rdgmq = $ ('div#mobile_' + rdgmq_id);
   $mobile_rdgmq.find ('[id^=mobile_' + rdgmq_id + '-a]').hide ();
   var $rdgm_img = $rdgmq.find ('input[name="rdgm_img"]');
   if ($rdgm_img.length) {
      $rdgm_img.changeElements ('img');
      $mobile_rdgmq.find ('input[name="rdgm_img"]').changeElements ('img');
   }
   if (rdgmdata[i_rdgm].question_time_limit) {
      start_rdgm_timer (i_rdgm, rdgmdata[i_rdgm].question_time_limit);
   }
   var rdgm_edit_b = $rdgmq.hasClass ('rdgm_edit');
   if (rdgm_edit_b) {
   } else if ($rdgmq.hasClass ('hotspot_diagram')) {
      const $hotspot_image_stack = $rdgmq.find ('div.hotspot_image_stack')
      rdgmdata[i_rdgm].$hotspot_image_stack[i_question] = $hotspot_image_stack;
      const $canvas   = $hotspot_image_stack.find ('canvas.layer0_edited');
      if (q.rwizard_b) {
         $hotspot_image_stack.find ('img.layer0_edited, img.rdgm_style_layer').addClass ('rwizard_display_block_important');
         $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('rwizard_display_none_important');
         $ ('#icon_rdgm' + i_rdgm).hide ();
      } else {
         rdgmdata[i_rdgm].n_labels_correct = 0;
         rdgmdata[i_rdgm].n_label_attempts = 0;
         const show_hotspots = rdgmdata[i_rdgm].show_hotspots[i_question];
         const find_the_dot  = rdgmdata[i_rdgm].find_the_dot[i_question];
         if (find_the_dot) {
            const find_the_dot_htm = create_find_the_dot_html (i_rdgm, rdgmdata[i_rdgm].find_the_dot[i_question]);
            $hotspot_image_stack.before (find_the_dot_htm);
            $hotspot_image_stack.find ('img.rdgm_layer0, img.rdgm_style_layer').hide ();
            $rdgmq.find ('input.find_the_dot_dot_color')
               .simpleColor ({boxWidth:   '25px',
                              boxHeight:  '17px',
                              onSelect:   find_the_dot_color_selected});
            $rdgmq.find ('input.find_the_dot_background_color')
               .simpleColor ({boxWidth:   '25px',
                              boxHeight:  '17px',
                              onSelect:   find_the_dot_color_selected});
            q.update_find_the_dot (i_rdgm, false, true);
            $hotspot_image_stack.find ('canvas.layer0_edited').css ({outline: '1px dotted gray'}).show ();
         } else {
            rdgmdata[i_rdgm].spotmap_width[i_question]  = $canvas.data ('rdgm_spotmap_width');
            rdgmdata[i_rdgm].spotmap_height[i_question] = $canvas.data ('rdgm_spotmap_height');
            const sparsemap                             = $canvas.data ('rdgm_sparsemap');
            rdgmdata[i_rdgm].sparsemap[i_question]      = sparsemap;
            const spotmap_data = $canvas.data ('rdgm_spotmap');
            if (sparsemap) {
               rdgmdata[i_rdgm].spotmap[i_question]     = JSON.parse (spotmap_data.replace (/(\d+):/g, '"$1":'));
            } else {
               rdgmdata[i_rdgm].spotmap[i_question]     = new Uint8ClampedArray (base64js.toByteArray (spotmap_data));
            }
            rdgmdata[i_rdgm].hotspot_image_width[i_question]  = $canvas.attr ('width');
            rdgmdata[i_rdgm].hotspot_image_height[i_question] = $canvas.attr ('height');
            $hotspot_image_stack.find ('img.hotspot_only_image').hide ();
            if (show_hotspots && show_hotspots.indexOf ('always') != -1) {
               $hotspot_image_stack.find ('img.rdgm_style_layer').show ();
            }
         }
         const hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
         if (! hotspot_user_interaction || hotspot_user_interaction == 'label_prompt') {
            var n_hotspots;
            if (rdgmdata[i_rdgm].answered_correctly[i_question] == -1) {
               var n_hotspots_to_do = 0;
               n_hotspots  = rdgmdata[i_rdgm].n_hotspots[i_question];
               for (var i=0; i<n_hotspots; i++) {
                  const mod_hotspot_no
                              = rdgmdata[i_rdgm].hotspot_nos[i_question][i] % 1000;
                  if (rdgmdata[i_rdgm].hotspot_nos[i_question][i] < 0) {
                     rdgmdata[i_rdgm].hotspot_nos[i_question][i] = -mod_hotspot_no;
                     n_hotspots_to_do++;
                  }
               }
               rdgmdata[i_rdgm].n_hotspots_to_do[i_question] = n_hotspots_to_do;
               if (debug[0]) {
                  console.log ('[display_question] n_hotspots_to_do:', n_hotspots_to_do);
               }
               rdgmdata[i_rdgm].n_labels_correct = n_hotspots - n_hotspots_to_do;
               rdgmdata[i_rdgm].n_label_attempts = 0;
            }
         }
         const hotspot_labels_stick = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
         if (rdgmdata[i_rdgm].answered_correctly[i_question] != -1) {
            rdgmdata[i_rdgm].hotspot_nos[i_question] = [];
            rdgmdata[i_rdgm].hotspot_labels[i_question] = [];
            rdgmdata[i_rdgm].hotspot_ver2_f[i_question] = $hotspot_image_stack.find ('.rdgm_hotspot1').hasClass ('rdgm_hotspot_ver2');
            $hotspot_image_stack
               .find ('div.rdgm_hotspot_label').not ('.rdgm_hotspot_deleted')
               .each (function () {
                         const $label = $ (this);
                         const classnames = $label.attr ('class');
                         const m = classnames.match (/ rdgm_hotspot(\d+)/);
                         const hotspot_no = m[1];
                         rdgmdata[i_rdgm].hotspot_nos[i_question].push (parseInt (hotspot_no));
                         $label.find ('div.ui-resizable-handle').remove ();
                         var hotspot_label = $label.find ('div.rdgm_hotspot_label_editable').text ();
                         hotspot_label = qqc.remove_tags_eols (hotspot_label);
                         rdgmdata[i_rdgm].hotspot_labels[i_question].push (hotspot_label);
                         /* DKTMP xxx
                         if (hotspot_labels_stick && hotspot_labels_stick == 'temporary') {
                            $label.off ('mouseenter');
                            $label.on  ('mouseenter', function () {
                                                         $label.hide ();
                                                      });
                         }
                         */
                         if (hotspot_labels_stick
                                  && (   hotspot_labels_stick == 'keep'
                                      || hotspot_labels_stick == 'temporary')) {
                            $label.off ('mouseenter mouseleave');
                            $label.on  ('mouseenter', function () {
                                                         $label.css ({opacity: 0.1});
                                                      })
                                  .on  ('mouseleave', function () {
                                                         $label.css ({opacity: 1.0});
                                                      });
                         }
                      });
            n_hotspots = rdgmdata[i_rdgm].hotspot_nos[i_question].length;
            rdgmdata[i_rdgm].n_hotspots[i_question] = n_hotspots;
            if (! n_hotspots) {
               errmsgs.push (T ('No hotspots set for hotspot_diagram'), + '.  rdgm: ' + (i_rdgm + 1) + ', ' + T ('question') + ' ' + (i_question + 1));
            }
            rdgmdata[i_rdgm].n_hotspots_to_do[i_question] = n_hotspots;
            if (debug[0]) {
               console.log ('[display_question] n_hotspots:', n_hotspots);
            }
            if (show_hotspots && show_hotspots.indexOf ('hide') == -1
                                                            && ! find_the_dot) {
               init_hotspot_image_canvas (i_rdgm, i_question, $hotspot_image_stack);
            }
         }
         rdgmdata[i_rdgm].n_label_targets = n_hotspots;
         rdgmdata[i_rdgm].answered_correctly[i_question] = 1;
         $hotspot_image_stack.find ('div.rdgm_hotspot_label').hide ();
         if (! hotspot_user_interaction || hotspot_user_interaction == 'label_prompt') {
            $rdgmq.find ('div.hotspot_click_feedback').html ('<b>Click on:</b>');  // DKTMP
            const current_query_hotspot_no = pick_random_hotspot (i_rdgm, i_question);
            rdgmdata[i_rdgm].current_query_hotspot_no[i_question] = current_query_hotspot_no;
            set_hotspot_label_query (i_rdgm, i_question, $rdgmq);
         }
         $hotspot_image_stack.off ('click.hotspot_diagram_click');
         if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
            if (rdgmdata[i_rdgm].n_questions > 1) {
               $ ('#next_button_text-rdgm' + i_rdgm).html (T ('Continue'));
               q.position_show_next_button (i_rdgm);
               rdgmdata[i_rdgm].next_button_show_b = true;
               rdgmdata[i_rdgm].answered_correctly[i_question] = 1;
               rdgmdata[i_rdgm].n_correct++;
            }
            if (rdgmdata[i_rdgm].user_question_number == 1) {
               alert_not_logged_in (i_rdgm);
            }
         } else {
            $hotspot_image_stack.on ('click.hotspot_diagram_click', rdgm_.hotspot_diagram_click);
         }
         if (   (show_hotspots        && show_hotspots.indexOf ('hover_show') != -1)
             || (hotspot_labels_stick && hotspot_labels_stick.indexOf ('hover_show') != -1)) {
            $hotspot_image_stack.off ('mousemove click.mobile_hover_eq');
            $hotspot_image_stack.on  ('mousemove click.mobile_hover_eq', show_hotspot_on_hover);
            if (show_hotspots && show_hotspots.indexOf ('keep') == -1) {
               $hotspot_image_stack.off ('mouseleave');
               $hotspot_image_stack.on  ('mouseleave', hide_hotspots);
            }
            rdgmdata[i_rdgm].current_xy_hotspot_no = -1;
         }
         if (rdgmdata[i_rdgm].icon_swhs && ! rdgmdata[i_rdgm].hide_r_diagrams_icon_b) {
            $hotspot_image_stack.append (create_icon_rdgm_div (i_rdgm));
         }
         var found_clicked_visited = S ('Correctly clicked');
         if (hotspot_user_interaction) {
            if (hotspot_user_interaction == 'find_hotspots') {
               found_clicked_visited = S ('Found');
            } else if (hotspot_user_interaction == 'info_only') {
               found_clicked_visited = S ('Visited');
            }
         }
         q.display_diagram_progress (i_rdgm, found_clicked_visited);
      }
   }
   if (start_quiz_b && qqc.is_mobile (rdgmdata[i_rdgm].mobile_enabled)) {
      q.go_mobile (i_rdgm);
   } else if (document_rdgm_mobile) {
      var $mobile_rdgmq = $ ('#mobile_rdgm' + i_rdgm + '-q' + i_question);
      if ($mobile_rdgmq.length) {
         $mobile_rdgmq.show ();
      } else {
         $rdgmq.show ();
      }
      window.scrollTo (0, 1);
   } else {
      if (debug[0]) {
         console.log ('[display_question] $rdgmq:', $rdgmq);
      }
      $rdgmq.css ('display', 'block');
      if (q.rwizard_b) {
         var init_b = false;
         if (rdgmdata[i_rdgm].use_dataset_question_ids[i_question]) {
            var $rdgm_editable = $rdgmq.find ('.rdgm_editable');
            if ($rdgm_editable.length) {
               $rdgm_editable.removeClass ('rdgm_editable');
               init_b = true;
            }
         } else {
            var hangman_labeled_diagram_f = $rdgmq.find ('div.hangman_image').length;
            rwizard.init_tinymce ('div#' + rdgmq_id + ' .rdgm_editable', false,
                                  hangman_labeled_diagram_f);
            init_b = true;
         }
      }
   }
   var selector = '#rdgm' + i_rdgm;
   if (q.preview) {
      selector += '-q' + i_question + '.rdgmq_preview';
   }
   var $rdgm = $ (selector);
   if (! document_rdgm_mobile && ! document_rdgm_force_mobile_f) {
      if (rdgm_edit_b) {
         var table_width = 10 + $rdgmq.find ('table.rdgm_edit_table').outerWidth ();
         if (debug[0]) {
            console.log ('[display_question] table_width:', table_width, ', initial_width:', rdgmdata[i_rdgm].initial_width);
         }
         if (table_width > rdgmdata[i_rdgm].initial_width) {
            $rdgm.css ({width: table_width + 'px', 'max-width': 'none'});
            rdgmdata[i_rdgm].width_reset = true;
         }
         if (q.rwizard_b) {
            var $labels = $rdgmq.find ('.rdgm_edit_highlight_label');
            /* DKTMP DEDRAG
            rwizard.create_label_tooltips ($labels);
            rwizard.disable_browser_context_menu ($labels);
            */
            $labels.addClass ('no_move');
         }
      } else {
         var $img = $rdgmq.find ('img');
         if ($img.length) {
            var img_width = 10 + $img.outerWidth ();
            if (debug[0]) {
               console.log ('[display_question] img_width:', img_width, ', initial_width:', rdgmdata[i_rdgm].initial_width);
            }
            if (img_width > rdgmdata[i_rdgm].initial_width) {
               $rdgm.css ({width: img_width + 'px', 'max-width': 'none'});
               rdgmdata[i_rdgm].width_reset = true;
            }
         }
      }
   }
   if ($rdgm.length) {
      if (! $rdgm.is (':visible')) {
         const observer = new IntersectionObserver (scale_quiz_to_container_when_visible, {threshold: 1});
         observer.observe ($rdgm[0]);
      } else {
         scale_quiz_to_container ($rdgm);
      }
   }
}
function scale_quiz_to_container_when_visible (entries, observer) {
   if (debug[0]) {
      console.log ('[scale_quiz_to_container_when_visible] entries:', entries);
      console.log ('[scale_quiz_to_container_when_visible] observer:', observer);
   }
   const $rdgm = $ (entries[0].target);
   if ($rdgm.is (':visible')) {
      scale_quiz_to_container ($rdgm);
      observer.unobserve (entries[0].target);
   }
}
function scale_quiz_to_container ($rdgm) {
   var rdgm_width = $rdgm.outerWidth ();
   var $container = $rdgm.parent ();
   if ($container.length) {
      var container_width = $container.width ();
      if (container_width > 0) {
         if (rdgm_width > container_width) {
            const scale_fac = container_width / rdgm_width;
            const trans_pct = Math.round ((1.0 - scale_fac) * 50.0)
            const rtl_fac = getComputedStyle ($container[0]).direction == 'rtl' ? 1 : -1;
            $rdgm.css ({transform: 'translate(' + rtl_fac*trans_pct + '%, -' + trans_pct + '%) scale(' + scale_fac.toFixed (3) + ')'});
            qqc.offset_height_rescale ($rdgm, scale_fac);
            const id = $rdgm[0].id;
            const m = id.match (/rdgm(\d+)/);
            if (m) {
               const i_rdgm = m[1];
               if (debug[0]) {
                  console.log ('[scale_quiz_to_container] $rdgm:', $rdgm);
                  console.log ('[scale_quiz_to_container] i_rdgm:', i_rdgm);
               }
               rdgmdata[i_rdgm].width_reset = true;
            }
            $rdgm[0].qscale_fac = scale_fac;
         }
      }
   }
}
this.show_response_recorded = function (i_rdgm) {
   var i_question = rdgmdata[i_rdgm].i_question;
   var question = rdgmdata[i_rdgm].questions[i_question];
   var hhmmss = DateFormat.format.date (new Date ().getTime (), 'h:mm:ss');
   $ ('span.response_recorded_wrapper-rdgm' + i_rdgm).css ({display: 'inline-block'});
   var $response_recorded        = $ ('span.response_recorded-rdgm' + i_rdgm);
   var $response_recorded_shadow = $ ('span.response_recorded_shadow-rdgm' + i_rdgm);
   $response_recorded.addClass ('response_recorded_jump')
                      .attr ('title', 'Response to question ' + question.user_question_number + ' recorded ' + hhmmss)
   $response_recorded_shadow.css ({display: 'inline-block'});
   var delay_remove = function () {
      $response_recorded.removeClass ('response_recorded_jump');
      $response_recorded_shadow.hide ();
   }
   setTimeout (delay_remove, 500);
}
this.pay_lock_settings = function (do_i_rdgm_deck, i_login_rdgm, escaped_session_id,
                                   remember_f) {
   qqc.pay_lock_settings (qname, rdgmdata, n_rdgmzes, i_login_rdgm,
                          escaped_session_id, remember_f, do_i_rdgm_deck);
}
this.go_mobile = function (i_rdgm) {
   non_mobile_scrollLeft = window.scrollX;
   non_mobile_scrollTop  = window.scrollY;
   var $rdgm = $ ('#rdgm' + i_rdgm);
   rdgmdata[i_rdgm].rdgm_style = $rdgm.attr ('style');
   $rdgm.removeAttr ('style').removeClass ('rdgm').addClass ('rdgm-mobile rwizard_rdgm_deck_div');
   $rdgm.after ('<div id="rdgm_div_placeholder"></div>');
   $rdgm.appendTo ('body');
   window.scrollTo (0, 0);
   $ ('body').css ({overflow: 'hidden'});
   $ ('#icon_rdgm' + i_rdgm).hide ();
   if (qqc.is_mobile (rdgmdata[i_rdgm].mobile_enabled) || ! document_rdgm_force_mobile_f) {
      $rdgm.find ('.rdgm_edit_label_head_standard').hide ();
      $rdgm.find ('.rdgm_edit_label_head_mobile').show ();
      var i_question = rdgmdata[i_rdgm].i_question;
      if (i_question < rdgmdata[i_rdgm].n_questions && ! rdgmdata[i_rdgm].login_show_b) {
         var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
         var $rdgmq = $ ('#' + rdgmq_id);
         var $mobile_rdgmq = $ ('#mobile_rdgm' + i_rdgm + '-q' + i_question);
         if ($mobile_rdgmq.length) {
            $mobile_rdgmq.show ();
            $rdgmq.hide ();
         } else {
            $rdgmq.show ();
         }
      }
      if (rdgmdata[i_rdgm].$rdgm_edit && rdgmdata[i_rdgm].$rdgm_edit[rdgmq_id]) {
         reset_label_positions ($rdgmq);
         $rdgm.css ('width', '');
      }
      $ ('.go-mobile-rdgm' + i_rdgm).hide ();
      if (! document_rdgm_force_mobile_f) {
         $ ('.exit-mobile-rdgm' + i_rdgm).show ();
         $ ('#mode-rdgm' + i_rdgm).hide ();
         $ ('#icon-exit-mobile-rdgm' + i_rdgm).show ();
         $ ('#summary-rdgm' + i_rdgm).find ('button.summary_exit_mobile_rdgm').show ();
      }
      document_rdgm_mobile = 'mobile_';
      scale_quiz_to_container ($rdgm);
   }
}
this.open_panel_exit_mobile = function (i_rdgm) {
   $ ('#overlay-exit-mobile-rdgm' + i_rdgm)
      .show ()
      .animate ({top: '0px'}, 500);
   panel_exit_mobile_open_b = true;
   $ ('#icon-exit-mobile-rdgm' + i_rdgm).hide ();
}
this.close_panel_exit_mobile = function (overlay_el) {
   $ (overlay_el).animate ({top: '-100px'}, 500,
                           function () {
                              $ (this).hide ();
                              $ ('div.icon-exit-mobile-rdgm').show ();
                           });
   window.scrollTo ($ (window).scrollLeft (), 1);
   panel_exit_mobile_open_b = false;
   panel_exit_mobile_just_closed_b = true;
   return false;
}
this.exit_mobile = function (i_rdgm) {
   var $rdgm = $ ('#rdgm' + i_rdgm);
   $rdgm.attr ('style', rdgmdata[i_rdgm].rdgm_style)
        .removeClass ('rdgm-mobile rwizard_rdgm_deck_div')
        .addClass ('rdgm');
   if ($ ('#xrdgm' + i_rdgm).length) {
      $ ('#rdgm' + i_rdgm).css ('width', rdgmdata[i_rdgm].initial_width + 'px');
   }
   $ ('#rdgm_div_placeholder').replaceWith ($rdgm);
   $ ('body').css ({overflow: ''});
   window.scrollTo (non_mobile_scrollLeft, non_mobile_scrollTop);
   $ ('#overlay-exit-mobile-rdgm' + i_rdgm).css ({top: '-100px', display: 'none'});
   $ (window).off ('scroll');
   $rdgm.find ('.rdgm_edit_label_head_standard').show ();
   $rdgm.find ('.rdgm_edit_label_head_mobile').hide ();
   var i_question = rdgmdata[i_rdgm].i_question;
   var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
   var $rdgmq = $ ('#' + rdgmq_id);
   if (i_question >= 0 && i_question < rdgmdata[i_rdgm].n_questions
                                          && ! rdgmdata[i_rdgm].login_show_b) {
      var $mobile_rdgmq = $ ('#mobile_rdgm' + i_rdgm + '-q' + i_question);
      $mobile_rdgmq.hide ();
      $rdgmq.show ();
   }
   var $table_img;
   if (rdgmdata[i_rdgm].$rdgm_edit && rdgmdata[i_rdgm].$rdgm_edit[rdgmq_id]) {
      $table_img = $rdgmq.find ('table.rdgm_edit_table');
   } else {
      $table_img = $rdgmq.find ('img');
   }
   if ($table_img.length) {
      var table_img_width = 10 + $table_img.outerWidth ();
      if (table_img_width > rdgmdata[i_rdgm].initial_width) {
         var selector = '#rdgm' + i_rdgm;
         if (q.preview) {
            selector += '-q' + i_question + '.rdgmq_preview';
         }
         $ (selector).css ({width: table_img_width + 'px', 'max-width': 'none'});
         rdgmdata[i_rdgm].width_reset = true;
      }
      if (rdgmdata[i_rdgm].$rdgm_edit && rdgmdata[i_rdgm].$rdgm_edit[rdgmq_id]) {
         reset_label_positions ($rdgmq);
      }
   }
   $ ('div.icon-exit-mobile-rdgm, div.icon-panel-exit-mobile-rdgm').hide ();
   $ ('.exit-mobile-rdgm').hide ();
   $ ('button.summary_exit_mobile_rdgm').hide ();
   const mobile_enabled = rdgmdata[i_rdgm].mobile_enabled;
   if (mobile_enabled == 'Always'
               || (mobile_enabled == 'Small screens only'
                                           && qqc.is_mobile (mobile_enabled))) {
      $ ('.go-mobile-rdgm' + i_rdgm).show ();
   }
   document_rdgm_mobile = '';
   panel_exit_mobile_just_closed_b = false;
}
var first_decode_err_f = true;
function cvt_feedback (htm, f_pos) {
   var before_c;
   var after_c;
   const no_c = typeof f_pos != 'undefined';
   if (no_c) {
      before_c = htm.substr (0, f_pos);
      after_c =  htm.substr (f_pos);
   } else {
      c_pos = htm.indexOf ('[c]');
      if (c_pos == -1) {
         return htm;
      }
      before_c = htm.substr (0, c_pos);
      after_c  = htm.substr (c_pos + 3);
   }
   f_pos = after_c.indexOf ('[f]');
   if (f_pos == -1) {
      f_pos = after_c.indexOf ('[fx]');
   }
   var after_f;
   var f_cvt;
   var f = '';
   if (f_pos != -1) {
      after_f = after_c.substr (f_pos + 3);
      after_c = after_c.substr (0, f_pos);
      while (true) {
         f_pos = after_f.indexOf ('[f]');
         if (f_pos == -1) {
            f_cvt = after_f;
         } else {
            f_cvt = after_f.substr (0, f_pos);
            after_f  = after_f.substr (f_pos + 3);
         }
         var r = feedback_decode (f_cvt);
         var more_f = r.c;
         if (more_f) {
            f += '[f]' + more_f;
         }
         if (f_pos == -1) {
            break;
         }
      }
   }
   var r = feedback_decode (after_c);
   var sc = '';
   var c  = '';
   if (! no_c) {
      var sc = '[c' + r.star + ']';
      var c = r.c;
   }
   /*
   if (first_decode_err_f) {
      c = '[Sorry, missing question data. Please contact <a href="mailto: support@r_diagrams.com">support@r_diagrams.com</a>]';
      first_decode_err_f = false;
   }
   console.log ('[cvt_feedback] unable to convert:', after_c);
   */
   var c_htm = before_c + sc + c + f;
   return c_htm;
}
function feedback_decode (s) {
   var tag_pos = s.indexOf ('[Qq]');
   var s_to_decode;
   var s_rest = '';
   if (tag_pos != -1) {
      s_to_decode = s.substr (0, tag_pos);
      s_rest      = s.substr (tag_pos + 4);
   } else {
      s_to_decode = s;
   }
   if (debug[2]) {
      console.log ('[feedback_decode] s_to_decode:', s_to_decode);
   }
   var star = '';
   var decoded_s = '';
   var fparts = s_to_decode.split (/<[^>]+>/);
   if (fparts.length > 1) {
      var splits = s_to_decode.match (/<[^>]+>/g)
      var decoded_parts = [];
      var n_splits = splits.length;
      var first_f = true;
      for (var i=0; i<n_splits; i++) {
         var fpart = fparts[i];
         if (fpart != '') {
            if (first_f) {
               first_f = false;
               if (/ /.test (fpart)) {
                  star = '*';
               }
            }
            try {
               decoded_parts.push (Base64.decode (fpart));
            } catch (e) {};
         }
         if (splits[i].indexOf ('qcodeq') != -1) {
            reinit_highlighting_f = true;
            splits[i] = splits[i].replace ('qcodeq', 'code');
         }
         decoded_parts.push (splits[i]);
      }
      try {
         var fpart = fparts[n_splits];
         if (first_f) {
            if (/ /.test (fpart)) {
               star = '*';
            }
         }
         decoded_parts.push (Base64.decode (fpart));
      } catch (e) {};
      decoded_s = decoded_parts.join ('');
   } else {
      if (/ /.test (s_to_decode)) {
         star = '*';
      }
      try {
         decoded_s = Base64.decode (s_to_decode);
      } catch (e) {};
   }
   decoded_s += s_rest;
   if (debug[2]) {
      console.log ('[feedback_decode] decoded_s:', decoded_s);
   }
   return {c: decoded_s, star: star};
}
this.hangman_show = function (rdgm_hangman_el, keyup_f) {
   if (suppress_hangman_hint_b) {
      suppress_hangman_hint_b = false;
      return false;
   }
   var $rdgm_hangman = $ (rdgm_hangman_el);
   $rdgm_hangman.find ('span.hangman_type_letters').hide ();
   clearTimeout (rdgm_hangman_el.i_hint_timeout);
   if (keyup_f) {
      var hide_hint_button = function () {
         $rdgm_hangman.find ('button.hangman_hint, span.hangman_status').fadeOut (1000);
      }
      rdgm_hangman_el.i_hint_timeout = setTimeout (hide_hint_button, 750);
   }
   if (! rdgm_hangman_el.done_f) {
      $rdgm_hangman.find ('button.hangman_hint').show ();
      var $hangman_status =  $rdgm_hangman.find ('span.hangman_status')
      if ($hangman_status.html ()) {
         $hangman_status.show ();
      }
   }
}
this.hangman_hide = function (rdgm_hangman_el) {
   var $rdgm_hangman = $ (rdgm_hangman_el);
   var hide_hint_button = function () {
      $rdgm_hangman.find ('button.hangman_hint, span.hangman_status').fadeOut (500);
   }
   rdgm_hangman_el.i_hint_timeout = setTimeout (hide_hint_button, 500);
}
function create_hangman_textentry_editable_divs (i_rdgm, i_question,
                                                 opening_tags, span_inputs,
                                                 hangman_textentry, re, htm) {
   htm = qqc.shortcodes_to_video_elements (htm);
   var new_htm = [];
   var bg_img_style = create_bg_img_style (i_rdgm, i_question);
   new_htm.push ('<div id="rdgm' + i_rdgm + '-q' + i_question + '" class="rdgmq rwizard_line_height"' + bg_img_style + '>\n');
   if (typeof rdgmdata[i_rdgm].parts_htm[i_question] == 'undefined') {
      rdgmdata[i_rdgm].parts_htm[i_question] = []
   }
   var t_pos = 0;
   var t_block;
   var i_part = 1;
   var htm_length = htm.length;
   while (true) {
      var remaining_htm = htm.substr (t_pos);
      var ii_pos = remaining_htm.search (re);
      if (ii_pos == -1) {
         break;
      }
      t_pos = t_pos + ii_pos;
      var part_htm = remaining_htm.substr (0, ii_pos);
      if (i_part == 1) {
         part_htm = opening_tags + part_htm;
      }
      part_htm = qqc.remove_unmatched_tag (part_htm, i_part == 1);
      if (part_htm.search (/\S/) == -1) {
         part_htm = '&nbsp;';
      }
      rdgmdata[i_rdgm].parts_htm[i_question][i_part] = part_htm;
      var m = remaining_htm.match (re);
      if (debug[9]) {
         console.log ('[create_hangman_textentry_editable_divs] m[0]:', m[0]);
      }
      t_pos += m[0].length;
      new_htm.push ('<div class="rdgm-question rdgm-question-' + hangman_textentry + ' rdgm-parts rdgm-part' + i_part + ' rdgm-inline rdgm_editable" data-i_part="' + i_part + '">\n');
      new_htm.push (   part_htm);
      new_htm.push ('</div>');
      new_htm.push (span_inputs[i_part-1]);
      i_part++;
   }
   var part_htm = htm.substr (t_pos);
   part_htm = qqc.remove_unmatched_tag (part_htm, false, true);
   if (part_htm.search (/\S/) == -1) {
      part_htm = '&nbsp;';
   }
   rdgmdata[i_rdgm].parts_htm[i_question][i_part] = part_htm;
   new_htm.push ('<div class="rdgm-question rdgm-question-' + hangman_textentry + ' rdgm-parts rdgm-part' + i_part + ' rdgm-inline rdgm_editable" data-i_part="' + i_part + '">\n');
   new_htm.push (   part_htm);
   new_htm.push ('</div>');
   return new_htm.join ('');
}
this.hangman_keyup = function (input_el, event, default_value, i_rdgm, i_question, i_choice) {
   if (rdgmdata[i_rdgm].user_question_number == 1
               && (q.no_intro_b[i_rdgm] || rdgmdata[i_rdgm].n_questions == 1)) {
      $ ('div#icon_rdgm' + i_rdgm).hide ();
      alert_not_logged_in (i_rdgm);
      if (rdgmdata[i_rdgm].rdgm_timer) {
         start_rdgm_timer (i_rdgm);
      }
   }
   var value = input_el.value;
   input_el.value = default_value;
   if (debug[9]) {
      console.log ('[hangman_keyup] value.charCodeAt:', value.charCodeAt (0), value.charCodeAt (1), value.charCodeAt (2), value.charCodeAt (3));
   }
   var keychars = value.replace (/[^a-z0-9]/gi, '');
   if (keychars == '') {
      return false;
   }
   keychars = keychars.toLowerCase ();
   if (debug[9]) {
      console.log ('[hangman_keyup] keychars:', keychars);
   }
   var current_entry = rdgmdata[i_rdgm].hangman[i_question].hangman_current_entry[i_choice];
   var final_entry   = rdgmdata[i_rdgm].hangman[i_question].hangman_final_entry[i_choice];
   var done_f;
   var n_chars = keychars.length;
   for (var i=0; i<n_chars; i++) {
      var keychar = keychars[i];
      var done_f = update_hangman_input (keychar, current_entry, final_entry,
                                          i_rdgm, i_question, i_choice, input_el);
      if (done_f) {
         break;
      }
   }
   if (! done_f) {
      $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm-feedback').hide ();
      $ (input_el).parents ('div.rdgmq').find('div.rdgm_hangman_msg').hide ();
      if (rdgmdata[i_rdgm].hangman[i_question].hangman_incorrect_chars[i_choice]) {
         var hangman_incorrect_chars_before_hint
                = rdgmdata[i_rdgm].hangman[i_question].hangman_incorrect_chars_before_hint[i_choice];
         var hangman_incorrect_chars_display
            = qqc.create_hangman_incorrect_chars_display (rdgmdata[i_rdgm].hangman[i_question].hangman_incorrect_chars[i_choice], hangman_incorrect_chars_before_hint, true);
         $ (input_el).parents ('span.rdgm_hangman.rdgm_hangman_c' + i_choice).find ('span.hangman_status').html (hangman_incorrect_chars_display).show ();
      }
   }
   return true;
}
function update_hangman_input (keychar, current_entry, final_entry,
                               i_rdgm, i_question, i_choice, input_el, hint_f) {
   var done_f = false;
   var good_char_b = false;
   var i_pos = -1;
   var re = new RegExp ('u>' + keychar + '</u', 'i');
   while (true) {
      var m = final_entry.substr (i_pos + 1).match (re);
      if (! m ) break;
      i_pos += m.index + 2;
      current_entry = qqc.setCharAt (current_entry, i_pos + 1, m[0][2]);
      good_char_b = true;
   }
   if (debug[9]) {
      console.log ('[update_hangman_input] keychar:', keychar, ', good_char_b:', good_char_b);
   }
   var hangman = rdgmdata[i_rdgm].hangman[i_question];
   var hangman_incorrect_chars = hangman.hangman_incorrect_chars[i_choice];
   var done_f     = false;;
   var all_done_f = false;;
   if (good_char_b) {
      hangman.hangman_current_entry[i_choice] = current_entry;
      var local_current_entry = current_entry.replace (/\t/g, '&ensp;');
      $ (input_el).parents ('span.rdgm_hangman.rdgm_hangman_c' + i_choice).find ('span.hangman_current_entry').html (local_current_entry);
      done_f = current_entry.indexOf ('<u>\t</u>') == -1;
      if (done_f) {
         hangman.n_hangman_done++;
         all_done_f = hangman.n_hangman_done == hangman.n_hangman;
      }
   } else {
      keychar = keychar.toLowerCase ();
      if (hangman_incorrect_chars.indexOf (keychar) == -1) {
         hangman_incorrect_chars += keychar;
         if (hangman_incorrect_chars.length > 6) {
            done_f = true;
            hangman.n_hangman_done++;
            all_done_f = hangman.n_hangman_done == hangman.n_hangman;
         }
      }
      hangman.hangman_incorrect_chars[i_choice] = hangman_incorrect_chars;
      if (debug[9]) {
         console.log ('[hangman_keyup] hangman_incorrect_chars:', hangman_incorrect_chars);
      }
   }
   if (done_f) {
      $ (input_el).on ('mousedown', function (e) {
                                       e.preventDefault ();
                                    });
      input_el.parentElement.done_f = true;
      const hangman_n_hints = hangman.hangman_n_hints[i_choice];
      var correct_b = hangman_incorrect_chars.length <= 6
                                                        && hangman_n_hints == 0;
      if (correct_b) {
         hangman.n_hangman_correct++;
         if (hangman.n_hangman > 1) {
            $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm-feedback').hide ();
            $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm_hangman_msg').hide ();
         }
         $ ('#rdgm' + i_rdgm + '-q' + i_question + '-a' + i_choice).show ();
         if (all_done_f && hangman.n_hangman_correct == hangman.n_hangman ) {
            if (! q.rwizard_b) {
               rdgmdata[i_rdgm].n_correct++;
            }
         }
      } else {
         if (hangman.n_hangman > 1) {
            $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm-feedback').hide ();
         }
         var msg = '<hr />';
         if (rdgmdata[i_rdgm].repeat_incorrect_b) {
            const hangman_correct_chars = current_entry.match (/<u>[^\t]<\/u>/g);
            if (hangman_correct_chars) {
               const n_correct = hangman_correct_chars.length - hangman_n_hints;
               if (hangman_correct_chars.length == 1) {
                  msg+= T ('You got one letter correct') + '.&nbsp; ';
               } else {
                  msg+= T ('You got %s letters correct') + '.&nbsp; ';
                  msg = msg.replace ('%s', qqc.number_to_word (hangman_correct_chars.length));
               }
               if (hangman_n_hints == 1) {
                  msg += T ('You used one hint') + '.&nbsp; ';
               } else if (hangman_n_hints > 1) {
                  msg += T ('You used %s hints') + '.&nbsp; ';
                  msg = message.replace ('%s', qqc.number_to_word (hangman_n_hints));
               }
               if (hangman_incorrect_chars.length) {
                  msg += T ('Incorrect letters') + ': ' + hangman_incorrect_chars + '.&nbsp; ' + T ('Pick different letters when you see this word again.');
               }
            } else {
               msg = '<hr />' + T ('Sorry, you entered more than six incorrect letters') + ': ' + hangman_incorrect_chars + '.&nbsp; ' + T ('Choose different letters when you see this word again!');
            }
         } else {
            msg = '<hr />' + T ('Sorry, you entered more than six incorrect letters.');
         }
         $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' div.rdgm_hangman_msg').html (msg).show ();
         if (all_done_f && hangman.n_hangman_correct != hangman.n_hangman ) {
            if (! q.rwizard_b) {
               rdgmdata[i_rdgm].n_incorrect++;
            }
         }
      }
      if (all_done_f) {
         if (! q.rwizard_b) {
            rdgmdata[i_rdgm].answered_correctly[i_question]
                      = hangman.n_hangman == hangman.n_hangman_correct ? 1 : -1;
         }
         input_el.blur ();
         if (rdgmdata[i_rdgm].qrecord_id && document_rdgm_user_logged_in_b) {
            var hangman_answer = hangman.hangman_answer[i_choice];
            var data = {q_and_a_text:  btoa (encodeURIComponent (rdgmdata[i_rdgm].q_and_a_text[i_question])),
                        q_and_a_crc32: rdgmdata[i_rdgm].q_and_a_crc32[i_question],
                        i_question:    rdgmdata[i_rdgm].dataset_id[i_question],
                        unit:          rdgmdata[i_rdgm].unit[i_question],
                        type:          'hangman',
                        response:      hangman_answer,
                        correct_b:     correct_b ? 1 : '',
                        confirm:       'js'};
            qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
         }
         update_topic_statistics (i_rdgm, i_question, correct_b);
         update_progress_show_next (i_rdgm);
      } else {
         var first_f = true;
         for (var i_choice=0; i_choice<hangman.n_hangman; i_choice++) {
            if (hangman.hangman_current_entry[i_choice]
                                     != hangman.hangman_final_entry[i_choice]
                     && hangman.hangman_incorrect_chars[i_choice].length <= 6) {
               var $rdgm_hangman = $ ('div#rdgm' + i_rdgm + '-q' + i_question + ' span.rdgm_hangman.rdgm_hangman_c' + i_choice);
               if (first_f) {
                  $rdgm_hangman.find ('input').focus ();
                  first_f = false;
               } else {
                  $rdgm_hangman.find ('span.hangman_type_letters').show ();
               }
            }
         }
      }
      done_f = true;
   }
   return done_f;
}
this.hangman_hint = function (i_rdgm, i_question, i_choice) {
   rdgmdata[i_rdgm].hangman[i_question].hangman_n_hints[i_choice]++;
   if (rdgmdata[i_rdgm].hangman[i_question].hangman_n_hints[i_choice] > rdgmdata[i_rdgm].hangman[i_question].hangman_max_hints) {
      return false;
   } else if (rdgmdata[i_rdgm].hangman[i_question].hangman_n_hints[i_choice] == rdgmdata[i_rdgm].hangman[i_question].hangman_max_hints) {
      $ ('#hangman_hint-rdgm' + i_rdgm + '-q' + i_question + '-c' + i_choice)
         .attr ('disabled', true)
         .addClass ('rdgm_button_disabled');
   } else {
      rdgmdata[i_rdgm].hangman[i_question].hangman_incorrect_chars_before_hint[i_choice]
                  = rdgmdata[i_rdgm].hangman[i_question].hangman_incorrect_chars[i_choice].length;
   }
   var hangman_answer = rdgmdata[i_rdgm].hangman[i_question].hangman_answer[i_choice];
   var current_entry = rdgmdata[i_rdgm].hangman[i_question].hangman_current_entry[i_choice];
   var matches = current_entry.match (/<u>.<\/u>/g);
   var i_pos = matches.indexOf ('<u>\t</u>');
   if (debug[9]) {
      console.log ('[hangman_hint] matches:', matches);
      console.log ('[hangman_hint] i_pos:', i_pos);
   }
   if (i_pos != -1) {
      var final_entry = rdgmdata[i_rdgm].hangman[i_question].hangman_final_entry[i_choice];
      matches = final_entry.match (/<u>.<\/u>/g);
      var hint_char = matches[i_pos][3];
      var rdgmq_id = 'rdgm' + i_rdgm + '-q' + i_question;
      var $rdgmq = $ ('div#' + rdgmq_id);
      var $hangman_input = $rdgmq.find ('span.rdgm_hangman.rdgm_hangman_c' + i_choice + ' input');
      var input_el = $hangman_input[0];
      update_hangman_input (hint_char, current_entry, final_entry,
                            i_rdgm, i_question, i_choice, input_el, true);
      $hangman_input.focus ();
   }
}
function single_char_textentry_keyup (e) {
   var input_el = e.target;
   if (debug[6]) {
      console.log ('[single_char_textentry_keyup] input_el:', input_el);
   }
   var value = input_el.value;
   if (value.search (/[a-z0-9]/i) == -1) {
      input_el.value = '';
      return false;
   }
   var id = input_el.id;
   var i_rdgm = id.match (/rdgm([0-9]+)/)[1];
   if (debug[6]) {
      console.log ('[single_char_textentry_keyup] i_rdgm:', i_rdgm);
   }
   if (rdgmdata[i_rdgm].user_question_number == 1) {
      $ ('div#icon_rdgm' + i_rdgm).hide ();
      alert_not_logged_in (i_rdgm);
      if (rdgmdata[i_rdgm].rdgm_timer) {
         start_rdgm_timer (i_rdgm);
      }
   }
   q.textentry_check_answer (i_rdgm, true);
}
function process_feedback_item (choice_html, i_rdgm, i_question, i_choice) {
   var feedback_start_tags = ['[f]', '[fx]'];
   var feedback_next_tags  = ['[f]', '[fx]', '[x]'];
   if (debug[2]) {
      console.log ('[process_feedback_item] choice_html: ', choice_html);
   }
   var feedback_item_html = qqc.parse_html_block (choice_html, feedback_start_tags,
                                                  feedback_next_tags);
   var feedback_div = '';
   var fx_b;
   if (feedback_item_html != 'NA') {
      choice_html = choice_html.replace (feedback_item_html, '');
      if (debug[2]) {
         console.log ('[process_feedback_item] feedback_item_html: ', feedback_item_html);
      }
      fx_b = feedback_item_html.indexOf ('[fx]') != -1;
      feedback_item_html = feedback_item_html.replace (/\[fx{0,1}\]/, '');
      feedback_div = create_feedback_div_html (i_rdgm, i_question, i_choice,
                                               feedback_item_html);
   } else {
      feedback_item_html = '';
   }
   if (debug[2]) {
      console.log ('[process_feedback_item] feedback_div:', feedback_div);
      console.log ('[process_feedback_item] choice_html: ', choice_html);
      console.log ('[process_feedback_item] fx_b:        ', fx_b);
   }
   return {'feedback_div':       feedback_div,
           'choice_html':        choice_html,
           'feedback_item_html': feedback_item_html,
           'fx_b':               fx_b};
}
function init_hotspot_image_canvas (i_rdgm, i_question, $hotspot_image_stack) {
   const $canvas   = $hotspot_image_stack.find ('canvas.layer0_edited');
   const canvas_el = $canvas[0];
   const ctx = canvas_el.getContext ('2d');
   rdgmdata[i_rdgm].ctx[i_question] = ctx;
   const $edited_img   = $hotspot_image_stack.find ('img.layer0_edited');
   const edited_img_el = $edited_img[0];
   if (edited_img_el.complete) {
      ctx.drawImage (edited_img_el, 0, 0, canvas_el.width, canvas_el.height);
   } else {
      const img = new Image ();
      img.src = edited_img_el.src;
      img.onload = function () {
         ctx.drawImage (img, 0, 0, canvas_el.width, canvas_el.height);
      }
   }
}
this.create_hotspot_image = function (i_rdgm, i_question, current_hotspot_no,
                                      $hotspot_image_stack, ctx) {
   if (debug[0]) {
      var start_msec = new Date ().getTime ();
   }
   const i_width   = ctx.canvas.width;
   const i_height  = ctx.canvas.height;
   const imageData = ctx.getImageData(0, 0, i_width, i_height);
   const data      = imageData.data;
   const p32       = new Uint32Array (data.buffer);
   const canvas_class = 'rdgm_tmp_hotspot-only_canvas-rdgm' + i_rdgm;
   var $hotspot_only_canvas = $ ('canvas.' + canvas_class);
   var erase_f = true;
   if (! $hotspot_only_canvas.length) {
      erase_f = false;
      $ ('body').append ('<canvas class="' + canvas_class + ' rdgm_display_none" width="' + i_width + '" height="' + i_height + '"></canvas>');
      $hotspot_only_canvas = $ ('canvas.' + canvas_class);
   }
   const hotspot_only_canvas_el  = $hotspot_only_canvas[0];
   var   hotspot_only_ctx        = hotspot_only_canvas_el.getContext ('2d');
   const find_the_dot = rdgmdata[i_rdgm].find_the_dot[i_question];
   if (find_the_dot) {
      find_the_dot.hotspot_only_new_f = false;
      $hotspot_only_canvas.attr ('width', i_width);
      $hotspot_only_canvas.attr ('height', i_height);
      hotspot_only_ctx.clearRect (0, 0, i_width, i_height);
      hotspot_only_ctx.beginPath ();
      var [r, g, b] = qqc.hex_to_rgb (find_the_dot.background_color.substr (1));
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
      hotspot_only_ctx.strokeStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
      hotspot_only_ctx.lineWidth   = 2;
      hotspot_only_ctx.arc (1 + find_the_dot.ix, 1 + find_the_dot.iy, 10, 0, 2*Math.PI);
      hotspot_only_ctx.stroke ();
      const $hotspot_label = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_hotspot_no);
      $hotspot_label.css ({left: 8 + find_the_dot.ix, top: 8 + find_the_dot.iy});
   } else {
      if (erase_f) {
         hotspot_only_ctx.clearRect (0, 0, i_width, i_height);
         hotspot_only_ctx.beginPath ();
      }
      const ii = hotspot_indexof (rdgmdata[i_rdgm].hotspot_nos[i_question], current_hotspot_no);
      const ver2_f = rdgmdata[i_rdgm].hotspot_ver2_f[i_question];
      const [cur_r, cur_g, cur_b] = q.hotspot_color_from_no (current_hotspot_no, ver2_f);
      if (! ver2_f) {
         if (current_hotspot_no == 11) {
            var [r1, g1, b1] = q.hotspot_color_from_no (1);
         } else if (current_hotspot_no == 13) {
            var [r1, g1, b1] = q.hotspot_color_from_no (3);
         }
      }
      var   highlighted_f = false;
      const $rdgmq            = $ ('div#rdgm' + i_rdgm + '-q' + i_question);
      const $label1           = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot1');
      var   border_hotspot_no = $label1.attr ('data-border_all');
      var   $label;
      if (! border_hotspot_no) {
         border_hotspot_no = current_hotspot_no;
      }
      $label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + border_hotspot_no);
      const border_width = $label.data ('border_width');
      if (border_width && border_width != '0') {
         highlighted_f = true;
      }
      var   highlight_hotspot_no = $label1.attr ('data-highlight_all');
      if (! highlight_hotspot_no) {
         highlight_hotspot_no = current_hotspot_no;
      }
      $label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + highlight_hotspot_no);
      if (! highlighted_f) {
         const highlight_brightness = $label.data ('highlight_brightness');
         if (highlight_brightness && highlight_brightness != '0') {
            highlighted_f = true;
         }
      }
      if (! highlighted_f) {
         const highlight_tint = $label.data ('highlight_tint');
         highlighted_f = !! highlight_tint;
      }
      if (! rdgmdata[i_rdgm].hotspot_highlighted_fs[i_question]) {
         rdgmdata[i_rdgm].hotspot_highlighted_fs[i_question] = {};
      }
      rdgmdata[i_rdgm].hotspot_highlighted_fs[i_question][current_hotspot_no] = highlighted_f;
      const n_pixels = i_width * i_height;
      if (highlighted_f) {
         const $style_layer_img = $rdgmq.find ('img.rdgm_style_layer');
         const style_layer_img_el = $style_layer_img[0];
         if (style_layer_img_el.complete) {
            hotspot_only_ctx.drawImage (style_layer_img_el, 0, 0, i_width, i_height);
         } else {
            const img = new Image ();
            img.src = style_layer_img_el.src;
            img.onload = function () {
               hotspot_only_ctx.drawImage (img, 0, 0, i_width, i_height);
            }
         }
         var hotspot_only_imageData  = hotspot_only_ctx.getImageData(0, 0, i_width, i_height);
         var hotspot_only_image_data = hotspot_only_imageData.data;
         var hotspot_only_p32        = new Uint32Array (hotspot_only_image_data.buffer);
         for (let i=0; i<n_pixels; i++) {
            let idx = i << 2;
            const a = data[idx + 3];
            if (a == q.hotspot_alpha_value) {
               const r = data[idx];
               const g = data[idx + 1];
               const b = data[idx + 2];
               if (! rgb_same (r, cur_r) || ! rgb_same (g, cur_g) || ! rgb_same (b, cur_b)) {
                  hotspot_only_p32[i] = 0;
               }
            } else {
               hotspot_only_p32[i] = 0;
            }
         }
      } else {
         var hotspot_only_imageData  = hotspot_only_ctx.getImageData(0, 0, i_width, i_height);
         var hotspot_only_image_data = hotspot_only_imageData.data;
         var hotspot_only_p32        = new Uint32Array (hotspot_only_image_data.buffer);
         const gray32 = (192 << 24) + (128 << 16) + (128 << 8) + 128
         for (let i=0; i<n_pixels; i++) {
            let idx = i << 2;
            const a = data[idx + 3];
            if (a == q.hotspot_alpha_value) {
               const r = data[idx];
               const g = data[idx + 1];
               const b = data[idx + 2];
               if (rgb_same (r, cur_r) && rgb_same (g, cur_g) && rgb_same (b, cur_b)) {
                  if (! ver2_f) {
                     if (current_hotspot_no == 11 || current_hotspot_no == 13) {
                        if (rgb_same (r, r1) && rgb_same (g, g1) && rgb_same (b, b1)) {
                           hotspot_only_p32[i] = gray32;
                        }
                     }
                  }
               } else {
                  hotspot_only_p32[i] = gray32;
               }
            } else {
               hotspot_only_p32[i] = gray32;
            }
         }
      }
      hotspot_only_ctx.putImageData (hotspot_only_imageData, 0, 0);
   }
   const dataURL = hotspot_only_canvas_el.toDataURL ();
   if (debug[0]) {
      console.log ('[create_hotspot_image] dataURL:', dataURL);
      console.log ('[create_hotspot_image] msec:', new Date ().getTime () - start_msec);
   }
   return dataURL;
}
function process_hotspot_diagram (i_rdgm, i_question, question_htm, opening_tags,
                                  rwizard_process_dataset_questions_f) {
   if (debug[0]) {
      console.log ('[process_hotspot_diagram] question_htm: ', question_htm);
   }
   var htm = [];
   htm.push ('<div id="rdgm' + i_rdgm + '-q' + i_question + '" class="rdgmq hotspot_diagram">');
   const hotspot_image_pos = question_htm.indexOf ('<div class="hotspot_image_stack"');
   const editable = question_htm.substr (0, hotspot_image_pos);
   if (q.rwizard_b) {
      htm.push ('<div class="rdgm_editable rdgm-question">');
      htm.push (   opening_tags + editable);
      htm.push ('</div>');
      var hotspot_image_stack = question_htm.substr (hotspot_image_pos);
      var hotspot_image_src = '';
      var m = hotspot_image_stack.match (/<img class="rdgm_layer0[^_][^>]*>/);
      if (m) {
         var hotspot_image_tag = m[0];
         var m2 = hotspot_image_tag.match (/ src="([^"]*)"/);
         if (m2) {
            hotspot_image_src = m2[1];
         }
      }
      htm.push (hotspot_image_stack);
      htm.push ('<div style="clear: both;"></div>');
      htm.push ('<div class="hotspot_click_feedback hotspot_click_feedback_correct   rdgm_editable"></div>');
      htm.push ('<div class="hotspot_click_feedback hotspot_click_feedback_incorrect rdgm_editable"></div>');
   } else {
      htm.push (opening_tags + question_htm);
      const hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
      if (! hotspot_user_interaction || hotspot_user_interaction != 'info_only') {
         htm.push ('<div style="clear: both;"></div>');
         htm.push ('<div class="hotspot_click_feedback"></div>');
         htm.push ('<div class="hotspot_label_query"></div>');
      }
   }
   htm.push ('</div>');
   if (set_rwizard_data_b) {
      qw.questions_cards[i_question].type              = 'hotspot_diagram';
      qw.questions_cards[i_question].question_text     = editable;
      qw.questions_cards[i_question].hotspot_image_src = hotspot_image_src;
      qw.questions_cards[i_question].canvas_el         = '';;
   }
   htm = htm.join ('\n');
   if (debug[0]) {
      console.log ('[process_hotspot_diagram] htm:', htm);
   }
   if (! rdgmdata[i_rdgm].hotspot_nos) {
      rdgmdata[i_rdgm].hotspot_nos              = {};
      rdgmdata[i_rdgm].hotspot_labels           = {};
      rdgmdata[i_rdgm].hotspot_highlighted_fs   = {};
      rdgmdata[i_rdgm].hotspot_ver2_f           = {};
      rdgmdata[i_rdgm].n_hotspots_to_do         = {};
      rdgmdata[i_rdgm].$hotspot_image_stack     = {};
      rdgmdata[i_rdgm].hotspot_image_width      = {};
      rdgmdata[i_rdgm].hotspot_image_height     = {};
      rdgmdata[i_rdgm].spotmap                  = {};
      rdgmdata[i_rdgm].spotmap_width            = {};
      rdgmdata[i_rdgm].spotmap_height           = {};
      rdgmdata[i_rdgm].sparsemap                = {};
      rdgmdata[i_rdgm].n_hotspots               = {};
      rdgmdata[i_rdgm].current_query_hotspot_no = {};
   }
   if (rdgmdata[i_rdgm].qrecord_id) {
      if (qqc.isInteger (rdgmdata[i_rdgm].dataset_id[i_question])) {
         var question_text_wo_tags = qqc.remove_tags_eols (editable);
         rdgmdata[i_rdgm].q_and_a_text[i_question]  = qqc.q_and_a_hash (question_text_wo_tags);
         rdgmdata[i_rdgm].q_and_a_crc32[i_question] = rdgm_crc32 (htm);
         if (debug[0]) {
            console.log ('[process_hotspot_diagram] rdgmdata[i_rdgm].q_and_a_text[i_question]:', rdgmdata[i_rdgm].q_and_a_text[i_question]);
            console.log ('[process_hotspot_diagram] rdgmdata[i_rdgm].q_and_a_crc32[i_question]:', rdgmdata[i_rdgm].q_and_a_crc32[i_question]);
         }
      } else {
         rdgmdata[i_rdgm].q_and_a_text[i_question]  = rdgmdata[i_rdgm].dataset_id[i_question];
         rdgmdata[i_rdgm].q_and_a_crc32[i_question] = 'dataset';
      }
   }
   if (rwizard_process_dataset_questions_f) {
      qw.questions_cards[i_question].question_html     = editable;
      var m = question_htm.match (/rdgm_layer0[^"]+"\s+src="([^"]+)/);
      if (m) {
         qw.questions_cards[i_question].image_url = m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find image) question_htm:', question_htm);
         qw.questions_cards[i_question].image_url = 'NA';
      }
      var hotspot_labels      = [];
      var feedback_corrects   = [];
      var feedback_incorrects = [];
      const re = /<div\s*(id=""){0,1}\s*class="rdgm_hotspot_label /;
      const correct_pat   = '<span class="hotspot_label_feedback_correct_content">';
      const incorrect_pat = '<span class="hotspot_label_feedback_incorrect_content">';
      var remaining_htm = question_htm;
      while (true) {
         const i_pos = remaining_htm.search (re);
         if (i_pos == -1) {
            break;
         }
         const hotspot_label_div = qqc.find_matching_block (remaining_htm.substr (i_pos));
         var hotspot_label;
         var feedback_correct;
         var feedback_incorrect;
         if (hotspot_label_div.indexOf ('rdgm_hotspot_deleted') != -1) {
            hotspot_label = '[deleted]';
            feedback_correct = '';
            feedback_incorrect = '';
         } else {
            const feedback_pos = hotspot_label_div.search ('<div class="hotspot_label_feedback');
            hotspot_label = hotspot_label_div.substr (0, feedback_pos - 6);
            hotspot_label = hotspot_label.replace (/<div[^>]+>/, '');
            hotspot_label = hotspot_label.replace (/<div[^>]+>/, '');
            const feedback_div          = hotspot_label_div.substr (feedback_pos);
            const feedback_correct_pos  = feedback_div.search (correct_pat);
            const feedback_correct_span = qqc.find_matching_block (feedback_div.substr (feedback_correct_pos));
            feedback_correct            = feedback_correct_span.substr (53);
            feedback_correct            = feedback_correct.replace (/<\/span>$/, '');
            const feedback_incorrect_span_pos = feedback_div.search (incorrect_pat);
            var   feedback_incorrect_span     = feedback_div.substr (feedback_incorrect_span_pos);
            feedback_incorrect_span           = qqc.find_matching_block (feedback_incorrect_span);
            feedback_incorrect                = feedback_incorrect_span.substr (55);
            feedback_incorrect                = feedback_incorrect.replace (/<\/span>$/, '');
         }
         hotspot_labels.push (hotspot_label);
         feedback_corrects.push (feedback_correct);
         feedback_incorrects.push (feedback_incorrect);
         remaining_htm = remaining_htm.substr (i_pos + hotspot_label_div.length);
      }
      qw.questions_cards[i_question].hotspot_labels      = hotspot_labels;
      qw.questions_cards[i_question].feedback_corrects   = feedback_corrects;
      qw.questions_cards[i_question].feedback_incorrects = feedback_incorrects;
      m = question_htm.match (/<canvas.*?width="(\d+)/m);
      if (m) {
         qw.questions_cards[i_question].hotspot_image_width = m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find canvas width) question_htm:', question_htm);
         qw.questions_cards[i_question].hotspot_image_width  = 0;
      }
      m = question_htm.match (/<canvas.*?height="(\d+)/m);
      if (m) {
         qw.questions_cards[i_question].hotspot_image_height = m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find canvas height) question_htm:', question_htm);
         qw.questions_cards[i_question].hotspot_image_height = 0;
      }
      m = question_htm.match (/rdgm_spotmap_width="(\d+)/m);
      if (m) {
         qw.questions_cards[i_question].spotmap_width = m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find spotmap_width) question_htm:', question_htm);
         qw.questions_cards[i_question].spotmap_width = 0;
      }
      m = question_htm.match (/rdgm_spotmap_height="(\d+)/m);
      if (m) {
         qw.questions_cards[i_question].spotmap_height = m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find spotmap_height) question_htm:', question_htm);
         qw.questions_cards[i_question].spotmap_height = 0;
      }
      m = question_htm.match (/rdgm_sparsemap="(\d+)/m);
      if (m) {
         qw.questions_cards[i_question].sparsemap = m[1] == '1';
      } else {
         qw.questions_cards[i_question].sparsemap = false;
      }
      m = question_htm.match (/rdgm_spotmap="([^"]+)/m);
      if (m) {
         qw.questions_cards[i_question].spotmap= m[1];
      } else {
         console.log ('[process_hotspot_diagram] (did not find spotmap) question_htm:', question_htm);
         qw.questions_cards[i_question].spotmap= '';
      }
      m = question_htm.match (/img class="rdgm_style_layer[^"]+"\s+src="([^"]+)/);
      if (m) {
         var img_src = m[1];
         if (img_src.substr (0, 4) == 'blob') {
            const wait = 'wait' + new Date ().getTime ();
            qqc.get_blob_as_data_url (wait, img_src);
            img_src = wait;
         }
         qw.questions_cards[i_question].style_layer_src = img_src;
         if (debug[0]) {
            console.log ('[process_hotspot_diagram] JSON.stringify (qw.questions_cards[' + i_question + ']):', JSON.stringify (qw.questions_cards[i_question]));
         }
      }
   }
   return htm;
}
function create_find_the_dot_html (i_rdgm, find_the_dot) {
   const width            = find_the_dot.width;
   const height           = find_the_dot.height;
   const dot_color        = find_the_dot.dot_color;
   const background_color = find_the_dot.background_color;
   const controls         = find_the_dot.controls;
   var htm = [];
   const show_hide_controls = controls ? 'block' : 'none';
   htm.push ('<div class="find_the_dot_controls" style="display: ' + show_hide_controls + '; margin-bottom: 2px;">');
   htm.push (   'Width');
   htm.push (   '<input class="find_the_dot_width"               type="text" onchange="' + qname + '.update_find_the_dot (' + i_rdgm + ')" value="' + width + '" />');
   htm.push (   'Height');
   htm.push (   '<input class="find_the_dot_height"              type="text" onchange="' + qname + '.update_find_the_dot (' + i_rdgm + ')" value="' + height + '"  />');
   htm.push (   '<button class="rdgm_button_small" style="background: gray;">');
   htm.push (      'Go');
   htm.push ('   </button>');
   htm.push (   '&nbsp;');
   htm.push (   'Dot color');
   htm.push (   '<div class="rdgm_simplecolor_wrapper" style="z-index: 3;">');
   htm.push (      '<input class="find_the_dot_dot_color"        type="text" value="' + dot_color + '" />');
   htm.push (   '</div>');
   htm.push (   '&nbsp;');
   htm.push (   'Background');
   htm.push (   '<div class="rdgm_simplecolor_wrapper" style="z-index: 2;">');
   htm.push (      '<input class="find_the_dot_background_color" type="text" value="' + background_color + '" />');
   htm.push (   '</div>');
   htm.push ('</div>');
   htm.push ('<button class="rdgm_button rdgm-smaller" style="float: right;" onclick="' + qname + '.update_find_the_dot (' + i_rdgm + ', true)" title="Place dot at new random location">');
   htm.push (   'New dot');
   htm.push ('</button>');
   if (controls) {
      htm.push ('One in <span class="find_the_dot_n_dots"></span>');
   }
   htm.push ('<br />');
   return htm.join ('\n');
}
function find_the_dot_color_selected (value, input_el) {
   if (debug[0]) {
      console.log ('[find_the_dot_color_selected] value:', value, ', input_el:', input_el);
   }
   const $rdgm = $ (input_el).parents ('div.rdgm');
   const id    = $rdgm[0].id;
   const i_rdgm = id.substr (4);
   const i_question = rdgmdata[i_rdgm].i_question;
   const dot_background_color = ($ (input_el).hasClass ('find_the_dot_dot_color') ? 'dot' : 'background') + '_color';
   rdgmdata[i_rdgm].find_the_dot[i_question][dot_background_color] = '#' + value;
   q.update_find_the_dot (i_rdgm);
}
this.update_find_the_dot = function (i_rdgm, new_dot_only_f, init_f) {
   const i_question = rdgmdata[i_rdgm].i_question;
   const $rdgm      = $ ('div#rdgm' + i_rdgm);
   const $rdgmq     = $ ('div#rdgm' + i_rdgm + '-q' + i_question);
   const $hotspot_image_stack = $rdgmq.find ('div.hotspot_image_stack')
   const $canvas              = $hotspot_image_stack.find ('canvas.layer0_edited');
   const ctx                  = $canvas[0].getContext ('2d');
   rdgmdata[i_rdgm].ctx[i_question] = ctx;
   const width  = parseInt ($rdgmq.find ('input.find_the_dot_width').val ());
   const height = parseInt ($rdgmq.find ('input.find_the_dot_height').val ());
   if (width < 1 || width > 1000 || height < 1 || height > 1000) {
      alert ('Please enter a number between 1 and 1000');
      return;
   }
   var find_the_dot = rdgmdata[i_rdgm].find_the_dot[i_question];
   find_the_dot.hotspot_only_new_f = true;
   if (! new_dot_only_f) {
      $hotspot_image_stack.css ({width: width, height: height});
      $canvas.attr ('width',  width);
      $canvas.attr ('height', height);
      rdgmdata[i_rdgm].hotspot_image_width[i_question]  = width;
      rdgmdata[i_rdgm].hotspot_image_height[i_question] = height;
      $rdgmq.find ('span.find_the_dot_n_dots').html ((width * height).toLocaleString ());
      const width10 = 10 + parseInt (width);
      if (width10 > rdgmdata[i_rdgm].initial_width) {
         $rdgm.css ({width: width10 + 'px', 'max-width': 'none'});
         rdgmdata[i_rdgm].width_reset = true;
      }
   }
   ctx.fillStyle = find_the_dot.background_color;
   ctx.fillRect (0, 0, width, height);
   if (new_dot_only_f || init_f) {
      find_the_dot.ix = parseInt (Math.random ()*width);
      find_the_dot.iy = parseInt (Math.random ()*height);
      if (new_dot_only_f) {
         rdgmdata[i_rdgm].n_labels_correct = 0;
         rdgmdata[i_rdgm].n_label_attempts = 0;
         q.display_diagram_progress (i_rdgm, S ('Visited'));
         var hotspot_nos = rdgmdata[i_rdgm].hotspot_nos[i_question];
         const n = hotspot_nos.length;
         for (let i=0; i<n; i++) {
            hotspot_nos[i] = hotspot_nos[i] % 1000;
         }
      }
   }
   const ix = find_the_dot.ix;
   const iy = find_the_dot.iy;
   ctx.fillStyle = find_the_dot.dot_color;
   ctx.fillRect (ix, iy, 1, 1);
   rdgmdata[i_rdgm].sparsemap[i_question] = 1;
   var spotmap = {};
   const ix_beg = Math.max (0, ix - 1);
   const ix_end = Math.min (width, ix + 2);
   const iy_beg = Math.max (0, iy - 1);
   const iy_end = Math.min (height, iy + 2);
   for (var iix=ix_beg; iix<ix_end; iix++) {
      spotmap[iix] = {};
      for (var iiy=iy_beg; iiy<iy_end; iiy++) {
         spotmap[iix][iiy] = 1;
      }
   }
   if (debug[0]) {
      console.log ('[update_find_the_dot] spotmap:', spotmap);
   }
   rdgmdata[i_rdgm].spotmap[i_question] = spotmap;
   rdgmdata[i_rdgm].spotmap_width[i_question]  = width;
   rdgmdata[i_rdgm].spotmap_height[i_question] = height;
}
this.hotspot_diagram_click = function (e) {
   if (debug[0]) {
      console.log ('[hotspot_diagram_click] event:', event);
   }
   const $rdgmq     = $ (event.target).parents ('div.rdgmq');
   const m          = $rdgmq[0].id.match (/rdgm(\d+)/);
   const i_rdgm     = m[1];
   const i_question = rdgmdata[i_rdgm].i_question;
   if (rdgmdata[i_rdgm].user_question_number == 1) {
      $ ('div#icon_rdgm' + i_rdgm).hide ();
      alert_not_logged_in (i_rdgm);
      if (rdgmdata[i_rdgm].rdgm_timer) {
         start_rdgm_timer (i_rdgm);
      }
   }
   if (rdgmdata[i_rdgm].use_dataset.indexOf ('secure_hotspot') == -1) {
      const click_hotspot_no = is_xy_hotspot (i_rdgm, i_question, event.offsetX, event.offsetY);
      q.hotspot_diagram_click2 (i_rdgm, i_question, click_hotspot_no);
   } else {
      const data = {use_dataset: rdgmdata[i_rdgm].use_dataset,
                    dataset_id:  rdgmdata[i_rdgm].dataset_id[i_question],
                    i_question:  i_question,
                    ix:          event.offsetX,
                    iy:          event.offsetY};
      qqc.qjax (qname, i_rdgm, '', 'is_xy_hotspot', data);
   }
}
this.hotspot_diagram_click2 = function (i_rdgm, i_question, click_hotspot_no) {
   const hotspot_nos              = rdgmdata[i_rdgm].hotspot_nos[i_question];
   const current_query_hotspot_no = rdgmdata[i_rdgm].current_query_hotspot_no[i_question];
   const $hotspot_image_stack     = rdgmdata[i_rdgm].$hotspot_image_stack[i_question];
   if (debug[0]) {
      console.log ('[hotspot_diagram_click2] current_query_hotspot_no:', current_query_hotspot_no);
   }
   rdgmdata[i_rdgm].n_label_attempts++;
   var   hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
   if (! hotspot_user_interaction) {
      hotspot_user_interaction = 'label_prompt';
   }
   const show_hotspots            = rdgmdata[i_rdgm].show_hotspots[i_question];
   var   hotspot_labels_stick     = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
   if (! hotspot_labels_stick) {
      hotspot_labels_stick = 'hide';
   }
   var $feedback;
   var feedback_msg = '';
   var finished_diagram_b = false;
   var correct_b = false;
   var $hotspot_label;
   var query_hotspot_no;
   var ok_f = click_hotspot_no > 0;
   if (hotspot_user_interaction == 'label_prompt') {
      query_hotspot_no = current_query_hotspot_no;
      ok_f = click_hotspot_no == current_query_hotspot_no;
   } else {
      query_hotspot_no = click_hotspot_no;
   }
   const $rdgmq = $ ('#rdgm' + i_rdgm + '-q' + i_question);
   $hotspot_label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + query_hotspot_no);
   if (query_hotspot_no) {
      var ii = hotspot_indexof (hotspot_nos, query_hotspot_no);
      if (ii == -1) {
         alert ('Sorry, error');
         ii = 0;
      }
   }
   if (hotspot_user_interaction == 'find_hotspots') {
      if (debug[0]) {
         console.log ('[hotspot_diagram_click2] hotspot_nos:', hotspot_nos);
      }
      if (Math.abs (hotspot_nos[ii]) > 1000) {
         click_hotspot_no = 0;
         ok_f = false;
      }
   }
   if (ok_f) {
      hotspot_nos[ii] += Math.sign (hotspot_nos[ii]) * 1000;
      if (show_hotspots && show_hotspots.indexOf ('hide') == -1) {
         show_hotspot_on_hover ();
         const $hotspot_only_image = $hotspot_image_stack.find ('img.rdgm_layer' + click_hotspot_no);
         const keep_temporary
            = rdgmdata[i_rdgm].hotspot_highlighted_fs[i_question][click_hotspot_no]
                                                         ? 'keep' : 'temporary';
         $hotspot_image_stack.find ('img.hotspot_only_image.hotspot_temporary').removeClass ('hotspot_temporary').hide ();
         if (show_hotspots.indexOf ('temporary') != -1) {
            $hotspot_only_image.addClass ('hotspot_temporary').show ();
         } else if (show_hotspots.indexOf ('keep') != -1) {
            $hotspot_only_image.addClass ('hotspot_' + keep_temporary).show ();
         }
      }
      if (hotspot_labels_stick == 'temporary') {
         $hotspot_image_stack.find ('div.rdgm_hotspot_label').hide ();
      }
      if (hotspot_labels_stick == 'temporary' || hotspot_labels_stick == 'keep') {
         var delay_show = function () {
            $hotspot_label.css ({display: 'inline-block'});
         }
         setTimeout (delay_show, 100);
         if (hotspot_labels_stick == 'keep') {
            $hotspot_label.addClass ('hotspot_clicked');
         }
      }
      rdgmdata[i_rdgm].n_labels_correct++;
      rdgmdata[i_rdgm].n_hotspots_to_do[i_question]--;
      feedback_msg = '';
      var $feedback = $hotspot_label.find ('span.hotspot_label_feedback_correct_content');
      if ($feedback.length) {
         feedback_msg = $feedback.html ();
         if (qqc.is_only_tags_and_whitespace (feedback_msg)) {
            feedback_msg = q.canned_feedback (true);
         } else {
            feedback_msg = feedback_msg.replace (/&nbsp;/g, ' ');
         }
      } else {
         feedback_msg = q.canned_feedback (true);
      }
      if (rdgmdata[i_rdgm].n_hotspots_to_do[i_question]) {
         if (hotspot_user_interaction == 'label_prompt') {
            feedback_msg += '<div><b>' + S ('Now click on:') + '</b></div>';
            const current_query_hotspot_no = pick_random_hotspot (i_rdgm, i_question);
            if (current_query_hotspot_no == 0) {
               rdgmdata[i_rdgm].n_hotspots_to_do[i_question] = 0;
            } else {
               rdgmdata[i_rdgm].current_query_hotspot_no[i_question] = current_query_hotspot_no;
               set_hotspot_label_query (i_rdgm, i_question, $rdgmq);
            }
         }
      }
      if (! rdgmdata[i_rdgm].n_hotspots_to_do[i_question]) {
         finished_diagram_b = true;
         set_hotspot_label_query (i_rdgm, i_question, $rdgmq, true);
         $hotspot_image_stack.off ('mousemove click.hotspot_diagram_click click.mobile_hover_eq');
         if (! q.rwizard_b && ! q.preview) {
            correct_b = rdgmdata[i_rdgm].answered_correctly[i_question] == 1;
            if (correct_b) {
               rdgmdata[i_rdgm].n_correct++;
               if (hotspot_user_interaction == 'label_prompt') {
                  feedback_msg += '<div>' + S ('You identified all of the items on the first try!') + '</div>';
               } else if (hotspot_user_interaction == 'find_hotspots') {
                  const n_tries = rdgmdata[i_rdgm].n_label_attempts;
                  if (n_tries == hotspot_nos.length) {
                     feedback_msg += '<div>' + S ('You identified all of the items on the first try!') + '</div>';
                  } else {
                     feedback_msg += '<div>' + plural (S ('It took you one try'), S ('It took you %s tries'), n_tries) + ' ' + plural (S ('to identify this item'), S ('to identify these items'), rdgmdata[i_rdgm].n_label_targets) + '.</div>';
                     feedback_msg = feedback_msg.replace ('%s', qqc.number_to_word (n_tries));
                  }
               }
            } else {
               const n_tries = rdgmdata[i_rdgm].n_label_attempts;
               feedback_msg += '<div>' + plural (S ('It took you one try'), S ('It took you %s tries'), n_tries) + ' ' + plural (S ('to identify this item'), S ('to identify these items'), rdgmdata[i_rdgm].n_label_targets) + '.</div>';
               feedback_msg = feedback_msg.replace ('%s', qqc.number_to_word (n_tries));
               rdgmdata[i_rdgm].n_incorrect++;
            }
            update_topic_statistics (i_rdgm, i_question, correct_b);
         }
         update_progress_show_next (i_rdgm);
      }
   } else {
      if (hotspot_user_interaction == 'label_prompt' || click_hotspot_no > 0) {
         hotspot_nos[ii] = - current_query_hotspot_no;
         rdgmdata[i_rdgm].answered_correctly[i_question] = -1;
      }
      if (show_hotspots && show_hotspots.indexOf ('keep') != -1) {
         $hotspot_image_stack.find ('img.hotspot_only_image').removeClass ('hotspot_clicked').hide ();
      }
      if (hotspot_labels_stick == 'temporary') {
         $hotspot_image_stack.find ('div.rdgm_hotspot_label').removeClass ('hotspot_clicked').hide ();
      }
      if (hotspot_user_interaction == 'label_prompt') {
         feedback_msg = '';
         var $feedback = $hotspot_label.find ('span.hotspot_label_feedback_incorrect_content');
         if ($feedback.length) {
            feedback_msg = $feedback.html ();
            if (qqc.is_only_tags_and_whitespace (feedback_msg)) {
               feedback_msg = q.canned_feedback (false);
            } else {
               feedback_msg = feedback_msg.replace (/&nbsp;/g, ' ');
            }
         } else {
            feedback_msg = q.canned_feedback (false);
         }
         if (rdgmdata[i_rdgm].n_hotspots_to_do[i_question] > 1) {
            feedback_msg += '<div><b>' + S ('Now click on:') + '</b></div>';
         } else {
            feedback_msg += '<div>';
            if (click_hotspot_no != 0) {
               const label_htm = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + click_hotspot_no).html ();
               feedback_msg += 'You clicked on ' + label_htm;
            }
            feedback_msg += '&emsp;<b>' + S ('Please try again') + ':</b></div>';
         }
         const current_query_hotspot_no = pick_random_hotspot (i_rdgm, i_question);
         if (current_query_hotspot_no) {
            rdgmdata[i_rdgm].current_query_hotspot_no[i_question] = current_query_hotspot_no;
            set_hotspot_label_query (i_rdgm, i_question, $rdgmq);
         }
      }
   }
   $rdgmq.find ('div.hotspot_click_feedback').html (feedback_msg);
   const found_clicked = (! hotspot_user_interaction || hotspot_user_interaction) == 'label_prompt' ? S ('Correctly clicked') : S ('Found');
   q.display_diagram_progress (i_rdgm, found_clicked);
   if (rdgmdata[i_rdgm].qrecord_id && document_rdgm_user_logged_in_b) {
      const hotspot_labels = rdgmdata[i_rdgm].hotspot_labels[i_question];
      const correct_hotspot_label = hotspot_labels[ii];
      var clicked_hotspot_label = '';
      if (click_hotspot_no != query_hotspot_no) {
         const jj = hotspot_indexof (hotspot_nos, click_hotspot_no);
         if (jj != -1) {
            clicked_hotspot_label = hotspot_labels[jj];
         }
         clicked_hotspot_label += '\t';
      }
      var data = {q_and_a_text:  btoa (encodeURIComponent (rdgmdata[i_rdgm].q_and_a_text[i_question])),
                  q_and_a_crc32: rdgmdata[i_rdgm].q_and_a_crc32[i_question],
                  i_question:    rdgmdata[i_rdgm].dataset_id[i_question],
                  unit:          rdgmdata[i_rdgm].unit[i_question],
                  type:          'hotspot_diagram',
                  response:      clicked_hotspot_label + correct_hotspot_label,
                  correct_b:     '',
                  confirm:       'js'};
      qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
      if (finished_diagram_b) {
         var data = {q_and_a_text:  btoa (encodeURIComponent (rdgmdata[i_rdgm].q_and_a_text[i_question])),
                     q_and_a_crc32: rdgmdata[i_rdgm].q_and_a_crc32[i_question],
                     i_question:    rdgmdata[i_rdgm].dataset_id[i_question],
                     unit:          rdgmdata[i_rdgm].unit[i_question],
                     type:          'hotspot_diagram',
                     response:      'done',
                     correct_b:     correct_b ? 1 : '',
                     confirm:       'js'};
         var delay_jjax = function () {
            qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
         }
         setTimeout (delay_jjax, 500);
      }
   }
}
var hotspot_long_hover_id;
var hotspot_label_hide_id;
var delay_hide_hotspot_no = -1;
function show_hotspot_on_hover () {
   if (debug[0]) {
      console.log ('[show_hotspot_on_hover] event:', event);
   }
   const $rdgmq     = $ (event.target).parents ('div.rdgmq');
   const m          = $rdgmq[0].id.match (/rdgm(\d+)/);
   const i_rdgm     = m[1];
   const i_question = rdgmdata[i_rdgm].i_question;
   const prev_xy_hotspot_no = rdgmdata[i_rdgm].current_xy_hotspot_no;
   var className = event.target.className;
   if (className.indexOf ('rdgm_hotspot_label') == -1 ) {
      const $label = $ (event.target).parents ('div.rdgm_hotspot_label');
      if ($label.length) {
         className = $label[0].className;
      } else {
         className = '';
      }
   }
   if (className) {
      const m = className.match (/rdgm_hotspot(\d+)/);
      if (m) {
         const label_hotspot_no = m[1];
         if (label_hotspot_no == prev_xy_hotspot_no
                                 || label_hotspot_no == delay_hide_hotspot_no) {
            clearTimeout (hotspot_label_hide_id);
            delay_hide_hotspot_no = -1;
            rdgmdata[i_rdgm].on_hotspot_label = true;
            const hotspot_labels_stick = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
            if (hotspot_labels_stick
                          && hotspot_labels_stick.indexOf ('keep') == -1
                          && hotspot_labels_stick.indexOf ('temporary') == -1) {
               const $hotspot_label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + label_hotspot_no);
               $hotspot_label.off ('mouseleave');
               $hotspot_label.on  ('mouseleave', function () {
                                                    $hotspot_label.hide ();
                                                    $hotspot_label.off ('mouseleave');
                                                 });
            }
         }
         return;
      }
   }
   rdgmdata[i_rdgm].on_hotspot_label = false;
   const new_xy_hotspot_no = is_xy_hotspot (i_rdgm, i_question, event.offsetX, event.offsetY);
   if (new_xy_hotspot_no != prev_xy_hotspot_no) {
      if (new_xy_hotspot_no) {
         if (rdgmdata[i_rdgm].user_question_number == 1) {
            $ ('div#icon_rdgm' + i_rdgm).hide ();
         }
         const hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
         if (hotspot_user_interaction && hotspot_user_interaction == 'find_hotspots') {
            const hotspot_nos = rdgmdata[i_rdgm].hotspot_nos[i_question];
            const ii = hotspot_indexof (hotspot_nos, new_xy_hotspot_no);
            if (Math.abs (hotspot_nos[ii]) > 1000) {
               return;
            }
         }
      }
      const $hotspot_image_stack     = rdgmdata[i_rdgm].$hotspot_image_stack[i_question];
      const hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
      const show_hotspot_on_hover2 = function () {
         const show_hotspots = rdgmdata[i_rdgm].show_hotspots[i_question];
         if (show_hotspots && show_hotspots.indexOf ('hide') == -1) {
            var   create_f = rdgmdata[i_rdgm].find_the_dot[i_question]?.hotspot_only_new_f;
            const img_class = 'rdgm_layer' + new_xy_hotspot_no;
            if (! create_f) {
               var $hotspot_only_image = $hotspot_image_stack.find ('img.' + img_class);
               create_f = $hotspot_only_image.length == 0;
            }
            if (create_f) {
               const ctx = rdgmdata[i_rdgm].ctx[i_question];
               const hotspot_only_img_src = q.create_hotspot_image (i_rdgm, i_question, new_xy_hotspot_no, $hotspot_image_stack, ctx);
               $hotspot_image_stack.append ('<img class="' + img_class + ' hotspot_image_layer hotspot_only_image" />');
               $hotspot_only_image = $hotspot_image_stack.find ('img.' + img_class);
               $hotspot_only_image[0].src = hotspot_only_img_src;
            }
            $hotspot_only_image.show ();
         }
         if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
            const hotspot_labels_stick = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
            if (hotspot_labels_stick && hotspot_labels_stick.indexOf ('hover_show') != -1) {
               if (debug[0]) {
                  console.log ('[show_hotspot_on_hover2] (label) new_xy_hotspot_no:', new_xy_hotspot_no);
               }
               if (hotspot_labels_stick.indexOf ('keep') != -1) {
                  $rdgmq.find ('div.rdgm_hotspot_label').css ({opacity: 0.5});
               }
               const $hotspot_label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + new_xy_hotspot_no);
               $hotspot_label.css ({display: 'inline-block', opacity: 1.0});
            }
            const hotspot_nos = rdgmdata[i_rdgm].hotspot_nos[i_question];
            const ii = hotspot_indexof (hotspot_nos, new_xy_hotspot_no);
            if (hotspot_nos[ii] < 1000) {
               rdgmdata[i_rdgm].n_labels_correct++;
               q.display_diagram_progress (i_rdgm, S ('Visited'));
               hotspot_nos[ii] += 1000;
            }
         }
      }
      rdgmdata[i_rdgm].current_xy_hotspot_no = new_xy_hotspot_no;
      var hide_previous = '';
      if (prev_xy_hotspot_no > 0) {
         if (debug[0]) {
            console.log ('[show_hotspot_on_hover (hide previous)] prev_xy_hotspot_no:', prev_xy_hotspot_no, ', new_xy_hotspot_no:', new_xy_hotspot_no);
         }
         const hotspot_labels_stick     = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
         const $prev_hotspot_only_image
            = $hotspot_image_stack
                                 .find ('img.rdgm_layer' + prev_xy_hotspot_no)
                                 .not ('img.hotspot_keep');
         hide_previous = 'hide';
         if (new_xy_hotspot_no == 0) {
            const show_hotspots = rdgmdata[i_rdgm].show_hotspots[i_question];
            if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
               if (show_hotspots && show_hotspots.indexOf ('keep') != -1) {
                  hide_previous = '';
               }
            }
            if (hide_previous && hotspot_labels_stick && hotspot_labels_stick.indexOf ('hover_show') != -1) {
               if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
                  hide_previous = 'delay';
               }
            }
         }
         if (hide_previous) {
            $prev_hotspot_only_image.hide ();
            if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
               const hotspot_labels_stick = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
               if (hotspot_labels_stick
                         && hotspot_labels_stick.indexOf ('hover_show') != -1
                         && hotspot_labels_stick.indexOf ('keep')       == -1
                         && hotspot_labels_stick.indexOf ('temporary')  == -1) {
                  const $hotspot_label = $rdgmq.find ('div.rdgm_hotspot_label.rdgm_hotspot' + prev_xy_hotspot_no);
                  if (hide_previous == 'delay') {
                     const delay_hide = function () {
                                           $hotspot_label.hide ();
                                        };
                     clearTimeout (hotspot_label_hide_id);
                     hotspot_label_hide_id = setTimeout (delay_hide, 700);
                     delay_hide_hotspot_no = prev_xy_hotspot_no;
                  } else {
                     $hotspot_label.hide ();
                  }
               } else {
                  $rdgmq.find ('div.rdgm_hotspot_label').css ({opacity: 1.0});
               }
            }
         }
      }
      if (new_xy_hotspot_no) {
         const show_hotspots = rdgmdata[i_rdgm].show_hotspots[i_question];
         if (show_hotspots && show_hotspots.indexOf ('long_hover_show') != -1) {
            clearTimeout (hotspot_long_hover_id);
            hotspot_long_hover_id = setTimeout (show_hotspot_on_hover2, 700);
         } else {
            show_hotspot_on_hover2 ();
         }
      }
   }
}
function hide_hotspots (e) {
   if (debug[0]) {
      console.log ('[hide_hotspots] e:', e);
   }
   const $rdgmq     = $ (event.target).parents ('div.rdgmq');
   const m          = $rdgmq[0].id.match (/rdgm(\d+)/);
   const i_rdgm     = m[1];
   const i_question = rdgmdata[i_rdgm].i_question;
   rdgmdata[i_rdgm].current_xy_hotspot_no = -1;
   clearTimeout (hotspot_long_hover_id);
   const show_hotspots            = rdgmdata[i_rdgm].show_hotspots[i_question];
   const hotspot_user_interaction = rdgmdata[i_rdgm].hotspot_user_interaction[i_question];
   var hide_label_f = false;
   if (hotspot_user_interaction && hotspot_user_interaction == 'info_only') {
      const hotspot_labels_stick = rdgmdata[i_rdgm].hotspot_labels_stick[i_question];
      hide_label_f = hotspot_labels_stick && hotspot_labels_stick.indexOf ('hover_show') != -1 && hotspot_labels_stick.indexOf ('keep') == -1;
      if (hide_label_f && rdgmdata[i_rdgm].on_hotspot_label) {
         return;
      }
   }
   if (show_hotspots && show_hotspots.indexOf ('hide') == -1) {
      if (   show_hotspots.indexOf ('temporary') != -1
          || show_hotspots.indexOf ('keep')      != -1) {
         $ (e.currentTarget).find ('img.hotspot_only_image')
            .not ('img.hotspot_keep')                       .hide ();
         if (hide_label_f) {
            $ (e.currentTarget).find ('div.rdgm_hotspot_label')
               .not ('div.hotspot_temporary')
               .not ('div.hotspot_keep')                       .hide ();
         }
      } else {
         $ (e.currentTarget).find ('img.hotspot_only_image').hide ();
         if (hide_label_f) {
            $ (e.currentTarget).find ('div.rdgm_hotspot_label').hide ();
         }
      }
   }
}
this.hotspot_color_from_no = function (hotspot_no, ver2_f=false) {
   var hotspot_color;
   var hotspot_rgba;
   const hotspot_colors = [[202,198,191], [143,131,102], [239,210,130], [106,80,0],    [251,209,30],
                           [0,210,255],   [0,123,201],   [0,86,234],    [123,132,147], [218,227,243]];
   const variants = [[0, 0, 1],
                     [0, 1, 0],
                     [0, 1, 1],
                     [1, 0, 0],
                     [1, 1, 0],
                     [1, 1, 1]];
   const ii = hotspot_no - 1;
   const i_color = ii % 10;
   hotspot_color = hotspot_colors[i_color];
   if (ii > 9) {
      const i_variant = ver2_f ? Math.floor (ii/10) % 5 : ii % 5;
      const variant   = variants[i_variant];
      const i_scale = Math.floor (ii/60.0) + 1;
      const offset = ver2_f ? 5 : 4;
      hotspot_color[0] = add_sub_color_variant (hotspot_color[0], variant[0], i_scale, offset);
      hotspot_color[1] = add_sub_color_variant (hotspot_color[1], variant[1], i_scale, offset);
      hotspot_color[2] = add_sub_color_variant (hotspot_color[2], variant[2], i_scale, offset);
   }
   /*
   if (debug[0]) {
      console.log ('[hotspot_color_from_no] hotspot_color:', hotspot_color);
   }
   */
   hotspot_color.push (q.hotspot_alpha_value);
   return hotspot_color;
}
function add_sub_color_variant (rgb, variant, i_scale, offset=4) {
   var new_rgb = rgb;
   const i_add_sub = variant * i_scale * offset;
   if (rgb + i_add_sub <= 255) {
      new_rgb += i_add_sub;
   } else {
      new_rgb -= i_add_sub;
   }
   return new_rgb;
}
function rgb_same (v1, v2) {
   return Math.abs (v1 - v2) <= 3;
}
function hotspot_indexof (hotspot_nos, i) {
   var jj = -1;
   const n_hotspots = hotspot_nos.length;
   for (var ii=0; ii<n_hotspots; ii++) {
      if (Math.abs (hotspot_nos[ii] % 1000) == i) {
         jj = ii;
         break;
      }
   }
   return jj;
}
function is_xy_hotspot (i_rdgm, i_question, ix, iy) {
   const hotspot_image_width  = rdgmdata[i_rdgm].hotspot_image_width[i_question];
   const hotspot_image_height = rdgmdata[i_rdgm].hotspot_image_height[i_question];
   const spotmap              = rdgmdata[i_rdgm].spotmap[i_question];
   const spotmap_width        = rdgmdata[i_rdgm].spotmap_width[i_question];
   const spotmap_height       = rdgmdata[i_rdgm].spotmap_height[i_question];
   const sparsemap            = rdgmdata[i_rdgm].sparsemap[i_question];
   const sx = Math.floor (ix/hotspot_image_width  * spotmap_width);
   const sy = Math.floor (iy/hotspot_image_height * spotmap_height);
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
   if (debug[0]) {
      console.log ('[is_xy_hotspot] ix:', ix, ', iy:', iy, ', hotspot_no:', hotspot_no);
   }
   return hotspot_no;
}
function pick_random_hotspot (i_rdgm, i_question) {
   const hotspot_nos = rdgmdata[i_rdgm].hotspot_nos[i_question];
   const n_hotspots  = rdgmdata[i_rdgm].n_hotspots[i_question];
   var ii = Math.floor (Math.random ()*n_hotspots);
   var hotspot_no = 0;
   const dir = Math.random () < 0.5 ? -1 : 1;
   for (var i=0; i<n_hotspots; i+=dir) {
      const abs_hotspot_no = Math.abs (hotspot_nos[ii]);
      if (abs_hotspot_no < 1000) {
         hotspot_no = abs_hotspot_no;
         break;
      }
      ii += dir;
      if (ii >= n_hotspots) {
         ii = 0;
      } else if (ii < 0) {
         ii = n_hotspots - 1;
      }
   }
   if (hotspot_no == 0) {
      alert ('Sorry, error: no hotspot');
   }
   if (debug[0]) {
      console.log ('[pick_random_hotspot] hotspot_nos:', hotspot_nos);
      console.log ('[pick_random_hotspot] hotspot_no:', hotspot_no);
   }
   return hotspot_no;
}
function set_hotspot_label_query (i_rdgm, i_question, $rdgmq, hide_f) {
   var label_htm = '';
   if (! hide_f) {
      const current_query_hotspot_no = rdgmdata[i_rdgm].current_query_hotspot_no[i_question];
      const $hotspot_image_stack     = rdgmdata[i_rdgm].$hotspot_image_stack[i_question];
      label_htm = $hotspot_image_stack.find ('div.rdgm_hotspot_label.rdgm_hotspot' + current_query_hotspot_no).html ();
   }
   const $hotspot_label_query = $rdgmq.find ('div.hotspot_label_query');
   $hotspot_label_query.html (label_htm);
}
this.init_drag_and_drop = function (rdgmq_elm) {
   if (debug[0]) {
      console.log ('[init_drag_and_drop] rdgmq_elm:', rdgmq_elm);
   }
   var $rdgmq = $ (rdgmq_elm);
   $rdgmq.removeAttr ('onmouseover');
   $rdgmq.find ('td.rdgm_edit_labels div.rdgm_edit_label').each (function () {
      if (debug[0] || debug[8]) {
         console.log ('[init_drag_and_drop] $ (this):', $ (this));
         console.log ('[init_drag_and_drop] \'td.rdgm_edit_labels div.rdgm_edit_label\':', $ (this)[0]);
      }
      var label_offset = $ (this).offset ();
      if (debug[8]) {
         console.log ('[init_drag_and_drop] label_offset:', label_offset);
      }
      $ (this).data ('label_x', label_offset.left).data ('label_y', label_offset.top);
      $ (this).draggable ({
         containment:   $ (this).parents ('table.rdgm_edit_table'),
         start:         function (e, ui) {
                           var $rdgm = $ (this).parents ('div.rdgm');
                           if ($rdgm.length) {
                              var rdgm_el = $rdgm[0];
                              if (rdgm_el.qscale_fac) {
                                 rdgm_el.qstart_left = ui.position.left;
                                 if (ui.position.top) {
                                    rdgm_el.qstart_top = ui.position.top;
                                 } else {
                                    rdgm_el.qstart_top = 0.1;
                                 }
                              }
                           }
                           q.label_dragstart ($ (this));
                        },
         drag:          function (e, ui) {
                           var $rdgm = $ (this).parents ('div.rdgm');
                           if ($rdgm.length) {
                              var rdgm_el = $rdgm[0];
                              if (rdgm_el.qscale_fac) {
                                 if (rdgm_el.qstart_top) {
                                    var scale_fac = rdgm_el.qscale_fac;
                                    ui.position.left = (ui.position.left - rdgm_el.qstart_left)/scale_fac + rdgm_el.qstart_left;
                                    ui.position.top  = (ui.position.top  - rdgm_el.qstart_top )/scale_fac + rdgm_el.qstart_top;
                                 }
                              }
                           }
                        }
      }).addClass ('rdgm_edit_label_unplaced');
   });
   $rdgmq.find ('.rdgm_edit_target').droppable ({
      accept:           '.rdgm_edit_label',
      hoverClass:       'rdgm_edit_target_hover',
      drop:             function (event, ui) {
                           q.label_dropped ($ (this), ui.draggable);
                        },
      tolerance:        'pointer',
   });
}
function process_header (htm, i_rdgm, i_question, intro_b) {
   var qtags = ['[h]'];
   var qnext_tags = ['[q]', '[q ', '<div class="rdgm_edit_question'];
   if (intro_b != undefined) {
      qnext_tags.push ('[i]');
   }
   header_html = qqc.parse_html_block (htm.substr (0, 1000), qtags, qnext_tags, true);
   if (header_html != 'NA' && header_html != '') {
      var htmx = htm.substr (0, 200);
      htmx = qqc.trim (htmx);
      var i_pos = qqc.opening_tag_shortcode_pos ('[h]', htmx);
      htmx = htmx.substr (i_pos, 5);
      var header_htmlx = header_html.replace (/<br[^>]*>/g, '');
      header_htmlx = qqc.trim (header_htmlx).substr (0, 5);
      if (htmx != header_htmlx) {
         errmsgs.push (T ('Text before header') + ' [h].  rdgm: ' + (i_rdgm + 1));
      }
      htm = htm.replace (header_html, '');
      header_html = header_html.replace (/\[h\]/ig, '');
      header_html = qqc.balance_closing_tag (header_html);
      header_html = header_html.replace (/<(p|h[1-6])[^>]*><\/(p|h[1-6])>/g, '');
      header_html = qqc.decode_image_tags (header_html);
   }
   return htm;
}
this.display_summary_and_exit = function (i_rdgm) {
   if (! q.rwizard_b) {
      $ ('.bck-question-rdgm' + i_rdgm).css ({opacity: 0.5}).addClass ('hover');
   }
   if (rdgmdata[i_rdgm].summary_b) {
      var report_html = [];
      var n_questions = rdgmdata[i_rdgm].n_questions_for_done;
      var n_correct   = rdgmdata[i_rdgm].n_correct;
      var n_incorrect = rdgmdata[i_rdgm].n_incorrect;
      var summary_line;
      if (rdgmdata[i_rdgm].repeat_incorrect_b) {
         var quiz_set = rdgmdata[i_rdgm].use_dataset && rdgmdata[i_rdgm].dataset_intro_f ? 'set' : 'quiz';
         report_html.push ('<p><b>' + T ('Congratulations, you\'re done!') + '</b></p>');
         if (n_incorrect == 0) {
            if (quiz_set == 'quiz') {
               summary_line = T ('In this %s-question quiz you answered every question correctly on the first try!');
            } else {
               summary_line = T ('In this %s-question set you answered every question correctly on the first try!');
            }
         } else {
            if (quiz_set == 'quiz') {
               if (n_incorrect == 1) {
                  summary_line = T ('In finishing this %s-question quiz you entered one incorrect answer');
               } else {
                  summary_line = T ('In finishing this %s-question quiz you entered %s incorrect answers');
               }
            } else {
               if (n_incorrect == 1) {
                  summary_line = T ('In finishing this %s-question set you entered one incorrect answer');
               } else {
                  summary_line = T ('In finishing this %s-question set you entered %s incorrect answers');
               }
            }
         }
         summary_line = summary_line.replace ('%s', qqc.number_to_word (n_questions));
         if (n_incorrect > 1) {
            summary_line = summary_line.replace ('%s', qqc.number_to_word (n_correct));
         }
      } else {
         if (n_incorrect == 0) {
            summary_line = T ('Congratulations, you answered all questions correctly');
         } else {
            summary_line = T ('Your score is %s out of %s questions');
            summary_line = summary_line.replace ('%', qqc.number_to_word (n_correct));
            summary_line = summary_line.replace ('%', qqc.number_to_word (n_questions));
         }
      }
      report_html.push ('<p>' + summary_line + '</p>');
      var n_topics = 0;
      if (rdgmdata[i_rdgm].topics) {
         n_topics = rdgmdata[i_rdgm].topics.length;
      }
      if (n_topics == 1) {
         var topic = rdgmdata[i_rdgm].topics[0];
         if (topic != 'Other') {
            var all_both_n;
            if (n_questions == 1) {
               report_html.push ('<p>The question was about topic &ldquo;' + topic + '.&rdquo;</p>');
            } else {
               if (n_questions == 2) {
                  all_both_n = T ('Both');
               } else {
                  all_both_n = T ('All') + ' '+ qqc.number_to_word (n_questions);
               }
               report_html.push ('<p>' + all_both_n + ' ' + plural (T ('question'), T ('questions'), n_questions) + ' were about topic &ldquo;' + topic + '.&rdquo;</p>');
            }
         }
      } else if (n_topics > 1 && n_incorrect > 0) {
         var incorrect_topics = [];
         for (var i_topic=0; i_topic<n_topics; i_topic++) {
            var topic = rdgmdata[i_rdgm].topics[i_topic];
            var n_topic_correct = rdgmdata[i_rdgm].topic_statistics[topic].n_correct;
            var n_topic_incorrect = rdgmdata[i_rdgm].topic_statistics[topic].n_incorrect;
            var n_topic_items = n_topic_correct + n_topic_incorrect;
            if (n_topic_incorrect > 0) {
               topic = topic.replace (/_/g, ' ');
               var topic_text = '<strong>' + topic + '</strong>: ' + qqc.number_to_word (n_topic_incorrect) + ' ' + T ('incorrect');
               incorrect_topics.push (topic_text);
            }
         }
         var n_incorrect_topics = incorrect_topics.length;
         var topics_html = [];
         if (n_incorrect_topics > 1) {
            topics_html.push (T ('These are the topics of questions that you answered incorrectly'));
            topics_html.push ('<ul>');
            for (var i=0; i<n_incorrect_topics; i++) {
               topics_html.push ('<li>');
               topics_html.push (   incorrect_topics[i]);
               topics_html.push ('</li>');
            }
            topics_html.push ('</ul>');
         } else {
            if (n_incorrect == 1) {
               topics_html.push (T ('The topic of the only question you answered incorrectly is') + '<br />');
            } else {
               topics_html.push (T ('The topic of the questions you answered incorrectly is') + '<br />');
            }
            topics_html.push (incorrect_topics[0]);
         }
         report_html.push (topics_html.join ('\n'));
      }
      $ ('#summary_report-rdgm' + i_rdgm).html (report_html.join ('\n'));
      if (rdgmdata[i_rdgm].rdgm_timer && ! q.rwizard_b && ! q.preview) {
         var data = {summary: 1};
         const qrecord_id = rdgmdata[i_rdgm].qrecord_id;
         if (qrecord_id.indexOf ('finish_times_demo') != -1) {
            data.demo_taker_time = rdgmdata[i_rdgm].elapsed_time;
         }
         qqc.qjax (qname, i_rdgm, qrecord_id, 'get_quiz_times', data);
      }
   }
   var $summary = $ ('#summary-rdgm' + i_rdgm);
   if (q.rwizard_b) {
      if ($summary.find ('div[contenteditable]').length == 0) {
         rwizard.init_tinymce ('div#rdgm_exit-rdgm' + i_rdgm + '.rdgm_editable');
      }
   }
   var $rdgm_img = $summary.find ('input[name="rdgm_img"]');
   if ($rdgm_img.length) {
      $rdgm_img.changeElements ('img');
   }
   if (rdgmdata[i_rdgm].cv_index) {
      $summary.find ('button.rdgm_restart').remove ();
   }
   $summary.show ();
   rdgmdata[i_rdgm].i_question = rdgmdata[i_rdgm].n_questions;
}
function shuffle (a) {
   var i = a.length - 1;
   while (i > 0) {
      const j = Math.floor (Math.random () * (i + 1));
      const temp = a[i];
      a[i] = a[j];
      a[j] = temp;
      i--;
   }
   if (debug[0]) {
      console.log ('[shuffle] a:', a);
   }
}
function check_rdgm_tag_pairs (htm) {
   var new_htm = '';
   var matches = htm.match (/\[rdgm|\[\/rdgm\]/gm);
   if (matches) {
      var n_tags = matches.length;
      var error_b = false;
      if (n_tags % 2 != 0) {
         error_b = true;
      } else {
         for (var i=0; i<n_tags; i++) {
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
      if (error_b) {
         if (debug[0]) {
            console.log ('[check_rdgm_tag_pairs] (error_b) htm.substr (0, 1000):', htm.substr (0, 1000));
         }
         const pos_more = htm.search (/<[pa] class="more-link|<div class="(search|blog)-entry-readmore/);
         if (pos_more != -1) {
            const pos_rdgm = htm.indexOf ('[rdgm');
            if (pos_rdgm != -1) {
               new_htm = htm.substring (0, pos_rdgm) + htm.substr (pos_more);
            } else {
               new_htm = htm;
            }
         } else if (htm.indexOf ('class="entry-summary') != -1) {
            const pos_rdgm = htm.indexOf ('[rdgm');
            const pos_more = htm.search (/\s*\[\u2026\]/);
            if (pos_rdgm != -1 && pos_more != -1) {
               new_htm = htm.substring (0, pos_rdgm) + htm.substr (pos_more);
            } else {
               new_htm = htm;
            }
         } else {
            errmsgs.push (T ('Unmatched [rdgm] - [/rdgm] pairs.'));
            new_htm = 'NA';
         }
         if (debug[0]) {
            console.log ('[check_rdgm_tag_pairs] (error_b) new_htm:', new_htm);
         }
      }
   }
   return new_htm;
}
function update_topic_statistics (i_rdgm, i_question, correct_b) {
   var question_topics = rdgmdata[i_rdgm].question_topics[i_question];
   if (question_topics) {
      for (var ii=0; ii<question_topics.length; ii++) {
         var topic = question_topics[ii];
         if (correct_b) {
            rdgmdata[i_rdgm].topic_statistics[topic].n_correct++;
         } else {
            rdgmdata[i_rdgm].topic_statistics[topic].n_incorrect++;
         }
      }
   }
}
function update_progress_show_next (i_rdgm) {
   if (rdgmdata[i_rdgm].question_time_limit) {
      stop_rdgm_timer (i_rdgm. true);
   }
   if (rdgmdata[i_rdgm].n_questions > 1 || rdgmdata[i_rdgm].use_dataset) {
      q.display_progress (i_rdgm);
      var n_done = rdgmdata[i_rdgm].n_correct;
      if (! rdgmdata[i_rdgm].repeat_incorrect_b) {
         n_done += rdgmdata[i_rdgm].n_incorrect;
      }
      if (n_done == rdgmdata[i_rdgm].n_questions_for_done) {
         if (rdgmdata[i_rdgm].summary_b) {
            $ ('#next_button_text-rdgm' + i_rdgm).html (T ('View summary report'));
         } else {
            $ ('#summary-rdgm' + i_rdgm).show ();
         }
         stop_rdgm_timer (i_rdgm);
         if (rdgmdata[i_rdgm].qrecord_id && document_rdgm_user_logged_in_b) {
            if (   rdgmdata[i_rdgm].use_dataset
                || rdgmdata[i_rdgm].repeat_incorrect_b
                || rdgmdata[i_rdgm].n_incorrect == 0  ) {
               var wait_completed = function () {
                  var data = {type: 'completed', confirm: 'js'};
                  qqc.jjax (qname, i_rdgm, rdgmdata[i_rdgm].qrecord_id, 'record_response_v3', data);
               }
               setTimeout (wait_completed, 2000);
            }
         }
      }
      if (n_done < rdgmdata[i_rdgm].n_questions_for_done || rdgmdata[i_rdgm].summary_b) {
         q.position_show_next_button (i_rdgm);
      }
      rdgmdata[i_rdgm].next_button_show_b = true;
   }
   if (rdgmdata[i_rdgm].n_questions == 1) {
      $( '#rdgm' + i_rdgm + ' div.single-question_exit').show ();
      stop_rdgm_timer (i_rdgm);
   }
}
this.display_progress = function (i_rdgm, came_from_start_b) {
   if (debug[0]) {
      console.log ('[display_progress] rdgmdata[i_rdgm].i_question:', rdgmdata[i_rdgm].i_question, ', came_from_start_b:', came_from_start_b);
   }
   if (rdgmdata[i_rdgm].hide_progress_b) {
      return;
   }
   var progress_html;
   var n_attempts = rdgmdata[i_rdgm].n_correct + rdgmdata[i_rdgm].n_incorrect;
   var n_done = rdgmdata[i_rdgm].n_correct;
   if (! rdgmdata[i_rdgm].repeat_incorrect_b) {
      n_done += rdgmdata[i_rdgm].n_incorrect;
   }
   if (q.rwizard_b) {
      if (rdgmdata[i_rdgm].i_question == -1 && ! came_from_start_b) {
         progress_html = T ('Questions in this quiz:') + ' ' + rdgmdata[i_rdgm].n_questions;
      } else {
         var display_i_question = rdgmdata[i_rdgm].i_question + 1;
         if (came_from_start_b) {
            display_i_question++;
         }
         progress_html = 'Question ' + display_i_question + ' of ' + rdgmdata[i_rdgm].n_questions;
      }
   } else {
      var n_questions = rdgmdata[i_rdgm].n_questions_for_done;
      var n_to_go = n_questions - n_done;
      if (n_attempts == 0) {
         progress_html = T ('Questions in this quiz:') + ' ' + n_to_go;
      } else {
         var questions;
         var incorrect;
         if (document_rdgm_mobile) {
            questions = T ('Qs');
            incorrect = T ('not');
         } else {
            questions = T ('questions');
            incorrect = T ('incorrect');
         }
         progress_html = n_questions + ' ' + questions + ', ' + n_attempts + ' ' + plural (T ('response'), T ('responses'), n_attempts) + ', ' + rdgmdata[i_rdgm].n_correct + ' ' + T ('correct') + ', ' + rdgmdata[i_rdgm].n_incorrect + ' ' + incorrect + ', ' + n_to_go + ' ' + T ('to go');
      }
   }
   $ ('#progress-rdgm' + i_rdgm).html (progress_html).show ();
}
this.display_diagram_progress = function (i_rdgm, prefix='Correctly labeled', n_hotspots=-1) {
   if (rdgmdata[i_rdgm].hide_progress_b) {
      return;
   }
   var i_question  = rdgmdata[i_rdgm].i_question + 1;
   var n_questions = rdgmdata[i_rdgm].n_questions;
   var progress_html = '';
   if (n_questions > 1 && ! rdgmdata[i_rdgm].random_b) {
      progress_html = 'Q #' + i_question + '/' + n_questions + '; ';
   }
   var n_correct;
   var n_items;
   if (n_hotspots == -1) {
      n_correct = rdgmdata[i_rdgm].n_labels_correct;
      n_items   = rdgmdata[i_rdgm].n_label_targets;
   } else {
      n_correct = n_hotspots;
      n_items   = n_hotspots;
   }
   if (prefix == 'Correctly labeled') {
      prefix = S ('Correctly labeled');
   }
   progress_html += prefix + ' ' + n_correct + ' ' + S ('out of') + ' ' + n_items + ' ' + S ('items');
   $ ('#progress-rdgm' + i_rdgm).html (progress_html).show ();
}
function create_feedback_div_html (i_rdgm, i_question, i_item, item_html, c_x) {
   var local_c_x = '';
   if (c_x != undefined) {
      local_c_x = c_x;
   }
   var htm = '<div id="rdgm' + i_rdgm + '-q' + i_question + '-a' + i_item + local_c_x + '" class="rdgm-feedback">\n';
   if (! local_c_x) {
      htm += '<hr style="margin: 0px;" />\n';
   }
   var classname = '';
   if (local_c_x) {
      if (local_c_x == 'c') {
         classname = 'rdgm_edit-correct_feedback';
      } else {
         classname = 'rdgm_edit-incorrect_feedback';
      }
      htm += '<div class="' + classname + ' rdgm_editable" data-i_choice="' + i_item + '">' + item_html + '</div>';
   } else {
      if (q.rwizard_b) {
         item_html = qqc.shortcodes_to_video_elements (item_html);
      }
      item_html = create_restart_button (i_rdgm, item_html, true);
      htm += '<span class="rdgm-feedback-span rdgm_editable" data-i_choice="' + i_item + '">' + item_html + '</span>';
   }
   htm += '<div style="clear: both;"></div>\n';
   htm += '</div>\n';
   if (debug[2]) {
      console.log ('[create_feedback_div_html] htm: ', htm);
   }
   return htm;
}
this.canned_feedback = function (correct_b) {
   var response;
   if (correct_b) {
      var i = Math.floor (Math.random () * correct.length);
      response = correct[i];
   } else {
      var i = Math.floor (Math.random () * incorrect.length);
      response = incorrect[i];
   }
   response = '<p><strong>' + response + '</strong></p>';
   if (debug[0]) {
      console.log ('[canned_feedback] response:', response);
   }
   return response;
}
this.keep_next_button_active = function () {
   next_button_active_b = true;
   $ ('.next_button').show ();
}
this.position_show_next_button = function (i_rdgm) {
   var $next_button = $ ('#next_button-rdgm' + i_rdgm);
   $next_button.show ();
}
function alert_not_logged_in (i_rdgm) {
   if (q.no_intro_b[i_rdgm] && rdgmdata[i_rdgm].qrecord_id && $.cookie ('rdgm_user_login')) {
      var user_logged_in_b
         =    typeof (document_rdgm_user_logged_in_b) != 'undefined'
                                   && document_rdgm_user_logged_in_b
           && typeof (document_rdgm_username) != 'undefined';
      if (! user_logged_in_b) {
         if (! document_rdgm_declined_login_b
                   && ! document_rdgm_not_logged_in_alerted && ! q.rwizard_b ) {
            if (rdgmdata[i_rdgm].qrecord_id.indexOf ('finish_times_demo') == -1) {
               alert ('Note: you are not logged in. You must be logged in to receive credit.');
               document_rdgm_not_logged_in_alerted = true;
            }
         }
      }
   }
}
function redisplay_current_question (i_rdgm, i_question) {
   if (i_question < rdgmdata[i_rdgm].n_questions) {
      if (document_rdgm_mobile) {
         var $mobile_rdgmq = $ ('#mobile_rdgm' + i_rdgm + '-q' + i_question);
         if ($mobile_rdgmq.length) {
            $mobile_rdgmq.show ();
         } else {
            $ ('#rdgm' + i_rdgm + '-q' + i_question).show ();
         }
      } else {
         $ ('#rdgm' + i_rdgm + '-q' + i_question).show ();
      }
   } else {
      $ ('#summary-rdgm' + i_rdgm).show ();
   }
   $ ('.bbfe-rdgm' + i_rdgm).css ({visibility: 'visible'});
   $ ('span.question-number-rdgm' + i_rdgm).css ({visibility: 'visible'});
}
function get_attr (htm, attr_name, plural_ok_b) {
   var attr_value = qqc.get_attr (htm, attr_name);
   if (plural_ok_b && ! attr_value) {
      attr_value = qqc.get_attr (htm, attr_name + 's');
   }
   return attr_value;
}
this.get_rdgmdata = function (i_rdgm, variable) {
   return rdgmdata[i_rdgm][variable];
}
this.set_rdgmdata = function (i_rdgm, variable, value) {
   if (i_rdgm == -1) {
      var s = variable + ' = ' + value;
      eval (s);
   } else {
      rdgmdata[i_rdgm][variable] = value;
   }
}
function S (string) {
   return qqc.T (string);
}
function T (string) {
   return qqc.T (string);
}
function plural (word, plural_word, n) {
   return qqc.plural (word, plural_word, n);
}
function inarray0 (array_of_arrays, query) {
   var len = array_of_arrays.length;
   for (var i=0; i<len; i++) {
      if (array_of_arrays[i][0] == query) {
         return true;
      }
   }
   return false;
}
};
rdgmf.call (rdgm_);
