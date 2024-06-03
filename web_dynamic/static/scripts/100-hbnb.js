const checkedAmenities = {};
const checkedLocations = { states: {}, cities: {} };

$(document).ready(() => {
  // Handle checkbox changes for amenities
  $('DIV.amenities input:checkbox').on('change', handleAmenityChange);

  // Handle checkbox changes for locations
  $('DIV.locations input:checkbox').on('change', handleLocationChange);

  // Check API status
  checkApiStatus();

  // Initial filter call
  filter();

  // Handle filter button click
  $('button').on('click', handleFilterButtonClick);
});

/**
 * Updates the list of checked amenities based on the checkbox change.
 *
 * @returns {void}
 */
function handleAmenityChange () {
  const checkbox = $(this);
  const id = checkbox.attr('data-id');
  const name = checkbox.attr('data-name');

  if (checkbox.is(':checked')) {
    checkedAmenities[name] = id;
  } else {
    delete checkedAmenities[name];
  }

  $('div.amenities h4').text(Object.keys(checkedAmenities).join(', '));
}

/**
 * Updates the checked locations based on the checkbox change event.
 * If the checkbox is checked, it adds the location to the corresponding states or cities object.
 * If the checkbox is unchecked, it removes the location from the corresponding states or cities object.
 * Finally, it calls the updateLocationsText function to update the displayed locations text.
 */
function handleLocationChange () {
  const checkbox = $(this);
  const id = checkbox.attr('data-id');
  const name = checkbox.attr('data-name');
  const type = checkbox.attr('data-type');

  if (checkbox.is(':checked')) {
    if (type === 'state') {
      checkedLocations.states[name] = id;
    } else if (type === 'city') {
      checkedLocations.cities[name] = id;
    }
  } else {
    if (type === 'state') {
      delete checkedLocations.states[name];
    } else if (type === 'city') {
      delete checkedLocations.cities[name];
    }
  }

  const locations = [...Object.keys(checkedLocations.states), ...Object.keys(checkedLocations.cities)];
  $('div.locations h4').text(locations.join(', '));
}

/**
 * Makes a GET request to the API endpoint 'http://127.0.0.1:5001/api/v1/status/' to check the status of the API.
 * If the request is successful and the response status is 'OK', adds the class 'available' to the 'div#api_status' element.
 * Otherwise, removes the class 'available' from the 'div#api_status' element.
 *
 * @returns {void}
 */
function checkApiStatus () {
  $.get('http://127.0.0.1:5001/api/v1/status/', (resp, textStatus) => {
    if (textStatus === 'success' && resp.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

/**
 * Perform a filter operation on places based on the provided list of amenities, states, and cities.
 * If no filters are provided, all places will be returned.
 *
 * @param {Array} amenities - List of amenity IDs to filter places by.
 * @param {Array} states - List of state IDs to filter places by.
 * @param {Array} cities - List of city IDs to filter places by.
 * @returns {void}
 */
function filter (amenities = [], states = [], cities = []) {
  const url = 'http://127.0.0.1:5001/api/v1/places_search';
  const requestData = (amenities.length < 1 && states.length < 1 && cities.length < 1) ? {} : { amenities, states, cities };

  $.ajax({
    url,
    type: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(requestData),
    success: function (data) {
      $('section.places').empty();
      data.forEach(place => {
        $.get(`http://127.0.0.1:5001/api/v1/users/${place.user_id}`, function (user) {
          const htmlPlace = createPlaceHtml(place, user);
          $('section.places').append(htmlPlace);
        });
      });
    }
  });
}

/**
 * Creates HTML markup for a place based on the provided place and user information.
 *
 * @param {Object} place - The place object containing details like name, price, max_guest, number_rooms, number_bathrooms, and description.
 * @param {Object} user - The user object containing details like first_name and last_name of the owner.
 * @returns {string} HTML markup representing the place information including title, price, guest capacity, room details, owner information, and description.
 */
function createPlaceHtml (place, user) {
  return `
    <article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
      </div>
      <div class='user'>
        <b>Owner: ${user.first_name} ${user.last_name}</b>
      </div>
      <div class="description">${place.description}</div>
    </article>`;
}

/**
 * Handle the click event on the filter button.
 * Calls the filter function with the checked amenities, states, and cities.
 *
 * @returns {void}
 */
function handleFilterButtonClick () {
  console.log('button clicked');
  filter(Object.values(checkedAmenities), Object.values(checkedLocations.states), Object.values(checkedLocations.cities));
  console.log('new result');
}
