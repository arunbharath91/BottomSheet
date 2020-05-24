interface IOptions {
  size?: string;
  onOpen?: Function;
  onClose?: Function;
  overlayClick?: boolean;
}

let sheetInstanceIndex: number = 1000;

const defaultOption: IOptions = {
  size: 'lg',
  overlayClick: false
}
export class BottomSheet {
  private source: string;
  private options: IOptions;
  private bottomSheet!: HTMLElement;
  private bottomSheetContainer!: HTMLElement;
  constructor(source: string, options?: IOptions) {
    this.source = source;
    this.options = { ...defaultOption, ...options };
    sheetInstanceIndex++;
    this.initBottomSheet();
  }

  protected initBottomSheet() {
    const validSoure: boolean = (this.source.split('.').pop() as string).toLowerCase() === 'html';

    if (this.options.onOpen) { this.options.onOpen.call(this) };
    this.bottomSheet = document.createElement('bottomsheet');
    this.bottomSheet.setAttribute("source", `${this.source}`);
    this.bottomSheet.style.zIndex = sheetInstanceIndex.toString();
    this.bottomSheet.innerHTML = `<div class="bottomsheet-container ${this.options.size}">
    <button type="button" class="bt-close" bottomsheet-close>	&#215;</button>
    <div class="view-container">

    </div>
    </div>`;
    document.body.prepend(this.bottomSheet);
    this.bottomSheetContainer = (this.bottomSheet.querySelector(`.bottomsheet-container`) as HTMLElement);

    setTimeout(() => {
      this.bottomSheetContainer.style.bottom = '0';
    }, 1, this.templateInsertion(validSoure));

    this.eventRegistration();
  }

  private templateInsertion(validSoure: boolean) {
    if (validSoure) {
      this.httpReq(`${this.source}`, { mode: 'no-cors', method: 'get' }, this.bottomSheetContainer);
    } else {
      this.insertTemplate(this.bottomSheetContainer)
    }
  }

  protected eventRegistration() {
    (this.bottomSheetContainer.querySelector('.bt-close') as HTMLElement).addEventListener('click', () => { this.close() });

    if (this.options.overlayClick) {
      this.bottomSheetContainer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      this.bottomSheet.addEventListener('click', () => { this.close() });
    }
  }

  private close() {
    setTimeout(() => {
      if (this.options.onClose) { this.options.onClose.call(this) };
      this.bottomSheet.remove();
      sheetInstanceIndex--;
    }, 500, this.bottomSheetContainer.removeAttribute('style'));
  }

  protected insertTemplate(bottomsheet: HTMLElement) {
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
