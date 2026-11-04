import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { CopyToZoneComponent } from './copy-to-zone/copy-to-zone.component';
import { DynamicHtmlComponent } from './dynamic-html/dynamic-html.component';
import { HorizontalListComponent } from './horizontal-list/horizontal-list.component';
import { NestedTreeSortComponent } from './nested-tree-sort/nested-tree-sort.component';
import { SortListComponent } from './sort-list/sort-list.component';
import { CopyToIFrameComponent } from './copy-to-iframe/copy-to-iframe.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'kanban', pathMatch: 'full' },
  { path: 'kanban', component: KanbanViewComponent },
  { path: 'sort-list', component: SortListComponent },
  { path: 'horizontal-list', component: HorizontalListComponent },
  { path: 'copy-to-zone', component: CopyToZoneComponent },
  { path: 'copy-to-iframe', component: CopyToIFrameComponent },
  { path: 'nested-tree-sort', component: NestedTreeSortComponent },
  { path: 'dynamic-html', component: DynamicHtmlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DropListDemoModule {}
