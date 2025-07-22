export interface AddPurchaseInfoProps {
  formData: {
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    customer_id: string;
    purchase_date: string;
    gst_number: string;
  };
  onNext?: () => void;
}

export interface CheckOutProps {
  formData: {
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    customer_id: string;
    purchase_date: string;
    gst_number: string;
  };
  onNext?: () => void;
}
