/*
  tinymceBubbleBar.js
  First of its kind native plugin for all modes of TinyMCE
  https://github.com/donShakespeare/tinymceBubbleBar
  Demo: http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html
  (c) 2015 by donShakespeare for MODx awesome TinymceWrapper
  Usage:
  tinymce.init({
    selector: "#myEditor",
    menubar: false, //or true
    toolbar: "bold italic underline bubbleBarOptionsButton", //add optional button for sticky bar
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // plugin location
    }
});
*/
var $ = jQuery;
var inlineGoodPracticeCSS = "#rwizard_wrapper .rdgm-mce-bubbleBar{position:absolute !important;z-index:9999;border-radius:5px;box-shadow:0 2px 8px rgba(0,0,0,.75);opacity:1!important;visibility:hidden}.rdgm-mce-bubbleBar.mce-tbActiveBar{position:absolute !important;z-index:9;opacity:.95!important;visibility:visible!important;animation:tinyBubble-pop-upwards 180ms forwards linear}.rdgm-mce-bubbleBar.rdgm-mce-bubbleBarSticky{visibility:visible!important;opacity:1!important;}@keyframes tinyBubble-pop-upwards{0%{opacity:0;transform:matrix(.97,0,0,1,0,12)}20%{opacity:.7;transform:matrix(.99,0,0,1,0,2)}40%{opacity:1;transform:matrix(1,0,0,1,0,-1)}100%{transform:matrix(1,0,0,1,0,0)}}";
$('head').append('<style>'+inlineGoodPracticeCSS+'</style>')
function fineTuneBarPosition(editor, range, bar) {
  var edges = range.getBoundingClientRect(),
    middleEdges = (edges.left + edges.right) / 2,
    barHeight = bar.outerHeight(),
    barWidth = bar.outerWidth(),
    middleBar = barWidth / 2,
    leftExtremist = 0,
    leftAnchor = leftExtremist - middleBar,
    windowWidth = $(window).innerWidth(),
    windowHeight = $(window).innerHeight(),
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
    extraPadding = 10,
    bubbleBarCSSstyle = editor.getParam("bubbleBarCSSstyle") ? editor.getParam("bubbleBarCSSstyle") : '';
  if (editor.getParam('inline')) {
    var thisEditor = $("#" + editor.id);
    var top = edges.top + window.pageYOffset - barHeight - extraPadding;
    if (edges.top < bar.height()) {
      var top = edges.top + window.pageYOffset + barHeight;
    }
  }
  else {
    var thisEditor = $(editor.getContainer());
    var top = edges.top - barHeight - extraPadding;
    if (edges.top < scrollTop || top < scrollTop) {
      var top = edges.bottom + extraPadding;
    }
  }
  if (middleEdges < middleBar) {
    var left = leftAnchor + middleBar;
  } else if ((windowWidth - middleEdges) < middleBar) {
    var left = windowWidth + leftAnchor - middleBar - extraPadding;
  } else {
    var left = leftAnchor + middleEdges + extraPadding;
  }
  bar.addClass('mce-tbActiveBar')
  .attr('style',bubbleBarCSSstyle)
  .css({
    "top": top,
    "left": left
  })
}
function bubbleUp(editor, addClass) {
  if (addClass == 'addClass') {
    if (editor.getParam("inline")) {
      var thisEd = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var thisEd = $(editor.getContainer()).find(".mce-toolbar-grp")
    }
    thisEd.addClass("rdgm-mce-bubbleBar")
  }
  if (addClass == 'addClassSticky') {
    if (editor.getParam("inline")) {
      var thisEd = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var thisEd = $(editor.getContainer()).find(".mce-toolbar-grp")
    }
    if (thisEd.hasClass("rdgm-mce-bubbleBarSticky")){
      thisEd.removeClass("rdgm-mce-bubbleBarSticky")
    }
    else{
      thisEd.addClass("rdgm-mce-bubbleBarSticky")
    }
  }
  setTimeout(function() {
    var range = editor.selection.getRng(true);
    var rangey = "" + range + "";
    if (editor.getParam("inline")) {
      var bar = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var bar = $(editor.getContainer()).find(".mce-toolbar-grp");
    }
    if (rangey.trim() !== '') {
      if (document_rdgm_bubblebar_enabled_b) {
        fineTuneBarPosition(editor, range, bar);
      }
    } else {
      $('.rdgm-mce-bubbleBar').removeClass('mce-tbActiveBar')
    }
  }, 100)
}
function wordCount(editor) {
  var countre = editor.getParam('wordcount_countregex', /[\w\u2019\x27\-\u00C0-\u1FFF]+/g);
  var cleanre = editor.getParam('wordcount_cleanregex', /[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g);
  var thisBody = editor.getContent({format: 'raw'});
  var selCount = editor.selection.getContent();
  var words = 0;
  var xters = 0;
  var selW = 0;
  var selC = 0;
  if (thisBody) {
    if(selCount){
      if(selCount !== '') {
        var selC = selCount.length;
        var sel = selCount.replace(/\.\.\./g, ' ').replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, ' ').replace(cleanre, '');
        var selArray = sel.match(countre);
        if (selArray) {
          selW = selArray.length;
        }
      }
    }
    var tx = thisBody.replace(/\.\.\./g, ' ').replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, ' ').replace(cleanre, '');
    var wordArray = tx.match(countre);
    var xtersArray = $(editor.getBody()).text().length;
    if (wordArray) {
      words = wordArray.length;
    }
    if (xtersArray) {
      xters = xtersArray;
    }
  }
  $(".mce-npSelCount span.mce-text").text("Selected Words: " + selW + ", Characters: " + selC);
  $(".mce-npCount span.mce-text").text("Total Word Count: " + words);
  $(".mce-npCSCount span.mce-text").text("Total Characters (+spaces): " + xters);
  $(".mce-npPCount span.mce-text").text("Total Paragraphs: " + $(editor.getBody()).find("p").length);
}
tinymce.PluginManager.add('bubbleBar', function(editor) {
  editor.addCommand('tinymceBubbleBar', function(){});
  editor.on("init", function() {
    bubbleUp(editor, "addClass");
    editor.settings.tinymceBubbleBar = true;
  })
  editor.on('mouseup keyup', function() {
    bubbleUp(editor)
  })
  editor.on('blur', function() {
    $('.rdgm-mce-bubbleBar').removeClass('mce-tbActiveBar')
  })
  editor.on('focus mouseup keyup change', function() {
    wordCount(editor)
  })
  editor.on('DblClick', function(e) {
    if (e.target.nodeName == 'IMG') {
      editor.execCommand('mceImage', true);
    }
    if (e.target.nodeName == 'A') {
      editor.execCommand('mceLink', true);
    }
  });
  editor.addButton('bubbleBarOptionsButton', {
    type: "menubutton",
    text: "...",
    classes: editor.id+ " bubbleBarOptionsButton",
    tooltip: 'tinymceBubbleBar options',
    autohide: false,
    onclick:function(){
      setTimeout(function(){
        wordCount(editor)
      },200)
    },
    onPostRender:function(){
    },
    menu:[
      {
        text: "Toggle Sticky",
        onclick: function(){
          bubbleUp(editor, "addClassSticky")
        }
      },
      {
        text: "Total Word Count: 000000",
        classes: "npCount",
        menu:[
          {
            classes: "npCSCount",
            text: "Total Characters (+spaces): 0000000",
            onPostRender: function(){
              setTimeout(function(){
                  wordCount(editor)
                },200)
            }
          },
          {
            classes: "npPCount",
            text: "Total Paragraphs: 000000 "
          },
          {
            classes: "npSelCount",
            text: "Selected Words: 000, Characters: 0000"
          }
        ]
      }
    ]
  })
})
