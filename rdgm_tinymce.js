(function() {
   const debug = false;
   tinymce.create ('tinymce.plugins.rdgm_tinymce', {
      init: function (ed) {
         if (debug) {
            console.log ('[rdgm_tinymce > init] ed:', ed);
         }
         if (ed.id == 'content'
                      || jQuery (ed.targetElm).hasClass ('wp-editor-area')
                      || jQuery (ed.targetElm).hasClass ('wp-block-freeform')) {
            run_rdgm_edit (ed);
            if (typeof rdgm_edit_params != 'undefined') {
                  if (debug) {
                     console.log ('[rdgm_tinymce > init] diagrams');
                  }
                  ed.addButton ('button_swhs', {
                     title:   'Swinging Hotspot wizard',
                     image:   rdgm_edit_params.url + 'images/icon_swhs.svg',
                     onclick: function () {
                        if (typeof (rdgm_edit) == 'undefined') {
                           pre_rdgm_edit.load_rdgm_edit_if_needed (ed, false, true);
                        } else {
                           rdgm_edit.show_main_menu (ed, false, true);
                        }
                     }
                  });
            }
         }
      },
      createControl : function (n, cm) {
         return null;
      },
   });
   tinymce.PluginManager.add ( 'rdgm_edit_button_script', tinymce.plugins.rdgm_tinymce );
   function run_rdgm_edit (ed) {
      function run_pre_rdgm_edit () {
         if (debug) {
            var msec = new Date ().getTime ();
            console.log ('[rdgm_tinymce.js > run_pre_rdgm_edit] msec', msec);
         }
         if (typeof (pre_rdgm_edit) == 'undefined') {
            setTimeout (run_pre_rdgm_edit, 10);
         } else {
            pre_rdgm_edit.load_rdgm_edit_if_needed (ed);
         }
      }
      setTimeout (run_pre_rdgm_edit, 10);
   }
})();
