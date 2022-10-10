import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllGamesComponent } from './admin-all-games.component';

describe('AdminAllGamesComponent', () => {
  let component: AdminAllGamesComponent;
  let fixture: ComponentFixture<AdminAllGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAllGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAllGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
