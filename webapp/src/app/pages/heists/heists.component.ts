import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../../pipes/mil-format.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-heists',
  standalone: true,
  imports: [
    HttpClientModule,
    TableModule,
    CommonModule,
    NumberFormatPipe,
    ConfirmDialogModule
  ],
  templateUrl: './heists.component.html',
  styleUrl: './heists.component.scss'
})
export class HeistsComponent {
  heists = <any>[];
  heistDetail: any = null;
  selectedHeist: any = null;

  currentUserId: any;
  currentUserRole: any;

  constructor(
    private api: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public auth: AuthService
  ) {
    this.currentUserId = this.auth.currentUserValue?.id;
    this.currentUserRole = this.auth.currentUserValue?.role;
    this.loadData();
  }

  loadData() {
    this.api.getAllHeists().subscribe((heists: any) => {
      console.log(heists);
      this.heists = heists;
    });
  }

  heistDetails(id: string) {
    if (this.selectedHeist === id) {
      this.selectedHeist = null;
      this.heistDetail = null;
    } else {
      this.selectedHeist = id;
      this.api.getHeist(id).subscribe((heist: any) => {
        console.log(heist);
        this.heistDetail = heist;
      });
    }
  }

  deleteHeist(event: Event, id: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Es-tu sûre de vouloir supprimé le braquage ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.api.deleteHeist(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Le braquage à bien été supprimé', life: 5000 });
          this.loadData();
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annulation', detail: 'Braquage non supprimé' });
      }
    });
  }
}
