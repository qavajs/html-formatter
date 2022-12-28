const { $, $$ } = require('@qavajs/po-playwright')

const Main = require('./components/Main');
const Feature = require('./components/Feature');
const Header = require('./components/Header');
const Failed = require('./components/Failed');
const MetadataOverlay = require('./components/MetadataOverlay');
const AttachmentOverlay = require('./components/AttachmentOverlay');

class App {
    Main = $(new Main('main'));
    Feature = $(new Feature('main'));
    Failed = $(new Failed('main'));
    Header = $(new Header('._1USbx._3lNb7'));
    MetadataOverlay = $(new MetadataOverlay('.uui-modal-window'));
    AttachmentOverlay = $(new AttachmentOverlay('.uui-modal-window'));
}

module.exports = App;
