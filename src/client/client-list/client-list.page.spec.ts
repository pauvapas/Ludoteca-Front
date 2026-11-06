import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientListPage } from './client-list.page';

describe('ClientListPage', () => {
  let component: ClientListPage;
  let fixture: ComponentFixture<ClientListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
