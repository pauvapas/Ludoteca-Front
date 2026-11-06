import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule, 
    MatToolbarModule,
  ],
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {}