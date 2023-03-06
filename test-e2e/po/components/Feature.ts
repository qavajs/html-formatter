import { $, $$, Component } from '@qavajs/po-playwright';
import Scenario from './Scenario';

export default class Feature extends Component {
    Title = $('.FlexRow_root__DtoT7 .Text_root__wYraY.text-layout_font-size-14__zmBoh');
    Scenarios = $$(new Scenario('[class*=Accordion_container]'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('[class*=Switch_container]');
}
