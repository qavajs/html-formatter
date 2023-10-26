import { $, Component } from '@qavajs/po-playwright';
import FeaturesTable from './FeaturesTable';

export default class Main extends Component {
    FeaturesTable = $(new FeaturesTable('.uui-panel[class*=features]'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('.uui-switch-body');
}
