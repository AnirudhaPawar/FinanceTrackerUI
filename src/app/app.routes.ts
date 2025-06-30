import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { CategoryFormComponent } from './features/categories/category-form/category-form.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { RecurringTransactionListComponent } from './features/recurring-transactions/recurring-transaction-list/recurring-transaction-list.component';
import { RecurringTransactionFormComponent } from './features/recurring-transactions/recurring-transaction-form/recurring-transaction-form.component';
import { BudgetListComponent } from './features/budgets/budget-list/budget-list.component';
import { BudgetFormComponent } from './features/budgets/budget-form/budget-form.component';
import { BudgetSummaryComponent } from './features/budgets/budget-summary/budget-summary.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './features/transactions/transaction-form/transaction-form.component';
import { TransactionSummaryComponent } from './features/transactions/transaction-summary/transaction-summary.component';
import { TransactionCategorySummaryComponent } from './features/transactions/transaction-category-summary/transaction-category-summary.component';
import { LayoutComponent } from './shared/layout/layout/layout.component';
import { UserProfileComponent } from './features/users/user-profile/user-profile.component';

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [authGuard]
//   },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'categories', component: CategoryListComponent },
//   { path: 'categories/new', component: CategoryFormComponent },
//   { path: 'categories/edit/:id', component: CategoryFormComponent },
//   { path: 'recurring-transactions', component: RecurringTransactionListComponent},
//   { path: 'recurring-transactions/new', component: RecurringTransactionFormComponent},
//   { path: 'budgets', component: BudgetListComponent},
//   { path: 'budgets/new', component:BudgetFormComponent},
//   { path: 'budgets/edit/:id', component: BudgetFormComponent},
//   { path: 'budgets/summary', component: BudgetSummaryComponent},
//   { path: 'users', component: UserListComponent},
//   { path: 'users/new', component: UserFormComponent},
//   { path: 'users/edit/:id', component: UserFormComponent},
//   { path: 'transactions', component: TransactionListComponent },
//   { path: 'transactions/new', component: TransactionFormComponent },
//   { path: 'transactions/edit/:id', component: TransactionFormComponent },
//   { path: 'transactions/summary', component: TransactionSummaryComponent },
//   { path: 'transactions/category-summary', component: TransactionCategorySummaryComponent }
// ];

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'profile', component: UserProfileComponent},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      { path: 'recurring-transactions', component: RecurringTransactionListComponent },
      { path: 'recurring-transactions/new', component: RecurringTransactionFormComponent },
      { path: 'recurring-transactions/edit/:id', component: RecurringTransactionFormComponent },
      { path: 'budgets', component: BudgetListComponent },
      { path: 'budgets/new', component: BudgetFormComponent },
      { path: 'budgets/edit/:id', component: BudgetFormComponent },
      { path: 'budgets/summary', component: BudgetSummaryComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: 'transactions', component: TransactionListComponent },
      { path: 'transactions/new', component: TransactionFormComponent },
      { path: 'transactions/edit/:id', component: TransactionFormComponent },
      { path: 'transactions/summary', component: TransactionSummaryComponent },
      { path: 'transactions/category-summary', component: TransactionCategorySummaryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
