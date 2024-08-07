testvalue ='';
$(document).ready(function() {
    var API_KEY = 'live_LsLBRZXEDPqzLQqjpjCuwocGsxp4ZMKQ09FuRKF4YohJdWH3SUBYeP0fiuQ7HglR';
    // Function to fetch random cat data
    getRandomCats();
    function getRandomCats() {
      var apiUrl = "https://api.thecatapi.com/v1/breeds?limit=3&page="+ Math.floor(Math.random() * 20);
  
      $.ajax({
        url: apiUrl,
        method: "GET",
        headers: {
            'x-api-key': API_KEY
        },
        success: function(data) {
          // Clear previous results
          $("#catContainer").empty();
  
          // Loop through each cat image data
          $.each(data, function(index, cat) {
            var imageId = cat.reference_image_id;
            $.ajax({
                url: 'https://api.thecatapi.com/v1/images/' + imageId,
                method: 'GET',
                success: function(imageData)
                { var catFact = cat.description;
                $("#catContainer").append(`
                  <div class="catInfo">
                    <img src="${imageData.url}" alt="Cat Image" height='150' width='150'>
                    <p><strong>Name:</strong> ${cat.name}</p>
                    <p><strong>Fact:</strong> ${catFact}</p>
                  </div>
                `); }
            });
          });
        },
        error: function() {
          $("#catContainer").html("<p>Failed to fetch cat images.</p>");
        }
      });
    }
  
    // Event listener for the button click
    $("#getCatButton").click(function() {
      getRandomCats();
    });
  });
  