import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, 
    MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
  ]
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  editing = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contact: ['', Validators.pattern(/^[0-9]{10}$/)],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // optional on edit
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editing = true;
      this.userId = +paramId;
      this.userService.getById(this.userId).subscribe(user => {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          contact: user.contact
        });
        // Note: password is not returned by API for security reasons
      });
    }
  }

  onSubmit(): void {
    const user: User = this.form.value;

    if (this.editing && this.userId != null) {
      this.userService.update(this.userId, user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.createUser(user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
