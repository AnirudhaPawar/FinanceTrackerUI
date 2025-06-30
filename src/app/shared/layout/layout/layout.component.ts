import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/auth.service';
import { UserDTO } from '../../models/user-dto.model';
import { UserService } from '../../../features/users/user.service';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ]
})
export class LayoutComponent implements OnInit {
  constructor(
    private auth: AuthService, 
    private router: Router, 
    private route: ActivatedRoute,
    private userService: UserService, 
    private cdr: ChangeDetectorRef,
    private titleService: Title
  ) {}
  isSidenavCollapsed = false;
  currentUser?: UserDTO;
  @ViewChild('sidenav', { read: ElementRef }) sidenavElement!: ElementRef;
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  toggleSidenav(): void {
    this.isSidenavCollapsed = !this.isSidenavCollapsed;
  
    const sidenavEl: HTMLElement = this.sidenavElement.nativeElement;
  
    const onTransitionEnd = () => {
      this.sidenavContainer.updateContentMargins();
      this.cdr.detectChanges();
      sidenavEl.removeEventListener('transitionend', onTransitionEnd);
    };
  
    sidenavEl.addEventListener('transitionend', onTransitionEnd);
  }
  

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login'], {
      queryParams: { sessionExpired: true }
    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getById(+userId).subscribe(user => {
        this.currentUser = user;
        this.auth.setUser(this.currentUser);
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || 'Finance App';
      this.titleService.setTitle(title);
    });
  }
}
