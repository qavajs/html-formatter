const { $, $$, Component } = require('@qavajs/po-playwright')
const Overlay = require('./Overlay');

class AttachmentOverlay extends Overlay {
    Image = $('img');
    Iframe = $('iframe');
    Text = $('pre');

}

module.exports = AttachmentOverlay;
