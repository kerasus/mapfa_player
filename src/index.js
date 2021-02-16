import $ from "jquery";
import videojs from 'video.js';
import 'videojs-logo';
import 'video.js/dist/video-js.min.css';
import 'videojs-logo/dist/videojs-logo.css';
window.jQuery = $;


var InitPage = function() {

    var apiAddress = 'https://api-stg.aggr-services.com/api/public/setting';

    function getVideojsConfig(data) {
        var config = {
            poster: data.video_poster,
            language: 'fa',
            liveui: true,
            autoplay: false
        }

        if (!data.video_poster) {
            delete config.poster
        }

        return config
    }

    function getVideoSrc(data) {
        var config = {
            type: 'application/x-mpegURL',
            res: 'x-mpegURL',
            label: 'x-mpegURL',
            src: data.video_src
        }

        if (!data.video_poster) {
            delete config.poster
        }

        return config
    }

    function getVideoLogoConfig(data) {
        var config = {
            image: data.logo_src,
            url: data.logo_link,
            width: data.logo_size,
            fadeDelay: null
        }

        if (!data.logo_link) {
            delete config.url
        }
        if (!data.logo_size) {
            config.logo_size = 50
        }

        return config
    }

    function loadPlayerSrc(player, data) {
        if (!data.video_src) {
            return
        }
        player.src(getVideoSrc(data));
    }

    function loadPlayerLogo(player, data) {
        if (!data.logo_src) {
            return
        }
        player.logo(getVideoLogoConfig(data));
        player.on('play', () => {
            player.logo().hide();
        });
        player.on('pause', () => {
            player.logo().show();
        });
    }

    function loadPlayer(data) {
        var player = videojs('video-0', getVideojsConfig(data));
        loadPlayerSrc(player, data);
        loadPlayerLogo(player, data);
    }

    function playerDataAdapter(data) {
        return {
            video_src: (data.streamURL) ? data.streamURL : null,
            video_poster: (data.bannerURL) ? data.bannerURL : null,
            logo_src: (data.logoURL) ? data.logoURL : null,
            logo_link: (data.logo_link) ? data.logo_link : null,
            logo_size: (data.logo_size) ? data.logo_size : null
        };
    }

    function getPlayerData(source, jobId) {
        $.ajax({
                type: "GET",
                url: source,
                data: {
                    jobId
                },
                accept: "application/json; charset=utf-8",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    loadPlayer(playerDataAdapter(response.data))
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('مشکلی در دریافت اطلاعات رخ داده است. لطفا مجددا صفحه را باز کنید.')
                }
            }
        );
    }

    function getParam(param) {
        return (new URL(window.location.href)).searchParams.get('jobId');
    }

    function init(jobId) {
        // loadPlayer({
        //     video_src: 'https://streaming-stg.aggr-services.com/dvr/5bfbe8b4-ffe8-462c-8633-0c4cfcb60615/1612171660442/main.m3u8',
        //     video_poster: 'https://cdn.alaatv.com/media/thumbnails/1029/1029001sane.jpg',
        //     logo_src: 'https://cdn.alaatv.com/upload/logo_20190508105212_20190512113140.png',
        //     logo_link: 'https://alaatv.com/',
        //     logo_size: 150
        // })
        getPlayerData(apiAddress, jobId)
    }

    return {
        init,
        getParam,
    };
}();

jQuery(document).ready( function() {
    var jobId = InitPage.getParam('jobId');
    InitPage.init(jobId);
});


