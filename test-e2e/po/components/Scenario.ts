import { $, $$, Component } from '@qavajs/po-playwright';

class Step extends Component {
    Attachments = $$('button');
}

export default class Scenario extends Component {
    Title = $('.uui-accordion-toggler .t2Air._2NWkE._16JVi._2LUBH._30qZ_._1YeLH._2khSS');
    Steps = $$(new Step('.uui-accordion-body > div'));
}
