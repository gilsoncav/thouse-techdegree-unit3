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
      //filter the colors by js puns
      $selColor.children().each(function() {
        $(this).removeAttr('disabled');
        $(this).show();
        if (/js puns/i.test($(this).text())) $(this).show();
        if (/js shirt/i.test($(this).text())) $(this).hide();
      });
      break;
    case 'heart js':
      //filter the colors by hearts
      $selColor.children().each(function() {
        $(this).removeAttr('disabled');
        $(this).show();
        if (/js puns/i.test($(this).text())) $(this).hide();
        if (/js shirt/i.test($(this).text())) $(this).show();
      });
      break;
    default:
      //disable and clean color selector
      $selColor.attr('disabled', 'disabled');
  }
  $selColor.prop('selectedIndex', 0);
});

//todo handler of checkboxes inside activities fieldset
const $fieldsetActivities = $('.activities');

$fieldsetActivities.on('change', function(e) {
  console.log(this);
  console.log(e.target);
  // if was checked
  if (e.target.checked) {
    //todo disable other checkboxes that conflicts the time
    //todo add the value from the total sum
  } else {
    // is was unchecked
    //todo re-enable other checkboxes that conflicts the time
    //todo subtract the value from the total sum
  }
});

/**
 * Helper function to properly disable / enable the activity to the user
 * and visually cue the user
 *
 * @param {*} label
 * @param {bool} status The new status true to enable, false to disable
 */
function changeActivityStatus(checkboxInput) {
  $('.activities input:not(checked)').each(function() {
    const strDayAndTime = $(this).data('day-and-time');
    if (strDayAndTime !== undefined) {
      const dayTimeArray = strDayAndTime.match(
        /^(\w+) (\d+)(am|pm)-(\d+)(am|pm)$/
      );
      const day = dayTimeArray[1];
      // getting start time in 24h pattern
      const timeStart =
        dayTimeArray[3] === 'am'
          ? parseInt(dayTimeArray[2])
          : parseInt(dayTimeArray[2]) + 12;
      const timeEnd =
        dayTimeArray[5] === 'am'
          ? parseInt(dayTimeArray[4])
          : parseInt(dayTimeArray[4]) + 12;
      const cost = parseInt($(this).data('cost'));
      console.log(day);
    }
  });
}

changeActivityStatus();
