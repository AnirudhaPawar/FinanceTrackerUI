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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard - Finance App' } },
      { path: 'profile', component: UserProfileComponent, data: { title: 'My Profile - Finance App' } },
      { path: 'categories', component: CategoryListComponent, data: { title: 'Categories - Finance App' } },
      { path: 'categories/new', component: CategoryFormComponent, data: { title: 'New Category - Finance App' } },
      { path: 'categories/edit/:id', component: CategoryFormComponent, data: { title: 'Edit Category - Finance App' } },
      { path: 'transactions', component: TransactionListComponent, data: { title: 'Transactions - Finance App' } },
      { path: 'transactions/new', component: TransactionFormComponent, data: { title: 'New Transaction - Finance App' } },
      { path: 'transactions/edit/:id', component: TransactionFormComponent, data: { title: 'Edit Transaction - Finance App' } },
      { path: 'transactions/summary', component: TransactionSummaryComponent, data: { title: 'Transaction Summary - Finance App' } },
      { path: 'transactions/category-summary', component: TransactionCategorySummaryComponent, data: { title: 'Category Summary - Finance App' } },
      { path: 'recurring-transactions', component: RecurringTransactionListComponent, data: { title: 'Recurring Transactions - Finance App' } },
      { path: 'recurring-transactions/new', component: RecurringTransactionFormComponent, data: { title: 'New Recurring Transaction - Finance App' } },
      { path: 'recurring-transactions/edit/:id', component: RecurringTransactionFormComponent, data: { title: 'Edit Recurring Transaction - Finance App' } },
      { path: 'budgets', component: BudgetListComponent, data: { title: 'Budgets - Finance App' } },
      { path: 'budgets/new', component: BudgetFormComponent, data: { title: 'New Budget - Finance App' } },
      { path: 'budgets/edit/:id', component: BudgetFormComponent, data: { title: 'Edit Budget - Finance App' } },
      { path: 'budgets/summary', component: BudgetSummaryComponent, data: { title: 'Budget Summary - Finance App' } },
      { path: 'users', component: UserListComponent, data: { title: 'Users - Finance App' } },
      { path: 'users/new', component: UserFormComponent, data: { title: 'New User - Finance App' } },
      { path: 'users/edit/:id', component: UserFormComponent, data: { title: 'Edit User - Finance App' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
