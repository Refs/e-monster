import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppService } from '../app.service';
import * as fromTvRoot from './reducers';
import * as collectionAction from './actions/collection';

@Component({
    selector: 'app-tv',
    templateUrl: './tv.component.html',
    styleUrls: ['./tv.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvComponent implements OnInit {

    constructor( private appService: AppService,
                 private store: Store<fromTvRoot.State> ) {
    }

    ngOnInit() {
        this.store.dispatch(new collectionAction.Load());
    }

    public onDeactivate() {
        this.appService.scrollBackToTop(false);
    }
}
