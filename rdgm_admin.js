const $ = jQuery;
var rdgm_admin_debug = false;
var t_strings;
$ (document).ready (function () {
      t_strings = [
         'Bars',
         'bin',
         'Click to highlight student',
         'Come back later to see more finish times',
         'Correct!',
         'Correctly clicked',
         'Correctly labeled',
         'cutoff',
         'Done:',
         'eight',
         'Error found',
         'Errors found',
         'Everyone',
         'Excellent!',
         'faster',
         'Few or no results available for',
         'Finish time (min:sec)',
         'Finish time:',
         'five',
         'Found',
         'four',
         'Good!',
         'Great!',
         'Identify yourself - initials, other characters, or emojis! (optional)',
         'independent students',
         'Independent students',
         'It took you %s tries',
         'It took you one try',
         'items',
         'nine',
         'No, that\'s not correct.',
         'Now click on:',
         'Number done',
         'one',
         'Only one independent student has taken this quiz.',
         'Only one person in your class has taken this quiz.',
         'out of',
         'Please try again',
         'Quizzes done by your class',
         'Quizzes done by your classes',
         'Quizzes done most recently by independent students',
         'Quizzes done most recently',
         'Rank:',
         'seven',
         'Show/hide emoji picker',
         'Showing results for everyone',
         'six',
         'Sorry, no.',
         'Sorry, that\'s not correct.',
         'Student',
         'ten',
         'These initials have already been used by someone else',
         'three',
         'times this quiz',
         'to identify these items',
         'to identify this item',
         'two',
         'Visited',
         'When done',
         'within',
         'You can enter your initials',
         'You identified all of the items on the first try!',
         'You&rsquo;re the first independent student to take this quiz!',
         'You&rsquo;re the first person in your class to take this quiz!',
         'You',
         'you',
         'Your class',
         'your class',
         'zero'
      ]; // t_strings
   $ ('form[action="options.php"]').attr ('onSubmit', 'return check_translate_strings_and_submit()');
   $ ('#t_strings_select').autocomplete ({
      source:        t_strings,
      classes:       {'ui-autocomplete': 'rdgm_tstrings_suggestions'},
      minLength:     3,
      select:        add_tstring_to_rdgm_translate_strings
   });
});
function set_tstrings_to_show (checkbox_el) {
   if (checkbox_el.checked) {
      $ ('#t_strings_select').autocomplete ('option', 'minLength', 0)
                             .attr ('placeholder', 'Type letters')
                             .focus ();
   } else {
      $ ('#t_strings_select').autocomplete ('option', 'minLength', 3)
                             .attr ('placeholder', 'Type three or more letters');
   }
}
function check_translate_strings_and_submit () {
   if (rdgm_admin_debug) {
      console.log ('[check_translate_strings_and_submit]');
   }
   var errmsgs = '';
   const $rdgm_translate_strings = $ ('textarea#rdgm_translate_strings');
   var old_new_strings = $rdgm_translate_strings.val ();
   var updated_strings = [];
   if (old_new_strings) {
      var updated = false;
      old_new_strings = old_new_strings.split ('\n');
      const n_old_new_strings = old_new_strings.length;
      for (var i=0; i<n_old_new_strings; i++) {
         if (old_new_strings[i].search (/\S/) == -1) {
            updated = true;
            continue
         }
         const fields = old_new_strings[i].split (';');
         const old_string = fields[0];
         const new_string = fields[1];
         if (t_strings.indexOf (old_string) == -1) {
            const r = dquo ();
            errmsgs += 'Phrase to translate, ' + r.ldquo + old_string + r.rdquo + ' does not match an existing phrase\n';
         }
         if (new_string.search (/\S/) == -1) {
            const r = dquo ();
            errmsgs += 'No translation entered (after semicolon) for ' + r.ldquo + old_string + r.rdquo + '\n';
         }
         updated_strings.push (old_new_strings[i]);
      }
      if (updated) {
         $rdgm_translate_strings.val (updated_strings.join ('\n'));
      }
   }
   if (errmsgs) {
      alert (errmsgs);
      return false;
   }
}
var ldquo = '';
var rdquo = '';
function dquo () {
   if (! ldquo) {
      const ldquo_el = document.createElement ('div');
      ldquo_el.innerHTML = '&ldquo;';
      ldquo = ldquo_el.innerHTML;
      const rdquo_el = document.createElement ('div');
      rdquo_el.innerHTML = '&rdquo;';
      rdquo = rdquo_el.innerHTML;
   }
   return {ldquo: ldquo, rdquo: rdquo};
}
function add_tstring_to_rdgm_translate_strings (event, ui) {
   if (rdgm_admin_debug) {
      console.log ('[add_tstring_to_rdgm_translate_strings] ui:', ui);
   }
   const delay_clear = function () {
      $ ('#t_strings_select').val ('');
   }
   setTimeout (delay_clear, 200);
   const $rdgm_translate_strings = $ ('textarea#rdgm_translate_strings');
   const string_to_translate = ui.item.value;
   var old_new_strings = $rdgm_translate_strings.val ();
   var updated_strings = [];
   var existing_old_new = '';
   if (old_new_strings) {
      old_new_strings = old_new_strings.split ('\n');
      const n_old_new_strings = old_new_strings.length;
      for (var i=0; i<n_old_new_strings; i++) {
         const old_string = old_new_strings[i].split (';')[0];
         if (old_string != string_to_translate) {
            updated_strings.push (old_new_strings[i]);
         } else {
            existing_old_new = old_new_strings[i];
         }
      }
   }
   if (existing_old_new) {
      updated_strings.push (existing_old_new);
   } else {
      updated_strings.push (string_to_translate + '; ');
   }
   $rdgm_translate_strings.val (updated_strings.join ('\n'));
   $rdgm_translate_strings.focus ();
}
