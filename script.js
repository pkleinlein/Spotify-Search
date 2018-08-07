var button = $("#search");
var input = $("input");
// var results = $("");
var more = $("#more");
var resultsDisplay = $("#results");
var resultsHtml;
var nextUrl;
var displayName = $(".displayName");
// button.on("click",
var doc = $(document);
var win = $(window);
var useInfiniteScroll = location.search.indexOf("scroll=infinite") > -1;

var getResults = function() {
    var value = input.val();
    var optionValue = $("select").val();
    console.log(value, optionValue);

    $.ajax({
        url: "https://elegant-croissant.glitch.me/spotify",
        method: "GET",
        data: {
            q: value,
            type: optionValue
        },
        success: function(data) {
            data = data.artists || data.albums;
            resultsHtml = "";
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images[0]) {
                    resultsHtml +=
                        // '<img src="' + data.items[i].images[0].url + '">';
                        '<div class="photoresult"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img src="' +
                        data.items[i].images[0].url +
                        '"></a><div class="name"><a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</a></div></div>";
                } else {
                    resultsHtml +=
                        '<div class="photoresult"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img src="http://experience-mp3.com/assets/general/cover.png"></a><div class="name"><a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</a></div></div>";
                }
            }
            if (resultsHtml == "") {
                displayName.html('No results found for "' + value + '"');
            } else {
                displayName.html('Results for "' + value + '"');
            }

            // if (useInfiniteScroll){
            //     setTimeout(scrollForever(), 1000);
            // }
            if (data.next != null) {
                $("#more").css({
                    visibility: "visible"
                });
                nextUrl = data.next.replace(
                    "api.spotify.com/v1/search",
                    "elegant-croissant.glitch.me/spotify"
                );
            } else {
                nextUrl = null;
                $("#more").css({
                    visibility: "hidden"
                });
            }

            resultsDisplay.html(resultsHtml);
            console.log(data);
            if (useInfiniteScroll) {
                scrollForever();
                $("#more").css({
                    visibility: "hidden"
                });
            }
        }
    });
};

button.on("click", function() {
    getResults();
});
input.on("keydown", function(e) {
    if (e.keyCode == 13) {
        getResults();
    }
});

var moreButton = function() {
    $.ajax({
        url: nextUrl,
        method: "GET",
        success: function(data) {
            data = data.artists || data.albums;
            if (data.next != null) {
                nextUrl = data.next.replace(
                    "api.spotify.com/v1/search",
                    "elegant-croissant.glitch.me/spotify"
                );
            } else {
                nextUrl = null;
                more.css({
                    visibility: "hidden"
                });
            }
            var newResults = "";
            // data = data.artists || data.albums;
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images[0]) {
                    newResults +=
                        // '<img src="' + data.items[i].images[0].url + '">';
                        '<div class="photo result"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img src="' +
                        data.items[i].images[0].url +
                        '"></a><div class="name"><a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</a></div></div>";
                } else {
                    newResults +=
                        '<div class="photo result"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img src="http://experience-mp3.com/assets/general/cover.png"></a><div class="name"><a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</a></div></div>";
                }
            }
            console.log(data);
            resultsDisplay.append(newResults);
            if (data.next != null) {
                scrollForever();
            }
        }
    });
};

more.on("click", function() {
    moreButton();
});

function scrollForever() {
    if (doc.scrollTop() + win.height() == doc.height()) {
        moreButton();
    } else {
        setTimeout(scrollForever, 500);
    }
}
