import { $, $$, Component } from '@qavajs/po-playwright';
import Overlay from './Overlay';

export default class LogsOverlay extends Overlay {
    Text = $('pre');

}
