$(document).ready(() => {
  const checkedAmenities = {};

  $('input:checkbox').on('change', function () {
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

  $.get('http://127.0.0.1:5001/api/v1/status/', (resp, textStatus) => {
    if (textStatus === 'success') {
      if (resp.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        if ($('div#api_status').hasClass('available')) {
          $('div#api_status').removeClass('available');
        }
      }
    }
  });
});

$(document).ready(function () {
  const url = 'http://127.0.0.1:5001/api/v1/places_search';
  $.ajax({
    url,
    type: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({}),
    success: function (data) {
      for (const place of data) {
        $.get('http://127.0.0.1:5001/api/v1/users/' + place.user_id, function (user) {
          const html_place =
            '<article>' +
            '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">' + place.price_by_night + '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest > 1 ? 's' : '') + '</div>' +
            '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms > 1 ? 's' : '') + '</div>' +
            '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms > 1 ? 's' : '') + '</div>' +
            '</div>' +

            "<div class='user'>" +
            '<b>Owner: ' + user.first_name + ' ' + user.last_name + '</b>' +
            '</div>' +

            '<div class="description">' + place.description + '</div>' +
            '</article>';

          $('section.places').append(html_place);
		    });
      }
    }
  });
});
