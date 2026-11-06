import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorListPage } from './author-list.page';

describe('AuthorListPage', () => {
  let component: AuthorListPage;
  let fixture: ComponentFixture<AuthorListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
