// focus on name field after loading the page
$('#name').focus();

// job role behaviour...
const $txtOtherTitle = $('#txt-other-title');
$txtOtherTitle.hide();

$('#title').on('change', e => {
  // Adds or remove other-title field if it's needed
  if ($(e.target).val() === 'other') {
    $txtOtherTitle.show();
  } else {
    $txtOtherTitle.hide();
  }
});

console.log($('#design'));

const $selColor = $('#color');
$selColor.attr('disabled', 'disabled');
$selColor.children().each(function() {
  $(this).attr('disabled', 'disabled');
});

$('#design').on('change', e => {
  $selColor.removeAttr('disabled');
  switch ($('#design').val()) {
    case 'js puns':
      //todo filter the colors by js puns
      $selColor.children().each(function() {
        $(this).removeAttr('disabled');
        $(this).show();
        if (/js puns/i.test($(this).text())) $(this).show();
        if (/js shirt/i.test($(this).text())) $(this).hide();
      });
      break;
    case 'heart js':
      //todo filter the colors by hearts
      $selColor.children().each(function() {
        $(this).removeAttr('disabled');
        $(this).show();
        if (/js puns/i.test($(this).text())) $(this).hide();
        if (/js shirt/i.test($(this).text())) $(this).show();
      });
      break;
    default:
      //todo disable and clean color selector
      $selColor.attr('disabled', 'disabled');
  }
  $selColor.prop('selectedIndex', 0);
});
