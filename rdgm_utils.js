var document_rdgm_declined_login_b    = 'not ready';
var document_rdgm_user_logged_in_b    = 'not ready';
var document_rdgm_maker_privileges    = false;
var qjax_bypass                       = 'not ready';
var rdgm_wp_site_url;
var document_rdgm_remember_f          = false;
var document_active_rdgm_qdeck        = '';
var document_rdgm_username            = '';
var document_rdgm_independent_taker_f = '';
var document_rdgm_email               = '';
var default_document_rdgm_email_confirm = 1;  // Don't require confirmation.
var document_rdgm_email_confirm       = default_document_rdgm_email_confirm;
var $dialog_current_password          = '';
var $dialog_assign_to_classes         = '';
var document_rdgm_class_id            = '';
var document_rdgm_school_id           = 0;
var document_rdgm_session_id;
var document_rdgm_login_timeout;
var document_rdgm_team_b              = false;
var document_rdgm_mobile_enabled      = 'Always';
var document_rdgm_mobile              = '';
var document_rdgm_bubblebar_enabled_b = true;
var document_rdgm_force_mobile_f      = false;
var document_rdgm_qdeck_maker_ids     = {};   // Set in check_registered.php.
var document_rdgm_pay_registration_date_unix = 0;
var document_rdgm_not_logged_in_alerted = false;
var document_rdgm_preview_i_rdgm;
var document_rdgm_preview_i_deck;
rdgm_utils = {};
var rdgm_utils_f = function () {
var qqc = this;
var qqcname = 'rdgm_utils';
var $ = jQuery;
var init_enter_intercept_f;
var jjax_script_no = 0;
var head = 'not ready';
var server_loc   = 'not ready';
var secure_server_loc;
var rdgm_ajaxurl = 'not ready';
var plugin_url = '';
var icon_expand_src = 'not ready';
var icon_collapse_src;
var use_dataset_options_html = {};
var use_dataset_options_display_name = {};
var progress_bars_leaderboard = {};
var refresh_leaderboard_timeout = {};
var dataset_questions_countdown_timeout = {};
var pay_rdgm_qdeck_;
var pay_i_rdgm_deck;
var payment_received_f = false;
var register_taker_global_reg_code_ok_f = false;
var register_taker_display_pay_screen_f = false;
var register_taker_global_username;
var register_taker_global_first_name;
var register_taker_global_last_name;
var register_taker_global_sha3_password;
var register_taker_global_username_unique_f;
var register_taker_global_email_unique_f;
var register_taker_global_reg_code_maker_id    = '';
var register_taker_global_reg_code_school_id   = '';
var register_taker_global_reg_code_class_id    = '';
var register_taker_global_reg_code_class_name  = '';
var register_taker_global_reg_code_school_name = '';
var register_taker_global_in_process_b = false;
var provide_feedback_html = {};
var debug = [];
debug[0]  = false;    // General.
debug[5]  = false;    // find_matching_block ().
debug[7]  = false;    // Enter -> click.
debug[9]  = false;    // [hangman].
debug[10] = false;    // parse_html_block ().
debug[11] = false;    // use_dataset.
debug[12] = false;    // Progress bars/leaderboard.
$ (document).ready (function () {
   if ($.cookie) {
      document_rdgm_declined_login_b = $.cookie ('rdgm_declined_login');
   }
   head = document.getElementsByTagName ('head')[0];
   if (debug[0]) {
      console.log ('[rdgm_utils ready] head:', head);
   }
   var $start_course_button = $ ('a.unit.unit_button');
   var button_label = $start_course_button.html ();
   if (button_label && button_label.toLowerCase () == 'start course') {
      var delay_init = function () {
         if ($ ('div.rdgm_wrapper_fallback').is (':visible')) {
            rdgm_.rdgm_init ();
         }
         if ($ ('div.qdeck_wrapper_fallback').is (':visible')) {
            qcard_.qdeck_init ();
         }
      }
      $start_course_button.click (function () {
         setTimeout (delay_init, 3000);
      });
   }
});
this.jjax = function (qname, i_rdgm, qrecord_id, dest, data) {
   qqc.qjax (qname, i_rdgm, qrecord_id, dest, data);
   return false;
   if (head == 'not ready') {
      head = document.getElementsByTagName ('head')[0];
   }
   jjax_script_no++;
   jjax_script_no = jjax_script_no % 5;
   var script_id = 'jjax' + jjax_script_no;
   var script = document.getElementById (script_id);
   if (script) {
      try {
         if (head) {
            head.removeChild (script);
         } else {
            document.body.removeChild (script);
         }
      } catch (e) {
         console.log ('[jjax] script_id:', script_id, ', script:', script);
      }
   }
   var script = document.createElement ('script');
   script.id = script_id;
   script.setAttribute ('charset', 'utf-8');
   var send_data = '?';
   if (data) {
      for (var property in data) {
         send_data += property + '=' + encodeURIComponent (data[property]) + '&'
      }
   }
   send_data += 'qname=' + qname + '&i_rdgm=' + i_rdgm + '&qrecord_id=' + encodeURIComponent (qrecord_id);
   var msec = new Date ().getTime();
   send_data += '&msec=' + msec;
   if (typeof (document_rdgm_session_id) != 'undefined') {
      send_data += '&rdgm_session_id=' + encodeURIComponent (document_rdgm_session_id);
   }
   if (server_loc == 'not ready') {
      server_loc        = qqc.get_rdgm_param ('server_loc', 'http://r_diagrams.com/admin');
      secure_server_loc = qqc.get_rdgm_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/rdgm/admin');
   }
   var local_server_loc;
   if (dest == 'login') {
      local_server_loc = secure_server_loc;
   } else {
      local_server_loc = server_loc;
   }
   local_server_loc = local_server_loc.replace (/^https*:/, '');
   script.src = local_server_loc + '/' + dest + '.php' + send_data;
   if (debug[0]) {
      console.log ('[jjax] data:', data);
      console.log ('[jjax] script.src:', script.src);
   }
   if (head) {
      head.appendChild (script);
   } else {
      document.body.appendChild (script);
   }
}
this.qjax = function (qname, i_rdgm, qrecord_id, dest, rdgmdata) {
   if (! rdgmdata) {
      rdgmdata = {};
   }
   rdgmdata.qname      = qname;
   rdgmdata.i_rdgm     = i_rdgm;
   rdgmdata.qrecord_id = qrecord_id;
   rdgmdata.dest       = dest;
   rdgmdata.js_f       = 1;
   if (typeof (document_rdgm_session_id) != 'undefined') {
      rdgmdata.rdgm_session_id = document_rdgm_session_id;
   }
   if (debug[0]) {
      console.log ('[qjax] rdgmdata:', rdgmdata);
   }
   if (qjax_bypass == 'not ready') {
      qjax_bypass = qqc.get_rdgm_param ('qjax_bypass', '');
   }
   rdgm_wp_site_url = qqc.get_rdgm_param ('wp_site_url', '');
   if (qjax_bypass) {
      var url = rdgm_wp_site_url + '/admin/' + dest;
      if (debug[0]) {
         console.log ('[qjax] url:', url);
      }
      $.ajax ({type:    'POST',
               url:     url,
               data:    rdgmdata,
               error:   function (XMLHttpRequest, statusText, errorThrown) {
                           console.log ('[qjax] XMLHttpRequest:', XMLHttpRequest, ', statusText:', statusText, ', errorThrown:', errorThrown);
                           console.log ('[qjax] url:', url);
                           var msg;
                           var readyState = XMLHttpRequest.readyState;
                           if (url.indexOf ('record') != -1) {
                              if (qname == 'rdgm_') {
                                 $ ('span.response_recorded-rdgm' + i_rdgm).hide ();
                              } else {
                                 $ ('span.response_recorded-qdeck' + i_rdgm).hide ();
                              }
                              if (readyState == 0) {
                                 if (rdgmdata.secure_f) {
                                    msg = 'Sorry, unable to record your response.  Please try again.  Perhaps check your Internet connection?';
                                 } else {
                                    msg = 'Sorry, unable to record your response.  Perhaps check your Internet connection?';
                                 }
                              } else {
                                 if (rdgmdata.secure_f) {
                                    msg = 'Sorry, unable to record your response.  Please try again.  If the problem reoccurs, contact support@r_diagrams.com';
                                 } else {
                                    msg = 'Sorry, unable to record your response.  If the problem reoccurs, please contact support@r_diagrams.com';
                                 }
                              }
                           } else {
                              if (readyState == 0) {
                                 msg = 'Sorry, unable to process request.  Perhaps check your Internet connection?';
                              } else {
                                 msg = 'Sorry, unable to process request.  If the problem persists, please contact support@r_diagrams.com';
                              }
                           }
                           alert (msg);
                        },
               success: qjax_callback});
   } else {
      if (rdgm_ajaxurl == 'not ready') {
         rdgm_ajaxurl = qqc.get_rdgm_param ('ajaxurl', '');
      }
      var data = {};
      data.action   = 'qjax';
      data.rdgmdata = rdgmdata;
      $.ajax ({type:    'POST',
               url:     rdgm_ajaxurl,
               data:    data,
               success: qjax_callback});
   }
}
function qjax_callback (js) {
   if (debug[0]) {
      console.log ('[qjax_callback] js:', js);
   }
   if (js) {
      js = js.replace (/var /g, '');
      eval (js);
   }
}
this.check_session_id = function (i_rdgm) {
   var cookie_session_id = $.cookie ('rdgm_session_id');
   if (debug[0]) {
      console.log ('[check_session_id] cookie_session_id:', cookie_session_id);
   }
   if (! cookie_session_id) {
      document_rdgm_user_logged_in_b = false;
   } else {
      document_rdgm_session_id = cookie_session_id;
      var data = {cookie_session_id: cookie_session_id};
      qqc.qjax ('', i_rdgm, '', 'check_session_id', data);
   }
}
function check_maker_session_id () {
   var cookie_session_id = $.cookie ('maker_session_id');
   if (debug[0]) {
      console.log ('[check_maker_session_id] cookie_session_id:', cookie_session_id);
   }
   if (! cookie_session_id) {
      qqc.maker_session_id_ok_or_no ();
   } else {
      var data = {cookie_session_id: cookie_session_id,
                  callback:          'maker_session_id_ok_or_no'
                 };
      qqc.qjax ('rdgm_utils', 0, '', 'check_maker_session_id', data);
   }
}
this.maker_session_id_ok_or_no = function () {
   if (! qqc.maker_logged_in_b) {
      var delay_set = function () {
         var $teacher_subscriptions = $ ('a.teacher_subscriptions');
         $teacher_subscriptions.each (function () {
            var $this = $ (this);
            var query_string = $this.data ('query_string');
            if (debug[0]) {
               console.log ('[maker_session_id_ok_or_no]: query_string:', query_string);
            }
            const secure_server_loc = qqc.get_rdgm_param ('secure_server_loc', 'https://r_diagrams.com/admin');
            const href = secure_server_loc + '/maker_login_register' + query_string;
            $this.attr ('href', href);
         });
      }
      setTimeout (delay_set, 250);
   }
}
this.offset_height_rescale = function ($el, scale_fac, add_margin) {
   const unscaled_height = $el.outerHeight ();
   var   offset = unscaled_height*(scale_fac - 1.0);
   if (add_margin) {
      offset += add_margin;
   }
   $el.css ({'margin-bottom': offset.toFixed (1)+ 'px'});
}
this.create_sortable_unit_number = function (unit_no) {
   var sortable_unit_no = '';
   var type = typeof unit_no;
   if (type != 'number' && type != 'string') {
      sortable_unit_no = 'z';
   } else if (unit_no == '') {
      sortable_unit_no = 'z';
   } else {
      var pieces = unit_no.split ('.');
      var n_pieces = pieces.length;
      if (n_pieces > 1) {
         var pieces2 = pieces[1].split ('-');
         pieces[1] = pieces2[0];
      }
      var n = Math.min (2, n_pieces);
      for (var i=0; i<n; i++) {
         pieces[i] = ('++++++' + pieces[i]).slice (-6);
      }
      sortable_unit_no = pieces.join ('.') + ' ' + unit_no;
   }
   return sortable_unit_no;
}
this.shuffle = function (array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor (Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
firstBy = (function() {
   function makeCompareFunction (f, direction) {
      if (typeof (f) != "function") {
         var i = f;
         var locale = window.navigator.userLanguage || window.navigator.language;
         f = function (a, b) {
            if (typeof a[i] == 'number' && typeof b[i] == 'number') {
               return a[i] - b[i];
            } else {
               var a0 = a[i] || 'zzz';
               var b0 = b[i] || 'zzz';
               return a0.toString ().toLowerCase ().localeCompare (b0.toString ().toLowerCase (), locale);
            }
         };
      }
      if (direction === -1)  return function(a, b)
                                       {return -f (a, b)
                                    };
      return f;
   }
   /* mixin for the `thenBy` property */
   function extend (f, d) {
      f = makeCompareFunction (f, d);
      f.thenBy = tb;
      return f;
   }
   /* adds a secondary compare function to the target function (`this` context)
      which is applied in case the first one returns 0 (equal)
      returns a new compare function, which has a `thenBy` method as well */
   function tb (y, d) {
      var x = this;
      y = makeCompareFunction (y, d);
      return extend (function (a, b) {
            return x (a, b) || y (a, b);
      });
    }
    return extend;
})();
this.remove_empty_opening_tags = function (htm) {
   htm = htm.replace (/^\s*<(p|h\d)>\s*<\/(p|h\d)>/, '');
   return htm;
}
this.is_only_tags_and_whitespace = function (htm) {
   var htm = qqc.remove_tags_eols (htm, true);
   htm = htm.replace (/&nbsp;|&ensp;|&emsp;|&thinsp;|&hairsp;/, '');
   const no_non_whitespace = htm.search (/\S/) == -1;
   return no_non_whitespace;
}
this.init_hide_show_password = function (selector) {
   $ (selector).hidePassword (true, {
      states: {
         shown: {
            toggle: {className: 'rdgm-hideShowPassword-toggle-hide'}
         },
         hidden: {
            toggle: {className: 'rdgm-hideShowPassword-toggle-show'}
         }
      }
   });
}
function rdgm_deck_selector (qname, i_rdgm) {
   var rdgm_deck = qname == 'rdgm_' ? 'div#rdgm' + i_rdgm : 'div.qcard_card-qdeck' + i_rdgm;
   return rdgm_deck + ' ';
}
this.is_mobile = function (mobile_enabled) {
   var mobile_b;
   if (! document_rdgm_force_mobile_f) {
      mobile_b = mobile_enabled != 'Disabled'
                       && (window.innerWidth < 961 || window.innerHeight < 450);
   }
   return mobile_b
}
this.set_force_mobile = function () {
   var in_iframe_b = parent !== window;
   if (in_iframe_b) {
      if (document.location.href.search (/(localhost|192.168.1.120|r_diagrams.com|swinginghotspot.com)\/u\//) != -1) {
         document_rdgm_force_mobile_f = true;
      }
   }
}
this.setCharAt = function (str, index, chr) {
   if (index > str.length-1)  return str;
   return str.substr (0,index) + chr + str.substr (index+1);
}
this.make_inline = function (htm, i_pos) {
   var htm_substr = htm.substr (i_pos);
   var tag_htm = htm_substr.match (/<[hp][^>]*>/)[0];
   var tagname = tag_htm[1];
   if (tagname == 'h') {
      tagname += tag_htm[2];
   }
   var new_tag = qqc.add_attr_value ('style', 'display: inline;', tag_htm);
   if (debug[9]) {
      console.log ('[make_inline] new_tag:', new_tag);
   }
   var new_htm_substr = htm_substr.replace (tag_htm, new_tag);
   var new_div = new_tag.replace (tagname, 'div');
   new_htm_substr = new_div + new_htm_substr;
   var pat = '</' + tagname + '>';
   if (new_htm_substr.search (pat) != -1) {
      new_htm_substr = new_htm_substr.replace (pat, pat + '</div>');
   } else {
      new_htm_substr += '</div>';
   }
   htm = htm.substr (0, i_pos) + new_htm_substr;
   var closing_tag = '</' + tagname + '>';
   new_tag = '<' + tagname + ' style="display: inline;">';
   htm = htm.replace (/\[hangman[^\]]*\]/, closing_tag + '$&' + new_tag);
   if (debug[9]) {
      console.log ('[make_inline] htm:', htm);
   }
   return htm;
}
this.add_attr_value = function (attr, value, attributes) {
   var re = new RegExp (attr + '\\s*=\\s*["\']', 'im');
   var m = attributes.match (re);
   if (m) {
      if (attributes.search (value) == -1) {
         attributes = attributes.replace (re, m[0] + value + ' ');
      }
   } else {
      attributes = attributes.replace ('>', ' ' + attr + '="' + value + '">');
   }
   if (debug[0]) {
      console.log ('[add_attr_value] attributes:', attributes);
   }
   return attributes;
}
this.remove_tags_eols = function (htm, keep_img_f) {
   if (htm) {
      if (keep_img_f) {
         htm = htm.replace (/<img/g, 'xXximg');
      }
      htm = qqc.trim (htm.replace (/<[^>]+>/g, '').replace (/\n|&nbsp;/g, ' ').replace (/ {2,}/g, ' '));
      if (keep_img_f) {
         htm = htm.replace (/xXximg/g, '<img');
      }
   }
   return htm;
}
this.q_and_a_hash = function (text) {
   if (text.length > 200) {
      text = text.substr (0, 184) + 'CRC32:' + rdgm_crc32 (text);
   }
   return text;
}
this.init_enter_intercept = function () {
}
this.$get_login_div = function (qname, i_rdgm) {
   var selector;
   if (qname == 'rdgm_') {
      selector = '#rdgm_login-rdgm' + i_rdgm;
      $ ('#progress-rdgm' + i_rdgm).html ('');
   } else {
      selector = 'div.qcard_card-qdeck' + i_rdgm + ' div.qcard-front div.qcard_content_size';
      $ ('#progress-qdeck' + i_rdgm).html ('');
   }
   return $ (selector);
}
this.get_attr = function (htm, attr_name) {
   var attr_value = '';
   var attr_re = new RegExp ('(\\s|^)' + attr_name + '\\s*=\\s*("([^"]+)")*', 'm');
   var attr_match = htm.match (attr_re);
   if (attr_match) {
      if (attr_match[3]) {
         attr_value = qqc.trim (attr_match[3]);
      }
   }
   return attr_value;
}
this.opening_tag_shortcode_pos = function (shortcode_pat, htm) {
   var shortcode_pat = shortcode_pat.replace (/([\[\]\*])/g, '\\$1');
   var opening_tags_re_txt = '(<[^\\/][^>]*>\\s*)*?' + shortcode_pat + '[\\s\\S]*';
   var opening_tags_re = new RegExp (opening_tags_re_txt);
   var i_pos = htm.search (opening_tags_re);
   if (i_pos == -1) {
      i_pos = htm.length;
   } else {
      var shortcode_re = new RegExp (shortcode_pat);
      var shortcode_pos = htm.search (shortcode_re);
      var repeat_b = false;
      var img_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<img');
      if (img_pos != -1) {
         i_pos += img_pos + 3;
         repeat_b = true;
      }
      var input_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<input');
      if (input_pos != -1) {
         i_pos += input_pos + 3;
         repeat_b = true;
      }
      var qp_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<span class="rwizard_placeholder">');
      if (qp_pos != -1) {
         i_pos += qp_pos + 3;
         repeat_b = true;
      }
      var break_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<br');
      if (break_pos != -1) {
         i_pos += break_pos + 3;
         repeat_b = true;
      }
      var iframe_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<video');
      if (iframe_pos != -1) {
         i_pos += iframe_pos + 3;
         repeat_b = true;
      }
      var iframe_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<iframe');
      if (iframe_pos != -1) {
         i_pos += iframe_pos + 3;
         repeat_b = true;
      }
      if (repeat_b) {
         var ii_pos = htm.substr (i_pos).search (opening_tags_re);
         i_pos += ii_pos;
      }
   }
   return i_pos;
}
this.replace_smart_quotes = function (string) {
   var new_string = string.replace (/[\u201C\u201D\u2033\u00AB\u00BB]/gm, '"');
   new_string = new_string.replace (/[\u2018\u2019]/gm, "'");
   new_string = new_string.replace (/&nbsp;|\u000A0/gm, ' ');
   new_string = new_string.replace (/&ndash;|\u2013/gm, '-');
   return new_string;
}
this.balance_closing_tag = function (s) {
   var i_pos_close_tag = s.search (/<\/[ph]/);
   if (i_pos_close_tag != -1) {
      var open_phx;
      var close_phx = s.substr (i_pos_close_tag + 2, 2);
      if (close_phx.substr (1) == '>') {
         open_phx = '<p';
      } else {
         open_phx = '<' + close_phx;
      }
      var re = new RegExp (open_phx);
      var i_pos_open_phx = s.search (re);
      if (i_pos_open_phx == -1 || i_pos_open_phx > i_pos_close_tag) {
         s = open_phx + '>' + s;
      }
   }
   return s;
}
this.remove_unmatched_tag = function (part, first_part_f, last_part_f) {
   var part_orig = part;
   var pieces = part.split (/(<[ph][^>]*>[^]*?<\/[ph][^>]*>)/);
   var n_pieces = pieces.length;
   var last_piece = pieces[n_pieces - 1];
   var new_last_piece = last_piece.replace (/<\/{0,1}[ph][^>]*>/g, '')
   var all_tags_removed_f = true;
   var i_unmatched_tags = last_piece.search (/<\/{0,1}[ph]/);
   if (i_unmatched_tags != -1) {
      if (! last_part_f || last_piece.search (/<[ph]/) != -1) {
         if (! first_part_f || last_piece.search (/<[ph]/) != -1) {
            if (new_last_piece.search (/\S/) != -1) {
               var wrap_tag_re = new RegExp (/<[ph][^>]*>/);
               var m = last_piece.match (wrap_tag_re);
               var wrap_tag = '<p>';
               var opening_tag_pos = -1;
               if (m) {
                  wrap_tag = m[0];
                  opening_tag_pos = last_piece.search (wrap_tag_re);
               } else if (n_pieces > 1) {
                  var next_to_last_piece = pieces[n_pieces - 2];
                  m = next_to_last_piece.match (wrap_tag_re);
                  if (m) {
                     wrap_tag = m[0];
                  }
               }
               if (opening_tag_pos != -1) {
                  var tag_type_re = new RegExp (/<\/{0,1}([ph][^>\s]*)/);
                  var tag_type;
                  if (! wrap_tag) {
                     tag_type = last_piece.match (tag_type_re)[1];
                     wrap_tag = '<' + tag_type + '>';
                  } else {
                     tag_type = wrap_tag.match (tag_type_re)[1];
                  }
                  var wrap_closing_tag = '</' + tag_type + '>';
                  var sub_pieces = last_piece.split (wrap_tag_re, 2);
                  sub_piece1 = sub_pieces[0].replace  (/<\/{0,1}[ph][^>]*>/g, '');
                  sub_piece2 = sub_pieces[1].replace  (/<\/{0,1}[ph][^>]*>/g, '');
                  var wrap_tag_inline;
                  if (wrap_tag.search ('class') != -1) {
                     wrap_tag_inline = wrap_tag.replace (/class\s*=\s*"/, 'class="rdgm-inline ');
                  } else {
                     wrap_tag_inline = '<' + tag_type + ' class="rdgm-inline">';
                  }
                  sub_piece1 = add_span_if_empty (sub_piece1);
                  sub_piece2 = add_span_if_empty (sub_piece2);
                  if (sub_piece1) {
                     sub_piece1 = wrap_tag_inline + sub_piece1 + wrap_closing_tag;
                  }
                  if (sub_piece2) {
                     sub_piece2 = wrap_tag_inline + sub_piece2 + wrap_closing_tag;
                  }
                  new_last_piece = sub_piece1;
                  if (sub_piece1 && sub_piece2) {
                     new_last_piece += wrap_tag + add_span_if_empty ('', true) + wrap_closing_tag;
                  }
                  new_last_piece += sub_piece2;
                  all_tags_removed_f = false;
               }
            }
         }
      }
   }
   if (all_tags_removed_f) {
      new_last_piece = '<p class="rdgm-inline">' + add_span_if_empty (new_last_piece, true) + '</p>';
   }
   var pieces_before_last = pieces.slice (0, n_pieces - 1);
   part = pieces_before_last.join ('') + new_last_piece;
   if (debug[0] && part != part_orig) {
      console.log ('[remove_unmatched_tag] part_orig:', part_orig);
      console.log ('[remove_unmatched_tag] part:     ', part);
   }
   return part;
}
function add_span_if_empty (htm, force_f) {
   if (! force_f && htm.search (/\S/) == -1) {
      htm = '';
   } else {
      var ck = htm.replace (/&nbsp;|&ensp;|&emsp;|&thinsp;|&hairsp;/, '');
      if (ck.search (/\S/) == -1) {
         htm += '<span class="rdgm-avoid-br" style="display: none;">x</span>';
      }
   }
   return htm;
}
var number_word;
this.number_to_word = function (number) {
   if (! number_word) {
      number_word = [qqc.S ('zero'), qqc.S ('one'), qqc.S ('two'), qqc.S ('three'), qqc.S ('four'), qqc.S ('five'), qqc.S ('six'), qqc.S ('seven'), qqc.S ('eight'), qqc.S ('nine'), qqc.S ('ten')];
   }
   var word;
   if (number > 10) {
      word = number.toString ();
   } else {
      word = number_word[number];
   }
   return word;
}
var ordinal_words;
this.number_to_ordinal_word = function (n, capitalize_b) {
   if (! ordinal_words) {
      ordinal_words = [qqc.T ('zeroth'),
                       qqc.T ('first'), qqc.T ('second'),  qqc.T ('third'),  qqc.T ('fourth'), qqc.T ('fifth'),
                       qqc.T ('sixth'), qqc.T ('seventh'), qqc.T ('eighth'), qqc.T ('ninth'),  qqc.T ('tenth'),
                       qqc.T ('eleventh'), qqc.T ('twelfth'),
                       qqc.T ('thirteenth')];
   }
   var ordinal_word;
   if (n < 14) {
      ordinal_word = ordinal_words[n];
   } else {
      var units_place = n % 10;
      if (units_place == 1) {
         ordinal_word = '' + n + 'st';
      } else if (units_place == 2) {
         ordinal_word = '' + n + 'nd';
      } else if (units_place == 3) {
         ordinal_word = '' + n + 'rd';
      } else {
         ordinal_word = '' + n + 'th';
      }
   }
   if (capitalize_b) {
      ordinal_word = qqc.capitalize (ordinal_word);
   }
   return ordinal_word;
}
this.capitalize = function (word) {
   word = word.substr (0, 1).toUpperCase () + word.substr (1);
   return word;
}
this.plural = function (word, plural_word, n) {
   var new_word;
   if (n == 1) {
      new_word = word;
   } else {
      new_word = plural_word;
   }
   return new_word;
}
this.S = function (string) {
   return qqc.T (string);
}
this.T = function (string) {
   var t_string = '';
   if (typeof rdgm_params != 'undefined') {
      if (typeof rdgm_params.T != 'undefined') {
         if (typeof rdgm_params.T[string] != 'undefined') {
            t_string = rdgm_params.T[string];
         }
      }
   } else if (typeof rdgm_edit_params != 'undefined') {
      if (typeof rdgm_edit_params.T != 'undefined') {
         if (typeof rdgm_edit_params.T[string] != 'undefined') {
            t_string = rdgm_edit_params.T[string];
         }
      }
   }
   if (t_string == '') {
      t_string = string;
   }
   return t_string;
}
this.currency = function (val) {
   if (val == 0) {
      return '$0.00'
   } else {
      var cents = '' + parseInt (val*100.0 + 0.5, 10);
      var len = cents.length;
      return '$' + cents.substr (0, len-2) + '.' + cents.substr (len-2);
   }
}
this.get_rdgm_param = function (key, default_value) {
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
this.trim = function (s) {
   if (s) {
      s = s.toString ();
      if ('a'.trim) {
         s = s.trim ();
      } else {
         s = s.replace (/^\s+|\s+$/g, '');
      }
   }
   return s;
}
this.add_script = function (script_url) {
   var script = document.createElement ('script');
   script.setAttribute ('charset', 'utf-8');
   script.src = script_url;
   var head = [];
   try {
      var head = $ ('head');
   } catch (e) {}
   if (head.length) {
      head.append (script);
   } else {
      $ ('body').append (script);
   }
}
this.pay_lock_settings = function (qname, qdata, n_rdgmzes_decks,
                                   i_login_rdgm, escaped_session_id, remember_f,
                                   do_i_rdgm_deck) {
}
this.set_rdgmdeckdata = function (qname, i_rdgm_deck, variable, value) {
   if (qname == 'rdgm_') {
      rdgm_.set_rdgmdata (i_rdgm_deck, variable, value);
   } else {
      qcard_.set_deckdata (i_rdgm_deck, variable, value);
   }
}
function get_rdgmdeckdata (qname, i_rdgm_deck, variable) {
   var value;
   if (qname == 'rdgm_') {
      value = rdgm_.get_rdgmdata (i_rdgm_deck, variable);
   } else {
      value = qcard_.get_deckdata (i_rdgm_deck, variable);
   }
   return value;
}
function parse_html_block_pattern (tags) {
   var tags_pat = '(' + tags.join (')|(') + ')';
   tags_pat = tags_pat.replace (/([\[\]\*])/g, '\\$1');
   tags_pat = '((' + tags_pat + ')\\s*)';
   return tags_pat;
}
this.find_opening_tags_at_end = function (htm) {
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
this.parse_html_block = function (htm, shortcodes, next_shortcodes, ignore_nbsp_b) {
   if (debug[10]) {
      console.log ('[parse_html_block] shortcodes: ', shortcodes, ', htm: ', htm);
   }
   var return_whitespace_b = typeof (ignore_nbsp_b) == 'string';
   var html_block;
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
         return 'NA';
      }
      offset = 3;
      var all_before_shortcode = htm.substr (0, shortcodes_pos);
      opening_tags = qqc.find_opening_tags_at_end (all_before_shortcode);
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
      next_opening_tags = qqc.find_opening_tags_at_end (all_before_next_shortcode);
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
         if (ignore_nbsp_b != undefined) {
            htm_wo_tags = htm_wo_tags.replace (/&nbsp;|&emsp;|<br[^>]*>/gm, '');
         }
         var is_whitespace_b = htm_wo_tags.search (/\S/) == -1;
         if (is_whitespace_b) {
            if (! return_whitespace_b) {
               html_block = '';
            }
         }
      }
   }
   if (return_whitespace_b && ! is_whitespace_b) {
      html_block = '';
   }
   if (debug[10]) {
      console.log ('[parse_html_block] html_block:', html_block);
   }
   return html_block;
}
this.find_matching_block = function (htm) {
   var htm_block = '';
   var len = htm.length;
   var i = 0;
   var i_level = 0;
   var tags = [];
   var expecting_slash_p_b = false;
   while (i < len) {
      if (htm[i] == '<') {
         if (htm.substr (i, 4) == '<br>' || htm.substr (i, 4) == '<hr>') {
            i += 3;
            continue;
         } else if (htm.substr (i, 4) == '<!--') {
            i += 4;
            continue;
         } else if (   htm.substr (i, 4) == '<img'
                    || htm.substr (i, 6) == '<input'
                    || htm.substr (i, 3) == '<br'
                    || htm.substr (i, 3) == '<hr' ) {
            i += 3;
            while (i < len) {
               i++;
               if (htm[i] == '>') {
                  break;
               }
            }
            continue
         } else if (htm.substr (i, 2) == '<p') {
            if (expecting_slash_p_b) {
               i++;
               continue;
            }
            expecting_slash_p_b = true;
         }
         i++;
         if (htm[i] == '/') {
            if (htm.substr (i, 4) == '/div') {
               if (expecting_slash_p_b) {
                  i_level--;
                  expecting_slash_p_b = false;
               }
            } else if (htm.substr (i, 2) == '/p') {
               expecting_slash_p_b = false;
            }
            i_level--;
            i++;
            var closing_tag = '';
            while (i < len) {
               if (htm[i] == '>') {
                  break;
               }
               closing_tag += htm[i];
               i++;
            }
            if (debug[5]) {
               console.log ('[find_matching_block] i_level: ', i_level, ', closing_tag:', closing_tag, ', tags:', tags.slice (0, i_level+1));
            }
            if (closing_tag != tags[i_level]) {
               if (debug[5]) {
                  console.log ('XXX');
               }
               i_level++;
            }
            if (i_level <= 0) {
               htm_block = htm.substring (0, i);
               while (i < len) {
                  if (htm[i] == '>') {
                     break;
                  }
                  htm_block += htm[i];
               }
               htm_block += '>';
               break;
            }
         } else {
            var tag_i_level = '';
            while (i < len) {
               if (htm[i] == '>' || /\s/.test (htm[i])) {
                  break
               }
               tag_i_level += htm[i];
               i++;
            }
            tags[i_level] = tag_i_level;
            if (debug[5]) {
               console.log ('[find_matching_block] (new_level) tag_i_level:', tag_i_level, ', (followed by): ', htm.substr (i+1, 30));
               console.log ('[find_matching_block] tags:', tags.slice (0, i_level+1));
            }
            i_level++;
         }
      } else if (htm[i] == '/') {
         i++;
         if (htm[i] == '>') {
            i_level--;
         }
      }
      i++;
   }
   if (debug[5]) {
      console.log ('[find_matching_block] htm_block:', htm_block);
   }
   return htm_block;
}
this.select_placeholder = function ($edit_field) {
   if (debug[0]) {
      console.log ('[select_placeholder] $edit_field:', $edit_field);
   }
   var $placeholder = $edit_field.find ('span.rwizard_placeholder');
   if ($placeholder.length == 0) {
      if (debug[0]) {
         console.log ('[select_placeholder] $placeholder.length: 0');
      }
      return;
   }
   var delay_select = function () {
      var placeholder_el = $placeholder[0];
      var id = $edit_field.attr ('id');
      var ed = tinyMCE.get (id);
      if (debug[0]) {
         console.log ('[select_placeholder] ed:', ed);
         if (! ed) {
            var delay_get = function () {
               ed = tinyMCE.get (id);
               console.log ('[select_placeholder > delay_get ] ed:', ed);
            }
            setTimeout (delay_get, 500);
         }
      }
      if (ed && ed.selection) {
         if (ed.dom.select ('span')) {
            ed.selection.select (ed.dom.select ('span')[0]);
         }
      }
      if (id.substr (0, 5) == 'qcard') {
         $edit_field.off ('keydown').off ('click');
         var replace_w_space_b = $edit_field[0].tagName.toLowerCase () == 'span';
         $edit_field.on ('click keydown', function (e) {
                             rwizard.remove_placeholder (e, $edit_field, replace_w_space_b);
                          });
      }
      setTimeout ('document_rdgm_bubblebar_enabled_b = true', 200);
   }
   document_rdgm_bubblebar_enabled_b = false;
   setTimeout (delay_select, 500);
}
function select_text (text_el) {
   if (document.body.createTextRange) {
      var range = document.body.createTextRange ();
      range.moveToElementText (text_el);
      range.select ();
   } else if (window.getSelection) {
      var selection = window.getSelection ();
      var range = document.createRange ();
      range.selectNodeContents (text_el);
      selection.removeAllRanges ();
      selection.addRange (range);
   }
}
this.check_pairs = function (opening, closing, htm) {
   var errmsg = '';
   var prev_opening_pos = 0;
   var prev_closing_pos = 0;
   while (true) {
      opening_pos = htm.indexOf (opening, prev_opening_pos);
      closing_pos = htm.indexOf (closing, prev_closing_pos);
      if (opening_pos == -1 && closing_pos == -1) {
         break;
      }
      errmsg = 'ok';
      if (closing_pos <= opening_pos || opening_pos == -1 || opening_pos < prev_closing_pos) {
         errmsg = 'Mis-matched pairs for ' + opening + '...' + closing;
         break;
      }
      prev_opening_pos = opening_pos + 1;
      prev_closing_pos = closing_pos + 1;
   }
   return errmsg;
}
this.hex_to_rgb = function (hex) {
   const rhex = hex.substr (0, 2);
   const ghex = hex.substr (2, 2);
   const bhex = hex.substr (4, 2);
   const r = parseInt (rhex, 16);
   const g = parseInt (ghex, 16);
   const b = parseInt (bhex, 16);
   return [r, g, b];
}
function decodeHtmlEntities (str) {
   return str.replace (/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode (dec);
   });
}
this.encodeHtmlEntities = function (str) {
   var buf = [];
   for (var i=str.length-1; i>=0; i--) {
      buf.unshift (['&#', str[i].charCodeAt (), ';'].join (''));
   }
   return buf.join ('');
}
this.addSlashes = function (str) {
   return (str + '').replace(/[\\"']/g, '\\$&').replace (/\n/g, '\\n').replace(/\u0000/g, '\\0');
}
this.decode_image_tags = function (htm) {
   htm = htm.replace (/<input[^>]+?name="rdgm_img"/g, '<img');
   return htm;
}
this.shortcodes_to_video_elements = function (htm) {
   htm = htm.replace (/\[audio(.*?)(src|mp3|m4a|ogg|wav|wma|mp4|m4v|webm|ogv|wmv|flv)([^\]]*)\]/g, '<video controls\$1\src\$3 data-audio_video="audio" height="30" width="280"></video>')
            .replace (/\[video(.*?)(src|mp3|m4a|ogg|wav|wma|mp4|m4v|webm|ogv|wmv|flv)([^\]]*)\]/g, '<video controls\$1\src\$3 data-audio_video="video"></video>');
   if (rdgm_edit.wp_editing_page_f) {
      var m = htm.match (/\[embed\][^\[]+\[\/embed\]/g);
      if (m) {
         var urls = [];
         var args = [];
         var n_embeds = m.length;
         for (var i=0; i<n_embeds; i++) {
            urls.push (m[i].replace (/\[\/{0,1}embed\]/g, ''));
            args.push ({width: 500});
         }
         var get_embed_code_callback = function (embed_codes) {
            for (var i=0; i<n_embeds; i++) {
               var embed_code = embed_codes[i].replace ('>', ' data-embed="true">');
               htm = htm.replace (m[i], embed_code);
            }
         }
         if (rdgm_ajaxurl == 'not ready') {
            rdgm_ajaxurl = qqc.get_rdgm_param ('ajaxurl', '');
         }
         var data = {action:     'process_embeds',
                     urls:        encodeURIComponent (JSON.stringify (urls)),
                     args:        encodeURIComponent (JSON.stringify (args))
                    };
         $.ajax ({
            type:       'POST',
            async:      false,
            url:        rdgm_ajaxurl,
            data:       data,
            success:    get_embed_code_callback
         });
      }
   }
   if (debug[0]) {
      console.log ('[shortcodes_to_video_elements] htm:', htm);
   }
   return htm;
}
this.hhmmss_from_sec = function (sec) {
   var ss = sec % 60;
   if (ss < 10) {
      ss = '0' + ss;
   }
   var mm = parseInt (sec/60.0) % 60;
   var hhmmss = mm + ':' + ss;
   if (sec >= 3600) {
      if (mm < 10) {
         mm = '0' + mm;
      }
      const hh = parseInt (sec/3600.0);
      hhmmss = hh + ':' + hhmmss;
   }
   return hhmmss;
}
this.isInteger = function (num) {
   return (num ^ 0) === num;
}
this.bin2hex = function (s) {
  var i
  var l
  var o = ''
  var n
  s += ''
  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? '0' + n : n;
  }
  return o
}
$.fn.changeElements = function (newType) {
   var newElements = [];
   $ (this).each (function () {
      var attrs = {};
      $.each (this.attributes, function (idx, attr) {
         attrs[attr.nodeName] = attr.nodeValue;
      });
      var newElement = $ ("<" + newType + "/>", attrs);
      $ (this).replaceWith (newElement);
   });
   return $ (newElements);
}
this.metaphone = function (word, max_phonemes) {
  var type = typeof word;
  if (type === 'undefined' || type === 'object' && word !== null) {
    return null; // weird!
  }
  if (type === 'number') {
    if (isNaN(word)) {
      word = 'NAN';
    } else if (!isFinite(word)) {
      word = 'INF';
    }
  }
  if (max_phonemes < 0) {
    return false;
  }
  max_phonemes = Math.floor(+max_phonemes) || 0;
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    vowel = 'AEIOU',
    soft = 'EIY',
    leadingNonAlpha = new RegExp('^[^' + alpha + ']+');
  word = typeof word === 'string' ? word : '';
  word = word.toUpperCase()
    .replace(leadingNonAlpha, '');
  if (!word) {
    return '';
  }
  var is = function(p, c) {
    return c !== '' && p.indexOf(c) !== -1;
  };
  var i = 0,
    cc = word.charAt(0), // current char. Short name, because it's used all over the function
    nc = word.charAt(1), // next char
    nnc, // after next char
    pc, // previous char
    l = word.length,
    meta = '',
    traditional = true;
  switch (cc) {
    case 'A':
      meta += nc === 'E' ? nc : cc;
      i += 1;
      break;
    case 'G':
    case 'K':
    case 'P':
      if (nc === 'N') {
        meta += nc;
        i += 2;
      }
      break;
    case 'W':
      if (nc === 'R') {
        meta += nc;
        i += 2;
      } else if (nc === 'H' || is(vowel, nc)) {
        meta += 'W';
        i += 2;
      }
      break;
    case 'X':
      meta += 'S';
      i += 1;
      break;
    case 'E':
    case 'I':
    case 'O':
    case 'U':
      meta += cc;
      i++;
      break;
  }
  for (; i < l && (max_phonemes === 0 || meta.length < max_phonemes); i += 1) {
    cc = word.charAt(i);
    nc = word.charAt(i + 1);
    pc = word.charAt(i - 1);
    nnc = word.charAt(i + 2);
    if (cc === pc && cc !== 'C') {
      continue;
    }
    switch (cc) {
      case 'B':
        if (pc !== 'M') {
          meta += cc;
        }
        break;
      case 'C':
        if (is(soft, nc)) {
          if (nc === 'I' && nnc === 'A') {
            meta += 'X';
          } else if (pc !== 'S') {
            meta += 'S';
          }
        } else if (nc === 'H') {
          meta += !traditional && (nnc === 'R' || pc === 'S') ? 'K' : 'X';
          i += 1;
        } else {
          meta += 'K';
        }
        break;
      case 'D':
        if (nc === 'G' && is(soft, nnc)) {
          meta += 'J';
          i += 1;
        } else {
          meta += 'T';
        }
        break;
      case 'G':
        if (nc === 'H') {
          if (!(is('BDH', word.charAt(i - 3)) || word.charAt(i - 4) === 'H')) {
            meta += 'F';
            i += 1;
          }
        } else if (nc === 'N') {
          if (is(alpha, nnc) && word.substr(i + 1, 3) !== 'NED') {
            meta += 'K';
          }
        } else if (is(soft, nc) && pc !== 'G') {
          meta += 'J';
        } else {
          meta += 'K';
        }
        break;
      case 'H':
        if (is(vowel, nc) && !is('CGPST', pc)) {
          meta += cc;
        }
        break;
      case 'K':
        if (pc !== 'C') {
          meta += 'K';
        }
        break;
      case 'P':
        meta += nc === 'H' ? 'F' : cc;
        break;
      case 'Q':
        meta += 'K';
        break;
      case 'S':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X';
        } else if (nc === 'H') {
          meta += 'X';
          i += 1;
        } else if (!traditional && word.substr(i + 1, 3) === 'CHW') {
          meta += 'X';
          i += 2;
        } else {
          meta += 'S';
        }
        break;
      case 'T':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X';
        } else if (nc === 'H') {
          meta += '0';
          i += 1;
        } else if (word.substr(i + 1, 2) !== 'CH') {
          meta += 'T';
        }
        break;
      case 'V':
        meta += 'F';
        break;
      case 'W':
      case 'Y':
        if (is(vowel, nc)) {
          meta += cc;
        }
        break;
      case 'X':
        meta += 'KS';
        break;
      case 'Z':
        meta += 'S';
        break;
      case 'F':
      case 'J':
      case 'L':
      case 'M':
      case 'N':
      case 'R':
        meta += cc;
        break;
    }
  }
  return meta;
}
};
rdgm_utils_f.call (rdgm_utils);
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
var DateFormat = {};
(function($) {
  var daysInWeek          = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var shortDaysInWeek     = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var shortMonthsInYear   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var longMonthsInYear    = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
  var shortMonthsToNumber = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                              'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
  var YYYYMMDD_MATCHER = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;
  $.format = (function() {
    function numberToLongDay(value) {
      return daysInWeek[parseInt(value, 10)] || value;
    }
    function numberToShortDay(value) {
      return shortDaysInWeek[parseInt(value, 10)] || value;
    }
    function numberToShortMonth(value) {
      var monthArrayIndex = parseInt(value, 10) - 1;
      return shortMonthsInYear[monthArrayIndex] || value;
    }
    function numberToLongMonth(value) {
      var monthArrayIndex = parseInt(value, 10) - 1;
      return longMonthsInYear[monthArrayIndex] || value;
    }
    function shortMonthToNumber(value) {
      return shortMonthsToNumber[value] || value;
    }
    function parseTime(value) {
      var time = value,
          values,
          subValues,
          hour,
          minute,
          second,
          millis = '',
          delimited,
          timeArray;
      if(time.indexOf('.') !== -1) {
        delimited = time.split('.');
        time   = delimited[0];
        millis = delimited[1];
      }
      timeArray = time.split(':');
      if(timeArray.length === 3) {
        hour   = timeArray[0];
        minute = timeArray[1];
        second = timeArray[2].replace(/\s.+/, '').replace(/[a-z]/gi, '');
        time = time.replace(/\s.+/, '').replace(/[a-z]/gi, '');
        return {
          time:    time,
          hour:    hour,
          minute:  minute,
          second:  second,
          millis:  millis
        };
      }
      return { time : '', hour : '', minute : '', second : '', millis : '' };
    }
    function padding(value, length) {
      var paddingCount = length - String(value).length;
      for(var i = 0; i < paddingCount; i++) {
        value = '0' + value;
      }
      return value;
    }
    return {
      parseDate: function(value) {
        var parsedDate = {
          date:       null,
          year:       null,
          month:      null,
          dayOfMonth: null,
          dayOfWeek:  null,
          time:       null
        };
        if(typeof value == 'number') {
          return this.parseDate(new Date(value));
        } else if(typeof value.getFullYear == 'function') {
          parsedDate.year       = String(value.getFullYear());
          parsedDate.month      = String(value.getMonth() + 1);
          parsedDate.dayOfMonth = String(value.getDate());
          parsedDate.time       = parseTime(value.toTimeString() + "." + value.getMilliseconds());
        } else if(value.search(YYYYMMDD_MATCHER) != -1) {
          /* 2009-04-19T16:11:05+02:00 || 2009-04-19T16:11:05Z */
          values = value.split(/[T\+-]/);
          parsedDate.year       = values[0];
          parsedDate.month      = values[1];
          parsedDate.dayOfMonth = values[2];
          parsedDate.time       = parseTime(values[3].split('.')[0]);
        } else {
          values = value.split(' ');
          if(values.length === 6 && isNaN(values[5])) {
            /*
             * This change is necessary to make `Mon Apr 28 2014 05:30:00 GMT-0300` work
             * like `case 7`
             * otherwise it will be considered like `Wed Jan 13 10:43:41 CET 2010
             * Fixes: https://github.com/phstc/jquery-dateFormat/issues/64
             */
            values[values.length] = '()';
          }
          switch (values.length) {
            case 6:
              /* Wed Jan 13 10:43:41 CET 2010 */
              parsedDate.year       = values[5];
              parsedDate.month      = shortMonthToNumber(values[1]);
              parsedDate.dayOfMonth = values[2];
              parsedDate.time       = parseTime(values[3]);
              break;
            case 2:
              /* 2009-12-18 10:54:50.546 */
              subValues = values[0].split('-');
              parsedDate.year       = subValues[0];
              parsedDate.month      = subValues[1];
              parsedDate.dayOfMonth = subValues[2];
              parsedDate.time       = parseTime(values[1]);
              break;
            case 7:
              /* Tue Mar 01 2011 12:01:42 GMT-0800 (PST) */
            case 9:
              /* added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0800 (China Standard Time) */
            case 10:
              /* added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0200 (W. Europe Daylight Time) */
              parsedDate.year       = values[3];
              parsedDate.month      = shortMonthToNumber(values[1]);
              parsedDate.dayOfMonth = values[2];
              parsedDate.time       = parseTime(values[4]);
              break;
            case 1:
              /* added by Jonny, for 2012-02-07CET00:00:00 (Doctrine Entity -> Json Serializer) */
              subValues = values[0].split('');
              parsedDate.year       = subValues[0] + subValues[1] + subValues[2] + subValues[3];
              parsedDate.month      = subValues[5] + subValues[6];
              parsedDate.dayOfMonth = subValues[8] + subValues[9];
              parsedDate.time       = parseTime(subValues[13] + subValues[14] + subValues[15] + subValues[16] + subValues[17] + subValues[18] + subValues[19] + subValues[20]);
              break;
            default:
              return null;
          }
        }
        if(parsedDate.time) {
          parsedDate.date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.dayOfMonth, parsedDate.time.hour, parsedDate.time.minute, parsedDate.time.second, parsedDate.time.millis);
        } else {
          parsedDate.date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.dayOfMonth);
        }
        parsedDate.dayOfWeek = String(parsedDate.date.getDay());
        return parsedDate;
      },
      date : function(value, format) {
        try {
          var parsedDate = this.parseDate(value);
          if(parsedDate === null) {
            return value;
          }
          var date       = parsedDate.date,
              year       = parsedDate.year,
              month      = parsedDate.month,
              dayOfMonth = parsedDate.dayOfMonth,
              dayOfWeek  = parsedDate.dayOfWeek,
              time       = parsedDate.time;
          var pattern      = '',
              retValue     = '',
              unparsedRest = '',
              inQuote      = false;
          /* Issue 1 - variable scope issue in format.date (Thanks jakemonO) */
          for(var i = 0; i < format.length; i++) {
            var currentPattern = format.charAt(i);
            var nextRight      = format.charAt(i + 1);
            if (inQuote) {
              if (currentPattern == "'") {
                retValue += (pattern === '') ? "'" : pattern;
                pattern = '';
                inQuote = false;
              } else {
                pattern += currentPattern;
              }
              continue;
            }
            pattern += currentPattern;
            unparsedRest = '';
            switch (pattern) {
              case 'ddd':
                retValue += numberToLongDay(dayOfWeek);
                pattern = '';
                break;
              case 'dd':
                if(nextRight === 'd') {
                  break;
                }
                retValue += padding(dayOfMonth, 2);
                pattern = '';
                break;
              case 'd':
                if(nextRight === 'd') {
                  break;
                }
                retValue += parseInt(dayOfMonth, 10);
                pattern = '';
                break;
              case 'D':
                if(dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
                  dayOfMonth = parseInt(dayOfMonth, 10) + 'st';
                } else if(dayOfMonth == 2 || dayOfMonth == 22) {
                  dayOfMonth = parseInt(dayOfMonth, 10) + 'nd';
                } else if(dayOfMonth == 3 || dayOfMonth == 23) {
                  dayOfMonth = parseInt(dayOfMonth, 10) + 'rd';
                } else {
                  dayOfMonth = parseInt(dayOfMonth, 10) + 'th';
                }
                retValue += dayOfMonth;
                pattern = '';
                break;
              case 'MMMM':
                retValue += numberToLongMonth(month);
                pattern = '';
                break;
              case 'MMM':
                if(nextRight === 'M') {
                  break;
                }
                retValue += numberToShortMonth(month);
                pattern = '';
                break;
              case 'MM':
                if(nextRight === 'M') {
                  break;
                }
                retValue += padding(month, 2);
                pattern = '';
                break;
              case 'M':
                if(nextRight === 'M') {
                  break;
                }
                retValue += parseInt(month, 10);
                pattern = '';
                break;
              case 'y':
              case 'yyy':
                if(nextRight === 'y') {
                  break;
                }
                retValue += pattern;
                pattern = '';
                break;
              case 'yy':
                if(nextRight === 'y') {
                  break;
                }
                retValue += String(year).slice(-2);
                pattern = '';
                break;
              case 'yyyy':
                retValue += year;
                pattern = '';
                break;
              case 'HH':
                retValue += padding(time.hour, 2);
                pattern = '';
                break;
              case 'H':
                if(nextRight === 'H') {
                  break;
                }
                retValue += parseInt(time.hour, 10);
                pattern = '';
                break;
              case 'hh':
                /* time.hour is '00' as string == is used instead of === */
                hour = (parseInt(time.hour, 10) === 0 ? 12 : time.hour < 13 ? time.hour
                    : time.hour - 12);
                retValue += padding(hour, 2);
                pattern = '';
                break;
              case 'h':
                if(nextRight === 'h') {
                  break;
                }
                hour = (parseInt(time.hour, 10) === 0 ? 12 : time.hour < 13 ? time.hour
                    : time.hour - 12);
                retValue += parseInt(hour, 10);
                pattern = '';
                break;
              case 'mm':
                retValue += padding(time.minute, 2);
                pattern = '';
                break;
              case 'm':
                if(nextRight === 'm') {
                  break;
                }
                retValue += time.minute;
                pattern = '';
                break;
              case 'ss':
                /* ensure only seconds are added to the return string */
                retValue += padding(time.second.substring(0, 2), 2);
                pattern = '';
                break;
              case 's':
                if(nextRight === 's') {
                  break;
                }
                retValue += time.second;
                pattern = '';
                break;
              case 'S':
              case 'SS':
                if(nextRight === 'S') {
                  break;
                }
                retValue += pattern;
                pattern = '';
                break;
              case 'SSS':
                retValue += time.millis.substring(0, 3);
                pattern = '';
                break;
              case 'a':
                retValue += time.hour >= 12 ? 'PM' : 'AM';
                pattern = '';
                break;
              case 'p':
                retValue += time.hour >= 12 ? 'p.m.' : 'a.m.';
                pattern = '';
                break;
              case 'E':
                retValue += numberToShortDay(dayOfWeek);
                pattern = '';
                break;
              case "'":
                pattern = '';
                inQuote = true;
                break;
              default:
                retValue += currentPattern;
                pattern = '';
                break;
            }
          }
          retValue += unparsedRest;
          return retValue;
        } catch (e) {
          if(console && console.log) {
            console.log(e);
          }
          return value;
        }
      },
      toBrowserTimeZone : function(value, format) {
        return this.date(new Date(value), format || 'MM/dd/yyyy HH:mm:ss');
      }
    };
  }());
}(DateFormat));
/**
 * [js-crc]{@link https://github.com/emn178/js-crc}
 *
 * @namespace crc    DK: rdgm_crc
 * @version 0.2.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2017
 * @license MIT
 */
!function(){"use strict";var e="object"==typeof window?window:{},o=!e.JS_CRC_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;o&&(e=global);var n,t,r,f,a=!e.JS_CRC_NO_COMMON_JS&&"object"==typeof module&&module.exports,i="function"==typeof define&&define.amd,l=!e.JS_CRC_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,s="0123456789abcdef".split(""),c=[{name:"rdgm_crc32",polynom:3988292384,initValue:-1,bytes:4},{name:"rdgm_crc16",polynom:40961,initValue:0,bytes:2}];for(n=0;n<c.length;++n){var u=c[n];for(u.method=function(e){return function(o){return d(o,e)}}(u),u.table=[],t=0;256>t;++t){for(f=t,r=0;8>r;++r)f=1&f?u.polynom^f>>>1:f>>>1;u.table[t]=f>>>0}}var d=function(e,o){var n="string"!=typeof e;n&&l&&e instanceof ArrayBuffer&&(e=new Uint8Array(e));var t,r,f=o.initValue,a=e.length,i=o.table;if(n)for(r=0;a>r;++r)f=i[255&(f^e[r])]^f>>>8;else for(r=0;a>r;++r)t=e.charCodeAt(r),128>t?f=i[255&(f^t)]^f>>>8:2048>t?(f=i[255&(f^(192|t>>6))]^f>>>8,f=i[255&(f^(128|63&t))]^f>>>8):55296>t||t>=57344?(f=i[255&(f^(224|t>>12))]^f>>>8,f=i[255&(f^(128|t>>6&63))]^f>>>8,f=i[255&(f^(128|63&t))]^f>>>8):(t=65536+((1023&t)<<10|1023&e.charCodeAt(++r)),f=i[255&(f^(240|t>>18))]^f>>>8,f=i[255&(f^(128|t>>12&63))]^f>>>8,f=i[255&(f^(128|t>>6&63))]^f>>>8,f=i[255&(f^(128|63&t))]^f>>>8);f^=o.initValue;var c="";return o.bytes>2&&(c+=s[f>>28&15]+s[f>>24&15]+s[f>>20&15]+s[f>>16&15]),c+=s[f>>12&15]+s[f>>8&15]+s[f>>4&15]+s[15&f]},p={};for(n=0;n<c.length;++n){var u=c[n];p[u.name]=u.method}if(a)module.exports=p;else{for(n=0;n<c.length;++n){var u=c[n];e[u.name]=u.method}i&&define(function(){return p})}}();
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports==="object"){factory(require("jquery"))}else{factory(jQuery)}})(function($,undef){var dataKey="plugin_hideShowPassword",shorthandArgs=["show","innerToggle"],SPACE=32,ENTER=13;var canSetInputAttribute=function(){var body=document.body,input=document.createElement("input"),result=true;if(!body){body=document.createElement("body")}input=body.appendChild(input);try{input.setAttribute("type","text")}catch(e){result=false}body.removeChild(input);return result}();function HideShowPassword(element,options){this.element=$(element);this.wrapperElement=$();this.toggleElement=$();this.init(options)}HideShowPassword.prototype={init:function(options){if(this.update(options,$.fn.hideShowPassword.defaults)){this.element.addClass(this.options.className);if(this.options.innerToggle){this.wrapElement(this.options.wrapper);this.initToggle(this.options.toggle);if(typeof this.options.innerToggle==="string"){this.toggleElement.hide();this.element.one(this.options.innerToggle,$.proxy(function(){this.toggleElement.show()},this))}}this.element.trigger(this.options.initEvent,[this])}},update:function(options,base){this.options=this.prepareOptions(options,base);if(this.updateElement()){this.element.trigger(this.options.changeEvent,[this]).trigger(this.state().changeEvent,[this])}return this.options.enable},toggle:function(showVal){showVal=showVal||"toggle";return this.update({show:showVal})},prepareOptions:function(options,base){var original=options||{},keyCodes=[],testElement;base=base||this.options;options=$.extend(true,{},base,options);if(original.hasOwnProperty("wrapper")&&original.wrapper.hasOwnProperty("inheritStyles")){options.wrapper.inheritStyles=original.wrapper.inheritStyles}if(options.enable){if(options.show==="toggle"){options.show=this.isType("hidden",options.states)}else if(options.show==="infer"){options.show=this.isType("shown",options.states)}if(options.toggle.position==="infer"){options.toggle.position=this.element.css("text-direction")==="rtl"?"left":"right"}if(!$.isArray(options.toggle.attachToKeyCodes)){if(options.toggle.attachToKeyCodes===true){testElement=$(options.toggle.element);switch(testElement.prop("tagName").toLowerCase()){case"button":case"input":break;case"a":if(testElement.filter("[href]").length){keyCodes.push(SPACE);break}default:keyCodes.push(SPACE,ENTER);break}}options.toggle.attachToKeyCodes=keyCodes}}return options},updateElement:function(){if(!this.options.enable||this.isType())return false;this.element.prop($.extend({},this.options.props,this.state().props)).addClass(this.state().className).removeClass(this.otherState().className);if(this.options.triggerOnToggle){this.element.trigger(this.options.triggerOnToggle,[this])}this.updateToggle();return true},isType:function(comparison,states){states=states||this.options.states;comparison=comparison||this.state(undef,undef,states).props.type;if(states[comparison]){comparison=states[comparison].props.type}return this.element.prop("type")===comparison},state:function(key,invert,states){states=states||this.options.states;if(key===undef){key=this.options.show}if(typeof key==="boolean"){key=key?"shown":"hidden"}if(invert){key=key==="shown"?"hidden":"shown"}return states[key]},otherState:function(key){return this.state(key,true)},wrapElement:function(options){var enforceWidth=options.enforceWidth,targetWidth;if(!this.wrapperElement.length){targetWidth=this.element.outerWidth();$.each(options.inheritStyles,$.proxy(function(index,prop){options.styles[prop]=this.element.css(prop)},this));this.element.css(options.innerElementStyles).wrap($(options.element).addClass(options.className).css(options.styles));this.wrapperElement=this.element.parent();if(enforceWidth===true){enforceWidth=this.wrapperElement.outerWidth()===targetWidth?false:targetWidth}if(enforceWidth!==false){this.wrapperElement.css("width",enforceWidth)}}return this.wrapperElement},initToggle:function(options){if(!this.toggleElement.length){this.toggleElement=$(options.element).attr(options.attr).addClass(options.className).css(options.styles).appendTo(this.wrapperElement);this.updateToggle();this.positionToggle(options.position,options.verticalAlign,options.offset);if(options.touchSupport){this.toggleElement.css(options.touchStyles);this.element.on(options.attachToTouchEvent,$.proxy(this.toggleTouchEvent,this))}else{this.toggleElement.on(options.attachToEvent,$.proxy(this.toggleEvent,this))}if(options.attachToKeyCodes.length){this.toggleElement.on(options.attachToKeyEvent,$.proxy(this.toggleKeyEvent,this))}}return this.toggleElement},positionToggle:function(position,verticalAlign,offset){var styles={};styles[position]=offset;switch(verticalAlign){case"top":case"bottom":styles[verticalAlign]=offset;break;case"middle":styles.top="50%";styles.marginTop=this.toggleElement.outerHeight()/-2;break}return this.toggleElement.css(styles)},updateToggle:function(state,otherState){var paddingProp,targetPadding;if(this.toggleElement.length){paddingProp="padding-"+this.options.toggle.position;state=state||this.state().toggle;otherState=otherState||this.otherState().toggle;this.toggleElement.attr(state.attr).addClass(state.className).removeClass(otherState.className).html(state.content);targetPadding=this.toggleElement.outerWidth()+this.options.toggle.offset*2;if(this.element.css(paddingProp)!==targetPadding){this.element.css(paddingProp,targetPadding)}}return this.toggleElement},toggleEvent:function(event){event.preventDefault();this.toggle()},toggleKeyEvent:function(event){$.each(this.options.toggle.attachToKeyCodes,$.proxy(function(index,keyCode){if(event.which===keyCode){this.toggleEvent(event);return false}},this))},toggleTouchEvent:function(event){var toggleX=this.toggleElement.offset().left,eventX,lesser,greater;if(toggleX){eventX=event.pageX||event.originalEvent.pageX;if(this.options.toggle.position==="left"){toggleX+=this.toggleElement.outerWidth();lesser=eventX;greater=toggleX}else{lesser=toggleX;greater=eventX}if(greater>=lesser){this.toggleEvent(event)}}}};$.fn.hideShowPassword=function(){var options={};$.each(arguments,function(index,value){var newOptions={};if(typeof value==="object"){newOptions=value}else if(shorthandArgs[index]){newOptions[shorthandArgs[index]]=value}else{return false}$.extend(true,options,newOptions)});return this.each(function(){var $this=$(this),data=$this.data(dataKey);if(data){data.update(options)}else{$this.data(dataKey,new HideShowPassword(this,options))}})};$.each({show:true,hide:false,toggle:"toggle"},function(verb,showVal){$.fn[verb+"Password"]=function(innerToggle,options){return this.hideShowPassword(showVal,innerToggle,options)}});$.fn.hideShowPassword.defaults={show:"infer",innerToggle:false,enable:canSetInputAttribute,triggerOnToggle:false,className:"hideShowPassword-field",initEvent:"hideShowPasswordInit",changeEvent:"passwordVisibilityChange",props:{autocapitalize:"off",autocomplete:"off",autocorrect:"off",spellcheck:"false"},toggle:{element:'<button type="button">',className:"hideShowPassword-toggle",touchSupport:typeof Modernizr==="undefined"?false:Modernizr.touchevents,attachToEvent:"click.hideShowPassword",attachToTouchEvent:"touchstart.hideShowPassword mousedown.hideShowPassword",attachToKeyEvent:"keyup",attachToKeyCodes:true,styles:{position:"absolute"},touchStyles:{pointerEvents:"none"},position:"infer",verticalAlign:"middle",offset:0,attr:{tabindex:"-1",role:"button","aria-label":"Show password",title:"Show password",tabIndex:0}},wrapper:{element:"<div>",className:"hideShowPassword-wrapper",enforceWidth:true,styles:{position:"relative"},inheritStyles:["display","verticalAlign","marginTop","marginRight","marginBottom","marginLeft"],innerElementStyles:{marginTop:0,marginRight:0,marginBottom:0,marginLeft:0}},states:{shown:{className:"hideShowPassword-shown",changeEvent:"passwordShown",props:{type:"text"},toggle:{className:"hideShowPassword-toggle-hide",content:"Hide",attr:{tabindex:"-1","aria-pressed":"true",title:"Hide password"}}},hidden:{className:"hideShowPassword-hidden",changeEvent:"passwordHidden",props:{type:"password"},toggle:{className:"hideShowPassword-toggle-show",content:"Show",attr:{tabindex:"-1","aria-pressed":"false",title:"Show password"}}}}}});
(function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"==typeof window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,b.base64js=a()}})(function(){return function(){function b(d,e,g){function a(j,i){if(!e[j]){if(!d[j]){var f="function"==typeof require&&require;if(!i&&f)return f(j,!0);if(h)return h(j,!0);var c=new Error("Cannot find module '"+j+"'");throw c.code="MODULE_NOT_FOUND",c}var k=e[j]={exports:{}};d[j][0].call(k.exports,function(b){var c=d[j][1][b];return a(c||b)},k,k.exports,b,d,e,g)}return e[j].exports}for(var h="function"==typeof require&&require,c=0;c<g.length;c++)a(g[c]);return a}return b}()({"/":[function(a,b,c){'use strict';function d(a){var b=a.length;if(0<b%4)throw new Error("Invalid string. Length must be a multiple of 4");var c=a.indexOf("=");-1===c&&(c=b);var d=c===b?0:4-c%4;return[c,d]}function e(a,b,c){return 3*(b+c)/4-c}function f(a){var b,c,f=d(a),g=f[0],h=f[1],j=new m(e(a,g,h)),k=0,n=0<h?g-4:g;for(c=0;c<n;c+=4)b=l[a.charCodeAt(c)]<<18|l[a.charCodeAt(c+1)]<<12|l[a.charCodeAt(c+2)]<<6|l[a.charCodeAt(c+3)],j[k++]=255&b>>16,j[k++]=255&b>>8,j[k++]=255&b;return 2===h&&(b=l[a.charCodeAt(c)]<<2|l[a.charCodeAt(c+1)]>>4,j[k++]=255&b),1===h&&(b=l[a.charCodeAt(c)]<<10|l[a.charCodeAt(c+1)]<<4|l[a.charCodeAt(c+2)]>>2,j[k++]=255&b>>8,j[k++]=255&b),j}function g(a){return k[63&a>>18]+k[63&a>>12]+k[63&a>>6]+k[63&a]}function h(a,b,c){for(var d,e=[],f=b;f<c;f+=3)d=(16711680&a[f]<<16)+(65280&a[f+1]<<8)+(255&a[f+2]),e.push(g(d));return e.join("")}function j(a){for(var b,c=a.length,d=c%3,e=[],f=16383,g=0,j=c-d;g<j;g+=f)e.push(h(a,g,g+f>j?j:g+f));return 1===d?(b=a[c-1],e.push(k[b>>2]+k[63&b<<4]+"==")):2===d&&(b=(a[c-2]<<8)+a[c-1],e.push(k[b>>10]+k[63&b>>4]+k[63&b<<2]+"=")),e.join("")}c.byteLength=function(a){var b=d(a),c=b[0],e=b[1];return 3*(c+e)/4-e},c.toByteArray=f,c.fromByteArray=j;for(var k=[],l=[],m="undefined"==typeof Uint8Array?Array:Uint8Array,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=0,p=n.length;o<p;++o)k[o]=n[o],l[n.charCodeAt(o)]=o;l[45]=62,l[95]=63},{}]},{},[])("/")});
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info
*
**/
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    , encode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend
        return output;
    } // End Function encode
    ,decode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }
        } // Whend
        output = Base64._utf8_decode(output);
        return output;
    } // End Function decode
    ,_utf8_encode: function (string)
    {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");
        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);
            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        } // Next n
        return utftext;
    } // End Function _utf8_encode
    ,_utf8_decode: function (utftext)
    {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;
        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);
            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        } // Whend
        return string;
    } // End Function _utf8_decode
}
