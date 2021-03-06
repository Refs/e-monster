import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OwlDialogService } from 'owl-ng';

import { IAlbum } from '../../model';
import * as fromMusicRoot from '../reducers';
import * as musicActions from '../actions/music';
import * as collectionAction from '../actions/collection';
import { TrackDialogComponent } from '../../share/track-dialog/track-dialog.component';
import { AppService } from '../../app.service';


@Component({
    selector: 'app-album-details',
    templateUrl: './album-details.component.html',
    styleUrls: ['./album-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChildren('trackItem') trackItems: QueryList<ElementRef>;

    public album$: Observable<IAlbum>;
    public inCollection$: Observable<boolean>;
    private routeParamsSub = Subscription.EMPTY;

    private routeQueriesSub = Subscription.EMPTY;

    get scrollTarget(): HTMLElement {
        return this.appService.appContainer;
    }

    constructor( private route: ActivatedRoute,
                 private elm: ElementRef,
                 private store: Store<fromMusicRoot.State>,
                 private appService: AppService,
                 private dialogService: OwlDialogService ) {
    }

    public ngOnInit() {
        this.routeParamsSub = this.route.params
            .pipe(map(params => new musicActions.Select(params.id)))
            .subscribe(action => this.store.dispatch(action));

        this.album$ = this.store.pipe(select(fromMusicRoot.getSelectedAlbum));
        this.inCollection$ = this.store.pipe(select(fromMusicRoot.isSelectedAlbumInCollection));
    }

    public ngAfterViewInit(): void {
        this.routeQueriesSub = this.route.queryParams
            .pipe(map(query => query['track_id']))
            .subscribe(( id ) => {
                if (id) {
                    // scroll track item into view
                    const trackItem = this.trackItems.find(( item ) => item.nativeElement.id === id);
                    trackItem.nativeElement.scrollIntoView({behavior: 'smooth'});
                }
            });
    }

    public ngOnDestroy(): void {
        this.routeParamsSub.unsubscribe();
        this.routeQueriesSub.unsubscribe();
    }

    public handleClickOnTrack( track: any, albumName: string, event: any ): any {
        const dialogRef = this.dialogService.open(TrackDialogComponent, {
            data: {
                albumName: albumName,
                trackName: track.name,
                artists: track.artists,
                spotifyUrl: track.external_urls.spotify,
            },
            dialogClass: 'audio-dialog',
            transitionX: event.clientX,
            transitionY: event.clientY,
        });
        event.preventDefault();
    }

    public addToCollection( album: IAlbum ) {
        this.store.dispatch(new collectionAction.AddAlbum(album));
    }

    public removeFromCollection( album: IAlbum ) {
        this.store.dispatch(new collectionAction.RemoveAlbum(album));
    }
}
