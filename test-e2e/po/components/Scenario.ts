import { $, $$, Component } from '@qavajs/po-playwright';

class Step extends Component {
    Attachments = $$('button');
    Time = $('.AwUU3x + .uui-icon + div');
}

export default class Scenario extends Component {
    Title = $('.uui-accordion-toggle-container > div > div:first-child');
    Steps = $$(new Step('.uui-accordion-body > div'));
    Time = $('.AwUU3x + .uui-icon + div');
}
