import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface InvoiceModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invoiceInfo: {
    invoiceNumber: string;
    cashierName: string;
    customerName: string;
    subtotal: number;
    tax: string;
    discount: string;
    total: number;
  };
  items: {
    id: string;
    name: string;
    qty: number;
    price: string;
  }[];
  onSaveInvoice: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({  isOpen,  setIsOpen,  invoiceInfo,  items,  onSaveInvoice,}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('print');
    if (!dom) return;
    toPng(dom)
      .then((dataUrl: string) => {
        const img = new Image();
        img.crossOrigin = 'annoymous';
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [5.5, 8.5],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          if (!pageCtx) return;
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = 'white';
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
        };
      })
      .catch((error: unknown) => {
        console.error('oops, something went wrong!', error);
      });
  };

  const taxAmount = (parseFloat(invoiceInfo.tax) / 100) * invoiceInfo.subtotal;
  const discountAmount = (parseFloat(invoiceInfo.discount) / 100) * invoiceInfo.subtotal;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="text-lg font-medium leading-6 text-gray-900">
                Invoice
              </div>
              <div id="print" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium text-gray-500">
                    <p>Invoice To:</p>
                    <p className="font-bold text-gray-800">
                      {invoiceInfo.customerName}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    <p>Billed By:</p>
                    <p className="font-bold text-gray-800">
                      {invoiceInfo.cashierName}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-y border-black/10 text-sm md:text-base">
                        <th>ITEM</th>
                        <th className="text-center">QTY</th>
                        <th className="text-right">PRICE</th>
                        <th className="text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="w-full">{item.name}</td>
                          <td className="min-w-[50px] text-center">{item.qty}</td>
                          <td className="min-w-[80px] text-right">
                            £{Number(item.price).toFixed(2)}
                          </td>
                          <td className="min-w-[90px] text-right">
                            £{Number(Number(item.price) * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex flex-col items-end space-y-2">
                    <div className="flex w-full justify-between border-t border-black/10 pt-2">
                      <span className="font-bold">Subtotal:</span>
                      <span>£{invoiceInfo.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 flex flex-row justify-between">
                      <span className="font-bold">Discount:</span>
                      <span>
                        ({invoiceInfo.discount || '0'}%)£
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-row justify-between">
                      <span className="font-bold">Tax:</span>
                      <span>
                        ({invoiceInfo.tax || '0'}%)£
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-row justify-between border-t border-gray-300 pt-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">
                        £
                        {invoiceInfo.total % 1 === 0
                          ? invoiceInfo.total
                          : invoiceInfo.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-row justify-center">
                  <button
                    className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
                    onClick={() => {
                      console.log('Save & Continue button clicked');
                      onSaveInvoice();
                    }}
                  >
                    Save & Continue
                  </button>
                  <button
                    className="mr-2 rounded-md bg-green-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-600"
                    onClick={SaveAsPDFHandler}
                  >
                    Download
                  </button>
                  <button
                    className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
