var readDrop = require('../lib/readfile.js').readDrop;

module.exports = function(context) {
    d3.select('body')
        .attr('dropzone', 'copy')
        .on('drop.import', readDrop(function(err, gj) {
            if (err) return;
            if (gj && gj.features) {
                context.data.mergeFeatures(gj.features);
            }
            d3.select('body').classed('dragover', false);
        }))
        .on('dragenter.import', over)
        .on('dragleave.import', exit)
        .on('dragover.import', over);

   function over() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        d3.event.dataTransfer.dropEffect = 'copy';
        d3.select('body').classed('dragover', true);
    }

    function exit() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        d3.event.dataTransfer.dropEffect = 'copy';
        d3.select('body').classed('dragover', false);
    }
};