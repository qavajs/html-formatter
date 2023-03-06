import { $, $$, Component } from '@qavajs/po-playwright';

class Step extends Component {
    Attachments = $$('button');
}

export default class Scenario extends Component {
    Title = $('.uui-accordion-toggle-container > div > div');
    Steps = $$(new Step('.uui-accordion-body > div'));
}
