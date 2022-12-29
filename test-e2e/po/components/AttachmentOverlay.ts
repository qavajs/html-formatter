import { $, $$, Component } from '@qavajs/po-playwright';
import Overlay from './Overlay';

export default class AttachmentOverlay extends Overlay {
    Image = $('img');
    Iframe = $('iframe');
    Text = $('pre');

}
