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

// Handler of checkboxes inside activities fieldset
const $fieldsetActivities = $('.activities');

$fieldsetActivities.on('change', function(e) {
  // if was checked
  // Disable (OR Enable) other checkboxes that conflicts the time
  refreshOtherActivities($(e.target));
  //TODO Add or subtract the value from the total sum
  sumValues();
});

/**
 * Helper function to properly disable / enable the activity to the user
 * and visually cue the user
 *
 * @param {*} label
 * @param {bool} status The new status true to enable, false to disable
 */
function refreshOtherActivities($checkboxInput) {
  const checkedActivityCheckbox = parseActivity($checkboxInput);
  $('.activities :checkbox:not(:checked)').each(function() {
    const otherNonCheckedActivityCheckbox = parseActivity($(this));
    // if the day is the same
    if (otherNonCheckedActivityCheckbox.day === checkedActivityCheckbox.day) {
      // if timeStart is in between the start time and end time
      if (
        otherNonCheckedActivityCheckbox.timeStart >=
          checkedActivityCheckbox.timeStart &&
        otherNonCheckedActivityCheckbox.timeStart <
          checkedActivityCheckbox.timeEnd
      ) {
        if ($checkboxInput.prop('checked')) {
          // disable the checkable activity
          $(this).attr('disabled', 'disabled');
          $(this)
            .parent()
            .addClass('conflicted');
        } else {
          $(this).removeAttr('disabled');
          $(this)
            .parent()
            .removeClass('conflicted');
        }
      }
    }
  });
}

function parseActivity($checkboxInput) {
  const newActivityObj = {
    $originalCheckbox: $checkboxInput
  };
  const strDayAndTime = $checkboxInput.data('day-and-time');
  const cost = parseInt($checkboxInput.data('cost'));
  const regexToParseDayTimeCost = /^(\w+) (\d+)(am|pm)-(\d+)(am|pm)$/;
  newActivityObj.cost = cost;
  if (strDayAndTime !== undefined) {
    // extract captured info in an Array
    const dayTimeArray = strDayAndTime.match(regexToParseDayTimeCost);
    // extracting info from the array into specific variables
    const day = dayTimeArray[1];
    const timeStart = ampmTo24h(dayTimeArray[2], dayTimeArray[3]);
    const timeEnd = ampmTo24h(dayTimeArray[4], dayTimeArray[5]);

    newActivityObj.day = day;
    newActivityObj.timeStart = timeStart;
    newActivityObj.timeEnd = timeEnd;
  }
  return newActivityObj;
}

/**
 * Helper function to convert the hour parsed in a AM PM format to a 24h standard
 *
 * @param {String} hour
 * @param {String} ampm String with 'am' or 'pm'
 * @returns {Number} The hour converted in 24h standard
 */
function ampmTo24h(hour, ampm) {
  return ampm === 'am' || (ampm === 'pm' && hour === '12')
    ? parseInt(hour)
    : parseInt(hour) + 12;
}

/**
 * Shows the sum of all selected Activities cost in the dedicated paragraph
 */
function sumValues() {
  let total = 0;
  $('.activities input:checkbox:checked').each(function() {
    const cost = parseActivity($(this)).cost;
    total += cost;
  });
  $('.activities .js-total-value strong').text(total);
}
