import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Portfolio } from '../../core/services/portfolio';

@Component({
  selector: 'app-delete-position',
  imports: [],
  templateUrl: './delete-position.html',
  styleUrl: './delete-position.css',
})
export class DeletePosition {
  private readonly router = inject(Router);
  private readonly portfolio = inject(Portfolio); 

  readonly positionId = input.required<string>(); 

  delete():void{
    this.portfolio.removePosition(this.positionId());
    this.router.navigate(['/positions']);
  }
}
