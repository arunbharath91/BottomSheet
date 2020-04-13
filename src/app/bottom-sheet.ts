
let sheetInstanceIndex: number = 1000;
export class BottomSheet {
  private source: string;
  constructor(source: string) {
    sheetInstanceIndex++;
    this.source = source;
  }

  public setSize(size: string = 'md') {
    this.initBottomSheet(size);
  }

  protected initBottomSheet(size: string) {
    const validSoure: boolean = (this.source.split('.').pop() as string).toLowerCase() === 'html';

    const bottomsheet = document.createElement('bottomsheet');
    bottomsheet.setAttribute("source", `${this.source}`);
    bottomsheet.style.zIndex = sheetInstanceIndex.toString();
    bottomsheet.innerHTML = `<div class="bottomsheet-container ${size}">
    <button type="button" class="bt-close" bottomsheet-close>	&#215;</button>
    <div class="view-container">

    </div>
    </div>`;
    document.body.prepend(bottomsheet);

    setTimeout(() => {
      (bottomsheet.querySelector(`.bottomsheet-container`) as HTMLElement).style.bottom = '0';
    }, 1,
      (validSoure) ? this.httpReq(`${this.source}`, {
        mode: 'no-cors',
        method: 'get'
      }, bottomsheet) : this.projectTemplate(bottomsheet)
    );

    this.registerCloseEvent(bottomsheet);

  }

  protected registerCloseEvent(bottomsheet: HTMLElement) {
    (bottomsheet.querySelector('.bt-close') as HTMLElement).addEventListener('click', () => {
      setTimeout(() => {
        bottomsheet.remove();
        sheetInstanceIndex--;
      }, 500, (bottomsheet.querySelector(`.bottomsheet-container`) as HTMLElement).removeAttribute('style'));
    });
  }

  protected projectTemplate(bottomsheet: HTMLElement) {
    const templateContent = (document.querySelector(`template[bottom-sheet-ref="${this.source}"]`) as HTMLElement);
    (bottomsheet.querySelector(`.view-container`) as HTMLElement).innerHTML = templateContent.innerHTML;
  }

  protected httpReq(url: RequestInfo, methods: RequestInit, bindElement: HTMLElement) {
    (bindElement.querySelector(`.view-container`) as HTMLElement).insertAdjacentHTML('afterbegin', `<div class="loader"></div>`);
    fetch(url, methods)
      .then((response) => {
        response.text().then((text) => {
          (bindElement.querySelector(`.view-container`) as HTMLElement).innerHTML = text;
        });
      })
      .catch((err) => {
        console.log(err)
      });
  }
}
