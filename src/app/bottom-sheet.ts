interface IOptions {
  size?: string;
  onOpen ? : Function;
  onClose ? : Function;
}

let sheetInstanceIndex: number = 1000;

const defaultOption: IOptions = {
  size: 'lg'
}
export class BottomSheet {
  private source: string;
  private options: IOptions;
  constructor(source: string, options?: IOptions) {
    this.source = source;
    this.options = {...defaultOption, ...options};
    sheetInstanceIndex++;
    this.initBottomSheet();
  }

  protected initBottomSheet() {
    const validSoure: boolean = (this.source.split('.').pop() as string).toLowerCase() === 'html';

    if (this.options.onOpen) { this.options.onOpen.call(this) };
    const bottomsheet = document.createElement('bottomsheet');
    bottomsheet.setAttribute("source", `${this.source}`);
    bottomsheet.style.zIndex = sheetInstanceIndex.toString();
    bottomsheet.innerHTML = `<div class="bottomsheet-container ${this.options.size}">
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
        if (this.options.onClose) { this.options.onClose.call(this) };
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
