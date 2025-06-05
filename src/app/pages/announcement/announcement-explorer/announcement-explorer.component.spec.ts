import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementExplorerComponent } from './announcement-explorer.component';

describe('AnnouncementExplorerComponent', () => {
  let component: AnnouncementExplorerComponent;
  let fixture: ComponentFixture<AnnouncementExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
