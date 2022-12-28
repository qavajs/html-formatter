const { $, $$, Component } = require('@qavajs/po-playwright')
const Overlay = require('./Overlay');

class Row extends Component {
    Key = $('div[role="cell"]:first-child');
    Value = $('div[role="cell"]:last-child');
}

class MetadataOverlay extends Overlay {
    Rows = $$(new Row('._30bAc div[role="row"]'));
}

module.exports = MetadataOverlay;
