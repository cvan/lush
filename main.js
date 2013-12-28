(function() {

    function search() {
    }

    var d = document;

    $(d).on('submit', '.form-search', function(e) {
        e.preventDefault();
        search();
    }).on('blur change keyup keypress paste', 'input[name=q]', function() {
        search();
    }).on('click', '.close', function(e) {
        e.preventDefault();
        $(this).closest('article').remove();
    });

    var states = {
        'mi': 'Michigan'
    };

    function getState() {
        // Try query-string parameter (`state`).
        var qsState = /[\?&]state=([\w\-]+)/i.exec(window.location.search);
        var state = (qsState ? qsState[1] : '').toLowerCase();

        // Try fetching from localStorage.
        if (!state) {
            state = window.localStorage.state;
        }

        // Try fetching the first and only state (assuming there's only one).
        var stateKeys = Object.keys(states);
        if (!state && stateKeys.length === 1) {
            state = stateKeys[0];
        }

        return state;
    }

    var state = getState();
    var stateName = states[state];
    console.log('State:', state, '/', stateName);

    var settings = {
        apiUrl: 'http://localhost:7000'
    };

    var urls = {
        'image': '/static/listings/img/' + state,
        'listings': '/static/listings/json/' + state + '.json'
    };

    function url(name) {
        return settings.apiUrl + urls[name];
    }

    function getDigits(tel) {
        return tel.replace(/[^\d]/g, '');
    }

    function getLocation() {
        // TODO: Use `navigator.geolocation`.
    }

    _.templateSettings.imports = {
        getDigits: getDigits,
        getLocation: getLocation,
        url: url
    };
    _.templateSettings.variable = 'data';

    $.getJSON(url('listings'), function(content) {
        // TODO: Save in localStorage/appcache.
        console.log('Got', content.length, 'listing' + (content.length === 1 ? '' : 's'));
        if (content.length) {
            var resultsHTML = '';
            var templateHTML = $('#template-listing').html();
            resultsHTML += _.template(templateHTML, content[0]);
            // content.forEach(function(listing) {
            //     resultsHTML += _.template(templateHTML, listing);
            // });
            $('.results').html(resultsHTML);
        }
    });

})();
