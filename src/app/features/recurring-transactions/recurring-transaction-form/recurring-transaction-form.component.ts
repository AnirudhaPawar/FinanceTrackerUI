import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecurringTransactionService } from '../recurring-transaction.service';
import { RecurringTransactionDTO } from '../../../shared/models/recurring-transaction-dto.model';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../shared/models/category.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-recurring-transaction-form',
  templateUrl: './recurring-transaction-form.component.html',
  styleUrls: ['./recurring-transaction-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class RecurringTransactionFormComponent implements OnInit {
  form: FormGroup;
  editing = false;
  id?: number;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private service: RecurringTransactionService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      categoryId: [null, Validators.required],
      type: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      note: [''],
      frequency: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      nextDueDate: ['', Validators.required],
      active: [false]
    });
  }

  ngOnInit(): void {
    // Load categories first
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;

      // After loading categories, check if editing mode
      const paramId = this.route.snapshot.paramMap.get('id');
      if (paramId) {
        this.editing = true;
        this.id = +paramId;

        this.service.getById(this.id).subscribe(data => {
          console.log('Loaded recurring transaction:', data);
          // Patch form including categoryId
          this.form.patchValue({
            categoryId: data.categoryId ?? null,
            type: data.type,
            amount: data.amount,
            note: data.note,
            frequency: data.frequency,
            startDate: data.startDate,
            endDate: data.endDate,
            nextDueDate: data.nextDueDate,
            active: data.active
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data: RecurringTransactionDTO = this.form.value;

    if (this.editing && this.id != null) {
      this.service.update(this.id, data).subscribe(() => this.router.navigate(['/recurring-transactions']));
    } else {
      this.service.create(data).subscribe(() => this.router.navigate(['/recurring-transactions']));
    }
  }
}
