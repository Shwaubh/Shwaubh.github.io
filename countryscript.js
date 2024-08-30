function shuffleArray(data, numberofelements){
    let currentIndex = 0;
    let randomIndex;
    while (currentIndex < numberofelements) {

      randomIndex = Math.floor( ( Math.random() * data.length-currentIndex) + currentIndex );
      [data[currentIndex], data[randomIndex]] = [data[randomIndex], data[currentIndex]];
      currentIndex++;
  }
  return data.slice(0, numberofelements);
}

testvalue ='';
$(document).ready(function() {
    // var API_KEY = 'live_LsLBRZXEDPqzLQqjpjCuwocGsxp4ZMKQ09FuRKF4YohJdWH3SUBYeP0fiuQ7HglR';
    // Function to fetch random country data
    getRandomCountry();
    function getRandomCountry() {
      var apiUrl = "https://restcountries.com/v3.1/all";
  
      $.ajax({
        url: apiUrl,
        method: "GET",
        headers: {
            // 'x-api-key': API_KEY
        },
        success: function(data) {
          // Clear previous results
          data = shuffleArray(data, 5);
          $("#countryContainer").empty();
  
          // Loop through each country image data
          $.each(data, function(index, country) {
                var imageId = country.flags.png;
                var countryFact = country.name.official;
                $("#countryContainer").append(`
                  <div class="countryInfo">
                    <img src="${imageId}" alt="Country Image" height='150' width='150'>
                    <p><strong>Name Official:</strong> ${countryFact}</p>
                    <p><strong>Name Common:</strong> ${country.name.common}</p>
                  </div>
                `); 
          });
        },
        error: function() {
          $("#countryContainer").html("<p>Failed to fetch country images.</p>");
        }
      });
    }
  
    // Event listener for the button click
    $("#getCountryButton").click(function() {
      getRandomCountry();
    });



  });
  