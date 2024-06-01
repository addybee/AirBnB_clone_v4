$(document).ready(() => {
  const checkedAmenities = {};

  $('li input').on('change', function () {
    const checkbox = $(this);
    const id = checkbox.attr('data-id');
    const name = checkbox.attr('data-name');

    if (checkbox.is(':checked')) {
      checkedAmenities[name] = id;
      $('div.amenities h4').text(Object.keys(checkedAmenities).join(', '));
    } else {
      delete checkedAmenities[name];
      $('div.amenities h4').text(Object.keys(checkedAmenities).join(', '));
    }

    // For debugging purposes, you can log the array to check if it's being updated correctly
    console.log(checkedAmenities);
  });
});
