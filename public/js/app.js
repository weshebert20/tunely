/* CLIENT-SIDE JS */


$(document).ready(function() {
  console.log('app.js loaded!');

// Gets all the albums from the DB and appends them to the page
  $.get('/api/albums', function(albums) {
    albums.forEach(function(album) {
    renderAlbum(album);  
   });
  });
// Submits a new album to the DB and renders it onto the page
  $('#album-form').submit(function() {
    event.preventDefault();
    console.log(this);
    var formData = $(this).serialize();
    console.log(formData);
    $(this).trigger("reset");
    $.post('/api/albums', formData, function(album) {
      console.log(album);
      renderAlbum(album);
    });
  });

  $('#albums').on('click', '.add-song', function(e) {
    console.log('Did a thing');
    var id = $(this).parents('.album').data('album-id');
    console.log('id', id);
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });

    $('#saveSong').on('click', handleNewSongSubmit);
      console.log(handleNewSongSubmit);

});

// handles the submit on the modal and POST the form data as a new song
function handleNewSongSubmit(e) {
  var albumId = $('#songModal').data('album-id');
  var songName = $('#songName').val();
  var trackNumber = $('#trackNumber').val();

  var formData = {
    name: songName,
    trackNumber: trackNumber
  };

  var postUrl = '/api/albums/' + albumId + '/songs';
  console.log('posting to ', postUrl, ' with data ', formData);

  $.post(postUrl, formData)
    .success(function(song) {
      console.log('song', song);

      // re-get full album and render on page
      $.get('/api/albums/' + albumId).success(function(album) {
        //remove old entry
        $('[data-album-id='+ albumId + ']').remove();
        // render a replacement
        $('#albums').empty();
        renderAlbum(album);

      });

      //clear form
      $('#songName').val('');
      $('#trackNumber').val('');
      $('#songModal').modal('hide');

    });
}

// Function to build the songs
function buildSongsHtml(songs) {
  var songText = " &ndash; ";
  songs.forEach(function(song) {
    songText = songText + " (" + song.trackNumber + ") " + song.name + " &ndash;";
  });

  var songsHtml = 
   "                     <li class='list-group-item'>" +
   "                        <h4 class='inline-header'>Songs:</h4>" +
   "                         <span>" + songText + "</span>" +
   "                      </li>";
   return songsHtml;
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  // console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +

  buildSongsHtml(album.songs) +

  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                 <button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $("#albums").append(albumHtml);

}




