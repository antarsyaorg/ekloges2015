nunjucks.configure('views', { autoescape: true });

$(window).on('hashchange', function() {
  if (window.location.hash.indexOf("/party/") != -1) {
    $("#party_dropdown").val(decodeURI(window.location.hash.substr(8)));
  }
});

$(document).ready(function() {
  $("#section_dropdown").change(function() {
    var value = $(this).val();
    if (!value) {
      window.location = '#/';
    }
    else {
      window.location = '#/section/' + value;
    }
  });

  $("#party_dropdown").change(function() {
    var value = $(this).val();
    if (!value) {
      window.location = '#/';
    }
    else {
      window.location = '#/party/' + value;
    }
  });

  $.getJSON('/data.json', function(data) {
    $("#people").append(nunjucks.render('entries.html', {'entries': data.entries}));

    var sections = new Array();
    var parties = new Array();
    for (var k=0, l = data.entries.length; k < l; k++) {
      var section = data.entries[k].section;
      var party = data.entries[k].party;
      if (sections[sections.length-1] != section) {
        sections.push(section);
      }
      if (parties[parties.length-1] != party) {
        parties.push(party);
      }
    }
    $("#section_dropdown").append(nunjucks.render('dropdown.html', {'entries': sections}));
    $("#party_dropdown").append(nunjucks.render('dropdown.html', {'entries': parties}));
  });

});

Path.map("#/party/:party").to(function(){
  var $li = $("#people li");
  var party = decodeURI(this.params['party']);
  $("#section_dropdown").val("");
  $li.hide();
  $li.filter('[data-party="' + party + '"]').show();
  $($li.filter('[data-party="' + party + '"]').prevAll(".perifereia")[0]).show();
});

Path.map("#/section/:section").to(function(){
  var $li = $("#people li");
  var section = decodeURI(this.params['section']);
  $("#party_dropdown").val("");
  $li.hide();
  $li.filter('[data-section="' + section + '"]').show();
});


Path.rescue(function(){
  $("#people li").show();
});

Path.listen();
