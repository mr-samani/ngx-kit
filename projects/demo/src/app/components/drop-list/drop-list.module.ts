import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { CopyToZoneComponent } from './copy-to-zone/copy-to-zone.component';
import { DynamicHtmlComponent } from './dynamic-html/dynamic-html.component';
import { HorizontalListComponent } from './horizontal-list/horizontal-list.component';
import { DemoKanbanComponent } from './kanban/kanban.component';
import { NestedTreeSortComponent } from './nested-tree-sort/nested-tree-sort.component';
import { SortListComponent } from './sort-list/sort-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'kanban', pathMatch: 'full' },
  { path: 'sort-list', component: SortListComponent },
  { path: 'kanban', component: DemoKanbanComponent },
  { path: 'horizontal-list', component: HorizontalListComponent },
  { path: 'copy-to-zone', component: CopyToZoneComponent },
  { path: 'nested-tree-sort', component: NestedTreeSortComponent },
  { path: 'dynamic-html', component: DynamicHtmlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DropListDemoModule {}
