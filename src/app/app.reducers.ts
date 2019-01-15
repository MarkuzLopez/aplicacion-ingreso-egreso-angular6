import { ActionReducerMap } from '@ngrx/store'; 

import * as fromUI from './shared/ui.reducers';
import * as fromAuth from './auth/auth.reducers';

export interface AppState { 
    ui: fromUI.State;
    auth: fromAuth.AuthState
}

export const appReducers: ActionReducerMap <AppState> = { 
    ui: fromUI.uiReducer,
    auth: fromAuth.authreducer
}
