import { $, $$ } from '@qavajs/po-playwright';

import Main from './components/Main';
import Feature from './components/Feature';
import Header from './components/Header';
import Failed from './components/Failed';
import MetadataOverlay from './components/MetadataOverlay';
import AttachmentOverlay from './components/AttachmentOverlay';

export default class App {
    Main = $(new Main('main'));
    Feature = $(new Feature('main'));
    Failed = $(new Failed('main'));
    Header = $(new Header('._1USbx._3lNb7'));
    MetadataOverlay = $(new MetadataOverlay('.uui-modal-window'));
    AttachmentOverlay = $(new AttachmentOverlay('.uui-modal-window'));
}
