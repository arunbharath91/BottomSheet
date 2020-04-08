import { BottomSheet } from "./bottom-sheet";

const openSheet  = () => {
  new BottomSheet('assets/templates/modal.html').setSize('lg');
};

const release  = () => {
  new BottomSheet("customer-model").setSize('md');
};


(window as any).openSheet = openSheet;
(window as any).release = release;
