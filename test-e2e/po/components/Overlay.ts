import { $, Component } from '@qavajs/po-playwright';

export default class Overlay extends Component {
    Title = $('.uui-font-semibold');
    X = $('[aria-label="Close modal"]');
}
