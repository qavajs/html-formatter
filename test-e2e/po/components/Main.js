const { $, $$, Component } = require('@qavajs/po-playwright')
const FeaturesTable = require('./FeaturesTable');

class Main extends Component {
    FeaturesTable = $(new FeaturesTable('.App_features__1Nyen'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('._1e-RT._29dT7._2ksiK.-clickable');
}

module.exports = Main;
