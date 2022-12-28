const { $, $$, Component } = require('@qavajs/po-playwright')

class Row extends Component {
    Name = $('.mcDo6 .P755f .uui-caption');
}

class FeaturesTable extends Component {
    Rows = $$(new Row('.uui-table-row'));
}

module.exports = FeaturesTable;
