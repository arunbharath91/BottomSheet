import { BottomSheet } from "./bottom-sheet";

const openSheet  = () => {
  new BottomSheet('assets/templates/modal.html', {size: 'lg',
  onOpen: ()=>{
    console.log('open');
  }
});
};

const release  = () => {
  new BottomSheet("customer-model", {size: 'md',
  onClose: ()=>{
    console.log('close');
  }
});
};


(window as any).openSheet = openSheet;
(window as any).release = release;
