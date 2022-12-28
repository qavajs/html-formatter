const { $, $$, Component } = require('@qavajs/po-playwright')
const Scenario = require('./Scenario');

class Feature extends Component {
    Title = $('.t2Air._2NWkE._16JVi._2LUBH._1S5Yu._1YeLH');
    Scenarios = $$(new Scenario('.LW8md.QQ7Qd.viC1y.XVxPc._3pEr7._2Njnp._2tefK'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('._1e-RT._29dT7._2ksiK.-clickable');
}

module.exports = Feature;
