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

/**
 * Set initial state of the T-Shirt section
 */
const $selColor = $('#color');
$('#colors-js-puns').hide();
$selColor.attr('disabled', 'disabled');
$selColor
  .children()
  .eq(0)
  .remove();
$selColor.children().each(function() {
  $(this).attr('disabled', 'disabled');
});

/**
 * Listener to changes from the Design SELECT to filter, activate and
 * deactivate the Color SELECT.
 */
$('#design').on('change', e => {
  $selColor.removeAttr('disabled');
  $('#colors-js-puns').show();
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
      $('#colors-js-puns').hide();
  }
  $selColor.prop('selectedIndex', 0);
});

// Handler of checkboxes inside activities fieldset
const $fieldsetActivities = $('.activities');

$fieldsetActivities.on('change', function(e) {
  // if was checked
  // Disable (OR Enable) other checkboxes that conflicts the time
  refreshOtherActivities($(e.target));
  validateActivitiesCheckboxesShowOrHideError(false);
  // Add or subtract the value from the total sum
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
          // make sure to enable the activity
          $(this).removeAttr('disabled');
          $(this)
            .parent()
            .removeClass('conflicted');
        }
      }
    }
  });
}

/**
 * Parse data from the activity element data attributes and builds an
 * object representing the activity to return
 *
 * @param {*} $checkboxInput
 * @returns {Object} An object that represents the activity with a day, timeStart,
 * timeEnd and cost properties
 */
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

/**
 * Sets the initial state of the Payment section
 */

// Hide all payments sections
$('#paypal').hide();
$('#bitcoin').hide();
$('#payment option[value^="select"]').attr('disabled', 'disabled');
// Setting the default payment option
$('#payment option[value="credit card"]').attr('selected', true);

/**
 * Sets listener for changes in the Payment type SELECT element to
 * show or hide proper sections according to the selected type
 */
$('#payment').on('change', e => {
  switch ($('#payment').val()) {
    case 'credit card':
      $('#credit-card').show();
      $('#paypal').hide();
      $('#bitcoin').hide();
      break;
    case 'paypal':
      $('#credit-card').hide();
      $('#paypal').show();
      $('#bitcoin').hide();
      break;
    case 'bitcoin':
      $('#credit-card').hide();
      $('#paypal').hide();
      $('#bitcoin').show();
      break;
  }
});

/**
 * Adds dynamically listeners to all INPUT elements in the form of the types
 * TEXT and EMAIL
 */
function addValidationListenerAllFields() {
  $('input[type="text"], input[type="email"]').each(function() {
    addValidationListener($(this));
    // disable autocompletion for these fields
    $(this).attr('autocomplete', 'off');
  });
}

/**
 * Helper function that just adds a validation listener for a field that
 * has an HTML custom attribute named "regexp" that must contains a
 * string with a Regular Expression to validate the field.
 *
 * @param {*} $input
 */
function addValidationListener($input) {
  // if the INPUT TEXT field has a regexp to validate it's value
  if ($input.attr('regexp')) {
    $input.on('keyup', e => {
      validateFieldShowOrHideError($input);
    });
  }
}

/**
 * Validates a field value.
 * If you want a field to be checked you must define the following attributes
 * in the HTML INPUT field (text or email):
 * It visually adds a visual alert with the proper error message to the user.
 *
 * `regexp` The regular expression to test the input value against. If you want
 * the field not to be checked, simply don't define this attribute.
 * `blankErrorMsg` The string message that you want to be shown if the field
 * was left empty. If you want to allow the field to be empty in form submission
 * simply don't define this attribute
 * `partialErrorMsg` The error message if the typed value of the INPUT does not
 * satisfy the regexp pattern.
 *
 * @param {jQuery INPUT} $input The INPUT field to be checked
 * @returns true If the field was validated with no errors
 */
function validateFieldShowOrHideError($input) {
  if ($input.attr('regexp')) {
    let errorMsg = 'noerror';

    // Check if there is an error (being empty) or if there is a
    // partial input that is not satisfying the regexp
    if ($input.val() === '') {
      errorMsg = $input.attr('blankErrorMsg');
    } else {
      const regexp = new RegExp($input.attr('regexp'), 'i');
      if (!regexp.test($input.val())) {
        errorMsg = $input.attr('partialErrorMsg');
      }
    }

    // removes any previous shown error alerts for this input
    removeErrorAlert($input);
    // If there is an error to show, appends a new error alert
    if (errorMsg !== 'noerror') {
      appendErrorAlert($input, errorMsg);
    }
    // returns true if there was no error
    return errorMsg === 'noerror';
  }
}

/**
 * Validates if there is at least one checkbox checked.
 * returns true if there is at least one checkbox selected.
 *
 * @param {*} validationErrorOccurred if there was an previous validation error
 * in any other field.
 * @returns true If there isn't any checkbox selected
 */
function validateActivitiesCheckboxesShowOrHideError(validationErrorOccurred) {
  removeErrorAlert($('.activities legend'));
  if ($('.activities input[type="checkbox"]:checked').length === 0) {
    appendErrorAlert(
      $('.activities legend'),
      'Please select at least one activity!'
    );
    if (!validationErrorOccurred)
      $('.activities input[type="checkbox"]:first').focus();
    return false;
  } else {
    return true;
  }
}

/**
 * Helper function to visually remove an error alert callout of
 * an form element
 *
 * @param {*} $formElement
 */
function removeErrorAlert($formElement) {
  if ($formElement.next('.js-error-alert').length > 0) {
    $formElement.next('.js-error-alert').remove();
  }
  $formElement.removeClass('error');
}

function appendErrorAlert($formElement, errorMsg) {
  $formElement.addClass('error');
  // if there is no error alert div already
  $formElement.after($(`<div class="js-error-alert">${errorMsg}</div>`));
}

/**
 * Sets listener to the form submission to assert that validations be enforced
 * before submission.
 */
$('form').on('submit', e => {
  console.log('COMMENT: submission prevented in code!');

  let validationErrorOccurred = false;

  // Browse all INPUT elements that are visible and need to be validated before
  // submission
  let $firstElementWithError;

  $('input[type="text"]:visible, input[type="email"]:visible').each(function(
    i
  ) {
    const ok = validateFieldShowOrHideError($(this));
    // Stores the first element that had a validation error to focus on it
    if (!ok && $firstElementWithError === undefined) {
      $firstElementWithError = $(this);
    }
  });

  // if there was an error with inputs
  if ($firstElementWithError !== undefined) {
    $firstElementWithError.focus();
    validationErrorOccurred = true;
  }

  // If there is no activity checkbox selected
  validationErrorOccurred =
    !validateActivitiesCheckboxesShowOrHideError(validationErrorOccurred) ||
    validationErrorOccurred;

  // ? apparently this code is asynchronous line by line. I got weird results with the next if check being executed before the last line was executed and changed the boolean value.
  if (validationErrorOccurred) {
    e.preventDefault();
    console.log('COMMENT: validation error occurred!');
  } else {
    console.log('COMMENT: no validation errors... submitting...');
  }
});

/**
 * At first load of the script attach listeners to all INPUTS that
 * has validation attributes (see `validateFieldShowOrHideError(...)`))
 */
addValidationListenerAllFields();
