import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatCardModule,
  MatTableModule,
  MatButtonModule,
  MatIconModule
  ]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error(err)
    });
  }

  editCategory(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }
}
