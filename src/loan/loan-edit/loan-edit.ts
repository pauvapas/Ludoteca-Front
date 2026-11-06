import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import { Loan } from '../model/Loan';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import {  FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { validateFields } from '../../core/helpers/validation.helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-loan-edit',
  styleUrl: './loan-edit.scss',
  templateUrl: './loan-edit.html',
  standalone: true,
  providers: [ provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } ],
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule , MatSelectModule],
})
export class LoanEdit implements OnInit {
  protected readonly loanService = inject(LoanService);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);
  protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  
  protected readonly id = signal<number | null>(null);
  protected readonly startDate = signal<String | null>(null);
  protected readonly endDate = signal<String | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);
  protected readonly clients = signal<Client[]>([]);
  protected readonly games = signal<Game[]>([]);

  ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);
  }

  convertDate(spanishDate: string): string{
    var standardDate, day, month, year, d;

    day = spanishDate.substring(0,2);
    if(day[1] == '/'){
      day = '0' + day[0];
      month = spanishDate.substring(2,4);
      if(month[1] == '/'){
        month = '0' + month[0];
        year = spanishDate.substring(4,8);
      }
      else{
        month = spanishDate.substring(2,4);
        year = spanishDate.substring(5,9);
      }
    }
    else{
      month = spanishDate.substring(3,5);
      if(month[1] == '/'){
        month = '0' + month[0];
        year = spanishDate.substring(5,9);
      }
      else{
        month = spanishDate.substring(3,5);
        year = spanishDate.substring(6,10);
      }
    }

    standardDate = year + '/' + month + '/' + day;

    d = new Date(standardDate).toISOString();

    return d;
  }

  loadFormData(initialData: Loan | null): void {
    var standardStartDate, standardEndDate;

    if(((initialData?.startDate ?? null) && (initialData?.endDate ?? null)) != null){
      standardStartDate = this.convertDate((initialData?.startDate ?? null).toString());
      standardEndDate = this.convertDate((initialData?.endDate ?? null).toString());

      this.startDate.set(standardStartDate);
      this.endDate.set(standardEndDate);
    }
    else{
      this.startDate.set(initialData?.startDate ?? null);
      this.endDate.set(initialData?.endDate ?? null);
    }

    this.id.set(initialData?.id ?? null);
  
    this.gameService.getAllGames().subscribe((gms) => {
        this.games.set(gms);
        this.gameId.set(initialData?.game?.id ?? null);
    });

    this.clientService.getClients().subscribe((cls) => {
        this.clients.set(cls);
        this.clientId.set(initialData?.client?.id ?? null);
    });
  }

  onSave() {
    const id = this.id();
    const startDate = this.startDate();
    const endDate = this.endDate();
    const gameId = this.gameId();
    const clientId = this.clientId();

    const requiredFields = ["gameId", "clientId", "startDate", "endDate"] as const
    const data = { gameId, clientId, startDate, endDate }

    if (!validateFields(data, requiredFields)) {
        alert("Rellena todos los campos obligatorios antes de continuar");
        return;
    }

    const loan = {
        id,
        game: this.games().find(g => g.id === gameId) ?? null,
        client: this.clients().find(c => c.id === clientId) ?? null,
        startDate,
        endDate,
    } as Loan;
    this.loanService.saveLoan(loan).subscribe(() => {
        this.dialogRef.close(true);
    });
  }

  onClose() {
      this.dialogRef.close(false);
  }
}