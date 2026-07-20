import { Routes } from '@angular/router';
import { Positions } from './layout/positions/positions';
import { App } from './app';
import { AddPosition } from './layout/add-position/add-position';
import { EditPosition } from './layout/edit-position/edit-position';
import { PositionDetail } from './layout/position-detail/position-detail';
import { Dashboard } from './layout/dashboard/dashboard';

export const routes: Routes = [
    {path: '', component: Dashboard},
    {path: 'positions', component: Positions},
    {path: 'add-position', component: AddPosition},
    {path: 'edit-position/:id', component: EditPosition},
    {path: 'position/:id', component: PositionDetail}
];
