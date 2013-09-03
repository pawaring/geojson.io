var qs = require('../lib/querystring'),
    xtend = require('xtend');

module.exports = function(context) {
    var router = {};

    router.on = function() {
        d3.select(window).on('hashchange.router', route);
        context.dispatch.on('change.route', unroute);
        context.dispatch.route(getQuery());
        return router;
    };

    router.off = function() {
        d3.select(window).on('hashchange.router', null);
        return router;
    };

    function route() {
        var oldHash = d3.event.oldURL.split('#')[1],
            newHash = d3.event.newURL.split('#')[1],
            oldQuery = qs.stringQs(oldHash),
            newQuery = qs.stringQs(newHash);

        if (isOld(oldHash)) return upgrade(oldHash);
        if (newQuery.id !== oldQuery.id) context.dispatch.route(newQuery);
    }

    function isOld(id) {
        return (id.indexOf('gist') === 0 || id.indexOf('github') === 0 || !isNaN(parseInt(id, 10)));
    }

    function upgrade(id) {
        location.hash = '#id=' + id;
    }

    function unroute() {
        var query = getQuery();
        var rev = reverseRoute();
        if (rev.id && query.id !== rev.id) {
            location.hash = '#' + qs.qsString(rev);
        }
    }

    function getQuery() {
        return qs.stringQs(window.location.hash.substring(1));
    }

    function reverseRoute() {
        var query = getQuery();
        var data = context.data.all();

        if (data.type === 'gist') {
            return xtend(query, {
                id: 'gist:' + [
                    data.meta.login,
                    data.source.id
                ].join('/')
            });
        } else if (data.type === 'github') {
            var id = 'github:' + [
              data.meta.login,
              data.meta.repo,
              'blob',
              data.meta.branch,
              data.source.path
            ].join('/');

            return xtend(query, {
                id: id
            });
        }

        return false;
    }

    return router;
};
