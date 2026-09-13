import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMenuItem } from './menu-item.component';
import { NGX_MENU_CONTEXT } from '../../tokens/menu-context.token';

describe('NgxMenuItem', () => {
  let component: NgxMenuItem;
  let fixture: ComponentFixture<NgxMenuItem>;
  let menuContext: {
    close: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    menuContext = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NgxMenuItem],
      providers: [
        {
          provide: NGX_MENU_CONTEXT,
          useValue: menuContext,
        },
      ],
    });

    fixture = TestBed.createComponent(NgxMenuItem);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the menu when clicked without a child menu', () => {
    component.onClick();

    expect(menuContext.close).toHaveBeenCalledOnce();
  });
});
