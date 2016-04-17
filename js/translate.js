jQuery(function($) {
  'use strict';

  // Function to call the SYSTRAN Translate Api translate/
  function translate(source, target, content, callback) {
    $.ajax({
      method:'GET',
      url: 'https://api-platform.systran.net/translation/text/translate?key=2f87f09d-4cc0-4ea3-af8e-5efce9a7e139',
      dataType: 'text',
      data: {
        source: source,
        target: target,
        input: content
      },
      success: function(data) {
        if (typeof data === 'string')
          try {
            data = JSON.parse(data);
          } catch (exp) {

          }

        var err;

        if (data && data.outputs && Array.isArray(data.outputs)) {
          data = data.outputs[0];

          if (data && data.output)
            data = data.output;

          if (data && data.error)
            err = data.error;
        }

        callback(err, data);
      },
      error: function(xhr, status, err) {
        callback(err);
      }
    });
  }

  function getTextFromHtml(content) {
    content = content.replace(/<div>(?:<br>)?/gi, '\n').replace(/<\/div>/gi, '');
    content = content.replace(/<p>&nbsp;<\/p>/gi, '\n').replace(/<p>/gi, '').replace(/\n*<\/p>/gi, '\n');
    content = content.replace(/<br[ \/]*>/gi, '\n');
    content = content.replace(/&nbsp;/gi, ' ');
    content = content.replace(/<([^> ]*)[^>]*>/gi, '');  //clean html markup
    content = content.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">"); //unescape some entities
    return content;
  }

  var $inputTextEditor = $('#inputTextEditorEN');
  var $outputTextEditor = $('#outputTextEditorEN');
  var $translating = $('#translating');
  var $source = 'en';
  var $target = 'nl';

  function launchTranslation(inputText, toTranslate) {
    $translating.removeClass('hidden');
    //Extract text to translate
    //var toTranslate = getTextFromHtml($inputTextEditor.html());
    translate($source, $target, toTranslate, function(err, result) {
      $translating.addClass('hidden');
      if (!err) {
        //Show result
        $('#' + inputText).val(result);
      } else {
        if (console.log)
            console.log('Error while doing translation: ' + err);
      }
    });
  }

  function translateSpecific(lang){
    if (lang == "en"){
        //alert(lang);
        var toTranslate = $('#inputTextEditorEN').val();
        $source = lang;
        $target = 'nl';
        launchTranslation('inputTextEditorNL', toTranslate);
        $target = 'fr';
        launchTranslation('inputTextEditorFR', toTranslate);
    }
    if (lang == "fr"){
        //alert(lang);
        var toTranslate = $('#inputTextEditorFR').val();
        $source = lang;
        $target = 'nl';
        launchTranslation('inputTextEditorNL', toTranslate);
        $source = lang;
        $target = 'en';
        launchTranslation('inputTextEditorEN', toTranslate);
    }
    if (lang == "nl"){
        //alert(lang);
        var toTranslate = $('#inputTextEditorNL').val();
         $source = lang;
         $target = 'en';
         launchTranslation('inputTextEditorEN', toTranslate);
         $target = 'fr';
         launchTranslation('inputTextEditorFR', toTranslate);
    }
  }

  //$('#translateButton').click(launchTranslation);
  $('#translateButtonEN').click(function(){translateSpecific('en');});
  $('#translateButtonFR').click(function(){translateSpecific('fr');});
  $('#translateButtonNL').click(function(){translateSpecific('nl');});
  $('#inputTextEditorEN').keypress(function (e) {
    if (e.which == 13) {
      translateSpecific('en');
    }
  });
  $('#inputTextEditorFR').keypress(function (e) {
      if (e.which == 13) {
        translateSpecific('fr');
      }
    });
   $('#inputTextEditorNL').keypress(function (e) {
       if (e.which == 13) {
         translateSpecific('nl');
       }
     });
  translateSpecific('en');
});