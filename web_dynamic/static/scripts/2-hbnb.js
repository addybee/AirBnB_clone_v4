$(document).ready(() => {
    const checkedAmenities = {};

    $.get("http://0.0.0.0:5001/api/v1/status/", (resp, textStatus) => {
      if (textStatus === 'success') {

        if (resp.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
          if ($('div#api_status').hasClass('available'))
            $('div#api_status').removeClass('available');
        }
      }
    });
    
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
