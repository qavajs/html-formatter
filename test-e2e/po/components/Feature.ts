import { $, $$, Component } from '@qavajs/po-playwright';
import Scenario from './Scenario';

export default class Feature extends Component {
    Title = $('[class*=featureTitle]');
    Scenarios = $$(new Scenario('.uui-accordion-container'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('.uui-switch-body');
}
