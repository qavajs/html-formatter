import { $, $$, Component } from '@qavajs/po-playwright';
import Feature from './Feature';

export default class Failed extends Component {
    Features = $$(new Feature('[data-testid="feature"]'));
    Search = $('[placeholder="Search"]');
}
