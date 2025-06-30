import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../shared/models/category.model';
import { TransactionDTO } from '../../../shared/models/transaction-dto.model';
import { CommonModule, formatDate } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  standalone: true,
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule
    , MatCardModule, MatIconModule, MatDatepickerModule, MatNativeDateModule
  ],
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  editing = false;
  transactionId?: number;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      type: ['income', Validators.required],
      amount: [0.01, [Validators.required, Validators.min(0.01)]],
      note: [''],
      categoryId: [null, Validators.required],
      tags: [[]],
      createdDate: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
  
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.editing = true;
        this.transactionId = +id;
  
        this.transactionService.getAll().subscribe(allTxs => {
          const tx = allTxs.find(t => t.id === this.transactionId);
          if (tx) {
            this.form.patchValue({
              type: tx.type,
              amount: tx.amount,
              note: tx.note,
              categoryId: tx.category?.id ?? null,
              tags: tx.tags?.join(', '),
              createdDate: tx.createdDate ? new Date(tx.createdDate) : new Date()
            });
          }
        });
      }
    });
  }

  onSubmit(): void {
    const formValue = this.form.value;

    const selectedCategory = this.categories.find(cat => cat.id == formValue.categoryId);
    const tagsArray = Array.isArray(formValue.tags)
      ? formValue.tags
      : typeof formValue.tags === 'string'
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

    const tx: TransactionDTO = {
      amount: formValue.amount,
      type: formValue.type,
      note: formValue.note,
      createdDate: this.toLocalISOStringStartOfDay(formValue.createdDate),
      category: selectedCategory ? {
        id: selectedCategory.id,
        name: selectedCategory.name
      } : undefined,
      tags: tagsArray
    };

    const request$ = this.editing && this.transactionId
      ? this.transactionService.update(this.transactionId, tx)
      : this.transactionService.create(tx);

    request$.subscribe(() => this.router.navigate(['/transactions']));
  }

  toLocalISOStringStartOfDay(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
  
    return `${year}-${month}-${day}T00:00:00`;
  }
  

}
