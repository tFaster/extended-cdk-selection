import { Injectable } from '@angular/core';
import { Observable, pipe, timer, UnaryFunction } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { CdkTable } from '@angular/cdk/table';

@Injectable({
  providedIn: 'root'
})
export class InteractionSimulatorService<T> {

  private _demoRowElements: HTMLElement[];
  private _tableHtmlElement: HTMLTableElement;

  constructor() {
  }

  init(elements: HTMLElement[], table: CdkTable<T>): void {
    this._demoRowElements = elements;
    this._tableHtmlElement = table._rowOutlet.elementRef.nativeElement.parentElement.parentElement;
  }

  runArrowDownUp(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown'),
      this.dispatchKeyboardArrow('ArrowDown'),
      this.dispatchKeyboardArrow('ArrowUp'),
      this.dispatchKeyboardArrow('ArrowUp'),
      this.dispatchKeyboardArrow('ArrowUp')
    ).subscribe(() => {
    });
  }

  runCtrlArrowDownUp(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardArrow('ArrowUp', true)
    ).subscribe(() => {
    });
  }

  runShiftArrowDownUp(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown', false, true),
      this.dispatchKeyboardArrow('ArrowDown', false, true),
      this.dispatchKeyboardArrow('ArrowUp', false, true),
      this.dispatchKeyboardArrow('ArrowUp', false, true),
      this.dispatchKeyboardArrow('ArrowUp', false, true)
    ).subscribe(() => {
    });
  }

  runCtrlShiftArrowDownUp(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown', true, true),
      this.dispatchKeyboardArrow('ArrowDown', true, true),
      this.dispatchKeyboardArrow('ArrowUp', true, true),
      this.dispatchKeyboardArrow('ArrowUp', true, true),
      this.dispatchKeyboardArrow('ArrowUp', true, true)
    ).subscribe(() => {
    });
  }

  runSpace(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardSpace(),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardSpace(),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardSpace(),
    ).subscribe(() => {
    });
  }

  runCtrlSpace(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[2]),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardSpace(true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardArrow('ArrowDown', true),
      this.dispatchKeyboardSpace(true),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardArrow('ArrowUp', true),
      this.dispatchKeyboardSpace(true),
    ).subscribe(() => {
    });
  }

  runCtrlA(): void {
    timer(1000).pipe(
      tap(() => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {key: 'a', shiftKey: false, ctrlKey: true});
        this._tableHtmlElement.dispatchEvent(event);
      }),
    ).subscribe(() => {
    });
  }

  runClick(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[3]),
      this.dispatchClick(this._demoRowElements[6]),
      this.dispatchClick(this._demoRowElements[1]),
      this.dispatchClick(this._demoRowElements[8])
    ).subscribe(() => {
    });
  }

  runCtrlClick(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[3]),
      this.dispatchClick(this._demoRowElements[6], true),
      this.dispatchClick(this._demoRowElements[1], true),
      this.dispatchClick(this._demoRowElements[8], true),
      this.dispatchClick(this._demoRowElements[8], true),
      this.dispatchClick(this._demoRowElements[1], true),
      this.dispatchClick(this._demoRowElements[6], true),
      this.dispatchClick(this._demoRowElements[3], true)
    ).subscribe(() => {
    });
  }

  runShiftClick(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[3]),
      this.dispatchClick(this._demoRowElements[6], false, true),
      this.dispatchClick(this._demoRowElements[1], false, true),
      this.dispatchClick(this._demoRowElements[8], true, true)
    ).subscribe(() => {
    });
  }

  runCtrlShiftClick(): void {
    timer(1000).pipe(
      this.dispatchClick(this._demoRowElements[3]),
      this.dispatchClick(this._demoRowElements[6], true, true),
      this.dispatchClick(this._demoRowElements[1], true, true),
      this.dispatchClick(this._demoRowElements[8], true, true)
    ).subscribe(() => {
    });
  }

  dispatchClick(rowElem: HTMLElement, ctrlKey: boolean = false, shiftKey: boolean = false): UnaryFunction<Observable<any>, Observable<any>> {
    return pipe(
      tap(() => {
        const event: MouseEvent = new MouseEvent('click', {shiftKey: shiftKey, ctrlKey: ctrlKey});
        rowElem.dispatchEvent(event);
      }),
      delay(800)
    );
  }

  dispatchKeyboardArrow(key: 'ArrowDown' | 'ArrowUp', ctrlKey: boolean = false, shiftKey: boolean = false): UnaryFunction<Observable<any>, Observable<any>> {
    return pipe(
      tap(() => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {key: key, shiftKey: shiftKey, ctrlKey: ctrlKey});
        this._tableHtmlElement.dispatchEvent(event);
      }),
      delay(400)
    );
  }

  dispatchKeyboardSpace(ctrlKey: boolean = false, shiftKey: boolean = false): UnaryFunction<Observable<any>, Observable<any>> {
    return pipe(
      tap(() => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {key: ' ', shiftKey: shiftKey, ctrlKey: ctrlKey});
        this._tableHtmlElement.dispatchEvent(event);
      }),
      delay(400)
    );
  }

}
