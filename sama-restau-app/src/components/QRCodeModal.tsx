import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';
import { useState } from 'react';

interface QRCodeModalProps {
  orderId: string;
  orderData: any;
  onClose: () => void;
}

export default function QRCodeModal({ orderId, orderData, onClose }: QRCodeModalProps) {
  const [qrValue] = useState(() => {
    // Generate QR code data with order information
    return JSON.stringify({
      orderId: orderId,
      customerName: orderData.customer_name,
      table: orderData.table,
      total: orderData.total_amount,
      items: orderData.order_items?.map((item: any) => ({
        name: item.menu_item?.name,
        quantity: item.quantity,
        price: item.price_at_time
      })),
      timestamp: orderData.created_at,
      status: orderData.status
    });
  });

  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${orderId}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        ctx?.drawImage(img, 0, 0, 300, 300);
        const pngFile = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-Commande-${orderId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-2xl font-bold text-on-surface">Code QR</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full">
            <X size={24} className="text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl border-2 border-outline-variant/20 flex items-center justify-center">
            <QRCodeSVG
              id={`qr-code-${orderId}`}
              value={qrValue}
              size={220}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#9F402D"
            />
          </div>

          {/* Order Info */}
          <div className="text-center">
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">Commande</p>
            <p className="font-headline text-xl font-bold text-primary">#{orderId.toString().slice(-5)}</p>
            {orderData.table && (
              <p className="text-sm text-on-surface-variant mt-1">Table {orderData.table}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-sm text-on-surface-variant text-center">
              Présentez ce code QR au personnel pour valider votre commande
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
            >
              <Download size={18} /> Télécharger
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
