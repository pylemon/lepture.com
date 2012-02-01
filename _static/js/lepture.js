$(function(){
    // copy from stevelosh.com
    var h2s = null;
    function place_scrolly_header() {
        var c = 75;
        var e = $(window).scrollTop();
        var d = null;
        var a = null;
        var b = null;
        h2s.each(function () {
            var h = $(this).position()["top"] - c;
            if (e < h) {
                return false
            }
            b = h;
            d = $(this).html().replace(/&nbsp;/g, " ");
            var f = e - (b + c);
            a = f / c;
            if (a > 1) {
                a = 1
            }
            if (a > 0.99) {
                var j = $(this).nextAll("h2");
                if (j.length) {
                    var i = j.first().position()["top"];
                    var g = i - e;
                    if (g <= c * 2) {
                        a = 1 / (c - g / 2)
                    }
                }
            }
        });
        if(h2s && h2s.length) {
            $("#scrolling-header").css({
                opacity: a
            }).css("left", h2s.first().position()["left"] - 180 - 35).html(d)
        }
    }

    function fetch_github_commits(github_repo) {
        var h = $("#github-section").position()["top"] - $(window).scrollTop() - 600;
        if (h > 0) { return }
        window.is_github_fetched = true;
        $('#github-section').html('<p><strong>Github Commits</strong></p><ul id="github-commits"></ul>');
        setTimeout("$('#github-commits').html('<li>Loading ... </li>')", 400);
        var url = 'https://api.github.com/repos/' + github_repo + '/commits?callback=?';
        $.getJSON(url, function(json){
            var items = [];
            $.each(json.data, function(index, item) {
                var li = '<li><a target="_blank" href="https://github.com/'
                + item.author.login + '"><img src="' + item.author.avatar_url
                + '&s=24" /></a> <a target="_blank" href="https://github.com/'
                + github_repo + '/commit/' + item.sha + '">'
                + item.commit.message + '</span></li>';
                items.push(li);
            });
            $('#github-commits').html(items.join(''));
        });
    }

    var isMobile = navigator.userAgent.match(/(iPhone|iPod|Android|Blackberry|mobile)/);
    var currentNav = window.currentNav || '#nav-home';
    $(currentNav).addClass('current');
    if(isMobile) {
        $('#nav-work, #search-form, #github').hide();
        $('#header nav, #nav li').height(36);
        $('#nav a').css({fontSize: 13, lineHeight: '36px'});
    } else {
        $('a[href^=http]:not(a[href^="http://lepture.com"])').attr('target', '_blank');
        $(document).keydown(function(e) {
            var tagName = e.target.tagName.toLowerCase();
            if("input" == tagName|| "textarea" == tagName){return ;}
            if(37 == e.keyCode || 72 == e.keyCode){
                var url = $('#prev-entry').attr('href');
            }else if(39 == e.keyCode || 76 == e.keyCode){
                var url = $('#next-entry').attr('href');
            }
            var url = url || '';
            if(url){location.assign(url);}
        });
        if (currentNav != "#nav-links") {
            var h2s = $(".entry-content h2");
            $("body").append('<div id="scrolling-header"></div>');
            $(window).scroll(function () {
                place_scrolly_header()
                if (window.github_repo && !window.is_github_fetched) {
                    fetch_github_commits(github_repo);
                }
            });
        } else {
            $('.page-content li a').each(function(index, item){
                var bg = 'http://www.google.com/s2/u/0/favicons?domain_url=';
                var bg = 'url(' + bg + item.href + ')';
                $(item).css('background-image', bg);
            });
        }
        /* footnote */
        $('body').append('<aside id="sidenote"></aside>');
        $("#sidenote").css({'width': $('body').width()/2-360});
        $('table.footnote').each(function(index, item){
            var exists = $('#sidenote .footnote');
            var prev = exists[exists.length - 1];
            var fixHeight = 0;
            if (prev) {
                var fixHeight = $(prev).height();
                var topBefore = $('a[href="#' + prev.id + '"]').offset().top;
            } else {
                var topBefore = 0;
            }
            var topNow = $('a[href="#' + item.id + '"]').position().top;
            var offset = topNow - topBefore - fixHeight;
            $(item).css('margin-top', offset < 0 ? 14 : offset);
            $('#sidenote').append(item);
        });
        $('a.footnote-reference').hover(function(){
            $($(this).attr("href")).css('background', '#fff')
        }, function(){
            $($(this).attr("href")).css('background', 'transparent')
        });
    }
});
