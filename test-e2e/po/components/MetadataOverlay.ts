import { $, $$, Component } from '@qavajs/po-playwright';
import Overlay from './Overlay';

class Row extends Component {
    Key = $('div[role="cell"]:first-child');
    Value = $('div[role="cell"]:last-child');
}

export default class MetadataOverlay extends Overlay {
    Rows = $$(new Row('[class*=DataTable_listContainer] div[role="row"]'));
}
