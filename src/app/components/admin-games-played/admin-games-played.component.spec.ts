import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesPlayedComponent } from './admin-games-played.component';

describe('AdminGamesPlayedComponent', () => {
  let component: AdminGamesPlayedComponent;
  let fixture: ComponentFixture<AdminGamesPlayedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGamesPlayedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGamesPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
