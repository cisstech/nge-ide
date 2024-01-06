export interface ConfirmOptions {
  title?: string;
  message?: string;
  danger?: boolean;
  okTitle?: string;
  noTitle?: string;
  buttons?: {
    id: string;
    danger?: boolean;
    title: string;
  }[];
}
