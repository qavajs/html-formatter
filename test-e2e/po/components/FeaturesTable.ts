import { $, $$, Component } from '@qavajs/po-playwright';

class Row extends Component {
    Name = $('.mcDo6 .P755f .uui-caption');
}

export default class FeaturesTable extends Component {
    Rows = $$(new Row('.uui-table-row'));
}
