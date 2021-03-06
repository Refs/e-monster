/**
 * video
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromMovieRoot from '../reducers';
import { MovieService } from '../service/movie.service';
import {
    MovieVideosActionTypes,
    SearchVideos,
    SearchVideosCompleted,
    SearchVideosError,
    Select
} from '../actions/video';

@Injectable()
export class VideoEffect {

    @Effect()
    public search$ = this.actions$.pipe(
        ofType(MovieVideosActionTypes.SearchVideos),
        withLatestFrom(this.store$.pipe(select(fromMovieRoot.getMovieVideosEntities))),
        map(( [action, entities]: [SearchVideos, any] ) => [action.payload, entities]),
        switchMap(( [id, entities] ) => {
            const inStore = entities && !!entities[id];
            let obs;
            if (inStore) {
                obs = of(new Select(id));
            } else {
                obs = this.movieService.getMovieVideos(id).pipe(
                    map(( res ) => new SearchVideosCompleted(res)),
                    catchError(err => of(new SearchVideosError(err)))
                );
            }
            return obs;
        })
    );

    constructor( private actions$: Actions,
                 private movieService: MovieService,
                 private store$: Store<fromMovieRoot.State> ) {
    }
}
