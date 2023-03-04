import { $, $$, Component } from '@qavajs/po-playwright';

export default class Header extends Component {
    Failed = $('a[href*=failed-scenarios]');
    Metadata = $('button');
}
