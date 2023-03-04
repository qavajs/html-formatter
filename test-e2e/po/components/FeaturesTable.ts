import { $, $$, Component } from '@qavajs/po-playwright';

class Row extends Component {
    Name = $('a[href*=feature]');
}

export default class FeaturesTable extends Component {
    Rows = $$(new Row('.uui-table-row'));
}
