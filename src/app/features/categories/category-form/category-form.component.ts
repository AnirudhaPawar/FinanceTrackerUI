import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryService } from '../category.service';
import { Category } from '../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
  ]
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  editing = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Category Form Loaded');
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editing = true;
      this.id = +paramId;
      this.categoryService.getById(this.id).subscribe(category => {
        console.log('category ', category);
        setTimeout(() => {
          this.form.patchValue({ name: category.name });
        }, 0);
      });
    }
  }

  onSubmit(): void {
    const data: Category = this.form.value;
    if (this.editing && this.id != null) {
      this.categoryService.update(this.id, data).subscribe(() => this.router.navigate(['/categories']));
    } else {
      this.categoryService.create(data).subscribe(() => this.router.navigate(['/categories']));
    }
  }
}
