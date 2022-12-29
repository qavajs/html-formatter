import { $, $$, Component } from '@qavajs/po-playwright';
import FeaturesTable from './FeaturesTable';

export default class Main extends Component {
    FeaturesTable = $(new FeaturesTable('.App_features__1Nyen'));
    Search = $('[placeholder="Search"]');
    ShowOnlyFailed = $('._1e-RT._29dT7._2ksiK.-clickable');
}
