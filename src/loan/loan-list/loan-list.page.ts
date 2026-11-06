import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';
import { GameService } from '../../game/game';
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
    standalone: true,
    providers: [ provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } ],
    imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule],
    selector: 'app-loan-list',
    styleUrl: './loan-list.page.scss',
    templateUrl: './loan-list.page.html',
})
export class LoanListPage implements OnInit {
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    protected readonly clients = signal<Client[]>([]);
    protected readonly games = signal<Game[]>([]);
    protected readonly loans = signal<Loan[]>([]);
    protected readonly filterClient = signal<Client | null>(null);
    protected readonly filterGame = signal<Game | null>(null);
    protected readonly filterDate = signal<string>('');

    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);
    protected readonly loanService = inject(LoanService);
    protected readonly dialog = inject(MatDialog);

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'gameTitle', 'clientName', 'startDate', 'endDate', 'action'];

    ngOnInit(): void {
        this.loadPage();

        this.clientService
            .getClients()
            .subscribe((clients) => this.clients.set(clients));

        this.gameService
            .getGames()
            .subscribe((games) => this.games.set(games));
    }

    loadPage(event?: PageEvent) {
        const gameId =
            this.filterGame() != null ? this.filterGame().id : null;
        const clientId =
            this.filterClient() != null ? this.filterClient().id : null;

        const date = this.filterDate();

        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }
        
        this.loanService.getLoans(pageable, gameId, clientId, date).subscribe((data) => {
            var newData = data.content.map(loan => {
                return {
                    ...loan,
                    startDate: new Date(loan.startDate.toString()).toLocaleDateString(),
                    endDate: new Date(loan.endDate.toString()).toLocaleDateString() 
                };
            });

            this.dataSource.data = newData;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
    }

    onCleanFilter(): void {
        this.filterGame.set(null);
        this.filterClient.set(null);
        this.filterDate.set('');
        this.onSearch();
    }

    onSearch(): void {
       this.loadPage();
    }

    createLoan() {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) return;
            this.onSearch();
        });
    }

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: { loan: loan },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) return;
            this.onSearch();
        });
    }

    deleteLoan(loan: Loan) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: {
                title: 'Eliminar préstamo',
                description:
                    'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }
}