import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../budget.service';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetDTO } from '../../../shared/models/budget-dto.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule, MatCardModule,  MatDatepickerModule,
    MatNativeDateModule]
})
export class BudgetFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  editing = false;
  id?: number;
  startDate = new Date();

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      categoryId: ['', Validators.required],
      month: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => (this.categories = c));
  
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editing = true;
      this.id = +paramId;
      this.budgetService.getById(this.id).subscribe(b => {
        // Convert "YYYY-MM" string to Date object
        const [year, month] = (b.month || '').split('-').map(Number);
        const formattedMonth = new Date(year, month - 1);
  
        this.form.patchValue({
          ...b,
          month: formattedMonth
        });
      });
    }
  }
  

  onSubmit(): void {
    const data: BudgetDTO = this.form.value;
    const rawDate: Date = this.form.get('month')?.value;
    const monthStr = `${rawDate.getFullYear()}-${(rawDate.getMonth() + 1).toString().padStart(2, '0')}`;
    data.month = monthStr;
    if (this.editing && this.id != null) {
      this.budgetService.update(this.id, data).subscribe(() => this.router.navigate(['/budgets']));
    } else {
      this.budgetService.create(data).subscribe(() => this.router.navigate(['/budgets']));
    }
  }

  cancel(): void {
    this.router.navigate(['/budgets']);
  }

  
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    const ctrlValue = this.form.get('month')?.value || new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setFullYear(normalizedMonth.getFullYear());
    this.form.get('month')?.setValue(new Date(ctrlValue));
    datepicker.close();
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
