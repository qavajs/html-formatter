import { $, $$ } from '@qavajs/po-playwright';

import Main from './components/Main';
import Feature from './components/Feature';
import Header from './components/Header';
import Failed from './components/Failed';
import MetadataOverlay from './components/MetadataOverlay';
import AttachmentOverlay from './components/AttachmentOverlay';
import LogsOverlay from './components/LogsOverlay';

export default class App {
    Main = $(new Main('main'));
    Feature = $(new Feature('main'));
    Failed = $(new Failed('main'));
    Header = $(new Header('[class*=MainMenu_root]'));
    MetadataOverlay = $(new MetadataOverlay('.uui-modal-window'));
    AttachmentOverlay = $(new AttachmentOverlay('.uui-modal-window'));
    LogsOverlay = $(new LogsOverlay('.uui-modal-window'));
}
